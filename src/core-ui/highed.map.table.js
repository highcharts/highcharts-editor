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
/** Map Table
 */

highed.MapTable = function(parent, props) {
  var events = highed.events(),
      mapContainer = highed.dom.cr(
        'div',
        'highed-edit-map-import-container highed-map-geojson-container active'
      ),
      mapHeader = highed.dom.cr('div', 'highed-map-value-header highed-map-geojson-header', props.header);
      mapTableContainer = highed.dom.cr('div', 'highed-map-table-container');
      table = highed.dom.cr('table', 'highed-map-table'),
      mapTHeader = highed.dom.cr('thead'),
      mapTBody = highed.dom.cr('tbody'),
      mapBtn = highed.dom.btn('Save', 'highed-map-geojson-btn highed-ok-button highed-import-button negative', null),
      mapOptions = props.selects,
      selects = [];
  //////////////////////////////////////////////////////////////////////////////


  function redrawDOM() {
    parent.innerHTML = '';
      
    highed.dom.ap(parent,     
      highed.dom.ap(
      mapContainer,
      mapHeader,
      highed.dom.ap(
        mapTableContainer, 
        highed.dom.ap(
          table,
          mapTHeader, 
          mapTBody
        )
      ),
      highed.dom.ap(highed.dom.cr('div', 'highed-map-geojson-btn-container'), mapBtn)
    ));
  }

  function createHeaders(data) {
    var tr = highed.dom.cr('tr');
    var selectsTr = highed.dom.cr('tr');
    
    data.forEach(function(element, index) {
      highed.dom.ap(tr, highed.dom.cr('th', 'map-table-label-header', element));
      var select = highed.dom.cr('div');
      var selectDropdown = highed.DropDown(select, 'highed-map-import-dropdown');

      (mapOptions || []).forEach(function(option, i) {
        selectDropdown.addItem({
          id: option.value,
          title: option.name,
        });
      });

      selectDropdown.selectByIndex(0);

      if(index === 0) selectDropdown.selectByIndex(1);
      else if (index === data.length - 1) selectDropdown.selectByIndex(mapOptions.length - 1);
      
      selectDropdown.on('Change', function(item) {
        var selectedId = item.id();
        var hasSelected = selects.some(function(s) {
          return (selectedId !== undefined && s !== item && selectedId === s.previousValue);
        });

        if (selectDropdown.previousValue === item.id()) return;
        if (hasSelected) {
          alert("This value has already been assigned to another column. Clear that column first before assigning to this one.");
          selectDropdown.selectById(selectDropdown.previousValue);
          return;
        }
        selectDropdown.previousValue = selectDropdown.getSelectedItem().id();        
      });

      selectDropdown.previousValue = selectDropdown.getSelectedItem().id();
      selects.push(selectDropdown);

      highed.dom.ap(selectsTr, highed.dom.ap(highed.dom.cr('th', ''), select));
    });

    highed.dom.ap(mapTHeader, selectsTr, tr);
  }

  function createTable(chartData, fn) {
    
    if (!chartData) return;
    data = chartData;  
    
    createHeaders(data[0]);
    
    data.forEach(function(d,index) {
      if (index === 0) return;
      var tr = highed.dom.cr('tr');
      d.forEach(function(element) {
        highed.dom.ap(tr, highed.dom.cr('td', '', element));
      });
      highed.dom.ap(mapTBody, tr);    
    });

    setTimeout(function() {
        redrawDOM()
    }, 10)
    
    highed.dom.on(mapBtn, 'click', function(ev) {
      var vals = {};
      selects.forEach(function(s, index) {
        if (s.getSelectedItem().index() > 0) {
          vals[s.getSelectedItem().id()] = index;
        }
      });
      if (fn) fn(vals);
    });
  
  }

  return {
    on: events.on,
    createTable: createTable
  };
};
