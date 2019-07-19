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

highed.MapSelector = function(chartPreview, chartType) {
  var events = highed.events();

  function createMapDataSection(toNextPage, cb) {

    if (chartType && chartType === 'Map' && Highcharts) {

      var container = highed.dom.cr('div', 'highed-table-dropzone-container'),
          baseMapPath = "https://code.highcharts.com/mapdata/",
          showDataLabels = false, // Switch for data labels enabled/disabled
          mapCount = 0,
          searchText,
          mapOptions = highed.dom.cr('div', 'highed-map-selector');
          mapSelectorImages = highed.dom.cr('div', 'highed-map-selector-images-container');

      function getSearchResults(query) {
        mapOptions.innerHTML = '';
        mapSelectorImages.innerHTML = '';
        mapCount = 0;

        Object.keys(Highcharts.mapDataIndex).forEach(function (mapGroup, maps) {
            if (mapGroup !== "version") {
              var found = false;
              var mapSelectorOptions = highed.dom.cr('div', 'highed-map-selector-options');
              Object.keys(Highcharts.mapDataIndex[mapGroup]).forEach(function (desc, path) {
                var pos = desc.search(query);
                if (pos > -1) {
                  //mapOptions += '<option value="' + path + '">' + desc + '</option>';
                  const option = highed.dom.cr('div', 'highed-map-option', desc);
                  var options = [option];

                  highed.dom.ap(mapSelectorOptions, option);

                  if (mapCount < 5) {
                    var mapSelectorImage = highed.dom.cr('img', 'highed-map-selector-image'),
                        mapSelectorImageContainer = highed.dom.cr('div', 'highed-map-selector-image-container'),
                        mapSelectorImageTitle = highed.dom.cr('div', 'highed-map-selector-image-text', desc);

                    mapSelectorImage.src = baseMapPath + (Highcharts.mapDataIndex[mapGroup][desc]).replace('.js', '.svg');
                    highed.dom.ap(mapSelectorImageContainer,mapSelectorImageTitle, mapSelectorImage);
                    highed.dom.ap(mapSelectorImages, mapSelectorImageContainer);
                    options.push(mapSelectorImageContainer);
                  }

                  highed.dom.on(options, 'click', function() {

                    var mapKey = Highcharts.mapDataIndex[mapGroup][desc].slice(0, -3),
                    svgPath = baseMapPath + mapKey + '.svg',
                    geojsonPath = baseMapPath + mapKey + '.geo.json',
                    javascriptPath = baseMapPath + Highcharts.mapDataIndex[mapGroup][desc];
                    
                    chartPreview.options.updateMap(mapKey, javascriptPath);
                    highed.ajax({
                      url: geojsonPath,
                      type: 'GET',
                      dataType: 'json',
                      success: function(data){
                        events.emit('LoadMapData', data.features);
                        if (toNextPage) toNextPage();
                      },
                      error: function(e) {
                      }
                    })

                  });

                  mapCount += 1;
                  found = true;
                }
              });

              if (found) highed.dom.ap(mapOptions, highed.dom.cr('div', 'highed-map-option-header', mapGroup), mapSelectorOptions);
            }
        });
      }

      getSearchResults('');
      searchText = 'Search ' + mapCount + ' maps';

      var input = highed.dom.cr('input', 'highed-map-selector-input');
      input.placeholder = 'Search ' + mapCount + ' maps';

      highed.dom.on(input, 'keyup', function(ev) {
        if (ev.target.value === '') { 
          mapOptions.classList.remove("active");
          return;
        }
        //if (!mapOptions.classList.contains('active')) mapOptions.classList += " active";
        getSearchResults(ev.target.value); 
      });

      //mapOptions = '<option value="custom/world.js">' + searchText + '</option>' + mapOptions;
      var inputSelector = highed.dom.cr('div', 'highed-map-selector-arrow', '<i class="fa fa-chevron-down"/>');

      highed.dom.on(inputSelector, 'click', function() {
        if (mapOptions.classList.contains('active')) mapOptions.classList.remove('active');
        else mapOptions.classList += " active";
      });

      highed.dom.ap(container, 
                    highed.dom.ap(highed.dom.cr('div', ''), input, inputSelector), 
                    highed.dom.ap(highed.dom.cr('div', ''), mapOptions),
                    mapSelectorImages);
      return container
    }

  }


  //////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    createMapDataSection: createMapDataSection
  };
};
