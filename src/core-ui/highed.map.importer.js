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
/** Map selector
 */

highed.MapImporter = function(container) {
  var events = highed.events(),
  
      mapContainer = highed.dom.cr(
        'div',
        'highed-edit-map-import-container highed-map-geojson-container'
      ),
      mapHeader = highed.dom.cr('div', 'highed-map-value-header highed-map-geojson-header', 'Link Data Values');
      mapTableContainer = highed.dom.cr('div', 'highed-map-table-container');
      mapTable = highed.dom.cr('table', 'highed-map-table'),
      mapTHeader = highed.dom.cr('thead'),
      mapTBody = highed.dom.cr('tbody'),
      options = [{
        name: 'Country Codes/Names'
      }, {
        name: 'Values'
      }];
  //////////////////////////////////////////////////////////////////////////////

  highed.dom.ap(
    container, 
    highed.dom.ap(
      mapContainer,
      mapHeader,
      highed.dom.ap(
        mapTableContainer, 
        highed.dom.ap(
          mapTable,
          mapTHeader, 
          mapTBody
        )
      )
    )
  );

  function show(chartData) {
    mapContainer.classList += ' active';
    createTable(highed.parseCSV(chartData));
  }

  function createHeaders(data) {
    var tr = highed.dom.cr('tr');
    var selectsTr = highed.dom.cr('tr');
    
    data.forEach(function(element){
      highed.dom.ap(tr, highed.dom.cr('th', 'map-table-label-header', element));
      var select = highed.dom.cr('div');
      var selectDropdown = highed.DropDown(select, 'highed-map-import-dropdown');

      selectDropdown.addItem({
        id: 0,
        title: '---',
      });


      options.forEach(function(option, i){
        selectDropdown.addItem({
          id: i + 1,
          title: option.name,
        });
      });
      selectDropdown.selectByIndex(0);

      highed.dom.ap(selectsTr, highed.dom.ap(highed.dom.cr('th', ''), select));
    });

    highed.dom.ap(mapTHeader, selectsTr, tr);
  }

  function createTable(data) {
    mapTHeader.innerHTML = mapTBody.innerHTML = '';
    
    createHeaders(data[0]);
    data.shift();

    data.forEach(function(d) {
      var tr = highed.dom.cr('tr');
      d.forEach(function(element){
        highed.dom.ap(tr, highed.dom.cr('td', '', element));
      });
      highed.dom.ap(mapTBody, tr);      
    });

  }

  return {
    on: events.on,
    show: show
  };
};
