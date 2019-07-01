/*******************************************************************************

Copyright (c) 2017-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*******************************************************************************/

// @format
// Stock tools overrides

highed.StockTools = function(planCode) {

  var popup,
  events = highed.events(),
  showAnnotationIcon = true,
  annotationModalOpen = false,
  stockToolsToolbarConfig = {
    stockTools: {
      gui: {
        buttons: ['simpleShapes', 'lines', 'crookedLines'],
        enabled: false
      },
    },
    navigation: {
      events: {
        // On selecting the annotation the showPopup event is fired
        showPopup: function(event) {

          if (!this.chart.indicatorsPopupContainer) {
            this.chart.indicatorsPopupContainer = document
              .getElementsByClassName('highcharts-popup-indicators')[0];
          }

          if (!this.chart.annotationsPopupContainer) {
            this.chart.annotationsPopupContainer = document
              .getElementsByClassName('highcharts-popup-annotations')[0];
          }

          if (event.formType === 'indicators') {
            this.chart.indicatorsPopupContainer.style.display = 'block';
          } else if (event.formType === 'annotation-toolbar') {
            // If user is still adding an annotation, don't show popup:
            if (!this.chart.activeButton) {
              this.chart.currentAnnotation = event.annotation;
              this.chart.annotationsPopupContainer.style.display = 'block';
            }
          }

          if (this.popup) {
            popup = this.popup;
            var currentAnnotation = this.chart.currentAnnotation
            
            setTimeout(function() {

              var child = popup.container.children[1];

              if (child.tagName !== 'SPAN') {
                events.emit('ShowAnnotationModal', currentAnnotation.options);
                annotationModalOpen = true;
                popup.container.style.display = 'none';
              }
            }, 1);
          }
        },
        closePopup: function() {
          // Hide the popup container, and reset currentAnnotation
          this.chart.annotationsPopupContainer.style.display = 'none';
          this.chart.currentAnnotation = null;
        },
        selectButton: function (event) {
            var newClassName = event.button.className + ' highcharts-active';


            if (event.button.classList.contains('highcharts-active')) return;

            event.button.className = newClassName;

            // Store info about active button:
            this.chart.activeButton = event.button;
        },
        deselectButton: function (event) {
            event.button.classList.remove('highcharts-active');
            // Remove info about active button:
            this.chart.activeButton = null;
        }
      },
      bindingsClassName: "tools-container"
    }
  },
  timeout = null;
  
  function closeAnnotationPopup(){
    if (popup) {
      popup.closePopup()
    }
    annotationModalOpen = false;
  }
  
  function toggleAnnotationIcon(toggle) {
    showAnnotationIcon = toggle
    if (toggle) {
      addStockTools();
    } else {
      removeStockTools();
    }
  }

  function hide(){
    //stockToolsToolbarConfig.stockTools.gui.visible = false;
  }

  function removeStockTools(){
    //stockToolsToolbarConfig.stockTools.gui.enabled = false;
  }

  function addStockTools(){
    //stockToolsToolbarConfig.stockTools.gui.enabled = true;
  }

  function getStockToolsToolbarConfig(){
    return stockToolsToolbarConfig;
  }

  function hideTooltip() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    
    this.chart.update({
      tooltip: {
        enabled: false
      }
    });
  }

  function showTooltip() {
    var chart = this.chart;
    timeout = setTimeout(function(){
      chart.update({
        tooltip: {
          enabled: true
        }
      });
    }, 1000);
  }

  function getAnnotationModalOpen() {
    return annotationModalOpen
  }

  function init(H) {

    H.addEvent(H.Chart, 'redraw', function () {
      var blacklist = ['pie'],
          chart = this;
        
      if (chart.options && chart.options.series) {
        var typeInBlacklist = chart.options.series.some(function(series) {
          return blacklist.includes(series.type);
        });


        if (typeInBlacklist || !showAnnotationIcon) {
          removeStockTools();
          return;
        }
      }

      addStockTools();
    });

    function selectableAnnotation(annotationType) {
      var originalClick = annotationType.prototype.defaultOptions.events &&
      annotationType.prototype.defaultOptions.events.click;

      function selectAndshowPopup(event) {
          var annotation = this,
              navigation = annotation.chart.navigationBindings,
              prevAnnotation = navigation.activeAnnotation;

          if (originalClick && originalClick.click) {
            originalClick.click.call(annotation, event);
          }

          if (prevAnnotation !== annotation) {
              // Select current:
              navigation.deselectAnnotation();

              navigation.activeAnnotation = annotation;
              annotation.setControlPointsVisibility(true);

              H.fireEvent(
                  navigation,
                  'showPopup',
                  {
                      annotation: annotation,
                      formType: 'annotation-toolbar',
                      options: navigation.annotationToFields(annotation),
                      onSubmit: function (data) {

                          var config = {},
                              typeOptions;

                          if (data.actionType === 'remove') {
                              navigation.activeAnnotation = false;
                              navigation.chart.removeAnnotation(annotation);
                          } else {
                              navigation.fieldsToOptions(data.fields, config);
                              navigation.deselectAnnotation();

                              typeOptions = config.typeOptions;

                              if (annotation.options.type === 'measure') {
                                  // Manually disable crooshars according to
                                  // stroke width of the shape:
                                  typeOptions.crosshairY.enabled =
                                      typeOptions.crosshairY.strokeWidth !== 0;
                                  typeOptions.crosshairX.enabled =
                                      typeOptions.crosshairX.strokeWidth !== 0;
                              }

                              annotation.update(config);
                          }
                      }
                  }
              );


          } else {
              // Deselect current:
              navigation.deselectAnnotation();
              H.fireEvent(navigation, 'closePopup');
          }
          // Let bubble event to chart.click:
          event.activeAnnotation = true;

          return highed.dom.nodefault(event);
      }

      function onDblClick(){
        var annotation = this,
        navigation = annotation.chart.navigationBindings;
        
        H.fireEvent(
          navigation,
          'showPopup',
          {
            annotation: annotation,
            formType: 'annotation-toolbar',
            options: navigation.annotationToFields(annotation),
            onSubmit: function (data) {
              var config = {},
                  typeOptions;

              if (data.actionType === 'remove') {
                  navigation.activeAnnotation = false;
                  navigation.chart.removeAnnotation(annotation);
              } else {
                  navigation.fieldsToOptions(data.fields, config);
                  navigation.deselectAnnotation();

                  typeOptions = config.typeOptions;

                  if (annotation.options.type === 'measure') {
                      // Manually disable crooshars according to
                      // stroke width of the shape:
                      typeOptions.crosshairY.enabled =
                          typeOptions.crosshairY.strokeWidth !== 0;
                      typeOptions.crosshairX.enabled =
                          typeOptions.crosshairX.strokeWidth !== 0;
                  }

                  annotation.update(config);
              }
            }
          }
        );

        document.querySelector('.highcharts-annotation-edit-button').click();

      }

      H.merge(
          true,
          annotationType.prototype.defaultOptions.events,
          {
            contextmenu: selectAndshowPopup,
            dblclick: onDblClick,
            mouseover: hideTooltip,
            mouseleave: showTooltip
          }
      );
    }

    if (H.Annotation) {
      // Basic shapes:
      selectableAnnotation(H.Annotation);
  
      // Advanced annotations:
      H.objectEach(H.Annotation.types, function (annotationType) {
        
        selectableAnnotation(annotationType);
      });
    }

    H.Toolbar.prototype.showHideToolbar = function () {

      var stockToolbar = this,
          chart = this.chart,
          wrapper = stockToolbar.wrapper,
          toolbar = this.listWrapper,
          submenu = this.submenu,
          visible = this.visible,
          PREFIX = 'highcharts-',
          DIV = 'div',
          createElement = H.createElement,
          showhideBtn,
          blacklist = ['pie'];


      if (chart.options && chart.options.series) {
        var typeInBlacklist = chart.options.series.some(function(series) {
          return blacklist.includes(series.type);
        });

        if (typeInBlacklist || !showAnnotationIcon) {
          removeStockTools();
          return;
        }
      }

      addStockTools();
      // Show hide toolbar
      this.showhideBtn = showhideBtn = createElement(DIV, {
          className: PREFIX + 'toggle-toolbar ' + (visible ? ' active' : ' inactive')
      }, null, wrapper);

      if (!visible) {
          // hide
          if (submenu) {
              submenu.style.display = 'none';
          }
          stockToolbar.visible = visible = false;
    
          toolbar.classList.add(PREFIX + 'hide');
          wrapper.style.height = showhideBtn.offsetHeight + 'px';

          this.showhideBtn.innerHTML = '<span><span class="fa fa-chevron-up"></span><i class="fas fa-marker"></i><span class="fa fa-chevron-down"></span><span class="tooltip">Annotate Chart</span></span>'
      } else {
          wrapper.style.height = '100%';
          this.showhideBtn.innerHTML = '<span><span class="fa fa-chevron-up"></span> <i class="fas fa-marker"></i> <span class="fa fa-chevron-down"/></span>'
      }

      stockToolbar.listWrapper.style.height = 'calc(100% - 90px)';
    
      // toggle menu
      ['click', 'touchstart'].forEach(function (eventName) {
          H.addEvent(showhideBtn, eventName, function () {
            if (planCode && planCode === 1) {
              // Show pay up dialog
              events.emit('Payup');
            } else {
              chart.update({
                stockTools: {
                    gui: {
                        visible: !visible,
                        placed: true
                    }
                }
            });
            }
          });
      });
    }

    H.Annotation.ControlPoint.prototype.redraw = function (animation) {
      this.graphic[animation ? 'animate' : 'attr'](
          this.options.positioner ? this.options.positioner.call(this, this.target) : null
      );
    };

    H.Popup.prototype.showPopup = function () {
      var popupDiv = this.container,
          PREFIX = 'highcharts-',
          toolbarClass = PREFIX + 'annotation-toolbar',
          popupCloseBtn = popupDiv
              .querySelectorAll('.' + PREFIX + 'popup-close')[0];

      // reset content
      popupDiv.innerHTML = '';

      popupDiv.classList.remove('hcc-popup')
      // reset toolbar styles if exists
      if (popupDiv.className.indexOf(toolbarClass) >= 0) {
          popupDiv.classList.remove(toolbarClass);

          // reset toolbar inline styles
          popupDiv.removeAttribute('style');
      }

      // add close button
      popupDiv.appendChild(popupCloseBtn);
      popupDiv.style.display = 'block';
    }

    H.Popup.prototype.annotations.addToolbar = function (chart, options, callback) {
      var _self = this,
          lang = this.lang,
          popupDiv = this.popup.container,
          showForm = this.showForm,
          PREFIX = 'highcharts-',
          toolbarClass = PREFIX + 'annotation-toolbar hcc-popup',
          createElement = H.createElement,
          pick = H.pick,
          SPAN = 'span',
          button;

      // set small size
      if (popupDiv.className.indexOf(toolbarClass) === -1) {
          popupDiv.className += ' ' + toolbarClass;
      }

      // set position
      popupDiv.style.top = chart.plotTop + 10 + 'px';

      // create label
      createElement(SPAN, {
          innerHTML: pick(
              // Advanced annotations:
              lang[options.langKey] || options.langKey,
              // Basic shapes:
              options.shapes && options.shapes[0].type
          )
      }, null, popupDiv);

      // add buttons
      button = this.addButton(
          popupDiv,
          lang.removeButton || 'remove',
          'remove',
          callback,
          popupDiv
      );

      button.className += ' ' + PREFIX + 'annotation-remove-button';

      button = this.addButton(
          popupDiv,
          lang.editButton || 'edit',
          'edit',
          function () {
            var currentAnnotation = chart.currentAnnotation;            
            events.emit('ShowAnnotationModal', currentAnnotation.options);
            annotationModalOpen = true
          },
          popupDiv
      );

      button.className += ' ' + PREFIX + 'annotation-edit-button';
    }

    H.setOptions({
      navigation: {
          bindings: {
  
              labelAnnotation: {
                  start: function (e) {
                      var x = this.chart.xAxis[0].toValue(e.chartX),
                          y = this.chart.yAxis[0].toValue(e.chartY),
                          type = 'label',
                          navigation = this.chart.options.navigation,
                          bindings = navigation && navigation.bindings;
  
                      this.chart.addAnnotation(H.merge({
                          langKey: 'label',
                          labelOptions: {
                              format: '{y:.2f}'
                          },
                          labels: [{
                              point: {
                                  x: x,
                                  y: y,
                                  xAxis: 0,
                                  yAxis: 0
                              },
                              controlPoints: [{
                                  symbol: 'triangle-down',
                                  positioner: function (target) {
                                      if (!target.graphic.placed) {
                                          return {
                                              x: 0,
                                              y: -9e7
                                          };
                                      }
  
                                      var xy = H.Annotation.MockPoint
                                          .pointToPixels(
                                              target.points[0]
                                          );
  
                                      return {
                                          x: xy.x - this.graphic.width / 2,
                                          y: xy.y - this.graphic.height / 2
                                      };
                                  },
  
                                  // TRANSLATE POINT/ANCHOR
                                  events: {
                                    drag: function (e, target) {
                                      var xy = this.mouseMoveToTranslation(e);

                                      target.translate(-xy.x, -xy.y);
                                      target.translatePoint(xy.x, xy.y);
                        
                                      target.annotation.labels[0].options =
                                        target.options;

                                      target.redraw(false);
                                    }
                                  }
                              }, {
                                  symbol: 'square',
                                  positioner: function (target) {
                                      if (!target.graphic.placed) {
                                          return {
                                              x: 0,
                                              y: -9e7
                                          };
                                      }
  
                                      return {
                                          x: target.graphic.alignAttr.x -
                                              this.graphic.width / 2,
                                          y: target.graphic.alignAttr.y -
                                              this.graphic.height / 2
                                      };
                                  },
  
                                  // TRANSLATE POSITION WITHOUT CHANGING THE
                                  // ANCHOR
                                  events: {
                                      drag: function (e, target) {
                                        
                                        var xy = this.mouseMoveToTranslation(e);

                                        target.translatePoint(xy.x, xy.y);

                                        target.annotation.labels[0].options =
                                            target.options;

                                        target.redraw(false);

                                      }
                                  }
                              }],
                              overflow: 'none',
                              crop: true
                          }]
                      },
                      navigation.annotationsOptions,
                      bindings[type] && bindings[type].annotationsOptions));
                  }
              }
          }
      }
    });

    H.Annotation.prototype.onMouseUp = function () {
      var chart = this.chart,
          annotation = this.target || this,
          annotationsOptions = chart.options.annotations,
          index = chart.annotations.indexOf(annotation);

      this.removeDocEvents();
      annotationsOptions[index] = annotation.options;
      events.emit("StockToolsChanged", annotation.options, index, "AnnotationMoved");
    }


    H.Annotation.ControlPoint.prototype.addEvents = function () {
      var emitter = this;

      H.addEvent(
          emitter.graphic.element,
          'mousedown',
          function (e) {
              emitter.onMouseDown(e);
          }
      );

      emitter.options.events.mouseover = hideTooltip;
      emitter.options.events.mouseleave = showTooltip;

      H.objectEach(emitter.options.events, function (event, type) {
          var eventHandler = function (e) {
              if (type !== 'click' || !emitter.cancelClick) {
                  event.call(
                      emitter,
                      emitter.chart.pointer.normalize(e),
                      emitter.target
                  );
              }
          };

          if (H.inArray(type, emitter.nonDOMEvents || []) === -1) {
              emitter.graphic.on(type, eventHandler);
          } else {
              H.addEvent(emitter, type, eventHandler);
          }
      });

      if (emitter.options.draggable) {
          H.addEvent(emitter, 'drag', emitter.onDrag);

          if (!emitter.graphic.renderer.styledMode) {
              emitter.graphic.css({
                  cursor: {
                      x: 'ew-resize',
                      y: 'ns-resize',
                      xy: 'move'
                  }[emitter.options.draggable]
              });
          }
      }

      if (!emitter.isUpdating) {
          H.fireEvent(emitter, 'add');
      }
    }

    H.Annotation.ControlPoint.prototype.onMouseUp = function () {
      var chart = this.chart,
          annotation = this.target.annotation || this,
          annotationsOptions = chart.options.annotations,
          index = chart.annotations.indexOf(annotation);

      if (annotation.target && annotation.target.options && (annotation.target.options.type === 'crookedLine' || annotation.target.options.type === "elliottWave")) {
        //annotationsOptions[index].typeOptions.points = annotation.target.points;
        events.emit("StockToolsChanged", annotation.target.points, index, "AnnotationHandleMoved");
      } 
      else if (annotation.options && (annotation.options.langKey === 'rectangle' || annotation.options.langKey === 'circle')) {
        events.emit("StockToolsChanged",  annotation.shapes[0].options.point, index, "AnnotationHandleMoved");
      }
      else {
        annotationsOptions[index].labels[0].point = annotation.labels[0].options.point;
        events.emit("StockToolsChanged",  annotation.labels[0].options.point, index, "AnnotationHandleMoved");
      }

      this.removeDocEvents();
    }


    // Comunication with bindings:
    H.addEvent(H.NavigationBindings, 'selectButton', function (event) {
      if (timeout) {

        clearTimeout(timeout);
        timeout = null;
      }

      this.chart.update({
        tooltip: {
          enabled: false
        }
      });
    });


    H.addEvent(H.NavigationBindings, 'deselectButton', function (event) {
      var chart = this.chart;
      timeout = setTimeout(function(){
        chart.update({
          tooltip: {
            enabled: true
          }
        });
      }, 1000);
    });


    H.NavigationBindings.prototype.bindingsButtonClick = function (button, events, clickEvent) {
      var navigation = this,
          chart = navigation.chart,
          PREFIX = 'highcharts-';

      if (navigation.selectedButtonElement) {
        H.fireEvent(
            navigation,
            'deselectButton',
            { button: navigation.selectedButtonElement }
        );

        if (navigation.nextEvent) {
            // Remove in-progress annotations adders:
            if (
                navigation.currentUserDetails &&
                navigation.currentUserDetails.coll === 'annotations'
            ) {
                chart.removeAnnotation(navigation.currentUserDetails);
            }
            navigation.mouseMoveEvent = navigation.nextEvent = false;
        }
        if (events.start || events.steps) {
            chart.renderer.boxWrapper.removeClass(PREFIX + 'draw-mode');
        }

        if (button.classList.contains(navigation.selectedButton.className)) return;
        
      }

      navigation.selectedButton = events;
      navigation.selectedButtonElement = button;

      H.fireEvent(navigation, 'selectButton', { button: button });

      // Call "init" event, for example to open modal window
      if (events.init) {
          events.init.call(navigation, button, clickEvent);
      }

      if (events.start || events.steps) {
          chart.renderer.boxWrapper.addClass(PREFIX + 'draw-mode');
      }
    }
    
  }

  ///////////////////////////////////////////////////////////////////////////

  return {
    init: init,
    hide: hide,
    closeAnnotationPopup: closeAnnotationPopup,
    getStockToolsToolbarConfig: getStockToolsToolbarConfig,
    toggleAnnotationIcon: toggleAnnotationIcon,
    on: events.on,
    getAnnotationModalOpen: getAnnotationModalOpen
  };

};