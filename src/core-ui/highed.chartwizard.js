/******************************************************************************

Copyright (c) 2016-2018, Highsoft

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

******************************************************************************/

// @format


/** Basic chart wizard for creating a chart
 * Includes 
 * 1) Choose template
 * 2) Title/Subtitle
 * 3) Choose map (Maps only)
 * 4) Importing Data
 * 5) Customize
 */

highed.ChartWizard = function(parent, userOptions, props, chartPreview, chartType) {
  var events = highed.events(),
    builtInOptions = [
      {
        id: 1,
        title: 'Choose Template',
        permission: 'templates',
        create: function(body) {
          highed.dom.ap(body, templateContainer);
        }
      },
      {
        id: 4,
        title: 'Title Your ' + (chartType === 'Map' ? 'Map' : 'Chart'),
        create: function(body) {
          highed.dom.ap(body, titleContainer);
        }
      },
      {
        id: 5,
        title: 'Customize',
        permission: 'customize',
        hideTitle: true,
        create: function(body) {
          highed.dom.ap(body, customizerContainer);
        }
      }
    ],
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox wizard highed-box-size '
    ),
    title = highed.dom.cr('div', 'highed-toolbox-body-title'),
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents test-test'
    ),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
    skippedData = false,
    listContainer = highed.dom.cr('div', 'highed-toolbox-createchart-list'),
    isVisible = false,
    customizerContainer = highed.dom.cr('div', 'highed-toolbox-customise'),
    titleContainer = highed.dom.cr('div', 'highed-toolbox-title'),
    templateContainer = highed.dom.cr('div', 'highed-toolbox-template'),
    dataTableContainer = highed.dom.cr('div', 'highed-toolbox-data'),
    dataNextButton = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Next'),
    dataSkipButton = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'No thanks, I will enter my data manually'),
    mapContainer = highed.dom.cr('div', 'highed-toolbox-map'),
    //toolbox = highed.Toolbox(userContents),
    activeOption,
    options = [];

    function init(dataPage,templatePage, customizePage, mapSelector, chartContainer) {
      var dataIndex = 1;

      if (highed.chartType === 'Map') {
        builtInOptions.splice(1, 0, {
          id: 2,
          title: 'Choose Map',
          create: function(body) {
            highed.dom.ap(body, mapContainer);
          },
          onload: function() {
            mapSelector.loadSamples(chartPreview.options.getTemplateSettings(), function() {
              events.emit("SimpleCreateChartDone", userOptions.indexOf('customize') === -1);
            });
            mapSelector.showMaps(chartPreview.options.getTemplateSettings()[0], goToNextPage);
          }
        });
        dataIndex = 2;
      }


      builtInOptions.splice(dataIndex, 0, 
        {
          id: 3,
          title: 'Import Data',
          create: function(body) {
            highed.dom.ap(body, dataTableContainer);
          },
          onload: function() {
            var options = chartPreview.options.getCustomized();
            
            if (options && options.series && (options.series || []).some(function(s){ return s.type === 'mappoint'})){
              dataPage.showLatLongTable('mappoint');
              chartPreview.redraw();
              
              highed.dom.style(dataSkipButton, {
                display: 'none'
              });
              
              return;
            }


            if (options && options.series && (options.series || []).some(function(s){ return s.type === 'mapbubble'})){
              dataPage.showLatLongTable('mapbubble');

              highed.dom.style(dataNextButton, {
                display: 'none'
              });
              
              return;
            }
            
            highed.dom.style(dataNextButton, {
              display: 'none'
            });
            
          }
        });



      var counter = 1;
      toolbox = highed.Toolbox(userContents);
      builtInOptions.forEach(function(option, index) {
        if (option.permission && userOptions.indexOf(option.permission) === -1) return;

        var o = toolbox.addEntry({
          title: option.title,
          number: counter,//option.id,
          onClick: manualSelection,
          onload: option.onload,
          hideTitle: option.hideTitle
        });

        if (highed.isFn(option.create)) {
          option.create(o.body);
        }

        options.push(o);
        counter++;

      });

      options[0].expand();

      createTitleSection();
      createImportDataSection(dataPage, chartContainer);
      createMapDataSection(mapSelector);
      createTemplateSection(templatePage);
      createCustomizeSection();

      highed.dom.ap(contents, userContents);
      highed.dom.ap(body, contents);
  
      //highed.dom.ap(userContents, listContainer);
      
      highed.dom.ap(parent, highed.dom.ap(container, body));

      expand();
    }

    function goToNextPage() {
      var expanded = toolbox.getActiveItem();
      var length = options.length - 1;
      var index = options.findIndex(function(opt){ return expanded === opt; });
      if (index + 1 <= length) options[index+1].expand();
      else events.emit("SimpleCreateChartDone", userOptions.indexOf('customize') === -1);
    }

    function createTitleSection() {

      var titleInput = highed.dom.cr('input', 'highed-imp-input'),
          subtitleInput = highed.dom.cr('input', 'highed-imp-input'),
          nextButton = highed.dom.cr(
            'button',
            'highed-ok-button highed-import-button negative',
            'Next'
          ),
          skipAll = highed.dom.cr('span', 'highed-toolbox-skip-all', 'Skip All');

      titleInput.placeholder = 'Enter ' + (highed.chartType === 'Map' ? 'map' : 'chart') + ' title';
      subtitleInput.placeholder = 'Enter ' + (highed.chartType === 'Map' ? 'map' : 'chart') + ' subtitle';

      titleInput.value = '';
      subtitleInput.value = '';

      //if (highed.chartType === 'Map') {
        highed.dom.style(skipAll, {
          display: 'none'
        })
      //}

      highed.dom.on(nextButton, 'click', function() {
        
        goToNextPage();
        events.emit("SimpleCreateChangeTitle", {
          title: titleInput.value,
          subtitle: subtitleInput.value
        });
      });

      highed.dom.on(skipAll, 'click', function() {
        events.emit("SimpleCreateChartDone", true);
      });

      highed.dom.ap(titleContainer,  
        highed.dom.cr(
          'table'
        ),
        highed.dom.ap(
          highed.dom.cr('tr', 'highed-toolbox-input-container'),
          highed.dom.cr(
            'td',
            'highed-toolbox-label',
            (highed.chartType === 'Map' ? 'Map' : 'Chart') + ' Title'
          ), 
          highed.dom.ap(highed.dom.cr('td'), titleInput)
        ),
        highed.dom.ap(
          highed.dom.cr('tr', 'highed-toolbox-input-container'),
          highed.dom.cr(
            'td',
            'highed-toolbox-label',
            'Subtitle'
          ), 
          highed.dom.ap(highed.dom.cr('td'), subtitleInput)
        ),
        highed.dom.ap(
          highed.dom.cr('tr'),
          highed.dom.cr('td'),
          highed.dom.ap(
            highed.dom.cr('td','highed-toolbox-button-container'),
            skipAll,
            nextButton
          )
        )
      );   
    }

    function createMapDataSection(mapSelector) {
      highed.dom.ap(mapContainer, mapSelector.createMapDataSection(goToNextPage));
    }

    function createImportDataSection(dataPage, chartContainer) {

      var loader = highed.dom.cr('span','highed-wizard-loader', '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>'),
          dataTableDropzoneContainer = dataPage.createSimpleDataTable(function() {
            goToNextPage();
          }, function(loading) {
            if (loading) loader.classList += ' active';
            else loader.classList.remove('active');
          }, chartContainer);


      dataNextButton = highed.dom.cr(
        'button',
        'highed-ok-button highed-import-button negative',
        'Next'
      );

      highed.dom.on(dataNextButton, 'click', function(){
        if (chartType !== 'Map') skippedData = false;
        goToNextPage();
      });
      highed.dom.on(dataSkipButton, 'click', function(){
        if (chartType !== 'Map') skippedData = true;
        goToNextPage();
      });

      highed.dom.ap(dataTableContainer,
        highed.dom.ap(dataTableDropzoneContainer,
          highed.dom.ap(
            highed.dom.cr('div','highed-toolbox-button-container'),
            loader,
            dataSkipButton,
            dataNextButton
          )
        )
      );
    }

    function createTemplateSection(templatePage) {

      var nextButton = highed.dom.cr(
            'button',
            'highed-ok-button highed-import-button negative',
            'Choose A Template Later'
      ),
      skipAllLink = highed.dom.cr('span','', 'Skip All'),
      skipAll = highed.dom.ap(highed.dom.cr('div', 'highed-toolbox-skip-all'), skipAllLink);
      loader = highed.dom.cr('span','highed-wizard-loader ', '<i class="fa fa-spinner fa-spin fa-1x fa-fw a"></i>'),
      templatesContainer = templatePage.createMostPopularTemplates(function() {
        setTimeout(function() {
          goToNextPage();
        }, 200);
      }, function(loading) {
        if (loading) loader.classList += ' active';
        else loader.classList.remove('active');
      });

      highed.dom.on(skipAll, 'click', function() {
        events.emit("SimpleCreateChartDone", true);
      });
      
      highed.dom.on(nextButton, 'click', function() {
        goToNextPage();
      });

      if (highed.chartType === 'Map') {
        highed.dom.style([nextButton, skipAllLink], {
          display: 'none'
        })
      }

      highed.dom.ap(templateContainer, 
        highed.dom.ap(highed.dom.cr('div', 'highed-toolbox-template-body'),         
          highed.dom.ap(
            highed.dom.cr('div', 'highed-toolbox-text'), 
            highed.dom.cr('div', 'highed-toolbox-template-text', 'Pick a basic starter template.' + (highed.chartType === 'Map' ? '' : ' You can change it later.')),
            highed.dom.cr('div', 'highed-toolbox-template-text', highed.chartType === 'Map' ? '' : "If you're not sure, just hit Choose A Template Later.")
          ),
          highed.dom.ap(
            highed.dom.cr('div', 'highed-toolbox-extras'),
            nextButton,
            highed.dom.ap(
              skipAll,
              loader
            )
          )
        ),
        templatesContainer
      );
    }

    function createCustomizeSection() {

      var nextButton = highed.dom.cr(
            'button',
            'highed-ok-button highed-import-button negative',
            'Customize Your ' + (chartType === 'Map' ? 'Map' : 'Chart')
          );//,
         // dataTableDropzoneContainer = dataPage.createSimpleDataTable();

      highed.dom.on(nextButton, 'click', function() {
        events.emit("SimpleCreateChartDone", skippedData);
      });

      highed.dom.ap(customizerContainer, 
        highed.dom.cr('div', 'highed-toolbox-customize-header', "You're Done!"),
        highed.dom.ap(
          highed.dom.cr('div','highed-toolbox-button-container'),
          nextButton
        )
      );
    }

    function manualSelection(number) {
      options.forEach(function(option, i){
        if (i+1 <= number) option.disselect();
        else option.removeCompleted();
      });
    }

    function resize() {
      if (isVisible) {
        expand();
      }
    }

    highed.dom.on(window, 'resize', resize);
    
    function expand() {
      //var bsize = highed.dom.size(bar);

      var newWidth = props.widths.desktop;
      if (highed.onTablet() && props.widths.tablet) newWidth = props.widths.tablet;
      else if (highed.onPhone() && props.widths.phone) newWidth = props.widths.phone;

      highed.dom.style(body, {
        width: 100 + '%',
        //height: //(bsize.h - 55) + 'px',
        opacity: 1
      });

      highed.dom.style(container, {
        width: newWidth + '%'
      });

      events.emit('BeforeResize', newWidth);

    function resizeBody() {
      var bsize = highed.dom.size(body),
      tsize = highed.dom.size(title),
      size = {
        w: bsize.w,
        h: (window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y
      };
        
      highed.dom.style(contents, {
        width: size.w + 'px',
        height: ((size.h - 16)) + 'px'
      });
    }

    setTimeout(resizeBody, 300);
    highed.emit('UIAction', 'ToolboxNavigation', props.title);

    }

    function show() {
      highed.dom.style(container, {
        display: 'block'
      });
      isVisible = true;
      //expand();
      
    }
    
    function hide() {
      highed.dom.style(container, {
        display: 'none'
      });
      isVisible = false;
    }

    function destroy() {}

    function getIcons() {
      return null;
    }

  //////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    destroy: destroy,
    hide: hide,
    show: show,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    getIcons: getIcons
  };
};
