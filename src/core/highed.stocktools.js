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


highed.StockTools = function(planCode) {

  var popup,
  events = highed.events(),
  stockToolsToolbarConfig = {
    stockTools: {
      gui: {
        buttons: ['simpleShapes', 'lines', 'crookedLines', 'verticalLabels', 'separator', 'toggleAnnotations', 'fullScreen']
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
                popup.container.style.display = 'none';
              }
            }, 1);
          }
        },
        closePopup: function() {
          // Hide the popup container, and reset currentAnnotation
          this.chart.annotationsPopupContainer.style.display = 'none';
          this.chart.currentAnnotation = null;
        }
      }
    }
  };

  function closeAnnotationPopup(){
    if (popup) {
      popup.closePopup()
    }
  }

  function hide(){
    stockToolsToolbarConfig.stockTools.gui.visible = false;
  }

  function getStockToolsToolbarConfig(){
    return stockToolsToolbarConfig;
  }

  function init(Highcharts) {

    function selectableAnnotation(annotationType) {
      var originalClick = annotationType.prototype.defaultOptions.events &&
              annotationType.prototype.defaultOptions.events.click;


      function overrideClick(event){
        if (originalClick && originalClick.click) {
            originalClick.click.call(annotation, event);
        }
      }

      function selectAndshowPopup(event) {
          var annotation = this,
              navigation = annotation.chart.navigationBindings,
              prevAnnotation = navigation.activeAnnotation;
/*
          if (originalClick) {
              originalClick.click.call(annotation, event);
          }*/

          if (prevAnnotation !== annotation) {
              // Select current:
              navigation.deselectAnnotation();

              navigation.activeAnnotation = annotation;
              annotation.setControlPointsVisibility(true);
              

              Highcharts.fireEvent(
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
              Highcharts.fireEvent(navigation, 'closePopup');
          }
          // Let bubble event to chart.click:
          event.activeAnnotation = true;

          return highed.dom.nodefault(event);
      }

      function onDblClick(){
        var annotation = this,
        navigation = annotation.chart.navigationBindings;

        Highcharts.fireEvent(
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

      Highcharts.merge(
          true,
          annotationType.prototype.defaultOptions.events,
          {
              contextmenu: selectAndshowPopup,
              click: overrideClick,
              dblclick: onDblClick
          }
      );
    }

    if (Highcharts.Annotation) {
      // Basic shapes:
      selectableAnnotation(Highcharts.Annotation);
  
      // Advanced annotations:
      Highcharts.objectEach(Highcharts.Annotation.types, function (annotationType) {
          selectableAnnotation(annotationType);
      });
    }

    Highcharts.Toolbar.prototype.showHideToolbar = function () {

      var stockToolbar = this,
          chart = this.chart,
          wrapper = stockToolbar.wrapper,
          toolbar = this.listWrapper,
          submenu = this.submenu,
          visible = this.visible,
          PREFIX = 'highcharts-',
          DIV = 'div',
          createElement = Highcharts.createElement,
          showhideBtn;
    
      // Show hide toolbar
      this.showhideBtn = showhideBtn = createElement(DIV, {
          className: PREFIX + 'toggle-toolbar '
      }, null, wrapper);

      if (!visible) {
          // hide
          if (submenu) {
              submenu.style.display = 'none';
          }
          stockToolbar.visible = visible = false;
    
          toolbar.classList.add(PREFIX + 'hide');
          wrapper.style.height = showhideBtn.offsetHeight + 'px';

          this.showhideBtn.innerHTML = 'Annotate <span class="fa fa-chevron-down"/>'
      } else {
          wrapper.style.height = '100%';
          this.showhideBtn.innerHTML = 'Annotate <span class="fa fa-chevron-right"/>'
      }

      stockToolbar.listWrapper.style.height = 'calc(100% - 70px)';
    
      // toggle menu
      ['click', 'touchstart'].forEach(function (eventName) {
          Highcharts.addEvent(showhideBtn, eventName, function () {
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

    Highcharts.Annotation.ControlPoint.prototype.redraw = function (animation) {
      this.graphic[animation ? 'animate' : 'attr'](
          this.options.positioner ? this.options.positioner.call(this, this.target) : null
      );
    };

    Highcharts.Popup.prototype.showPopup = function () {

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

    Highcharts.Popup.prototype.annotations.addToolbar = function (chart, options, callback) {
      var _self = this,
          lang = this.lang,
          popupDiv = this.popup.container,
          showForm = this.showForm,
          PREFIX = 'highcharts-',
          toolbarClass = PREFIX + 'annotation-toolbar hcc-popup',
          createElement = Highcharts.createElement,
          pick = Highcharts.pick,
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
              showForm.call(
                  _self,
                  'annotation-edit',
                  chart,
                  options,
                  callback
              );
          },
          popupDiv
      );

      button.className += ' ' + PREFIX + 'annotation-edit-button';
    }

  }

  ///////////////////////////////////////////////////////////////////////////

  return {
    init: init,
    hide: hide,
    closeAnnotationPopup: closeAnnotationPopup,
    getStockToolsToolbarConfig: getStockToolsToolbarConfig,
    on: events.on
  };

};