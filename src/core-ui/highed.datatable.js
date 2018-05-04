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

function parseCSV(inData, delimiter) {
  var isStr = highed.isStr,
    isArr = highed.isArray,
    isNum = highed.isNum,
    csv = inData || '',
    result = [],
    options = {
      delimiter: delimiter
    },
    potentialDelimiters = {
      ',': true,
      ';': true,
      '\t': true
    },
    delimiterCounts = {
      ',': 0,
      ';': 0,
      '\t': 0
    };
  //The only thing CSV formats have in common..
  rows = (csv || '').replace(/\r\n/g, '\n').split('\n');

  // If there's no delimiter, look at the first few rows to guess it.

  if (!options.delimiter) {
    rows.some(function(row, i) {
      if (i > 10) return true;

      var inStr = false,
        c,
        cn,
        cl,
        token = '';

      for (var j = 0; j < row.length; j++) {
        c = row[j];
        cn = row[j + 1];
        cl = row[j - 1];

        if (c === '"') {
          if (inStr) {
            if (cl !== '"' && cn !== '"') {
              // The next non-blank character is likely the delimiter.

              while (cn === ' ') {
                cn = row[++j];
              }

              if (potentialDelimiters[cn]) {
                delimiterCounts[cn]++;
                return true;
              }

              inStr = false;
            }
          } else {
            inStr = true;
          }
        } else if (potentialDelimiters[c]) {
          if (!isNaN(Date.parse(token))) {
            // Yup, likely the right delimiter
            token = '';
            delimiterCounts[c]++;
          } else if (!isNum(token) && token.length) {
            token = '';
            delimiterCounts[c]++;
          }
        } else {
          token += c;
        }
      }
    });

    options.delimiter = ';';

    if (
      delimiterCounts[','] > delimiterCounts[';'] &&
      delimiterCounts[','] > delimiterCounts['\t']
    ) {
      options.delimiter = ',';
    }

    if (
      delimiterCounts['\t'] >= delimiterCounts[';'] &&
      delimiterCounts['\t'] >= delimiterCounts[',']
    ) {
      options.delimiter = '\t';
    }
  }

  rows.forEach(function(row, rowNumber) {
    var cols = [],
      inStr = false,
      i = 0,
      j,
      token = '',
      guessedDel,
      c,
      cp,
      cn;

    function pushToken() {
      token = (token || '').replace(/\,/g, '');
      if (!token.length) {
        token = null;
        // return;
      }

      if (isNum(token)) {
        token = parseFloat(token);
      }

      cols.push(token);
      token = '';
    }

    for (i = 0; i < row.length; i++) {
      c = row[i];
      cn = row[i + 1];
      cp = row[i - 1];

      if (c === '"') {
        if (inStr) {
          pushToken();
        } else {
          inStr = false;
        }

        //Everything is allowed inside quotes
      } else if (inStr) {
        token += c;
        //Check if we're done reading a token
      } else if (c === options.delimiter) {
        pushToken();

        //Append to token
      } else {
        token += c;
      }

      // Push if this was the last character
      if (i === row.length - 1) {
        pushToken();
      }
    }

    result.push(cols);
  });

  return result;
}

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
    table = highed.dom.cr('table', 'highed-dtable-table'),
    thead = highed.dom.cr('thead', 'highed-dtable-head'),
    tbody = highed.dom.cr('tbody', 'highed-dtable-body'),
    tableTail = highed.dom.cr(
      'div',
      'highed-dtable-table-tail',
      'Only the first 500 rows are shown.'
    ),
    colgroup = highed.dom.cr('colgroup'),
    leftBar = highed.dom.cr('div', 'highed-dtable-left-bar'),
    topBar = highed.dom.cr('div', 'highed-dtable-top-bar'),
    topLeftPanel = highed.dom.cr('div', 'highed-dtable-top-left-panel'),
    checkAll = highed.dom.cr('input'),
    mainInput = highed.dom.cr('textarea', 'highed-dtable-input'),
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
      'Loading Data...'
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
      'highed-ok-button highed-dtable-gsheet-button',
      'Detach Sheet From Chart'
    ),
    gsheetLoadButton = highed.dom.cr(
      'button',
      'highed-ok-button highed-dtable-gsheet-button',
      'Load Spreadsheet'
    ),
    liveDataLoadButton = highed.dom.cr(
      'button',
      'highed-ok-button highed-dtable-gsheet-button',
      'Load Live Data'
    ),
    liveDataCancelButton = highed.dom.cr(
      'button',
      'highed-ok-button highed-dtable-gsheet-button',
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
    saveCtx = highed.ContextMenu([
      {
        title: 'Use <code>,</code> as delimiter',
        click: function() {
          highed.download('data.csv', toCSV(','), 'application/csv');
        }
      },
      {
        title: 'Use <code>;</code> as delimiter',
        click: function() {
          highed.download('data.csv', toCSV(';'), 'application/csv');
        }
      }
    ]),
    selectedRowIndex = 0,
    addRowCtx = highed.ContextMenu([
      {
        title: 'At the end',
        icon: '',
        click: function() {
          addRow();
          highed.emit('UIAction', 'AddRowAtEnd');
        }
      },
      {
        title: 'After highlighted',
        click: function() {
          addRowAfter(selectedRowIndex);
          highed.emit('UIAction', 'AddRowAfterHighlight');
        }
      },
      {
        title: 'Before highlighted',
        click: function() {
          addRowBefore(selectedRowIndex);
          highed.emit('UIAction', 'AddRowBeforeHighlight');
        }
      }
    ]);
  checkAll.type = 'checkbox';

  highed.dom.on(mainInput, 'click', function(e) {
    return highed.dom.nodefault(e);
  });

  highed.dom.style(liveDataIntervalInput, {
    padding: '8px'
  });
  ////////////////////////////////////////////////////////////////////////////

  // Handle drag 'n drop of files

  function handleFileUpload(f) {
    if (f.type !== 'text/csv') {
      return highed.snackBar('The file is not a valid CSV file');
    }

    var reader = new FileReader();

    reader.onload = function(e) {
      loadCSV({ csv: e.target.result });
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
        events.emit('Change', getHeaderTextArr(), toData());
      }
    }, 1000);
  }

  function makeEditable(target, value, fn, keyup, close) {
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
    mainInput.setSelectionRange(0, mainInput.value.length);

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
        if (ps.length > 1) {
          if (
            confirm(
              'You are about to load CSV data. This will overwrite your current data. Continue?'
            )
          ) {
            rawCSV = mainInput.value;
            highed.emit('UIAction', 'PasteCSVAttempt');
            return loadRows(ps);
          }
          return;
        }

        return highed.isFn(fn) && fn(mainInput.value);
      })
    );

    highed.dom.ap(target, mainInput);
    mainInput.focus();
  }

  ////////////////////////////////////////////////////////////////////////////

  function Column(row, colNumber, val) {
    var value = typeof val === 'undefined' ? null : val,
      col = highed.dom.cr('td'),
      colVal = highed.dom.cr('div', 'highed-dtable-col-val', value),
      input = highed.dom.cr('input'),
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
          addRow();
          rows[row.number + 1].columns[0].focus();
        } else {
          goBelow();
        }
        return highed.dom.nodefault(e);
      }
    }

    function selContents() {
      input.setSelectionRange(0, input.value.length);
    }

    function focus() {
      function checkNull(value) {
        return value === null || value === '';
      }
      mainInput.className = 'highed-dtable-input';
      makeEditable(
        col,
        value,
        function(val) {
          var changed = value !== val;
          value = checkNull(val) ? null : val;
          colVal.innerHTML = value;
          if (changed) {
            emitChanged();
          }
        },
        handleKeyup
      );

      row.select();
    }

    function destroy() {
      row.node.removeChild(col);
      col.innerHTML = '';
      colVal.innerHTML = '';
    }

    function getVal() {
      return value;
    }

    function addToDOM(me) {
      colNumber = me || colNumber;
      highed.dom.ap(row.node, highed.dom.ap(col, colVal));
    }

    highed.dom.on(col, 'click', focus);

    if (rows.length <= 500) {
      addToDOM();
    }

    exports = {
      focus: focus,
      value: getVal,
      destroy: destroy,
      addToDOM: addToDOM
    };

    return exports;
  }

  ////////////////////////////////////////////////////////////////////////////

  function Row(skipAdd) {
    var columns = [],
      row = highed.dom.cr('tr'),
      leftItem = highed.dom.cr('div', 'highed-dtable-left-bar-row', ''),
      checker = highed.dom.cr('input', 'highed-dtable-row-select-box'),
      checked = false,
      didAddHTML = false,
      exports = {};

    checker.type = 'checkbox';

    function addCol(val) {
      columns.push(Column(exports, columns.length, val));
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

      highed.dom.ap(tbody, row);

      highed.dom.ap(leftBar, highed.dom.ap(leftItem, checker));
    }

    function rebuildColumns() {
      row.innerHTML = '';
      columns.forEach(function(col, i) {
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

    for (var i = 0; i < 1; i++) {
      var r = Row();
    }

    for (var j = 0; j < 2; j++) {
      addCol('Column ' + (j + 1));
    }

    highed.dom.ap(colgroup, highed.dom.cr('col'));
    resize();

    surpressChangeEvents = false;
  }

  function updateColumns() {
    colgroup.innerHTML = '';
    topBar.innerHTML = '';

    gcolumns.forEach(function(col, i) {
      col.colNumber = i;
      col.addToDOM();
    });

    rebuildColumns();

    highed.dom.ap(colgroup, highed.dom.cr('col'));
    resize();
  }

  function addCol(value, where) {
    //The header columns control the colgroup
    var col = highed.dom.cr('col'),
      colNumber = gcolumns.length,
      header = highed.dom.cr('span', 'highed-dtable-top-bar-col'),
      headerTitle = highed.dom.cr('div', '', value),
      moveHandle = highed.dom.cr('div', 'highed-dtable-resize-handle'),
      options = highed.dom.cr(
        'div',
        'highed-dtable-top-bar-col-options fa fa-chevron-down'
      ),
      exports = {
        col: col,
        header: header,
        headerTitle: headerTitle,
        colNumber: gcolumns.length
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
            insertCol(exports.colNumber);
          }
        },
        {
          title: highed.L('dgInsColAfter'),
          icon: 'plus',
          click: function() {
            insertCol(exports.colNumber + 1);
          }
        }
      ]),
      ox;

    ////////////////////////////////////////////////////////////////////////

    exports.addToDOM = function() {
      highed.dom.ap(colgroup, col);
      highed.dom.ap(
        topBar,
        highed.dom.ap(header, headerTitle, options, moveHandle)
      );
    };

    exports.destroy = function() {
      colgroup.removeChild(col);
      topBar.removeChild(header);

      gcolumns = gcolumns.filter(function(b) {
        return b !== exports;
      });
    };

    ////////////////////////////////////////////////////////////////////////

    exports.addToDOM();

    // highed.dom.showOnHover(header, options);

    col.width = 140;
    highed.dom.style([col, header], {
      width: col.width + 'px'
    });

    mover.on('StartMove', function(x) {
      ox = x;

      highed.dom.style(document.body, {
        cursor: 'ew-resize'
      });
    });

    mover.on('Moving', function(x) {
      col.width = x;

      highed.dom.style([col, header], {
        width: x + 'px'
      });

      moveHandle.className =
        'highed-dtable-resize-handle highed-dtable-resize-handle-moving';
    });

    mover.on('EndMove', function(x) {
      highed.dom.style(document.body, {
        cursor: ''
      });

      moveHandle.className = 'highed-dtable-resize-handle';
    });

    highed.dom.on(options, 'click', function(e) {
      ctx.show(e.clientX, e.clientY);
      return highed.dom.nodefault(e);
    });

    highed.dom.on(header, 'click', function(e) {
      //Ugly.
      mainInput.className = 'highed-dtable-input highed-dtable-input-header';

      //Spawn an edit box in the node
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
        row.addCol();
      }
    });

    if (where) {
      gcolumns.splice(where, 0, exports);
    } else {
      gcolumns.push(exports);
    }

    emitChanged();
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
    tbody.innerHTML = '';

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
      }

      if (direction === 'ASC') {
        return ad.localeCompare(bd);
      }
      return bd.localeCompare(ad);
    });

    rebuildRows();
    emitChanged();
  }

  /** Clear the table
   * @memberof highed.DataTable
   */
  function clear(noWait) {
    rows = rows.filter(function(row) {
      row.destroy();
      return false;
    });

    gcolumns = gcolumns.filter(function(row) {
      //Destroy col here
      return false;
    });

    tbody.innerHTML = '';
    leftBar.innerHTML = '';
    topBar.innerHTML = '';
    colgroup.innerHTML = '';

    highed.dom.style(tableTail, {
      display: ''
    });

    events.emit('ClearData');

    emitChanged(noWait);
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
    if (!where) gcolumns.length;
    if (where < 0) where = 0;
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
      hs = highed.dom.size(topBar),
      tb = highed.dom.size(toolbar.container);

    highed.dom.style(frame, {
      height: ps.h - hs.h - tb.h + 'px',
      width: ps.w - hs.h + 'px'
    });

    highed.dom.style(table, {
      width: ps.w - hs.h + 'px'
    });
  }

  /** Returns the header titles as an array
   *  @memberof highed.DataTable
   *  @returns {array<string>} - the headers
   */
  function getHeaderTextArr(quoteStrings) {
    return gcolumns.map(function(item) {
      var title = item.headerTitle.innerHTML.length
        ? item.headerTitle.innerHTML
        : null;

      if (quoteStrings) {
        title = '"' + title + '"';
      }

      return title;
    });
  }

  /** Get the table contents as an array of arrays
   *  @memberof highed.DataTable
   *  @param {boolean} quoteStrings - if true, strings are wrapped in double quotes
   *  @param {boolean} includeHeaders - if true, the header texts will be included as the first row
   *  @returns {array<array<string>>}
   */
  function toData(quoteStrings, includeHeaders) {
    var data = [];

    if (includeHeaders) {
      data.push(getHeaderTextArr(quoteStrings));
    }

    rows.forEach(function(row) {
      var rarr = [],
        hasData = false;

      row.columns.forEach(function(col) {
        var v = col.value(),
          d;

        if (v) {
          hasData = true;
        }

        if (quoteStrings && !highed.isNum(v) && highed.isStr(v)) {
          v = '"' + v.replace(/\"/g, '"') + '"';
        }

        if (highed.isNum(v)) {
          v = parseFloat(v);
        }

        if (highed.isStr(v) && Date.parse(v) !== NaN) {
          //v = (new Date(v)).getTime();
        }

        rarr.push(v);
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
   */
  function toCSV(delimiter, quoteStrings) {
    delimiter = delimiter || ',';
    return toData(quoteStrings, true)
      .map(function(cols) {
        return cols.join(delimiter);
      })
      .join('\n');
  }

  function loadRows(rows, done) {
    var sanityCounts = {};

    clear();

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
      // Four or more rows have varrying amounts of columns.
      // Something is wrong.
      showDataImportError();
    }

    highed.dom.style(loadIndicator, {
      opacity: 1
    });

    setTimeout(function() {
      rows.forEach(function(cols, i) {
        var row;

        if (i) {
          row = Row();
        }

        cols.forEach(function(c) {
          if (i === 0) {
            addCol(c);
          } else {
            row.addCol(c);
          }
        });
      });

      highed.dom.ap(colgroup, highed.dom.cr('col'));

      // highed.snackBar(highed.L('dgDataImported'));
      resize();

      highed.dom.style(loadIndicator, {
        opacity: 0
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

  function loadCSV(data, surpressEvents) {
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
      rows = parseCSV(data.csv, data.delimiter);
      loadRows(rows, function() {});
    } else {
      // surpressChangeEvents = false;
      // if (!surpressEvents) {
      //   emitChanged(true);
      // }
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
    gsheetEndRow.value = endRow || '';
    gsheetStartCol.value = startColumn || 0;
    gsheetEndCol.value = endColumn || 0;

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

  function addImportTab(tabOptions){
    importer.addImportTab(tabOptions);
  }

  function hideImportModal(){
    importModal.hide();
  }

  function showLiveData() {
    if (
      rows.length <= 1 ||
      confirm('This will clear your existing data. Continue?')
    ) {
      clear(true);

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

  function showGSheet() {
    if (
      rows.length <= 1 ||
      confirm('This will clear your existing data. Continue?')
    ) {
      clear(true);

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

  importer.on('ImportCSV', function(data) {
    highed.emit('UIAction', 'ImportCSV');
    loadCSV(data);
  });

  importer.on('ImportLiveData', function(data) {
    isInLiveDataMode = true;
    showLiveData();
    //loadLiveDataFromURL(data.url);
  });

  importer.on('ImportChartSettings', function(settings, format) {
    // Do something with the data here
    events.emit('ImportChartSettings', settings, format);
    importModal.hide();
  });

  highed.dom.on(gsheetCancelButton, 'click', function() {
    hideGSheet();
    events.emit('CancelDataInput');
  });

  highed.dom.on(liveDataCancelButton, 'click', function() {
    hideLiveData();
    events.emit('CancelDataInput');
  });

  highed.dom.on(liveDataLoadButton, 'click', function() {
    loadLiveDataFromURL(liveDataInput.value, liveDataIntervalInput.value, detailValue || 'columnsURL');
  });

  highed.dom.on(gsheetLoadButton, 'click', function() {
    events.emit('LoadGSheet', {
      googleSpreadsheetKey: gsheetID.value,
      googleSpreadsheetWorksheet: gsheetWorksheetID.value || false,
      dataRefreshRate: gsheetRefreshTime.value || false,
      enablePolling: (parseInt(gsheetRefreshTime.value) !== 0),
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
      });
    });
  });

  ////////////////////////////////////////////////////////////////////////////

  dropZone.innerHTML =
    'DROP CSV FILES HERE OR ON THE TABLE!<br/>' +
    '<span class="highed-dtable-drop-zone-small">...you can also paste CSV or Excel data into any cell</span>';

  table.cellPadding = 0;
  table.cellSpacing = 0;

  highed.dom.on(frame, 'scroll', function(e) {
    leftBar.style.top = -frame.scrollTop + 'px';
    topBar.style.left = -frame.scrollLeft + 'px';
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
        highed.dom.ap(table, colgroup, thead, tbody),
        tableTail,
        dropZone
      ),
      leftBar,
      topBar,
      highed.dom.ap(topLeftPanel, checkAll)
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
        'Google Spreadsheet'
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
          highed.dom.cr('div'),
          gsheetLoadButton,
          gsheetCancelButton
        ),
        highed.dom.cr(
          'div',
          '',
          [
            'When using Google Spreadsheet, Highcharts references the sheet directly.<br/><br/>',
            'This means that the published chart always loads the latest version of the sheet.<br/><br/>',

            'For more information on how to set up your spreadsheet, visit',
            '<a target="_blank" href="https://www.highcharts.com/cloud/import-data/how-to-set-up-a-google-spreadsheet-file">the documentation</a>.'
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
          highed.dom.cr('div'),
          liveDataLoadButton,
          liveDataCancelButton
        ),
        highed.dom.cr('div', '', [
          'Live data needs a url to your JSON data to reference.<br/><br/>',
          'This means that the published chart always loads the latest version of your data.<br/><br/>'
        ].join(' '))
      )
    )
  );

  function getRawCSV() {
    return rawCSV;
  }

  ////////////////////////////////////////////////////////////////////////////

  toolbar = highed.Toolbar(container, {
    additionalCSS: ['highed-dtable-toolbar']
  });

  toolbar.addButton({
    css: 'fa-plus-circle',
    tooltip: 'Add row',
    title: highed.L('dgAddRow'),
    click: function(e) {
      highed.emit('UIAction', 'BtnAddRow');
      addRowCtx.show(e.clientX, e.clientY);
    }
  });

  toolbar.addButton({
    css: 'fa-file-o',
    tooltip: 'Reset',
    title: highed.L('dgNewBtn'),
    click: function() {
      highed.emit('UIAction', 'BtnFlushData');
      if (confirm('Start from scratch?')) {
        highed.emit('UIAction', 'FlushDataConfirm');
        init();
        emitChanged();
      }
    }
  });

  toolbar.addButton({
    tooltip: 'Import Google Spreadsheet',
    title: 'Google Sheet',
    click: function() {
      highed.emit('UIAction', 'BtnGoogleSheet');
      showGSheet();
    }
  });

  toolbar.addButton({
    css: 'fa-floppy-o',
    title: highed.L('dgExportBtn'),
    tooltip: 'Download data',
    click: function(e) {
      highed.emit('UIAction', 'BtnExportData');
      saveCtx.show(e.clientX, e.clientY);
    }
  });

  toolbar.addButton({
    title: highed.L('dgImportBtn'),
    click: function() {
      highed.emit('UIAction', 'BtnImport');
      importModal.show();
      importer.resize();
    }
  });

  highed.dom.on(checkAll, 'change', function() {
    rows.forEach(function(row) {
      row.check(checkAll.checked);
    });
  });

  highed.dom.ap(
    toolbar.left,
    highed.dom.cr(
      'div',
      'highed-dtable-toolbar-label',
      highed.L('dgWithSelected') + ' '
    )
  );

  toolbar.addIcon(
    {
      css: 'fa-trash',
      title: 'Delete row(s)',
      click: function() {
        highed.emit('UIAction', 'BtnDeleteRow');

        if (!confirm(highed.L('dgDeleteRow'))) {
          return;
        }

        highed.emit('UIAction', 'DeleteRowConfirm');

        rows.forEach(function(row) {
          if (row.isChecked()) {
            row.destroy();
            emitChanged();
          }
        });
      }
    },
    'left'
  );

  // toolbar.addIcon(
  //   {
  //     css: 'fa-clone',
  //     title: 'Clone Rows',
  //     click: function() {
  //       importModal.show();
  //       importer.resize();
  //     }
  //   },
  //   'left'
  // );

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
    initGSheet: initGSheet,
    on: events.on,
    resize: resize,
    loadLiveDataFromURL: loadLiveDataFromURL,
    loadLiveDataPanel: loadLiveDataPanel
  };
};
