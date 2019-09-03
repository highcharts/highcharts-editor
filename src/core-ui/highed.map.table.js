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
        'highed-edit-map-import-container highed-map-geojson-container active ' + props.className
      ),
      mapHeader = highed.dom.cr('div', 'highed-map-value-header highed-map-geojson-header', props.header),
      mapDescription = highed.dom.cr('div', 'highed-map-value-description highed-map-geojson-description', props.description),
      mapTableContainer = highed.dom.cr('div', 'highed-map-table-container'),
      table = highed.dom.cr('table', 'highed-map-table data ' + (!props.readOnly ? 'edit' : '')),
      deleteTable = highed.dom.cr('table', 'highed-map-table highed-map-table-delete'),
      mapTHeader = highed.dom.cr('thead'),
      mapTBody = highed.dom.cr('tbody'),
      deleteTableBody = highed.dom.cr('tbody'),
      mapBtn = props.noSaveBtn ? highed.dom.cr('span') : highed.dom.btn('Save', 'highed-map-geojson-btn highed-ok-button highed-import-button negative', null),
      mapOptions = props.selects,
      selects = [],
      rows = [],
      mainInput = highed.dom.cr('input'),
      prevValue = null,
      noData = highed.dom.cr('div', 'highed-map-table-no-data', 'No Data'),
      extra = props.extra;
  //////////////////////////////////////////////////////////////////////////////
  
  if (!extra) extra = highed.dom.cr('span');

  function redrawDOM() {
    parent.innerHTML = '';
      
    highed.dom.ap(parent,     
      highed.dom.ap(
      mapContainer,
      mapHeader,
      mapDescription,
      extra,
      highed.dom.ap(
        mapTableContainer, 
        highed.dom.ap(
          table,
          mapTHeader, 
          mapTBody,
          noData
          
        ),
        highed.dom.ap(
          deleteTable,
          highed.dom.ap(
            highed.dom.cr('thead'), 
            highed.dom.ap(highed.dom.cr('tr'),
              highed.dom.ap(
                highed.dom.cr('th', 'map-table-label-header no-selects'), 
                highed.dom.cr('i', 'fa fa-trash')
              )
            )
          ),
          deleteTableBody
        )
      ),
      highed.dom.ap(highed.dom.cr('div', 'highed-map-geojson-btn-container'), mapBtn)
    ));
  
  }

  function createHeaders(data) {
    var tr = highed.dom.cr('tr');
    var selectsTr = highed.dom.cr('tr');
    
      data.forEach(function(element, index) {
        var th = highed.dom.cr('th', 'map-table-label-header ' + (selects.length === 0 ? ' no-selects' : ''), element);
        highed.dom.ap(tr, th);
        
        if (props.hiddenValues && props.hiddenValues.includes(index)) {
          highed.dom.style(th, {
            display: 'none'
          });
        }
        var select = highed.dom.cr('div');

        if (mapOptions.length > 0) {
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
        }


      });
  
      highed.dom.ap(mapTHeader, selectsTr, tr);
  }

  function handlePreviousValue(td) {
    if (prevValue) {
      prevValue.setValue(mainInput.value);
    }
  }

  function createCell(value) {
    var td = highed.dom.cr('td', '', value),
        exports = {};

    if (!props.readOnly) {
      highed.dom.on(td, 'click', function(){
      
        td.innerHTML = '';

        handlePreviousValue(td);

        mainInput = mainInput.cloneNode(true);
  
        mainInput.value = value;
        highed.dom.ap(td, mainInput);
        mainInput.focus();
  
        prevValue = exports;

        highed.dom.on(mainInput, 'keyup', function(e) {
          setValue(e.target.value);
          if (e.keyCode === 13) {
            td.innerHTML = e.target.value;
          }
        });
      });
    }

    function getVal() {
      return value;
    }

    function setValue(newValue){
      value = newValue;
    }

    exports = {
      element: td,
      value: getVal,
      setValue: setValue
    }

    return exports;
  }

  function createBody(data){

    if (!noData.classList.contains('hide') && data.length > 1) noData.classList += ' hide';
    data.forEach(function(d,index) {
      if (index === 0) return;
      
      rows[index - 1] = [];

      var tr = highed.dom.cr('tr');
      d.forEach(function(element) {

        var td = createCell(element);
        rows[index - 1].push(td);

        highed.dom.ap(tr, td.element);
        highed.dom.ap(deleteTableBody, highed.dom.cr('td','', '<i class="fa fa-trash">'));
      });
      highed.dom.ap(mapTBody, tr);    
    });

  }

  function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  function createTable(chartData, fn) {
    
    if (!chartData) return;
    data = chartData;  
    
    createHeaders(data[0]);
    createBody(data);

    setTimeout(function() { //TODO: Fix this later
        redrawDOM()
    }, 10)
    
    highed.dom.on(mapBtn, 'click', function(ev) {
      var vals = {};
      selects.forEach(function(s, index) {
        if (s.getSelectedItem().index() > 0) {
          vals[s.getSelectedItem().id()] = index;
        }
      });

      var dataArr = rows.map(function(row) {

        arraymove(row, vals.labels, 0);
        arraymove(row, vals.value, 1);

        return row.map(function(column) {
          return column.value();
        });
      });

      dataArr.unshift(data[0]);

      vals.labels = 0;
      vals.value = 1;

      if (fn) fn(vals, dataArr);
    });
  
  }

  function highlightRows(failedCodes) {
    failedCodes.forEach(function(cells) {
      table.children[1].children[cells.index - 1].classList += ' highed-map-import-failed';
    })
  }

  function addRow(newData) {
    data.push(newData);

    if (!noData.classList.contains('hide')) noData.classList += ' hide';
      
      var rowIndex = (rows.length > 0 ? rows.length: 0);
      rows[rowIndex] = [];

      var tr = highed.dom.cr('tr');
      var deleteltr = highed.dom.cr('tr');
      newData.forEach(function(element, index) {
        var td = createCell(element);
        rows[rowIndex].push(td);

        if (props.hiddenValues && props.hiddenValues.includes(index)) {
          highed.dom.style(td.element, {
            display: 'none'
          });
        }

        highed.dom.ap(tr, td.element);
      });
      highed.dom.ap(mapTBody, tr);    
      highed.dom.ap(deleteTableBody, highed.dom.ap(deleteltr, highed.dom.cr('td','', '<i class="fa fa-trash">')));
      
  }

  function resize() {
    highed.dom.style(noData, {
      width: (highed.dom.size(table).w + highed.dom.size(deleteTable).w + 1) +  'px'
    });
  }

  return {
    on: events.on,
    createTable: createTable,
    highlightRows: highlightRows,
    addRow: addRow,
    resize: resize
  };
};
