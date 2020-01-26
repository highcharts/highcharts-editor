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

/** Data table
 *  @constructor
 *  @param {domnode} parent - the node to attach to
 *  @param {object} attributes - the properties
 */
highed.DataTable = function(parent, attributes) {
  var properties = highed.merge(
      {
        checkable: true,
        importer: {}
      },
      attributes
    ),
    events = highed.events(),
    container = highed.dom.cr('div', 'highed-dtable-container'),
    frame = highed.dom.cr('div', 'highed-dtable-table-frame highed-scrollbar'),
    movementBar = highed.dom.cr('div', 'highed-dtable-movement-bar', ''),
    table = highed.dom.cr('table', 'highed-dtable-table'),
    thead = highed.dom.cr('thead', 'highed-dtable-head highed-dtable-top-bar'),
    tbody = highed.dom.cr('tbody', 'highed-dtable-body'),
    tableTail = highed.dom.cr(
      'div',
      'highed-dtable-table-tail',
      'Only the first 500 rows are shown.'
    ),
    colgroup = highed.dom.cr('colgroup'),
    leftBar = highed.dom.cr('div', 'highed-dtable-left-bar'),
    hideCellsDiv = highed.dom.cr('div', 'highed-dtable-hide-cells'),
    topBar = highed.dom.cr('div', 'highed-dtable-top-bar'),
    topLetterBar = highed.dom.cr('tr', 'highed-dtable-top-letter-bar'),
    topColumnBar = highed.dom.cr('tr', 'highed-dtable-top-column-bar'),
    topLeftPanel = highed.dom.cr('div', 'highed-dtable-top-left-panel'),
    //checkAll = highed.dom.cr('input'),
    mainInput = highed.dom.cr('textarea', 'highed-dtable-input'),
    cornerPiece = highed.dom.cr('div', 'highed-dtable-corner-piece'),
    weirdDataModal = highed.OverlayModal(false, {
      // zIndex: 20000,
      showOnInit: false,
      width: 300,
      height: 350
    }),
    weirdDataContainer = highed.dom.cr(
      'div',
      'highed-dtable-weird-data highed-box-size highed-errobar-body'
    ),
    weirdDataIgnore = highed.dom.cr(
      'button',
      'highed-ok-button',
      'No, this looks right'
    ),
    weirdDataFix = highed.dom.cr(
      'button',
      'highed-ok-button',
      'Yeah, this looks wrong'
    ),
    loadIndicator = highed.dom.cr(
      'div',
      'highed-dtable-load-indicator',
      '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> Loading'
    ),
    dropZone = highed.dom.cr(
      'div',
      'highed-dtable-drop-zone highed-transition'
    ),
    liveDataFrame = highed.dom.cr(
      'div',
      'highed-box-size highed-dtable-gsheet-frame'
    ),
    gsheetFrame = highed.dom.cr(
      'div',
      'highed-box-size highed-dtable-gsheet-frame'
    ),
    gsheetContainer = highed.dom.cr(
      'div',
      'highed-box-size highed-prettyscroll highed-dtable-gsheet'
    ),
    liveDataContainer = highed.dom.cr(
      'div',
      'highed-box-size highed-prettyscroll highed-dtable-gsheet'
    ),
    liveDataInput = highed.dom.cr('input', 'highed-imp-input-stretch'),
    liveDataIntervalInput = highed.dom.cr('input', 'highed-imp-input-stretch'),
    liveDataTypeSelect = highed.DropDown(),

    liveDataTypeContainer = highed.dom.cr('div', 'highed-customize-group'),
    liveDataTypeMasterNode = highed.dom.cr('div', 'highed-customize-master-dropdown'),

    gsheetID = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetWorksheetID = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetRefreshTime = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetStartRow = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetEndRow = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetStartCol = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetEndCol = highed.dom.cr(
      'input',
      'highed-box-size highed-dtable-gsheet-id'
    ),
    gsheetCancelButton = highed.dom.cr(
      'button',
      'highed-import-button green padded',
      'Detach Sheet From Chart'
    ),
    gsheetPluginButton = highed.dom.cr(
      'a',
    'highed-import-button green padded gsheet-plugin-btn',
      'Google Sheet Plugin'
    ),
    switchRowColumns = highed.dom.cr(
      'button',
      'switch-column-button highed-template-tooltip',
      '<i class="fa fa-sync-alt" aria-hidden="true"></i> <span class="highed-tooltip-text highed-template-tooltip-text-left">Switch Rows/Columns</span>'
    ),
    gsheetLoadButton = highed.dom.cr(
      'button',
      'highed-import-button green padded',
      'Load Spreadsheet'
    ),
    liveDataLoadButton = highed.dom.cr(
      'button',
      'highed-import-button green padded',
      'Load Live Data'
    ),
    liveDataCancelButton = highed.dom.cr(
      'button',
      'highed-import-button green padded',
      'Cancel'
    ),
    detailValue = 0,
    isInGSheetMode = false,
    isInLiveDataMode = false,
    mainInputCb = [],
    rawCSV = false,
    mainInputCloseCb = false,
    toolbar,
    importModal = highed.OverlayModal(false, {
      minWidth: 600,
      minHeight: 600
    }),
    importer = highed.DataImporter(importModal.body, properties.importer),
    rows = [],
    gcolumns = [],
    changeTimeout = false,
    dataModal,
    surpressChangeEvents = false,
    monthNumbers = {
      JAN: 1,
      FEB: 2,
      MAR: 3,
      APR: 4,
      MAY: 5,
      JUN: 6,
      JUL: 7,
      AUG: 8,
      SEP: 9,
      OCT: 10,
      NOV: 11,
      DEC: 12
    },
    simpleDataTable = null,
    selectedRowIndex = 0,
    keyValue = "A",
    tempKeyValue = "A",
    //checkAll.type = 'checkbox',
    selectedFirstCell = [],
    selectedEndCell = [],
    selectedCopyFirstCell = [],
    selectedCopyEndCell = [],
    lastSelectedCell = [null, null],
    allSelectedCells = [],
    allSelectedCopyCells = [],
    selectedHeaders = [],
    columnsToHighlight = [],
    dataFieldsUsed = [],
    inCopyOverCellMode = false;
    moveToColumn = null,
    dragHeaderMode = false,
    mapImporter = highed.MapImporter(),
    highlighter = highed.Highlighter(),
    mapDataTable = null,
    dropCSVFileHere = highed.dom.cr('div', 'highed-table-dropzone-title', 'Drop CSV files here'),
    globalContextMenu = highed.ContextMenu([
      {
        title: "Insert Row Above",
        icon: 'plus',
        click: function() {
          events.emit('ColumnMoving');
          addRowBefore(selectedFirstCell[1]);
          highed.emit('UIAction', 'AddRowBeforeHighlight'); 
          events.emit('ColumnMoved');
        }
      },
      {
        title: "Insert Row Below",
        icon: 'plus',
        click: function() {
          events.emit('ColumnMoving');
          addRowAfter(selectedEndCell[1]);
          highed.emit('UIAction', 'AddRowAfterHighlight'); 
          events.emit('ColumnMoved');
        }
      },
      '-',
      {
        title: 'Remove Row',
        icon: 'trash',
        click: function() {
          highed.emit('UIAction', 'BtnDeleteRow');

          if (!confirm(highed.L('dgDeleteRow'))) {
            return;
          }

          highed.emit('UIAction', 'DeleteRowConfirm');

          rows.forEach(function(row, index) {
            //if (row.isChecked()) {
              if(row.number === selectedFirstCell[1]) {
                row.destroy();
                emitChanged();
              }
            //}
          });
          rebuildRows();
        }
      },
      {
        title: highed.L('dgDelCol'),
        icon: 'trash',
        click: function() {
          if (confirm(highed.L('dgDelColConfirm'))) {
            events.emit('ColumnMoving');
            delCol(selectedFirstCell[0]);
            updateColumns();
            events.emit('ColumnMoved');
          }
        }
      },
      '-',
      {
        title: highed.L('dgInsColBefore'),
        icon: 'plus',
        click: function() {
          events.emit('ColumnMoving');
          insertCol(selectedFirstCell[0]);
          events.emit('ColumnMoved');
        }
      },
      {
        title: highed.L('dgInsColAfter'),
        icon: 'plus',
        click: function() {
          events.emit('ColumnMoving');
          insertCol(selectedFirstCell[0] + 1);
          events.emit('ColumnMoved');
        }
      }
    ]);
    
  const DEFAULT_COLUMN = 9,
        DEFAULT_ROW = 20;
  
  gsheetPluginButton.href = "https://gsuite.google.com/marketplace/app/highcharts_cloud/629254340466";
  gsheetPluginButton.target = "_blank";

  if (highed.chartType !== 'Map') highed.dom.ap(hideCellsDiv, switchRowColumns)

  highed.dom.on(mainInput, 'click', function(e) {
    return highed.dom.nodefault(e);
  });

  highed.dom.style(liveDataIntervalInput, {
    padding: '8px'
  });

  var mouseDown = false;
  document.body.onmousedown = function() { 
    mouseDown = true;
  }
  document.body.onmouseup = function() {
    mouseDown = false;
  }

  document.addEventListener('keydown', function (e) {  
    if(e.keyCode === 8 || e.keyCode === 46){
      allSelectedCells.forEach(function(cell){
        cell.deleteContents();
      });
    }
  }, false);

  document.addEventListener('contextmenu', function(e) {
    if (e.path && e.path.indexOf(container) > -1) {
      globalContextMenu.show(e.clientX, e.clientY, true);
      return highed.dom.nodefault(e);
    }
  }, false);

  highed.dom.on(document.querySelector('body'), 'click', function(){
    globalContextMenu.hide();
  });

  highed.dom.on(cornerPiece, 'mousedown', function(e){
    inCopyOverCellMode = true;
    deselectAllCells();
  });


  highed.dom.ap(frame, cornerPiece);
  ////////////////////////////////////////////////////////////////////////////

  // Handle drag 'n drop of files
  function handleFileUpload(f, cb) {
    if (f.type !== 'text/csv') {
      return highed.snackBar('The file is not a valid CSV file');
    }

    var reader = new FileReader();

    reader.onload = function(e) {
      //events.emit('ClearSeriesForImport');
      if (highed.chartType === 'Map') {
        mapImporter.show(e.target.result, toData());
        //clear();
      } else {
        loadCSV({ csv: e.target.result }, null, true, cb);
      }
    };

    reader.readAsText(f);
  }

  frame.ondrop = function(e) {
    e.preventDefault();

    var d = e.dataTransfer;
    var f;
    var i;

    if (d.items) {
      for (i = 0; i < d.items.length; i++) {
        f = d.items[i];
        if (f.kind === 'file') {
          handleFileUpload(f.getAsFile());
        }
      }
    } else {
      for (i = 0; i < d.files.length; i++) {
        f = d.files[i];
        handleFileUpload(f);
      }
    }
  };

  frame.ondragover = function(e) {
    e.preventDefault();
  };

  ////////////////////////////////////////////////////////////////////////////

  function showDataImportError() {
    highed.dom.style(weirdDataContainer, {
      display: 'block'
    });
  }

  function hideDataImportError() {
    highed.dom.style(weirdDataContainer, {
      display: 'none'
    });
  }

  function emitChanged(noDelay) {
    window.clearTimeout(changeTimeout);

    if (isInGSheetMode) {
      return;
    }
    if (isInLiveDataMode) {
      return;
    }

    if (surpressChangeEvents) {
      return;
    }

    if (noDelay) {
      return events.emit('Change', getHeaderTextArr(), toData());
    }

    //We use an interval to stop a crazy amount of changes to be
    //emitted in succession when e.g. loading sets.
    changeTimeout = window.setTimeout(function() {
      if (!isInGSheetMode && !isInLiveDataMode) {
        events.emit('Change', getHeaderTextArr());
      }
    }, 1000);
  }

  function makeEditable(target, value, fn, keyup, close, dontFocus) {
    if (mainInputCb.length) {
      mainInputCb = mainInputCb.filter(function(fn) {
        fn();
        return false;
      });
    }

    if (mainInputCloseCb) {
      mainInputCloseCb();
    }

    mainInputCloseCb = close;

    mainInput.value = value;
    //mainInput.setSelectionRange(0, mainInput.value.length);

    mainInputCb.push(
      highed.dom.on(mainInput, 'keydown', function(e) {
        //(highed.isFn(fn) && fn(mainInput.value));
        if (highed.isFn(keyup)) {
          return keyup(e);
        }
      })
    );

    mainInputCb.push(
      highed.dom.on(mainInput, 'keyup', function(e) {
        // Super hack to allow pasting CSV into cells
        var ps = highed.parseCSV(mainInput.value);
        if (ps.length > 1) { //TODO: Need to fix this...
          if (
            confirm(
              'You are about to load CSV data. This will overwrite your current data. Continue?'
            )
          ) {
            rawCSV = mainInput.value;
            highed.emit('UIAction', 'PasteCSVAttempt');
             loadCSV({
               csv: rawCSV
              }, null, true, function() {

            });
            /*
            return loadRows(ps, function() {
              if (rows.length > 0) rows[0].columns[0].focus();
              events.emit('InitLoaded');
              events.emit('AssignDataForFileUpload', rows[0].length);
            });*/
          }
          return;
        }
        return highed.isFn(fn) && fn(mainInput.value);
      })
    );
    
    highed.dom.ap(target, mainInput);

    if (!dontFocus) mainInput.focus();

  }

  ////////////////////////////////////////////////////////////////////////////
  function highlightLeft(colNumber) {
    columnsToHighlight.forEach(function(highlightedColumn) {
      highlightedColumn.element.classList.remove('highlight-right');
    });
    
    rows.forEach(function(row) {
      if (row.columns[colNumber].element.className.indexOf('highlight-right') === -1) {
        row.columns[colNumber].element.className += ' highlight-right';
        columnsToHighlight.push(row.columns[colNumber]);
      }
    });

    if (gcolumns[colNumber].header.className.indexOf('highlight-right') === -1) {
      gcolumns[colNumber].header.className += ' highlight-right';
      columnsToHighlight.push({
        element: gcolumns[colNumber].header
      });
    }

    if (gcolumns[colNumber].letter.className.indexOf('highlight-right') === -1) {
      gcolumns[colNumber].letter.className += ' highlight-right';
      columnsToHighlight.push({
        element: gcolumns[colNumber].letter
      });
      moveToColumn = colNumber;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  function Column(row, colNumber, val, keyVal) {
    var value = typeof val === 'undefined' || typeof val === 'object' || (val === 'null') ? null : val, //object check for ie11/edge
    col = highed.dom.cr('td', 'highed-dtable-cell'),
      colVal = highed.dom.cr('div', 'highed-dtable-col-val', value),
      input = highed.dom.cr('input'),
      disabled = false,
      exports = {};

    function goLeft() {
      if (colNumber >= 1) {
        row.columns[colNumber - 1].focus();
      } else {
        //Go up to the last column
        if (row.number - 1 >= 0) {
          rows[row.number - 1].columns[
            rows[row.number - 1].columns.length - 1
          ].focus();
        }
      }
    }

    function goRight() {
      if (colNumber < row.columns.length - 1) {
        row.columns[colNumber + 1].focus();
      } else {
        //Go down on the first column
        if (row.number < rows.length - 1) {
          rows[row.number + 1].columns[0].focus();
        }
      }
    }

    function goUp() {
      if (row.number > 0 && rows[row.number - 1].columns.length > colNumber) {
        rows[row.number - 1].columns[colNumber].focus();
      }
    }

    function goBelow() {
      if (
        row.number < rows.length - 1 &&
        rows[row.number + 1].columns.length > colNumber
      ) {
        rows[row.number + 1].columns[colNumber].focus();
      }
    }

    function handleKeyup(e) {
      //Go the the column to the left
      if (e.keyCode === 37) {
        goLeft();
        return highed.dom.nodefault(e);

        //Go to the column above
      } else if (e.keyCode === 38) {
        goUp();
        return highed.dom.nodefault(e);

        //Go to the column to the right
      } else if (e.keyCode === 39 || e.keyCode === 9) {
        goRight();
        return highed.dom.nodefault(e);

        //Go to the column below
      } else if (e.keyCode === 40) {
        goBelow();
        return highed.dom.nodefault(e);

        //Go to next row
      } else if (e.keyCode === 13) {
        //If we're standing in the last column of the last row,
        //insert a new row.
        if (row.number === rows.length - 1) {
          // && colNumber === rows.columns.length - 1) {
          events.emit('ColumnMoving');
          addRow();
          rows[row.number + 1].columns[0].focus();
          events.emit('ColumnMoved');
    
        } else {
          goBelow();
        }
        return highed.dom.nodefault(e);
      }
    }

    function selContents() {
      input.setSelectionRange(0, input.value.length);
    }

    function deleteContents() {
      colVal.innerHTML = '';
      mainInput.value = '';
      value = null;
      emitChanged();
    }

    function setValue(newValue, suppressEvent) {
      colVal.innerHTML = newValue;
      mainInput.value = newValue;
      value = newValue;
      if (!suppressEvent) 
        emitChanged();
    }

    function setHiddenValue(newValue) {
      colVal.setAttribute('data-value', newValue);
    }

    function setDisabled(){
      disabled = true;
    }

    function focus(dontFocus) {

      deselectAllCells();

      function checkNull(value) {
        return value === null || value === '';
      }
      mainInput.className = 'highed-dtable-input';
      mainInput.draggable = false;

      highed.dom.on(mainInput, 'dragstart', function(e){
        highed.dom.nodefault(e);
        return false;
      });
      highed.dom.on(mainInput, 'ondrop', function(e){
        highed.dom.nodefault(e);
        return false;
      });

      makeEditable(
        col,
        value,
        function(val) {
          var changed = value !== val;
          value = checkNull(val) ? null : val;
          colVal.innerHTML = value;
          if (changed) {
            emitChanged();
            events.emit('ChangeMapCategoryValue', value);
          }
        },
        handleKeyup,
        dontFocus
      );



      highed.dom.style(cornerPiece, {
        top: ((highed.dom.pos(col).y + highed.dom.size(col).h - 3)) + "px",
        left: ((highed.dom.pos(col).x + highed.dom.size(col).w - 3)) + "px",
        display: "block"
      });

      row.select();
    }

    function deselectCell() {
      col.classList.remove('cell-selected');
    }

    function deselectCopyCell() {
      col.classList.remove('cell-copy-selected');
    }

    function selectCell() {
      if(col.className.indexOf('cell-selected') === -1) {
        col.className += ' cell-selected';
        if (allSelectedCells.indexOf(exports) === -1) allSelectedCells.push(exports);
      }
    }

    function select() {
      selectedEndCell[0] = colNumber;
      selectedEndCell[1] = row.number; 

      selectNewCells(selectedFirstCell, selectedEndCell);
    }

    function selectCellToCopy() {
      if(col.className.indexOf('cell-copy-selected') === -1) {
        col.className += ' cell-copy-selected';
        if (allSelectedCopyCells.indexOf(exports) === -1) allSelectedCopyCells.push(exports);
      }
    }

    function destroy() {
      row.node.removeChild(col);
      col.innerHTML = '';
      colVal.innerHTML = '';
    }

    function getVal() {
      return colVal.getAttribute('data-value') || value;
    }

    function getCellValue(){
      return value;
    }

    function addToDOM(me) {
      colNumber = me || colNumber;
      highed.dom.ap(row.node, highed.dom.ap(col, colVal));
    }

    highed.dom.on(col, 'mouseup', function(e) {
      
      if (disabled) return;
      if (inCopyOverCellMode) {
        inCopyOverCellMode = false;
        
        const newValue = rows[selectedCopyFirstCell[1]].columns[selectedCopyFirstCell[0]].value();
        allSelectedCopyCells.forEach(function(cell) {
          cell.setValue(newValue);
          cell.deselectCopyCell();
        });

        allSelectedCopyCells = [];

      }
      else if (selectedFirstCell[0] === selectedEndCell[0] && 
          selectedFirstCell[1] === selectedEndCell[1]) {
            //Have not dragged anywhere else on the grid. So the user has just clicked on a cell.
            
          lastSelectedCell[0] = colNumber;
          lastSelectedCell[1] = row.number;
          selectedCopyFirstCell[0] = selectedFirstCell[0];
          selectedCopyFirstCell[1] = selectedFirstCell[1];
          selectedCopyEndCell[1] = selectedEndCell[1];
          selectedCopyEndCell[0] = selectedEndCell[0];
          selectedHeaders = [];
          focus();
          globalContextMenu.hide();
      }
    });

    highed.dom.on([col, colVal], 'mouseover', function(e) {
      if(mouseDown) {
        if (inCopyOverCellMode) {

          if (colNumber === selectedCopyEndCell[0]) {
            selectedCopyEndCell[1] = row.number;
            selectedCopyEndCell[0] = selectedCopyFirstCell[0];
          } else if (selectedCopyEndCell[1] === row.number) {
            selectedCopyEndCell[1] = selectedCopyFirstCell[1];
            selectedCopyEndCell[0] = colNumber;
          }

          selectCellsToMove(selectedCopyFirstCell, selectedCopyEndCell);

        } else if (dragHeaderMode) {
          highlightLeft(colNumber);
        } else {
          select();      
        }
      }
    });
    highed.dom.on(col, 'mousedown', function() {
      
      if (disabled) return;

      if (lastSelectedCell[0] !== colNumber && lastSelectedCell[1] !== row.number) {
        //focus();
      }
    
      selectedFirstCell[0] = colNumber;//keyVal; 
      selectedEndCell[0] = colNumber;//keyVal; 
      selectedFirstCell[1] = row.number; 
      selectedEndCell[1] = row.number;                   
      
      selectedCopyFirstCell[0] = selectedFirstCell[0];
      selectedCopyFirstCell[1] = selectedFirstCell[1];
      selectedCopyEndCell[1] = selectedEndCell[1];
      selectedCopyEndCell[0] = selectedEndCell[0];

    });

    if (rows.length <= 500) {
      addToDOM();
    }

    exports = {
      focus: focus,
      value: getVal,
      cellValue: getCellValue, 
      destroy: destroy,
      addToDOM: addToDOM,
      selectCell: selectCell,
      deleteContents: deleteContents,
      deselectCell: deselectCell,
      deselectCopyCell: deselectCopyCell,
      element: col,
      setValue: setValue,
      setHiddenValue: setHiddenValue,
      setDisabled: setDisabled,
      rowNumber: row.number,
      colNumber: colNumber,
      selectCellToCopy: selectCellToCopy,
      updateColNumber: function(i){
        colNumber = i;
        exports.colNumber = i;
      }
    };

    return exports;
  }

  function deselectAllCells() {

    allSelectedCells.forEach(function(cells) {
      cells.deselectCell();
    });
    
    allSelectedCells = [];
    selectedEndCell[0] = null;
    selectedEndCell[1] = null;
    selectedFirstCell[0] = null;
    selectedFirstCell[1] = null;
  }

  function selectCellsToMove(firstCell, endCell) { // selectedCopyFirstCell, selectedCopyEndCell

    allSelectedCopyCells = allSelectedCopyCells.filter(function(cell) {
      if ((cell.rowNumber > endCell[1] || cell.colNumber > endCell[0]) || (cell.rowNumber < firstCell[1] || cell.colNumber < firstCell[0])) {
        cell.deselectCopyCell();
        return false;
      }

      return cell;
    });

    var tempColValue,
        lowCell,
        highCell,
        cell;

    if (firstCell[0] <= endCell[0]) {
      tempColValue = firstCell[0];
      cell = endCell;
    } else if (firstCell[0] > endCell[0]) {
      tempColValue = endCell[0];      
      cell = firstCell;
    }

    lowCell = (firstCell[1] > endCell[1] ? endCell : firstCell);
    highCell = (firstCell[1] < endCell[1] ? endCell : firstCell);
    

    while(tempColValue <= cell[0]) {
      for(var i = lowCell[1];i<= highCell[1]; i++) {
        if (rows[i]) rows[i].columns[tempColValue].selectCellToCopy();
      }
      tempColValue++;
    }

  }

  function selectNewCells(firstCell, endCell) { //firstCell, endCell
    
    if (firstCell.length === 0 || endCell.length === 0 ||   // Weird bug when opening the console and hovering over cells
      (firstCell[0] === null || firstCell[1] === null)
    ) return;

    allSelectedCells = allSelectedCells.filter(function(cell) {
      if ((cell.rowNumber > endCell[1] || cell.colNumber > endCell[0]) || (cell.rowNumber < firstCell[1] || cell.colNumber < firstCell[0])) {
        cell.deselectCell();
        return false;
      }

      return cell;
    });

    var tempColValue,
        lowCell,
        highCell,
        cell;

    if (firstCell[0] <= endCell[0]) {
      tempColValue = firstCell[0];
      cell = endCell;
    } else if (firstCell[0] > endCell[0]) {
      tempColValue = endCell[0];      
      cell = firstCell;
    }

    lowCell = (firstCell[1] > endCell[1] ? endCell : firstCell);
    highCell = (firstCell[1] < endCell[1] ? endCell : firstCell);
    
    while(tempColValue <= cell[0]) {
      for(var i = lowCell[1];i<= highCell[1]; i++) {
        if (rows[i]) rows[i].columns[tempColValue].selectCell();
      }
      tempColValue++;
    }
  }

  ////////////////////////////////////////////////////////////////////////////

  function Row(skipAdd) {
    var columns = [],
      row = highed.dom.cr('tr'),
      leftItem = highed.dom.cr('div', 'highed-dtable-left-bar-row', ''),
      checker = highed.dom.cr('div', 'highed-dtable-row'),
      checked = false,
      didAddHTML = false,
      exports = {};

    highed.dom.on(leftItem, 'mouseover', function(e) {
      if(mouseDown) {
          selectedEndCell[1] = checker.value;
          selectNewCells(selectedFirstCell, selectedEndCell);
      }
    });    
    
    highed.dom.on(leftItem, 'mousedown', function(e) {
      //if (e.button === 2 && selectedFirstCell.length > 0 && selectedEndCell.length > 0 && selectedFirstCell[0] === 0 && selectedEndCell[0] === (rows[0].columns.length - 1)) {
      deselectAllCells();
    
      selectedFirstCell[0] = 0
      selectedEndCell[0] = rows[0].columns.length - 1;
      selectedFirstCell[1] = e.target.value; 
      selectedEndCell[1] = e.target.value;

      selectNewCells(selectedFirstCell, selectedEndCell);

    });

    function addCol(val, keyValue) {
      columns.push(Column(exports, columns.length, val, keyValue));
    }

    function insertCol(where) {
      var col = Column(exports, columns.length);
      columns.splice(where, 0, col);
    }

    function select() {
      var o = tbody.querySelector('.highed-dtable-body-selected-row');
      if (o) {
        o.className = '';
      }
      row.className = 'highed-dtable-body-selected-row';
      selectedRowIndex = exports.rowIndex;
    }

    function isChecked() {
      return checked;
    }

    function check(state) {
      checker.checked = checked = state;
    }

    function destroy() {
      if (didAddHTML) {
        leftBar.removeChild(leftItem);
        tbody.removeChild(row);
        row.innerHTML = '';
      }

      rows = rows.filter(function(b) {
        return b !== exports;
      });

      if (rows.length < 2) {
        showDropzone();
      }
    }

    function addToDOM(number) {
      didAddHTML = true;
      exports.number = number;
      checker.textContent = number + 1;
      checker.value = number;
      leftItem.value = number;
      highed.dom.ap(tbody, row);

      highed.dom.ap(leftBar, highed.dom.ap(leftItem, checker));
    }

    function rebuildColumns() {
      row.innerHTML = '';
      columns.forEach(function(col, i) {
        col.updateColNumber(i);
        col.addToDOM(i);
      });
    }

    function delCol(which) {
      if (which >= 0 && which < columns.length) {
        columns[which].destroy();
        columns.splice(which, 1);
      }
    }

    highed.dom.on(checker, 'change', function() {
      checked = checker.checked;
    });
    if (rows.length < 500) {
      addToDOM(rows.length);
    } else if (rows.length === 500) {
      highed.dom.style(tableTail, {
        display: 'block'
      });
    }

    exports = {
      destroy: destroy,
      select: select,
      columns: columns,
      number: rows.length,
      addCol: addCol,
      isChecked: isChecked,
      check: check,
      node: row,
      addToDOM: addToDOM,
      insertCol: insertCol,
      rebuildColumns: rebuildColumns,
      delCol: delCol,
      rowIndex: rows.length
    };

    if (!skipAdd) {
      rows.push(exports);
    }

    resize();

    return exports;
  }

  ////////////////////////////////////////////////////////////////////////////

  function rebuildRows() {
    rows.forEach(function(row, i) {
      if (rows.length < 500) {
        row.addToDOM(i);
      }
      row.rowIndex = i;
    });
    emitChanged();
  }

  function rebuildColumns() {
    rows.forEach(function(row) {
      row.rebuildColumns();
    });
  }

  function addRowBefore(index) {
    if (index > 0 && index < rows.length) {
      rows.splice(index - 0, 0, addRow(true, true));
      rebuildRows();
    }
  }

  function addRowAfter(index) {
    if (index >= 0 && index < rows.length) {
      rows.splice(index + 1, 0, addRow(true, true));
      rebuildRows();
    }
  }

  function init() {
    clear();
    surpressChangeEvents = true;

    setTimeout(function(){ events.emit('InitLoaded'); }, 10);
    
    for (var i = 0; i < DEFAULT_ROW; i++) {
      var r = Row(false, keyValue);
    }

    tempKeyValue = "A";
    for (var j = 0; j < DEFAULT_COLUMN; j++) {
      addCol('Column ' + (j + 1));
    }
    highed.dom.ap(colgroup, highed.dom.cr('col'));
    resize();
    surpressChangeEvents = false;
  }

  function updateColumns() {
    colgroup.textContent = '';
    topColumnBar.textContent = '';
    topLetterBar.textContent = '';
    var resetLetters = 'A';
    
    gcolumns.forEach(function(col, i) {      
      col.colNumber = i;
      col.setLetter(resetLetters);
      resetLetters = getNextLetter(resetLetters);
      col.addToDOM();

    });

    rebuildColumns();

    highed.dom.ap(colgroup, highed.dom.cr('col'));
    resize();
  }

  function getNextLetter(key) {
    if (key === 'Z' || key === 'z') {
      return String.fromCharCode(key.charCodeAt() - 25) + String.fromCharCode(key.charCodeAt() - 25);
    } else {
      var lastChar = key.slice(-1);
      var sub = key.slice(0, -1);
      if (lastChar === 'Z' || lastChar === 'z') {
        return getNextLetter(sub) + String.fromCharCode(lastChar.charCodeAt() - 25);
      } else {
        return sub + String.fromCharCode(lastChar.charCodeAt() + 1);
      }
    }
    return key;
  };

  function addCol(value, where, suppressEvents) {
    //The header columns control the colgroup
    var col = highed.dom.cr('col'),
      colNumber = gcolumns.length,
      header = highed.dom.cr('th', 'highed-dtable-top-bar-col'),
      letter = highed.dom.cr('th', 'highed-dtable-top-bar-letter'),
      headerTitle = highed.dom.cr('div', '', (typeof value === 'undefined' || value === 'null' ? null : value)),
      moveHandle = highed.dom.cr('div', 'highed-dtable-resize-handle'),
      options = highed.dom.cr(
        'div',
        'highed-dtable-top-bar-col-options fa fa-chevron-down'
      ),
      exports = {
        col: col,
        header: header,
        headerTitle: headerTitle,
        colNumber: gcolumns.length,
        letter: letter,
        test: true
      },
      mover = highed.Movable(
        moveHandle,
        'X',
        false,
        false,
        {
          x: 20,
          y: 0
        },
        true
      ),
      ctx = highed.ContextMenu([
        {
          title: highed.L('dgSortAsc'),
          icon: 'sort-amount-asc',
          click: function() {
            sortRows(exports.colNumber, 'asc');
          }
        },
        {
          title: highed.L('dgSortDec'),
          icon: 'sort-amount-desc',
          click: function() {
            sortRows(exports.colNumber, 'desc');
          }
        },
        '-',
        {
          title: highed.L('dgSortAscMonth'),
          icon: 'sort-amount-asc',
          click: function() {
            sortRows(exports.colNumber, 'asc', true);
          }
        },
        {
          title: highed.L('dgSortDecMonth'),
          icon: 'sort-amount-desc',
          click: function() {
            sortRows(exports.colNumber, 'desc', true);
          }
        },
        '-',
        {
          title: highed.L('dgDelCol'),
          icon: 'trash',
          click: function() {
            if (confirm(highed.L('dgDelColConfirm'))) {
              delCol(exports.colNumber);
            }
          }
        },
        // {
        //     title: 'Clone Column',
        //     icon: 'clone'
        // },
        '-',
        {
          title: highed.L('dgInsColBefore'),
          icon: 'plus',
          click: function() {

            events.emit('ColumnMoving');
            insertCol(exports.colNumber);
            events.emit('ColumnMoved')
          }
        },
        {
          title: highed.L('dgInsColAfter'),
          icon: 'plus',
          click: function() {
            events.emit('ColumnMoving');
            insertCol(exports.colNumber + 1);
            events.emit('ColumnMoved')
          }
        }
      ]),
      ox,
      keyCell = highed.dom.cr('span', 'highed-dtable-cell-value', keyValue);

    //letter.innerHTML = keyValue;
    letter.value = highed.getLetterIndex(keyValue);

    exports.setLetter = function (str) {
      keyCell.innerHTML = str;
      letter.value = highed.getLetterIndex(str);
      //exports.colNumber = highed.getLetterIndex(str);
    }

    exports.hideColumns = function() {
      if (!col.classList.contains('cell-hide')) {
        col.classList.add('cell-hide');
        header.classList.add('cell-hide');
        letter.classList.add('cell-hide');
      }
    }

    exports.showColumns = function() {
      if (col.classList.contains('cell-hide')) {
        col.classList.remove('cell-hide');
        header.classList.remove('cell-hide');
        letter.classList.remove('cell-hide');
      }
    }

    highed.dom.on(letter, 'mouseover', function(e) {
      if(mouseDown && (e.target !== options && e.target !== moveHandle)) {
        if (dragHeaderMode) {
          if (movementBar.className.indexOf('active') === -1) {
            movementBar.className += ' active'; 
            highed.dom.style(movementBar, {
              width: 140 * ((selectedHeaders[0] < selectedHeaders[1] ? selectedHeaders[1] - selectedHeaders[0]  : selectedHeaders[0] - selectedHeaders[1]) +1) + 'px'
              //width: 140 * selectedHeaders.length + 'px'
            });
          }
          highlightLeft(letter.value);
          
          highed.dom.style(movementBar, {
            left: (e.clientX - highed.dom.size(movementBar).w / 2) + 'px'
          });
        } else {
          selectedEndCell[0] = letter.value;
          selectedHeaders[1] = letter.value;
          selectNewCells(selectedFirstCell, selectedEndCell);
        }
      }
    });    
    
    highed.dom.on(letter, 'mousedown', function(e) {

      deselectAllCells();
      
      if (selectedHeaders.length > 0 && ( e.target.value >= selectedHeaders[0] && e.target.value <= selectedHeaders[1])) {
        //User is trying to drag headers left and right.
        dragHeaderMode = true;
      } else {
        //deselectAllCells();
        if(e.target !== options && e.target !== moveHandle) {
          selectedHeaders = [];

          selectedHeaders[0] = e.target.value;
          selectedHeaders[1] = e.target.value;

          selectedFirstCell[0] = e.target.value;
          selectedEndCell[0] = e.target.value;
          selectedFirstCell[1] = 0; 
          selectedEndCell[1] = rows.length - 1; 
          selectNewCells(selectedFirstCell, selectedEndCell);
        }
      }
    });

    highed.dom.on(container, 'mouseover', function(e) {
      if (dragHeaderMode) {
        highed.dom.style(movementBar, {
          left: (e.clientX - highed.dom.size(movementBar).w / 2) + 'px'
        });
      } 
    });

    function shuffleArray(arr, min, amount, moveTo) {
      var x = arr.splice(min, amount);
      var args = [moveTo, 0].concat(x);
      Array.prototype.splice.apply(arr, args);
    }

    function moveCells() {
      
      if (moveToColumn !== null) {    
        events.emit('ColumnMoving');
        
        const min = selectedHeaders[0/*(moveToColumn < selectedHeaders[0] ? 1 : 0)*/],
              max = (selectedHeaders[0] < selectedHeaders[1] ? selectedHeaders[1] - selectedHeaders[0]  : selectedHeaders[0] - selectedHeaders[1]) +1,
              total = (selectedHeaders[0] < selectedHeaders[1] ? selectedHeaders[1] - selectedHeaders[0]  : selectedHeaders[0] - selectedHeaders[1]);

        shuffleArray(gcolumns, min, max, (moveToColumn < selectedHeaders[0] ? moveToColumn + 1 : moveToColumn - total));

        rows.forEach(function(row) {
          shuffleArray(row.columns, min, max, (moveToColumn < selectedHeaders[0] ? moveToColumn + 1 : moveToColumn - total));
        });

        if (rows.length > 0) rows[0].columns[0].focus();
        updateColumns();
        emitChanged();
        events.emit('ColumnMoved');
      }
    }

    highed.dom.on(container, 'mouseup', function(e) {
      if (dragHeaderMode) {

        moveCells();
        selectedHeaders = [];
        dragHeaderMode = false;
        movementBar.classList.remove('active');
        columnsToHighlight.forEach(function(highlightedColumn) {
          highlightedColumn.element.classList.remove('highlight-right');
        });
        columnsToHighlight = [];
        moveToColumn = null;
      }
      globalContextMenu.hide();
    })

    highed.dom.on(header, 'mouseover', function(e) {
      if(mouseDown) {
        if (dragHeaderMode) {
          highlightLeft(exports.colNumber);
        }
      }
    });

    
    keyValue = getNextLetter(keyValue);
    ////////////////////////////////////////////////////////////////////////
    exports.addToDOM = function() {

      highed.dom.ap(colgroup, col);
      highed.dom.ap(
        topLetterBar,
        highed.dom.ap(letter, keyCell, options, moveHandle)
      );

      highed.dom.ap(
        topColumnBar,
        highed.dom.ap(header, headerTitle)
      );
    };

    exports.destroy = function() {
      colgroup.removeChild(col);
      topColumnBar.removeChild(header);
      topLetterBar.removeChild(letter);

      gcolumns = gcolumns.filter(function(b) {
        return b !== exports;
      });

    };

    ////////////////////////////////////////////////////////////////////////

    exports.addToDOM();

    // highed.dom.showOnHover(header, options);

    col.width = 140;
    highed.dom.style([col, header, letter], {
      width: col.width + 'px',
      'max-width': col.width + 'px'
    });

    mover.on('StartMove', function(x) {
      ox = x;

      if (!header.classList.contains('no-transition')) {
        header.classList += ' no-transition';
        letter.classList += ' no-transition';
        col.classList += ' no-transition';
      }

      if (rows.length > 0) rows[0].columns[0].focus();
      highed.dom.style(cornerPiece, {
        display: 'none'
      })

      highed.dom.style(document.body, {
        cursor: 'ew-resize'
      });
    });

    mover.on('Moving', function(x) {
      col.width = x;

      highed.dom.style(cornerPiece, {
        display: 'none'
      })

      highed.dom.style([col, header, letter], {
        width: x + 'px',
        'max-width': x + 'px'
      });

      moveHandle.className =
        'highed-dtable-resize-handle highed-dtable-resize-handle-moving';
    });

    mover.on('EndMove', function(x) {
      highed.dom.style(document.body, {
        cursor: ''
      });

      if (header.classList.contains('no-transition')) {
        header.classList.remove('no-transition');
        letter.classList.remove('no-transition');
        col.classList.remove('no-transition');
      }

      moveHandle.className = 'highed-dtable-resize-handle';
      if (rows.length > 0) rows[0].columns[0].focus();
    });

    highed.dom.on(options, 'click', function(e) {
      ctx.show(e.clientX, e.clientY);
      return highed.dom.nodefault(e);
    });

    highed.dom.on(header, 'click', function(e) {
      //Ugly.
      mainInput.className = 'highed-dtable-input highed-dtable-input-header';
      //Spawn an edit box in the node

      highed.dom.style(cornerPiece, {
        display: "none"
      });
      deselectAllCells();

      makeEditable(
        header,
        value,
        function(val) {
          headerTitle.innerHTML = value = val;
          emitChanged();
        },
        function(e) {
          if (e.keyCode === 13) {
            mainInput.className = 'highed-dtable-input';
            header.removeChild(mainInput);
          }
        }
      );
    });

    rows.forEach(function(row) {
      if (where) {
        row.insertCol(where);
      } else {
        row.addCol(null, tempKeyValue);
      }

      tempKeyValue = getNextLetter(tempKeyValue);
    });

    if (where !== null && !isNaN(where)) {
      gcolumns.splice(where, 0, exports);
    } else {
      gcolumns.push(exports);
    }

    if (!suppressEvents) emitChanged();
  }

  function showDropzone() {
    highed.dom.style(dropZone, {
      opacity: 1
    });
  }

  function hideDropzone() {
    highed.dom.style(dropZone, {
      opacity: 0
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  // PUBLIC FUNCTIONS FOLLOW

  /** Sort rows
   * @memberof highed.DataTable
   * @param column {number} - the column to sort on
   * @param direction {string} - the direction: `asc` or `desc`
   * @param asMonths {boolean} - if true, sort by month
   */
  function sortRows(column, direction, asMonths) {
    tbody.textContent = '';
    
    direction = (direction || '').toUpperCase();
    rows.sort(function(a, b) {
      var ad = a.columns[column].value(),
        bd = b.columns[column].value();

      if ((highed.isNum(ad) && highed.isNum(bd)) || asMonths) {
        if (asMonths) {
          ad = monthNumbers[ad.toUpperCase().substr(0, 3)] || 13;
          bd = monthNumbers[bd.toUpperCase().substr(0, 3)] || 13;
        } else {
          ad = parseFloat(ad);
          bd = parseFloat(bd);
        }

        if (direction === 'ASC') {
          return ad - bd;
        }

        return bd < ad ? -1 : bd > ad ? 1 : 0;
      } else if (ad === null){
        return 1;
      } 
      else if (bd === null){
        return -1;
      }

      if (direction === 'ASC') {
        if (!ad) return bd;
        return ad.localeCompare(bd);
      }

      if (bd) {
        if (!ad) return bd;
        return bd.localeCompare(ad);
      }
       else {
         if (ad) {
           return ad.localeCompare(bd);
         }
       }
      
    });

    rebuildRows();

    if (rows.length > 0) rows[0].columns[column].focus();
    emitChanged();
  }

  /** Clear the table
   * @memberof highed.DataTable
   */
  function clear(noWait, surpressEvents) {
    rows = rows.filter(function(row) {
      row.destroy();
      return false;
    });

    gcolumns = gcolumns.filter(function(row) {
      //Destroy col here
      return false;
    });

    tbody.textContent = '';
    leftBar.textContent = '';
    topColumnBar.textContent = '';
    topLetterBar.textContent = '';
    colgroup.textContent = '';
    keyValue = "A";

    highed.dom.style(tableTail, {
      display: ''
    });

    if (!surpressEvents) {
      events.emit('ClearData', true);
      emitChanged(noWait);
    }
    
    showDropzone();
  }

  /** Add a new row
   * @memberof highed.DataTable
   */
  function addRow(supressChange, skipAdd) {
    var r = Row(skipAdd);

    gcolumns.forEach(function() {
      r.addCol();
    });

    if (!supressChange) {
      emitChanged();
    }
    if (rows.length > 1) {
      hideDropzone();
    }

    return r;
  }

  /** Insert a new column
   * @memberof highed.DataTable
   * @param {number} where - is the position where to add it
   */
  function insertCol(where) {
    if (where === null) where = gcolumns.length;
    if (where <= 0) where = 0;
    if (where >= gcolumns.length) where = gcolumns.length;
    //Insert into gcolumns and on each row, then call updateColumns()
    addCol(highed.L('dgNewCol'), where);

    updateColumns();
  }

  /** Delete a column
   * @memberof highed.DataTable
   * @param {number} which - the index of the column to delete
   */
  function delCol(which) {
    if (which >= 0 && which < gcolumns.length) {
      rows.forEach(function(row) {
        row.delCol(which);
      });

      gcolumns[which].destroy();

      updateColumns();
      emitChanged();
    }
  }

  /** Resize the table based on the container size
   *  @memberof highed.DataTable
   */
  function resize() {
    var ps = highed.dom.size(parent),
      hs = highed.dom.size(topBar);
      //tb = highed.dom.size(toolbar.container);
    
    highed.dom.style(frame, {
      height: ps.h - hs.h - 52 - 17 + 'px'
    });

    highed.dom.style([container, gsheetFrame, liveDataFrame], {
      height: ps.h - hs.h - 22 - 52 /*- tb.h*/ + 'px'
    });


    highed.dom.style(table, {
      width: ps.w + 'px'
    });

  }

  /** Returns the header titles as an array
   *  @memberof highed.DataTable
   *  @returns {array<string>} - the headers
   */
  function getHeaderTextArr(quoteStrings, section) {

    var columnNames = [];


    function cleanData(data) {
      var title = data && data.headerTitle.innerHTML.length
      ? data.headerTitle.innerHTML
      : null;
      
      if (quoteStrings) {
        title = '"' + title + '"';
      }

      columnNames.push(title);  
    }

    if (section) {
      //Add in label data first
      //cleanData(gcolumns[section.labelColumn]);
    }

    gcolumns.reduce(function(result, item, index) {
      
      if ( section && !checkSections(section, index)) {
            return;
          }
      
      cleanData(item);

    }, []);

    return columnNames;
  }

  function checkSections(sections, index) {
    return (sections || []).some(function(section) {
      return (section.dataColumns.indexOf(index) > -1 || (section.extraColumns && section.extraColumns.indexOf(index) > -1) || section.labelColumn === index);
    });
  }

  /** Get the table contents as an array of arrays
   *  @memberof highed.DataTable
   *  @param {boolean} quoteStrings - if true, strings are wrapped in double quotes
   *  @param {boolean} includeHeaders - if true, the header texts will be included as the first row
   *  @returns {array<array<string>>}
   */
  function toData(quoteStrings, includeHeaders, section) {
    var data = [];
    if (includeHeaders) {
      data.push(getHeaderTextArr(quoteStrings, section));
    }
    dataFieldsUsed = [];

    function addData(column, arr) { 

      if (quoteStrings && !highed.isNum(column) && highed.isStr(column)) {
        column = '"' + column.replace(/\"/g, '"') + '"';
      }

      if (highed.isNum(column)) {
        column = parseFloat(column);
      }

      arr.push(column);
    }

    rows.forEach(function(row) {
      var rarr = [],
        hasData = false;

      if (section) {
        //Add in label data first
        //addData(row.columns[section[0].labelColumn].value(), rarr);
      }

      row.columns.forEach(function(col, index) {
        if (section && !checkSections(section, index)) return;

        var v = col.value();

        if (v || v === 0) {
          hasData = true;
        }

        if (dataFieldsUsed.indexOf(index) === -1) {
          dataFieldsUsed.push(index);
          if (!v && v !== 0) {
            hasData = true;
            v = undefined;
          }
        }

        addData(v, rarr);

      });

      if (hasData) {
        data.push(rarr);
      }
    });

    return data;
  }

  /** Get the table contents as series
   *  @memberof highed.DataTable
   */
  function toDataSeries(ignoreFirst) {
    var res = {
      categories: [],
      series: []
    };

    gcolumns.forEach(function(item, i) {
      if (i > 0) {
        res.series.push({
          name: item.headerTitle.innerHTML.length
            ? item.headerTitle.innerHTML
            : null,
          data: []
        });
      }
    });

    rows.forEach(function(row, i) {
      row.columns.forEach(function(col, ci) {
        var v = col.value();

        if (!ci) {
          if (v && highed.isStr(v) && Date.parse(v) !== NaN) {
            // v = new Date(v);
          }

          res.categories.push(v);
          return;
        }

        ci--;

        if (v && highed.isNum(v)) {
          v = parseFloat(v);
        }

        if (v && highed.isStr(v) && Date.parse(v) !== NaN) {
          // v = (new Date(v)).getTime();
        }

        res.series[ci].data.push(v);
      });
    });

    return res;
  }

  /** Get the table contents as standard CSV
   *  @memberof highed.DataTable
   *  @param delimiter {string} - the delimiter to use. Defaults to `,`.
   *  @param section {array} - the section of the data table which is the data.
   */
  function toCSV(delimiter, quoteStrings, section) {
    delimiter = delimiter || ','; 
    
    if (highed.chartType !== 'Map') {
      return toData(quoteStrings, true, section)
        .map(function(cols) {
          return cols.join(delimiter);
        }).join('\n');
    }

    return toData(quoteStrings, true, section)
      .filter(function(cols) {
        return cols[1] !== null && cols[1] !== undefined;
      }).map(function(cols) {
        return cols.join(delimiter);
      }).join('\n');
  }

  function loadRows(rows, done, suppressEvents) {
    var sanityCounts = {};
    clear(null, suppressEvents);

    if (rows.length > 1) {
      hideDropzone();
    }

    // Do a sanity check on rows.
    // If the column count varries between rows, there may be something wrong.
    // In those cases we should pop up a dialog allow to specify what the
    // delimiter should be manually.

    rows.some(function(row, i) {
      var count = row.length;
      sanityCounts[count] =
        typeof sanityCounts[count] === 'undefined' ? 0 : sanityCounts[count];
      ++sanityCounts[count];
      return i > 20;
    });

    if (Object.keys(sanityCounts).length > 4) {
      // Four or more rows have varying amounts of columns.
      // Something is wrong.
      showDataImportError();
    }

    highed.dom.style(loadIndicator, {
      opacity: 1
    });

    highed.dom.style(hideCellsDiv, {
      opacity: 0
    });

    setTimeout(function() {

      if(rows[0] && rows.length < DEFAULT_ROW) {
        var counter = DEFAULT_ROW - rows.length,
            length = (rows[0].length > DEFAULT_COLUMN ? rows[0].length : DEFAULT_COLUMN);

        rows.forEach(function(row) {
          if (row.length < DEFAULT_COLUMN) {
            const len = DEFAULT_COLUMN - row.length;
            for(var i=0;i<len;i++) {
              row.push(null);
            }
          }
        });

        for(var i =0;i<counter; i++) {
          rows.push(Array(length).fill(null, 0));
        }
      }
      
      rows.forEach(function(cols, i) {
        var row;

        if (i) row = Row();
        
        tempKeyValue = "A";
        
        cols.forEach(function(c) {
          if (i === 0) addCol(c, null, suppressEvents);
          else row.addCol(c, tempKeyValue);
          tempKeyValue = getNextLetter(tempKeyValue);
        });
      });

      highed.dom.ap(colgroup, highed.dom.cr('col'));

      // highed.snackBar(highed.L('dgDataImported'));
      resize();

      highed.dom.style(loadIndicator, {
        opacity: 0
      });
      highed.dom.style(hideCellsDiv, {
        opacity: 1
      });

      if (highed.isFn(done)) {
        done();
      }
    }, 10);
  }

  function loadLiveDataPanel(params){
      //loadRows(params.csv);

      isInLiveDataMode = true;
      highed.dom.style(gsheetFrame, {
        display: 'none'
      });
      highed.dom.style(container, {
        display: 'none'
      });
      highed.dom.style(liveDataFrame, {
        display: 'block'
      });

      liveDataInput.value = params.columnsURL || params.rowsURL || params.csvURL;
      liveDataIntervalInput.value = params.dataRefreshRate || '';
      liveDataTypeSelect.selectById((params.columnsURL ? 'columnsURL' : (params.rowsURL ? 'rowsURL': 'csvURL')));
  }

  function loadLiveDataFromURL(url, interval, type) {
    isInLiveDataMode = true;
    events.emit('LoadLiveData', { url: url,
                                  interval: interval,
                                  type: type });
  }

  function loadCSV(data, surpressEvents, updateAssignData, cb) {
    var rows;

    if (isInGSheetMode) {
      isInGSheetMode = false;
      isInLiveDataMode = false;

      highed.dom.style(gsheetFrame, {
        display: 'none'
      });

      highed.dom.style(liveDataFrame, {
        display: 'none'
      });

      highed.dom.style(container, {
        display: 'block'
      });
    }

    // highed.snackBar(highed.L('dgDataImporting'));
    importModal.hide();

    surpressChangeEvents = true;
    rawCSV = data.csv;

    if (data && data.csv) {
      rows = highed.parseCSV(data.csv, data.delimiter);

      if (updateAssignData && rows[0].length < DEFAULT_COLUMN) events.emit('AssignDataForFileUpload', rows[0].length);

      var counter = DEFAULT_ROW - rows.length,
          length = (rows[0].length > DEFAULT_COLUMN ? rows[0].length : DEFAULT_COLUMN);

      rows.forEach(function(row) {
        if (row.length < DEFAULT_COLUMN) {
          const len = DEFAULT_COLUMN - row.length;
          for(var i=0;i<len;i++) {
            row.push(null);
          }
        }
      });

      for(var i =0;i<counter; i++) {
        rows.push(Array(length).fill(null, 0));
      }

      loadRows(rows, function() {
        if (updateAssignData && rows[0].length > DEFAULT_COLUMN) events.emit('AssignDataForFileUpload', rows[0].length);
        if (cb) cb();
      }, surpressEvents);
    } 

    surpressChangeEvents = false;
    if (!surpressEvents) {
      emitChanged(true);
    }
  }

  function initGSheet(
    id,
    worksheet,
    startRow,
    endRow,
    startColumn,
    endColumn,
    skipLoad,
    dataRefreshRate
  ) {
    gsheetID.value = id;
    gsheetWorksheetID.value = worksheet || '';
    gsheetRefreshTime.value = dataRefreshRate || '';
    gsheetStartRow.value = startRow || 0;
    gsheetEndRow.value = (endRow === Number.MAX_VALUE ? '' : endRow) || '';
    gsheetStartCol.value = startColumn || 0;
    gsheetEndCol.value =  (endColumn === Number.MAX_VALUE ? '' : endColumn) || '';

    isInGSheetMode = true;
    isInLiveDataMode = false;

    highed.dom.style(gsheetFrame, {
      display: 'block'
    });

    highed.dom.style(container, {
      display: 'none'
    });

    highed.dom.style(liveDataFrame, {
      display: 'none'
    });

    if (!skipLoad) {

      events.emit('LoadGSheet', {
        googleSpreadsheetKey: gsheetID.value,
        googleSpreadsheetWorksheet: gsheetWorksheetID.value || false,
        dataRefreshRate: gsheetRefreshTime.value || false,
        enablePolling: (parseInt(gsheetRefreshTime.value) !== 0),
        startRow: gsheetStartRow.value || 0,
        endRow: gsheetEndRow.value || undefined,
        startColumn: gsheetStartCol.value || 0,
        endColumn: gsheetEndCol.value || undefined
      });
    }
  }

  function showDataTableError() {
    highed.dom.style(container, {
      border: '1px solid #aa5555'
    });
  }

  function hideDataTableError() {
    highed.dom.style(container, {
      border: 'initial'
    });
  }

  function addImportTab(tabOptions){
    importer.addImportTab(tabOptions);
  }

  function hideImportModal(){
    importModal.hide();
  }

  function showImportModal(index) {
    importModal.show();
    if (!isNaN(index)) {
      importer.selectTab(index);
    }

    events.emit('initExporter', importer.exporter);
    importer.resize();
  }

  function showLiveData(skipConfirm) {
    if (
      skipConfirm ||
      rows.length <= 1 ||
      confirm('This will clear your existing data. Continue?')
    ) {
      clear(true);
      events.emit('ClearSeries');

      liveDataInput.value = '';
      liveDataIntervalInput.value = '';
      liveDataTypeSelect.selectByIndex(0);

      highed.dom.style(gsheetFrame, {
        display: 'none'
      });

      highed.dom.style(container, {
        display: 'none'
      });

      highed.dom.style(liveDataFrame, {
        display: 'block'
      });
      importModal.hide();

      isInGSheetMode = false;
      isInLiveDataMode = true;
    }
  }

  function showGSheet(skipConfirm) {
    if (
      skipConfirm ||
      rows.length <= 1 ||
      confirm('This will clear your existing data. Continue?')
    ) {
      clear(true);
      events.emit('ClearSeries');
      
      gsheetID.value = '';
      gsheetWorksheetID.value = '';
      gsheetRefreshTime.value = '';
      highed.dom.style(gsheetFrame, {
        display: 'block'
      });

      highed.dom.style(container, {
        display: 'none'
      });

      highed.dom.style(liveDataFrame, {
        display: 'none'
      });

      importModal.hide();
      isInGSheetMode = true;
      isInLiveDataMode = false;
    }
  }

  function hideLiveData() {
    if (
      !liveDataInput.value ||
      confirm('Are you sure you want to remove your live data?')
    ) {
      // Should emit a gsheet clear

      events.emit('LoadLiveData', {
          url: ''
      });

      highed.dom.style(gsheetFrame, {
        display: 'none'
      });

      highed.dom.style(container, {
        display: 'block'
      });


      highed.dom.style(liveDataFrame, {
        display: 'none'
      });

      isInLiveDataMode = false;

      init();
    }
  }

  function hideGSheet() {
    if (
      !gsheetID.value ||
      confirm('Are you sure you want to detach the current spreadsheet?')
    ) {
      // Should emit a gsheet clear
      events.emit('LoadGSheet', {
        googleSpreadsheetKey: '',
        googleSpreadsheetWorksheet: false
      });

      highed.dom.style(gsheetFrame, {
        display: 'none'
      });

      highed.dom.style(container, {
        display: 'block'
      });

      highed.dom.style(liveDataFrame, {
        display: 'none'
      });
      isInGSheetMode = false;

      init();

      highed.emit('UIAction', 'DetachGoogleSheet');
    }
  }

  ////////////////////////////////////////////////////////////////////////////

  mapImporter.on('HandleTileMapImport', function(data, linkedCodes, toNextPage, assigns) {
    loadSampleData(data);
    toNextPage();
  });

  mapImporter.on('HandleMapImport', function(data, linkedCodes, toNextPage, assigns, serie) {

    loadCSV({ csv: data }, true, false, function() {
      rows.forEach(function(row) {
        if (linkedCodes) {
          var code = linkedCodes.filter(function(v) { return v.name === row.columns[0].value()});
          if (code && code.length > 0) {
            row.columns[0].setHiddenValue(code[0].code);
          }
          row.columns[0].setDisabled(true);
        }
      });

      events.emit('HandleMapImport', assigns, serie, data);
      //events.emit('SetupAssignData', assigns, serie);
      toNextPage();
    });
  });
  importer.on('ExportComma', function(data) {
    highed.emit('UIAction', 'ExportComma');
    highed.download('data.csv', toCSV(','), 'application/csv');
    events.emit('EnableAssignDataPanel');
    importModal.hide();
  });

  importer.on('ExportSemiColon', function(data) {
    highed.emit('UIAction', 'ExportSemiColon');
    highed.download('data.csv', toCSV(';'), 'application/csv');
    events.emit('EnableAssignDataPanel');
    importModal.hide();
  });

  importer.on('ImportCSV', function(data, cb) {
    highed.emit('UIAction', 'ImportCSV');
    events.emit('EnableAssignDataPanel');
    loadCSV(data, null, true, cb);
  });

  importer.on('ImportGoogleSpreadsheet', function() {
    highed.emit('UIAction', 'BtnGoogleSheet');
    events.emit('DisableAssignDataPanel');
    showGSheet();
  });

  importer.on('ImportLiveData', function(data) {
    isInLiveDataMode = true;
    events.emit('DisableAssignDataPanel');
    showLiveData();
    //loadLiveDataFromURL(data.url);
  });

  importer.on('ImportChartSettings', function(settings, format) {
    // Do something with the data here
    events.emit('ImportChartSettings', settings, format);
    importModal.hide();
  });

  highed.dom.on(switchRowColumns, 'click', function() {
    selectSwitchRowsColumns()
  })

  highed.dom.on(gsheetCancelButton, 'click', function() {
    hideGSheet();
    events.emit('CancelDataInput');
    events.emit('EnableAssignDataPanel');
  });

  highed.dom.on(liveDataCancelButton, 'click', function() {
    hideLiveData();
    events.emit('CancelDataInput');
    events.emit('EnableAssignDataPanel');
  });

  highed.dom.on(liveDataLoadButton, 'click', function() {
    loadLiveDataFromURL(liveDataInput.value, liveDataIntervalInput.value, detailValue || 'columnsURL');
  });

  highed.dom.on(gsheetLoadButton, 'click', function() {

    var value = parseInt(gsheetRefreshTime.value);
    events.emit('LoadGSheet', {
      googleSpreadsheetKey: gsheetID.value,
      googleSpreadsheetWorksheet: gsheetWorksheetID.value || false,
      dataRefreshRate: (!isNaN(value) && value !== 0 ? value : false),
      enablePolling: (!isNaN(value) && value !== 0),
      startRow: gsheetStartRow.value || 0,
      endRow: gsheetEndRow.value || Number.MAX_VALUE,
      startColumn: gsheetStartCol.value || 0,
      endColumn: gsheetEndCol.value || Number.MAX_VALUE
    });
  });

  highed.dom.on(weirdDataIgnore, 'click', hideDataImportError);

  highed.dom.on(weirdDataFix, 'click', function() {
    // Pop open a modal with the option of supplying a delimiter manually.
    var dropdownParent = highed.dom.cr('div'),
      dropdown = highed.DropDown(dropdownParent),
      okBtn = highed.dom.cr('button', 'highed-ok-button', 'Rerun Import'),
      nevermindBtn = highed.dom.cr('button', 'highed-ok-button', 'Nevermind'),
      selectedDelimiter = undefined;

    weirdDataModal.body.innerHTML = '';
    weirdDataModal.show();

    dropdown.addItems([
      {
        title: 'Tab',
        id: 'tab',
        select: function() {
          selectedDelimiter = '\t';
        }
      },
      {
        title: 'Comma',
        id: 'comma',
        select: function() {
          selectedDelimiter = ',';
        }
      },
      {
        title: 'Semicolon',
        id: 'semicolon',
        select: function() {
          selectedDelimiter = ';';
        }
      }
    ]);

    dropdown.selectByIndex(0);

    highed.dom.ap(
      weirdDataModal.body,
      highed.dom.cr('h3', '', 'Data Import Fixer'),
      highed.dom.cr(
        'div',
        'highed-dtable-weird-data-body',
        [
          'We could not properly determine how your columns are separated.',
          '<br/><br/>',
          'Usually this is caused by commas as thousand separators,',
          'or something similar. Please choose which delimiter you want to use,',
          'and click the Rerun button.<br/><br/>'
        ].join(' ')
      ),
      dropdownParent,
      highed.dom.style(okBtn, {
        marginRight: '5px'
      }),
      nevermindBtn
    );

    highed.dom.on(nevermindBtn, 'click', weirdDataModal.hide);

    highed.dom.on(okBtn, 'click', function() {
      weirdDataModal.hide();
      hideDataImportError();

      loadCSV({
        csv: rawCSV,
        delimiter: selectedDelimiter
      }, null, true);
    });
  });

  ////////////////////////////////////////////////////////////////////////////

  dropZone.innerHTML =
    'Drop CSV files here.<br/>' +
    '<span class="highed-dtable-drop-zone-small">You can also paste CSV or Excel data into any cell</span>';

  table.cellPadding = 0;
  table.cellSpacing = 0;

  highed.dom.on(frame, 'scroll', function(e) {
    leftBar.style.top = -frame.scrollTop + 'px';
    //topBar.style.left = -frame.scrollLeft + 40 + 'px';
  });

  parent = highed.dom.get(parent);
  highed.dom.ap(
    parent,
    gsheetFrame,
    liveDataFrame,
    highed.dom.ap(
      container,
      highed.dom.ap(
        frame,
        highed.dom.ap(table, 
         // colgroup, 
          highed.dom.ap(thead,   
            topLetterBar, topColumnBar
          ),
        tbody),
        tableTail,
        dropZone,
        movementBar
      ),
      hideCellsDiv,
      leftBar
      //highed.dom.ap(topLeftPanel, checkAll)
    ),
    highed.dom.ap(
      weirdDataContainer,
      highed.dom.cr(
        'div',
        'highed-dtable-weird-data-body',
        [
          'Uh-oh! It looks like our data importer may have had some issues',
          'processing your data.',
          'Usually this means that we were unable to deduce how the columns',
          'are separated.'
        ].join(' ')
      ),
      weirdDataIgnore,
      weirdDataFix
    ),

    loadIndicator
  );

  gsheetID.placeholder = 'Spreadsheet ID';
  gsheetWorksheetID.placeholder = 'Worksheet (leave blank for first)';
  gsheetRefreshTime.placeholder = 'Refresh Time (leave blank for no refresh)';

  highed.dom.ap(
    gsheetFrame,
    highed.dom.ap(
      gsheetContainer,
      highed.dom.cr(
        'div',
        'highed-dtable-gsheet-heading',
        'Link Google Spreadsheet'
      ),
      highed.dom.ap(
        highed.dom.cr('div', 'highed-dtable-gsheet-inner'),
        // highed.dom.cr('div', 'highed-dtable-gsheet-centered', 'You have loaded a Google Spreadsheet.'),
        // highed.dom.cr(
        //   'div',
        //   'highed-dtable-gsheet-desc',
        //   [
        //     'Google Spreadsheets are referenced, meaning that the data is imported',
        //     'on the fly. When viewing the chart, the latest version of your sheet',
        //     'will always be used!<br/><br/>'
        //   ].join(' ')
        // ),
        highed.dom.cr(
          'div',
          'highed-dtable-gsheet-label',
          'Google Spreadsheet ID'
        ),
        highed.dom.ap(highed.dom.cr('div'), gsheetID),
        highed.dom.ap(
          highed.dom.cr('table', 'highed-stretch'),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Worksheet'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Refresh Time (Seconds)')
          ),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.ap(highed.dom.cr('td', '', ''), gsheetWorksheetID),
            highed.dom.ap(highed.dom.cr('td', '', ''), gsheetRefreshTime)
          ),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Start Row'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'End Row')
          ),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.ap(highed.dom.cr('td', '', ''), gsheetStartRow),
            highed.dom.ap(highed.dom.cr('td', '', ''), gsheetEndRow)
          ),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Start Column'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'End Column')
          ),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.ap(highed.dom.cr('td', '', ''), gsheetStartCol),
            highed.dom.ap(highed.dom.cr('td', '', ''), gsheetEndCol)
          )
        ),
        highed.dom.ap(
          highed.dom.cr('div', 'highed-gsheet-btn-container'),
          gsheetLoadButton,
          gsheetCancelButton,
          gsheetPluginButton
        ),
        highed.dom.cr(
          'div',
          'highed-gsheet-text',
          [
            'When using Google Spreadsheet, Highcharts references the sheet directly.<br/><br/>',
            'This means that the published chart always loads the latest version of the sheet.<br/><br/>',

            'For more information on how to set up your spreadsheet, visit',
            '<a target="_blank" href="https://cloud.highcharts.com/docs/#/google-spread-sheet-setting">the documentation</a>.<br/><br/>',
            'We also have a <a target="_blank" href="https://gsuite.google.com/marketplace/app/highcharts_cloud/629254340466">Google Sheets plugin</a>',
            'that can be used to simplify the import process.',
          ].join(' ')
        )
      )
    )
  );

  liveDataTypeSelect.addItems([
    {id: 'columnsURL', title: "JSON (Column Ordered)"},
    {id: 'rowsURL', title: "JSON (Row Ordered)"},
    {id: 'csvURL', title: "CSV"}
  ]
  );

  liveDataTypeSelect.on('Change', function(selected) {
    //detailIndex = selected.index();
    detailValue = selected.id();
    //liveDataTypeSelect.selectById(detailValue || 'json');
  });

  highed.dom.ap(liveDataTypeMasterNode, liveDataTypeSelect.container);
  highed.dom.style(liveDataTypeMasterNode, {
    display: 'block'
  });

  highed.dom.ap(
    liveDataFrame,
    highed.dom.ap(
      liveDataContainer,
      highed.dom.cr(
        'div',
        'highed-dtable-gsheet-heading',
        'Live Data'
      ),
      highed.dom.ap(
        highed.dom.cr('div', 'highed-dtable-gsheet-inner'),
        // highed.dom.cr('div', 'highed-dtable-gsheet-centered', 'You have loaded a Google Spreadsheet.'),
        // highed.dom.cr(
        //   'div',
        //   'highed-dtable-gsheet-desc',
        //   [
        //     'Google Spreadsheets are referenced, meaning that the data is imported',
        //     'on the fly. When viewing the chart, the latest version of your sheet',
        //     'will always be used!<br/><br/>'
        //   ].join(' ')
        // ),
        highed.dom.cr(
          'div',
          'highed-dtable-gsheet-label',
          'URL'
        ),
        highed.dom.ap(highed.dom.cr('div'), liveDataInput),

        highed.dom.ap(
          highed.dom.cr('table', 'highed-stretch'),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Chart Refresh Time (Seconds)'),
            highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Data Type')
          ),
          highed.dom.ap(
            highed.dom.cr('tr'),
            highed.dom.ap(highed.dom.cr('td', '', ''), liveDataIntervalInput),
            highed.dom.ap(highed.dom.cr('td', '', ''), liveDataTypeMasterNode)
          )
        ),

        highed.dom.ap(
          highed.dom.cr('div', 'highed-gsheet-btn-container'),
          liveDataLoadButton,
          liveDataCancelButton
        ),
        highed.dom.cr('div', 'highed-gsheet-text', [
          'Live data needs a url to your JSON data to reference.<br/><br/>',
          'This means that the published chart always loads the latest version of your data.<br/><br/>'
        ].join(' '))
      )
    )
  );

  function selectSwitchRowsColumns() {
    var csvData = rowsToColumns(highed.parseCSV(toCSV()))
    .map(function(cols) {
      return cols.join(';');
    }).join('\n')

    clearData()
    loadCSV({
      csv: csvData
    }, null, true);
  }

  function rowsToColumns(rows) {
    var row,
        rowsLength,
        col,
        colsLength,
        columns;

    if (rows) {
        columns = [];
        rowsLength = rows.length;
        for (row = 0; row < rowsLength; row++) {
            colsLength = rows[row].length;
            for (col = 0; col < colsLength; col++) {
                if (!columns[col]) {
                    columns[col] = [];
                }
                columns[col][row] = rows[row][col];
            }
        }
    }
    return columns;
  }


  function getRawCSV() {
    return rawCSV;
  }

  function clearData() {
    highed.emit('UIAction', 'FlushDataConfirm');
    init();
    emitChanged();
    if (rows.length > 0) rows[0].columns[0].focus();
  }

  function highlightCells(previousValues, values, input, newOptions) {
    highlighter.highlightCells(rows, gcolumns, previousValues, values, input, newOptions);
  }

  function removeAllCellsHighlight(previousValues, values, input, newOptions) {
    highlighter.removeAllCellsHighlight(rows, gcolumns, previousValues, values, input, newOptions)
  }

  function toggleUnwantedCells(values, toggle) {
    
    var found = false;

    gcolumns.forEach(function(col, index) {
      if (values.indexOf(index) === -1) {
        toggle ? col.hideColumns() : col.showColumns();
      } else {
        col.showColumns();

        if (!found && rows[0]) {
          rows[0].columns[index].focus();
          found = true;
        }
        
      }
    });
  }
  
  function getColumnLength(){
    return (rows[0] && rows[0].columns ? rows[0].columns.length : 2);
  }

  function areColumnsEmpty(colNumber) {
    return !rows.some(function(row){
      return row.columns[colNumber].value() !== null;
    });
  }

  function areRowsEmpty(rowNumber) {
    return !rows[rowNumber].columns.some(function(column){
      return column.value() !== null;
    });
  }

  function getDataFieldsUsed() {
    return dataFieldsUsed;
  }

  function isInCSVMode() {
    return (!isInGSheetMode && !isInLiveDataMode);
  }

  function createSimpleDataTable(toNextPage, loading, chartContainer){

    simpleDataTable = highed.WizardData(importer, mapImporter, chartContainer);
    simpleDataTable.on('DownloadMapCSVStub', function(){
      downloadRows = rows.map(function(row){
          return row.columns[0].cellValue();
      }).join('\n');
      highed.download('data.csv', downloadRows, 'application/csv');
    });

    simpleDataTable.on('UpdateDataGridWithLatLong', function(data) {
      loadCSV({ csv: data.map(function(cols) {
        return cols.join(',');
      }).join('\n')}, null, false);

      events.emit('ResetAssignValues', {
        labels: -1,
        latitude: 0,
        longitude: 1,
        value: 2
      });
      
    });

    simpleDataTable.createSimpleDataTable(toNextPage, loading, {
      gsheetID: gsheetID,
      gsheetWorksheetID: gsheetWorksheetID,
      gsheetRefreshTime: gsheetRefreshTime,
      gsheetStartRow: gsheetStartRow,
      gsheetEndRow: gsheetEndRow,
      gsheetStartCol: gsheetStartCol,
      gsheetEndCol: gsheetEndCol,
      liveDataInput: liveDataInput,
      liveDataIntervalInput: liveDataIntervalInput,
      liveDataTypeSelect: liveDataTypeSelect
    });

    simpleDataTable.on('HandleFileUpload', function(file, cb) {
      handleFileUpload(file, cb);
    });

    return simpleDataTable.container();
  }

  function showLatLongTable(type) {
    simpleDataTable.showLatLongTable(type);
  }

  function loadMapData(mapData, code, name, csv, cb, suppressEvents) {
    const rowLength = rows.length;
    var i = 0;

    if (!code || code === '') code = 'hc-key';
    if (!name || name === '') name = 'name';

    mapData = mapData.sort(function(a, b) {
      if(a.properties['hc-key'] < b.properties['hc-key']) { return -1; }
      if(a.properties['hc-key'] > b.properties['hc-key']) { return 1; }
      return 0;
    });

    var newRows = [];
    if (csv) newRows = highed.parseCSV(csv);

    gcolumns.forEach(function(col, index){
      if (newRows && newRows[0] && newRows[0][index]) {
        col.headerTitle.innerHTML = newRows[0][index] === 'null' ? '' : newRows[0][index];
      }
    });
    
    mapData.forEach(function(data) {
      if (!data.properties[name]) return;

      if (i >= rowLength) addRow(suppressEvents);
      rows[i].columns[0].setValue(data.properties[name], suppressEvents);
      rows[i].columns[0].setHiddenValue(data.properties[code]);

      newRows.forEach(function(r, n) {
        if (r[0] === data.properties[code]) {
          rows[i].columns.forEach(function(col, x) {
            if (x === 0 || newRows[n][x] === undefined) return;
            
            col.setValue(newRows[n][x], suppressEvents);
          })
        }
      });

      i++;
      data.properties.hccode = code; 
      data.properties.hcname = name; 
    });

    highlighter.highlightCells(rows, gcolumns, [0],[0], {
      colors: {
        'light': 'rgba(66, 200, 192, 0.2)',
        'dark': 'rgb(66, 200, 192)',
      }
    })

    highlighter.highlightCells(rows, gcolumns, [1],[1], {
      colors: {
        'light': 'rgba(145, 151, 229, 0.2)',
        'dark': 'rgb(145, 151, 229)',
      }
    })
    
    rows.forEach(function(row) {
      row.columns[0].setDisabled(true);
    });

    mapImporter.setMap(mapData);

    if (cb && highed.isFn(cb)) cb();
  }

  function getMapValueFromCode(key, assignedValue) {
    rows.some(function(row) {
      if (row.columns[0].element.children[0].getAttribute('data-value') === key) {
        value = row.columns[assignedValue.dataColumns[0]];
        return true;
      }
    });
    return value;
  }

  function loadSampleData(data) {
    importer.emitCSVImport(data);
  }

  ////////////////////////////////////////////////////////////////////////////

  highed.ready(function() {
    init();
  });

  ////////////////////////////////////////////////////////////////////////////

  return {
    toolbar: toolbar,
    sortRows: sortRows,
    clear: clear,
    addRow: addRow,
    insCol: insertCol,
    delCol: delCol,
    loadCSV: loadCSV,
    getRawCSV: getRawCSV,
    toData: toData,
    toCSV: toCSV,
    toDataSeries: toDataSeries,
    getHeaderTextArr: getHeaderTextArr,
    addImportTab: addImportTab,
    hideImportModal: hideImportModal,
    showImportModal: showImportModal,
    initGSheet: initGSheet,
    on: events.on,
    resize: resize,
    loadSampleData: loadSampleData,
    loadLiveDataFromURL: loadLiveDataFromURL,
    loadLiveDataPanel: loadLiveDataPanel,
    isInCSVMode: isInCSVMode,
    //highlightSelectedFields: highlightSelectedFields,
    highlightCells: highlightCells,
    removeAllCellsHighlight: removeAllCellsHighlight,
    toggleUnwantedCells: toggleUnwantedCells,
    getColumnLength: getColumnLength,
    getDataFieldsUsed: getDataFieldsUsed,
    createSimpleDataTable: createSimpleDataTable,
    areColumnsEmpty: areColumnsEmpty,
    clearData: clearData,
    showDataTableError: showDataTableError,
    hideDataTableError: hideDataTableError,
    selectSwitchRowsColumns: selectSwitchRowsColumns,
    loadMapData: loadMapData,
    getMapValueFromCode: getMapValueFromCode,
    showLatLongTable: showLatLongTable
  };
};
