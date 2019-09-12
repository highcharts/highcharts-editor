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
/** Map Importer
 */

highed.MapImporter = function() {
  var events = highed.events(),
      container = null,
      mapContainer = highed.dom.cr(
        'div',
        'highed-edit-map-import-container highed-map-geojson-container'
      ),
      selects =  [{ //TODO: Take these from assign data
        name: '---'
      }, {
        name: 'Country Codes/Names',
        value: 'labels',
        colors: {
          light: 'rgba(66, 200, 192, 0.2)',
          dark: 'rgb(66, 200, 192)'
        },
        mandatory: true
      }, {
        name: 'Values',
        value: 'value',
        mandatory: true,
        colors: {
          light: 'rgba(145, 151, 229, 0.2)',
          dark: 'rgb(145, 151, 229)'
        }
      }],
      mapTable = highed.MapTable(mapContainer, {
        selects: selects,
        highlightColumn: true,
        header: 'Link Data Values',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      });
      data = null,
      toNextPage = null,
      mapData = null,
      parsedData = null;
  //////////////////////////////////////////////////////////////////////////////

  function init(parent, cb) {
    toNextPage = cb,
    container = parent;

    highed.dom.ap(
      container, 
      mapContainer 
    );
  }

  function handleTileMap(parsedData, assigns, dataTableData) {
    dataTableData = dataTableData.map(function(row, index){
      var newData = parsedData.filter(function(d){ return d[assigns.labels] === row[0] });
      row = row.slice(0, 5);
      
      row[4] = (newData ? newData[0][assigns.value] : 0);
      return row;
    });

    assigns.labels = 1;
    assigns.value = 4;

    dataTableData.unshift(['hc-a2', 'name', 'x', 'y', 'value']);

    events.emit('HandleTileMapImport', dataTableData.map(function(cols) {
      return cols.join(',');
    }).join('\n'), null, toNextPage, assigns);

    return;
  }

  function show(chartData, dataTableData) {
    data = chartData;
    parsedData = highed.parseCSV(chartData);
    mapContainer.classList += ' active';

    mapTable.createTable(parsedData, function(assigns, parsedData) {
      //TODO: check if mandatory fields have been assigned before continuing

      var codeIndex = assigns.labels;
  
      if (!mapData) {
        // If no mapdata, the chart type is most likely something that hasnt gone through the mapcollection/geojson route (Tilemap/Honeycomb)
        // Find a better way to do this in future
        return handleTileMap(parsedData, assigns, dataTableData);
      }

      var hasLatLong = mapTable.getOptions().some(function(opt){ return opt.value === 'latitude'; });

      if (hasLatLong) {
          
        events.emit('HandleMapImport', parsedData.map(function(cols) {
          return cols.join(',');
        }).join('\n'), null, toNextPage, assigns, 1);
        return;
      }

      //Convert codes to hc-key

      var isCode2 = parsedData.every(function(d, index) { return index === 0 || d[codeIndex].length === 2}),
          isCode3,
          linkedCodes = [],
          failedCodes = [];
  
      if (!isCode2) isCode3 = parsedData.every(function(d, index) { return index === 0 || d[codeIndex].length === 3});
  
      parsedData.forEach(function(d, index) {
        if (index === 0) return;
        var code = d[codeIndex];
        // iso-a2, iso-a3, name (Africa)
        //hc-key, hc-a2, name  (US)
        
        var found = false;
        
        mapData.forEach(function(mData) {
          if (mData.properties) {
            
            if ( (isCode2 && 
                ((mData.properties['iso-a2'] && mData.properties['iso-a2'] === code) || 
                (mData.properties['hc-a2'] && mData.properties['hc-a2'] === code))) || 
                (isCode3 && (mData.properties['iso-a3'] && mData.properties['iso-a3'] === code)) ||
                ((!isCode3 && !isCode2) && mData.properties[mData.properties.hcname] === code) ) {
  
              parsedData[index][codeIndex] = mData.properties[mData.properties.hcname];
  
              found = true;
              return;
  
            }
          }
        });
  
        if (!found) {
          failedCodes.push({
            code: code, 
            index: index
          });
        }
      });
  
      var newData = [];
      var length = parsedData[0].length;
  
      newData.push(parsedData[0]); // Headers

      mapData.forEach(function(data, index) {
        if (data.properties[data.properties.hcname]) {
          
          var oldData = parsedData.filter(function(d){ return d[0] === data.properties[data.properties.hcname] });
  
          if (oldData && oldData.length > 0) {
            newData.push(oldData);
          } else {
            //Not part of data but in map collection. Create vals for it.
            var arr = Array(length).fill(null, 0);
            arr[0] = data.properties[data.properties.hcname];
            newData.push(arr);
          }
          linkedCodes.push({
            code: data.properties[data.properties.hccode],
            name: data.properties[data.properties.hcname]
          });
        };
      });
  
      if (failedCodes.length > 0) {
        mapTable.highlightRows(failedCodes);
        if (!confirm("There are incompatible values in your dataset. Are you sure you would like to continue?")) return;
      }

      events.emit('HandleMapImport', newData.map(function(cols) {
        return cols.join(',');
      }).join('\n'), linkedCodes, toNextPage, assigns);

    });
  }

  function setMap(map) {
    mapData = map;
  }

  function addToSelects(arr, pos){
    mapTable.addToSelects(arr, pos);
  }

  return {
    on: events.on,
    show: show,
    init: init,
    addToSelects: addToSelects,
    setMap: setMap
  };
};
