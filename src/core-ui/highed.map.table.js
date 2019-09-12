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
 * 
 *  @constructor
 *  @param {domnode} parent - the node to attach to
 *  @param {object} attributes - the properties
 *    selects: (Array) select options for selecting column values
 *    readOnly: (Bool) Cannot edit table
 *    header: (String) Header of table
 *    description: (String) Additional description
 *    className: (String) extra classes for table
 *    extra: (Node) extra nodes to attach (Probably should be removed from here)
 *    noSaveBtn: (Bool) handle saving outside of this component
 *    canDelete: (Bool) Can delete rows inline
 *    hiddenValues: (Array) Values to not show in the table
 *    highlightColumn: (Bool) Whether to highlight columns when selected
 *    skipOrdering: (Bool) Skip all the logic when returning final result of table
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
      extra = props.extra,
      timeout = null;
  //////////////////////////////////////////////////////////////////////////////
  
  if (!extra) extra = highed.dom.cr('span');

  if (!props.canDelete) {
    highed.dom.style(deleteTable, {
      display: 'none'
    });
  }


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

  function highlightColumns(index, color){
    rows.forEach(function(col) {
      col[index].highlight(color.light);
    });
  }

  function removeHighlight(index){
    rows.forEach(function(col) {
      col[index].removeHighlight();
    });
  }

  function getDataIndex(headers){
    var dataIndex = (headers || []).length - 1;
    var MAX_ROW_LENGTH = 10,
        MAX_COL_LENGTH = 60,
        chartData = data.slice();

    if (chartData.length < MAX_COL_LENGTH && chartData[0].length < MAX_ROW_LENGTH) {
      chartData.shift();
      var reversedArr = (chartData[0] || []).map(function(col, i){
        return chartData.map(function(row) {
          return row[i];
        });
      });

      var predictedValues = reversedArr.map(function(row) {
        var isString = row.some(function(col) {
          return typeof col === 'string';
        });

        var diff = 0;
        if (!isString) {
          row.forEach(function(col, i) {
            diff = (i % 2 === 0 ? diff + col : diff - col);
          });
        }
        return diff;
      });

      dataIndex = predictedValues.reduce(function(iMax, x, i, arr) {
        return x > arr[iMax] ? i : iMax
      }, 0);
    }

    return dataIndex;
  }

  function createHeaders(data) {
    var tr = highed.dom.cr('tr');
    var selectsTr = highed.dom.cr('tr'),
        dataIndex = getDataIndex(data);
      

      data.forEach(function(element, index) {
        var th = highed.dom.cr('th', 'map-table-label-header ' + (mapOptions.length === 0 ? ' no-selects' : ''), element);
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
              title: option.name
            });
          });
    
          selectDropdown.selectByIndex(0);
    
          if(index === 0) {
            selectDropdown.selectByIndex(1);
            if (props.highlightColumn) highlightColumns(index, mapOptions[1].colors);
          } else if (index === dataIndex) {
            selectDropdown.selectByIndex(mapOptions.length - 1);
            if (props.highlightColumn) highlightColumns(index, mapOptions[mapOptions.length - 1].colors);
          }
          
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

            if (props.highlightColumn) {
              removeHighlight(index);
              if (selectDropdown.getSelectedItem().id() !== undefined) {
                highlightColumns(index, mapOptions[selectDropdown.getSelectedItem().index()].colors);
              }
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
    if (prevValue && (prevValue.element === td)) {
      return;
    }

    if (prevValue) {
      var val = mainInput.value;
      prevValue.element.removeChild(mainInput);
      prevValue.setValue(val);
      prevValue.element.innerHTML = val;
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

          clearTimeout(timeout);

          timeout = setTimeout(function () {
            //Delay just so we dont refresh the chart too much.
            events.emit("InputChanged");
          }, 800);

          if (e.keyCode === 13) {
            td.innerHTML = e.target.value;
          }
        });
      });
    }

    function getVal(){
      return value;
    }

    function setValue(newValue){
      value = newValue;
    }

    function highlight(colour) {
      highed.dom.style(td, {
        backgroundColor: colour
      });
    }

    function removeHighlight() {
      highed.dom.style(td, {
        backgroundColor: 'initial'
      });
    }

    exports = {
      element: td,
      value: getVal,
      setValue: setValue,
      highlight: highlight,
      removeHighlight: removeHighlight
    }

    return exports;
  }

  function createDeleteBtn() {
    var trash = highed.dom.cr('td','clickable', '<i class="fa fa-trash">');
    highed.dom.on(trash, 'click', function(){
      
      const parent = trash.parentNode,
            table = trash.parentNode.parentNode,
            index = Array.prototype.indexOf.call(table.childNodes, parent);

      rows[index][0].destroy();
      rows.splice(index, 1);
      data.splice(index, 1);
      events.emit("InputChanged");
    });
    return trash;
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

        if (props.canDelete) {
          var trash = createDeleteBtn();
          highed.dom.ap(deleteTableBody, trash);
        }

        td.destroy = function() {
          tr.remove();
        }
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
    
    createBody(data);
    createHeaders(data[0]);

    setTimeout(function() { //TODO: Fix this later
      redrawDOM()
    }, 10)
    
    highed.dom.on(mapBtn, 'click', function(ev) {
      var vals = {},
          dataArr = [];
          
      selects.forEach(function(s, index) {
        if (s.getSelectedItem().index() > 0) {
          vals[s.getSelectedItem().id()] = index;
        }
      });

      if (!props.skipOrdering) {
        dataArr = rows.map(function(row) {
        
          if (vals.hasOwnProperty('latitude')) {
            arraymove(row, vals.latitude, 0);
            arraymove(row, vals.longitude, 1);
            arraymove(row, vals.value, 2);
          } else {
            arraymove(row, vals.labels, 0);
            arraymove(row, vals.value, 1);
          }

          return row.map(function(column) {
            return column.value();
          });
        });
  
        dataArr.unshift(data[0]);
  
        if (vals.hasOwnProperty('latitude')) {
          arraymove(dataArr[0], vals.lat, 0);
          arraymove(dataArr[0], vals.lon, 1);
          arraymove(dataArr[0], vals.value, 2); 
          vals.latitude = 0;
          vals.longitude = 1;
          vals.value = 2;
          vals.labels = -1;
        } else {
          arraymove(dataArr[0], vals.labels, 0);
          arraymove(dataArr[0], vals.value, 1);
          vals.labels = 0;
          vals.value = 1;
        }
  
      }

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
      
      var rowIndex = (rows.length > 0 ? rows.length : 0);
      rows[rowIndex] = [];

      var tr = highed.dom.cr('tr');
      var deleteltr = highed.dom.cr('tr');
      newData.forEach(function(element, index) {
        var td = createCell(element);
        td.destroy = function() {
          tr.remove();
          deleteltr.remove();
        }
        rows[rowIndex].push(td);

        if (props.hiddenValues && props.hiddenValues.includes(index)) {
          highed.dom.style(td.element, {
            display: 'none'
          });
        }

        highed.dom.ap(tr, td.element);
      });
      highed.dom.ap(mapTBody, tr);    

      if (props.canDelete) {
        var trash = createDeleteBtn(rowIndex);
        highed.dom.ap(deleteTableBody, highed.dom.ap(deleteltr, trash));
      }      
  }

  function getData() {

    var dataArr = rows.map(function(row) {
      return row.map(function(column) {
        return column.value();
      });
    });
    dataArr.unshift(data[0]);
    dataArr = dataArr.map(function(row) {
      arraymove(row, 2, 3);
      return row.map(function(col) {
        return col;
      })
    });
    return dataArr;
  }

  function resize() {
    setTimeout(function(){
      highed.dom.style(table, {
        width: (highed.dom.size(mapContainer).w - 71) + 'px'
      });

      highed.dom.style(noData, {
        width: (highed.dom.size(table).w + highed.dom.size(deleteTable).w + 1) +  'px'
      });

    }, 10)


  }

  function hide() {
    highed.dom.style(mapContainer, {
      display: 'none'
    });
  }

  function addToSelects(arr, pos) {
    arr.forEach(function(a, index) {
      mapOptions.splice(pos + index, 0, arr[index]);
    });
  }

  function getOptions(){
    return mapOptions;
  }

  return {
    on: events.on,
    createTable: createTable,
    highlightRows: highlightRows,
    addRow: addRow,
    getData: getData,
    resize: resize,
    hide: hide,
    highlightColumns: highlightColumns,
    removeHighlight: removeHighlight,
    addToSelects: addToSelects,
    getOptions: getOptions
  };
};
