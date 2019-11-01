/******************************************************************************

Copyright (c) 2016-2019, Highsoft

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
/** Map selector
 */

highed.MapSelector = function(chartPreview) {
  var events = highed.events(),
      predefinedMaps = highed.dom.cr('div', ''),
      importContainer = highed.dom.cr('div', 'highed-map-import-container'),
      container = highed.dom.cr('div', 'highed-table-dropzone-container'),
      mapSelectorContainer = highed.dom.cr('div'),
      mapSelectorMapContainer = highed.dom.cr('div', 'highed-map-selector-container'),
      mapSelectorGeojsonContainer = highed.dom.cr('div', 'highed-map-geojson-container'),
      mapSelectorGeojsonCodeContainer = highed.dom.cr('div', ''),
      mapSampleContainer = highed.dom.cr('div', 'highed-toolbox-map'),
      loadSampleText = highed.dom.cr('div', 'highed-map-load-sample-text', 'Or load a sample to try it out:'),
      baseMapPath = "https://code.highcharts.com/mapdata/",
      mapSelectorGeojsonNameContainer =  highed.dom.cr('div', ''),
      mapSelectorGeojsonCodeDropdown = highed.DropDown(mapSelectorGeojsonCodeContainer, 'highed-map-import-dropdown'),
      mapSelectorGeojsonNameDropdown = highed.DropDown(mapSelectorGeojsonNameContainer, 'highed-map-import-dropdown'),
      mapTable = highed.MapTable(mapSelectorMapContainer, {
        selects: [],
        header: 'Link Values',
        skipOrdering: true,
        readOnly: true,
        dynamicWidth: true,
        ellipsesCounter: 4,
        description: [
          'Your GEOJSON data is not compatible with our system. We expect there to be a "hc-key" and "name" value.', 
          'We have listed the first and last three rows from your dataset below, please select the country code and name so we can link these two together.',
          'If the options below are selected correctly then continue by pressing the "Save" button.'
        ].join(' '),
        extra: highed.dom.ap(
          highed.dom.cr('div', 'highed-map-select-geojson'),
          highed.dom.ap(
            highed.dom.cr('div', 'highed-map-geojson-label', 'Code:'),
            mapSelectorGeojsonCodeContainer
          ),
          highed.dom.ap(
            highed.dom.cr('div', 'highed-map-geojson-label', 'Name:'),
            mapSelectorGeojsonNameContainer
          )
        ),
      }),
      mostPopular = [{
          name: 'World Map',
          map: 'custom/world'
        }, {
          name: 'Europe',
          map: 'custom/europe'
        },{
          name: 'United States of America',
          map: 'countries/us/us-all'
        }, {
          name: 'United Kingdom',
          map: 'countries/gb/gb-all'
        }, {
          name: 'Norway',
          map: 'countries/no/no-all'
        }],
      blacklist = [
        "World with Palestine areas, high resolution", 
        "World with Palestine areas, medium resolution",
        "World with Palestine areas, low resolution",
        "World, Eckert III projection, high resolution",
        "World, Eckert III projection, low resolution",
        "World, Miller projection, ultra high resolution",
        "World, Miller projection, very high resolution",
        "World, Miller projection, high resolution",
        "World, Miller projection, low resolution",
        "World, Robinson projection, high resolution",
        "World, Robinson projection, low resolution",
      ];

  function createMapDataSection(toNextPage, cb) {

    if (highed.chartType && highed.chartType === 'Map' && Highcharts) {

      var mapCount = 0,
          mapOptions = highed.dom.cr('div', 'highed-map-selector');
          mapSelectorImages = highed.dom.cr('div', 'highed-map-selector-images-container');

      function getSearchResults(query, skipTiles) {
        mapOptions.innerHTML = '';
        mapSelectorImages.innerHTML = '';
        mapCount = 0;

        Object.keys(Highcharts.mapDataIndex).forEach(function (mapGroup, maps) {
            if (mapGroup !== "version") {
              var found = false;
              var mapSelectorOptions = highed.dom.cr('div', 'highed-map-selector-options');
              Object.keys(Highcharts.mapDataIndex[mapGroup]).forEach(function (desc, path) {
                if (blacklist.includes(desc)) return;

                var pos = (desc.toLowerCase()).search(query.toLowerCase());
                if (pos > -1) {
                  //mapOptions += '<option value="' + path + '">' + desc + '</option>';

                  var titleText = desc.replace(', medium resolution', '');
                  const option = highed.dom.cr('div', 'highed-map-option', titleText);
                  var options = [option];

                  highed.dom.ap(mapSelectorOptions, option);

                  if (mapCount < 25 && !skipTiles) {
                    var mapSelectorImage = highed.dom.cr('img', 'highed-map-selector-image'),
                        mapSelectorImageContainer = highed.dom.cr('div', 'highed-map-selector-image-container'),
                        mapSelectorImageTitle = highed.dom.cr('div', 'highed-map-selector-image-text', titleText);

                    mapSelectorImage.src = baseMapPath + (Highcharts.mapDataIndex[mapGroup][desc]).replace('.js', '.svg');
                    highed.dom.ap(mapSelectorImageContainer,mapSelectorImageTitle, mapSelectorImage);
                    highed.dom.ap(mapSelectorImages, mapSelectorImageContainer);
                    options.push(mapSelectorImageContainer);
                  }

                  highed.dom.on(options, 'click', function() {

                    chartPreview.options.updateMap(mapKey, javascriptPath, function() {
                      highed.ajax({
                        url: geojsonPath,
                        type: 'GET',
                        dataType: 'json',
                        success: function(data) {

                          events.emit('LoadMapData', data.features);
                          if (toNextPage) toNextPage();

                          events.emit('AddSerie', {
                            name: 'Separators',
                            type: 'mapline',
                            color: 'silver',
                            showInLegend: false,
                            enableMouseTracking: false
                          });
                          
                        },
                        error: function(e) {
                        }
                      })
                    });


                  });

                  mapCount += 1;
                  found = true;
                }
              });

              if (found) highed.dom.ap(mapOptions, highed.dom.cr('div', 'highed-map-option-header', mapGroup), mapSelectorOptions);
            }
        });
      }

      function getMostPopular(){
        
        mostPopular.forEach(function(mapOption){

          var mapSelectorImage = highed.dom.cr('img', 'highed-map-selector-image'),
              mapSelectorImageContainer = highed.dom.cr('div', 'highed-map-selector-image-container'),
              mapSelectorImageTitle = highed.dom.cr('div', 'highed-map-selector-image-text', mapOption.name);

          mapSelectorImage.src = baseMapPath + mapOption.map + '.svg'; //(Highcharts.mapDataIndex[mapGroup][desc]).replace('.js', '.svg');
          highed.dom.ap(mapSelectorImageContainer,mapSelectorImageTitle, mapSelectorImage);
          highed.dom.ap(mapSelectorImages, mapSelectorImageContainer);

          highed.dom.on(mapSelectorImageContainer, 'click', function() {

            var mapKey = mapOption.map, //Highcharts.mapDataIndex[mapGroup][desc].slice(0, -3),
            svgPath = baseMapPath + mapKey + '.svg',
            geojsonPath = baseMapPath + mapKey + '.geo.json',
            javascriptPath = baseMapPath + mapOption.map + '.js'; //Highcharts.mapDataIndex[mapGroup][desc];
            
            chartPreview.options.updateMap(mapKey, javascriptPath, function() {
              highed.ajax({
                url: geojsonPath,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                  events.emit('LoadMapData', data.features);
                  if (toNextPage) toNextPage();

                  events.emit('AddSerie', {
                    name: 'Separators',
                    type: 'mapline',
                    color: 'silver',
                    showInLegend: false,
                    enableMouseTracking: false
                  });

                },
                error: function(e) {
                }
              })
            });
          });
        })
      }

      getSearchResults('', true);
      getMostPopular();
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

      var importInput = highed.dom.cr('button', 'highed-ok-button highed-import-button import-geojson-map-btn', 'Import GeoJSON Map');

      highed.dom.ap(importContainer, 
        loadSampleText,
        mapSampleContainer
      );

/*
      highed.dom.ap(importContainer, 
                    highed.dom.cr('div', 'highed-toolbox-body-title highed-map-import-geojson-header', 'Import GeoJSON Map'),
                    importInput);*/

      highed.dom.on(importInput, 'click', function() {
        highed.readLocalFile({
          type: 'text',
          accept: '.json,.geojson',
          success: function(info) {
            
            if (info.size > 2000000) {
              highed.snackBar("File size cannot exceed 2mb");
              return;
            }

            var data = JSON.parse(info.data);

            function project(geojson, projection) {
              const projectPolygon = function(coordinate) {
                  coordinate.forEach(function(lonLat, i) {
                      coordinate[i] = window.proj4(projection, lonLat);
                  });
              };
              geojson.features.forEach(function (feature) {
                  if (feature.geometry.type === 'Polygon') {
                      feature.geometry.coordinates.forEach(projectPolygon);
                  } else if (feature.geometry.type === 'MultiPolygon') {
                      feature.geometry.coordinates.forEach(function(items) {
                          items.forEach(projectPolygon);
                      });
                  }
              });
            }

            if (data.type && data.type === 'Topology') {
              // Project the data using Proj4
              
              data = window.topojson.feature(
                data,
                // For this demo, get the first of the named objects
                data.objects[Object.keys(data.objects)[0]]
              );

            } else if (data.features[0].properties.name && data.features[0].properties['hc-key']) {
              chartPreview.data.updateMapData(data);
              events.emit('LoadMapData', data.features);
              if (toNextPage) toNextPage();
              return;
            }

            // Dont have default keys, find out from user which they are and use them instead.
            var keyedData = Object.keys(data.features[0].properties),
                length = 0;

            function extractProps(data, features, key){ //User has an array value in their geojson props, extract all the values from here into own key
              features.forEach(function(feature, i){
                if (highed.isObj(feature)) {
                  Object.keys(feature).forEach(function(featureKeys){
                    data[key + '_' + i + '_' + featureKeys] = feature[featureKeys];
                  })
                }
              })
            }

            project(
              data,
              '+proj=lcc +lat_1=33 +lat_2=45 +lat_0=39 +lon_0=-96'
            );
            data.features.forEach(function(d) {
              if (d.properties) {
                Object.keys(d.properties).forEach(function(p, index){
                  if (highed.isArr(d.properties[p])) {
                    extractProps(d.properties, d.properties[p], p);
                    delete d.properties[p];
                  }
                })
              }

              length = Object.keys(d.properties).length;
              if (length > keyedData.length) keyedData = Object.keys(d.properties);

            });

            keyedData.some(function(key, index) {
              if (index === 2) return false;

            });

            function formatData(d) {
              return keyedData.map(function(key){
                return d.properties[key];
              });
            }

            var dataArr = (data.features).slice(0,3).map(formatData);

            if (data.features.length >= 6) dataArr = dataArr.concat(data.features.slice(-3).map(formatData));

            (keyedData).forEach(function(option, i) {
              mapSelectorGeojsonCodeDropdown.addItem({
                id: i,
                title: option
              });
              mapSelectorGeojsonNameDropdown.addItem({
                id: i,
                title: option
              });
            });

            [{dropdown: mapSelectorGeojsonCodeDropdown, color: 'rgba(66, 200, 192, 0.2)'},
              {dropdown: mapSelectorGeojsonNameDropdown, color: 'rgba(145, 151, 229, 0.2)'}].forEach(function(option) {
              option.dropdown.on('Change', function(item) {
                if (option.dropdown.previousValue) {
                  mapTable.removeHighlight(option.dropdown.previousValue.index());
                }
                mapTable.highlightColumns(item.index(), {
                  light: option.color
                });
                option.dropdown.previousValue = item;
              });
              });

            dataArr.unshift(keyedData);

            mapTable.createTable(dataArr, function(values) {
              if (mapSelectorGeojsonCodeDropdown.getSelectedItem() === false || mapSelectorGeojsonNameDropdown.getSelectedItem() === false) {
                alert("Please assign the appropriate code/name pair from your dataset before continuing.");
                return;
              }

              chartPreview.data.updateMapData(data, dataArr[0][mapSelectorGeojsonCodeDropdown.getSelectedItem().id()], dataArr[0][mapSelectorGeojsonNameDropdown.getSelectedItem().id()]);
              events.emit('ChangeAssignLinkedToValue', {
                key: 'labels',
                value: dataArr[0][mapSelectorGeojsonCodeDropdown.getSelectedItem().id()]
              })
              
              events.emit('LoadMapData', data.features, dataArr[0][mapSelectorGeojsonCodeDropdown.getSelectedItem().id()], dataArr[0][mapSelectorGeojsonNameDropdown.getSelectedItem().id()]);
              if (toNextPage) toNextPage();
            });
            
            mapSelectorGeojsonContainer.classList += ' active';
          }
        });
      });

      highed.dom.ap(container, 
                    highed.dom.ap(
                      mapSelectorContainer,
                      highed.dom.ap(highed.dom.cr('div', 'highed-choose-map-container'), input, inputSelector),
                      importInput, 
                      highed.dom.ap(highed.dom.cr('div', ''), mapOptions),
                      mapSelectorImages
                    ),
                    importContainer,
                    predefinedMaps,
                    highed.dom.ap(
                      mapSelectorGeojsonContainer,
                      mapSelectorMapContainer
                    ));
      return container
    }

  }

  function toggleVisible(element, style) {
    highed.dom.style(element, {
      display: style
    });
  }

  function showMaps(type, toNextPage) {
    if (!type || (type && (type.templateTitle !== 'Honeycomb' && type.templateTitle !== 'Tilemap Circle'))) {
      toggleVisible(mapSelectorContainer, 'block');
      toggleVisible(predefinedMaps, 'none');
      toggleVisible(importContainer, 'block');
    } else {
      const samples = highed.samples.getMap('Tilemap');
      
      predefinedMaps.innerHTML = '';

      Object.keys(samples).forEach(function(key) {
        var sample = samples[key];
        
        var container = highed.dom.cr('div', 'highed-chart-template-container highed-map-container'),
            thumbnail = highed.dom.cr('div', 'highed-chart-template-thumbnail'),
            title = highed.dom.cr('div', 'highed-map-text', sample.title);
            
        var mapType = type.templateTitle === 'Honeycomb' ? 'honeycomb' : 'circle';

        highed.dom.style(thumbnail, {
          'background-image': 'url(' + highed.option('thumbnailURL') + sample.thumbnail[mapType] + ')'
        });

        highed.dom.on(container, 'click', function() {
          events.emit('LoadDataSet', sample.dataset.join('\n'));
          if (sample.inverted) chartPreview.options.set('chart--inverted', sample.inverted);
          if (toNextPage) toNextPage();
          
        });
        
        highed.dom.ap(predefinedMaps, highed.dom.ap(container, thumbnail, title));
      });

      toggleVisible(predefinedMaps, 'block');
      toggleVisible(mapSelectorContainer, 'none');
      toggleVisible(importContainer, 'none');
    }
  }

  function loadSamples(type, toNextPage) {
    var keys = Object.keys(type);
    
    if (keys.length > 0 && type[keys[0]] && (type[keys[0]].templateTitle !== 'Honeycomb' && type[keys[0]].templateTitle !== 'Tilemap Circle')) {
      var templateTitle = type[keys[0]].templateTitle;
      const samples = highed.samples.getMap(templateTitle);
      
      if (!samples) {
        highed.dom.style(loadSampleText, {
          display: 'none'
        });
        return;
      }

      Object.keys(samples).forEach(function(key) {
        var sample = samples[key];
        
        var container = highed.dom.cr('div', 'highed-chart-template-container highed-map-container'),
            thumbnail = highed.dom.cr('div', 'highed-chart-template-thumbnail'),
            title = highed.dom.cr('div', 'highed-map-text', sample.title);
            
        var mapType = type.templateTitle === 'Honeycomb' ? 'honeycomb' : 'circle';

        highed.dom.style(thumbnail, {
          'background-image': 'url(' + highed.option('thumbnailURL') + sample.thumbnail + ')'
        });

        highed.dom.on(container, 'click', function() {

          var mapKey = sample.map,
          svgPath = baseMapPath + mapKey + '.svg',
          geojsonPath = baseMapPath + mapKey + '.geo.json',
          javascriptPath = baseMapPath + sample.map + '.js';
          
          chartPreview.options.updateMap(mapKey, javascriptPath, function() {
            highed.ajax({
              url: geojsonPath,
              type: 'GET',
              dataType: 'json',
              success: function(data) {
                var customized = chartPreview.options.getCustomized();
                if (sample.templateConfig) {
                  chartPreview.options.setAll(highed.merge(customized, sample.templateConfig));
                  if (sample.templateConfig.title) {
                    events.emit('ChangeTitle', sample.templateConfig.title.text);
                  }
                }
                
                events.emit('AddSerie', {
                  name: 'Separators',
                  type: 'mapline',
                  color: 'silver',
                  showInLegend: false,
                  enableMouseTracking: false
                });

                events.emit('LoadMapData', data.features, null, null, sample.dataset.join('\n'), null, sample.useLatLong);

                if (toNextPage) toNextPage();
              },
              error: function(e) {
              }
            })
          });

        });

        highed.dom.ap(mapSampleContainer, highed.dom.ap(container, thumbnail, title));
      });

    }
  }


  //////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    createMapDataSection: createMapDataSection,
    showMaps: showMaps,
    loadSamples: loadSamples
  };
};
