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
      mapTable = highed.MapTable(mapContainer, {
        selects: [{ //TODO: Take these from assign data
          name: '---'
        }, {
          name: 'Country Codes/Names',
          value: 'labels',
          mandatory: true
        }, {
          name: 'Values',
          value: 'value',
          mandatory: true
        }],
        header: 'Link Data Values'
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

  function show(chartData) {
    data = chartData;
    parsedData = highed.parseCSV(chartData);
    mapContainer.classList += ' active';

    mapTable.createTable(parsedData, function(assigns, parsedData) {
      //TODO: check if mandatory fields have been assigned before continuing
  
      var codeIndex = assigns.labels;
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
        if (data.properties.name) {
          
          var oldData = parsedData.filter(function(d){ return d[0] === data.properties.name; });
  
          if (oldData && oldData.length > 0) {
            newData.push(oldData);
          } else {
            //Not part of data but in map collection. Create vals for it.
            var arr = Array(length).fill(null, 0);
            arr[0] = data.properties.name;
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

  return {
    on: events.on,
    show: show,
    init: init,
    setMap: setMap
  };
};
