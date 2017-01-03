/******************************************************************************

Copyright (c) 2016, Highsoft

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

function parseCSV(inData, delimiter) {
    var isStr = Highcharts.isString,
        isArr = Highcharts.isArray,
        isNum = Highcharts.isNum,
        each = Highcharts.each,
        csv = inData || '',
        options = {
            delimiter: delimiter || ',',
            startRow: 0,
            endRow: Number.MAX_VALUE,
            startColumn: 0,
            endColumn: Number.MAX_VALUE
        },
        potentialDelimiters = {
            ',': true,
            ';': true
        },
        //The only thing CSV formats have in common..
        rows = (csv || '').replace(/\r\n/g, '\n').split('\n')
    ;

    /*
        Auto detecting delimiters
            - If we meet a quoted string, the next symbol afterwards 
              (that's not \s, \t) is the delimiter
            - If we meet a date, the next symbol afterwards is the delimiter

        Date formats
            - If we meet a column with date formats, check all of them to see if 
              one of the potential months crossing 12. If it does, we now know the
              format

        It would make things easier to guess the delimiter before
        doing the actual parsing.

    */

    each(rows, function (row, rowNumber) {
        var cols = [],
            inStr = false,
            i = 0,
            j,
            token = '',
            guessedDel,
            c,
            cp,
            cn
        ;

        function pushToken() {
            if (isNum(token)) {
                token = parseFloat(token);
            } else if (date.parse(token) !== NaN) {
                //We can look at the next token now and update the delimiter

            }

            cols.push(token);
            token = '';
        }

        for (i = 0; i < row.length; i++) {
            c = row[i];
            cn = row[i + 1]

            if (c === '"') {
                if (inStr) {
                    //Next symbol that's a potential delimiter 
                    //is THE delimiter if the CSV is well-formed
                    //We only do this on the first column.
                    if (!cols.length && rowNumber === 0) {
                        j = i;
                        while (!potentialDelimiters[guessedDel]) {
                            guessedDel = row[++j];
                        }
                        
                        if (guessedDel !== options.delimiter) {
                            options.delimiter = guessedDel;
                        }
                    }

                    pushToken();
                } else {
                    inStr = true;
                }

            //Everything is allowed inside quotes
            } else if (inStr) {
                token += c;
            
            //Check if we're done reading a token
            } else if (c === options.delimiter) {
                pushToken();
            
            //Append to token
            } else if (c !== ' ') {
                token += c;   
            }

            cp = c;
        }
    });
}


/** Data table
 *  @constructor
 *  @param {domnode} parent - the node to attach to
 *  @param {object} attributes - the properties
 */
highed.DataTable = function (parent, attributes) {
    var properties = highed.merge({
            checkable: true
        }, attributes),
        events = highed.events(),
        container = highed.dom.cr('div', 'highed-dtable-container'),
        frame = highed.dom.cr('div', 'highed-dtable-table-frame'),
        table = highed.dom.cr('table', 'highed-dtable-table'),
        thead = highed.dom.cr('thead', 'highed-dtable-head'),
        tbody = highed.dom.cr('tbody', 'highed-dtable-body'),
        colgroup = highed.dom.cr('colgroup'),
        leftBar = highed.dom.cr('div', 'highed-dtable-left-bar'),
        topBar = highed.dom.cr('div', 'highed-dtable-top-bar'),
        topLeftPanel = highed.dom.cr('div', 'highed-dtable-top-left-panel'),
        checkAll = highed.dom.cr('input'),
        mainInput = highed.dom.cr('input', 'highed-dtable-input'),
        mainInputCb = [],
        mainInputCloseCb = false,
        toolbar,
        importModal = highed.OverlayModal(false, {
            minWidth: 600,
            minHeight: 600
        }),
        importer = highed.DataImporter(importModal.body),
        rows = [],
        gcolumns = [],
        changeTimeout = false,
        monthNumbers = {
            'JAN': 1,
            'FEB': 2,
            'MAR': 3,
            'APR': 4,
            'MAY': 5,
            'JUN': 6,
            'JUL': 7,
            'AUG': 8,
            'SEP': 9,
            'OCT': 10,
            'NOV': 11,
            'DEC': 12
        },
        saveCtx = highed.ContextMenu([
            {
                title: 'Use "," Delimiter',
                click: function () {
                    highed.download('data.csv', toCSV(','), 'application/csv');
                }
            },
            {
                title: 'Use ";" Delimiter',
                click: function () {
                    highed.download('data.csv', toCSV(';'), 'application/csv');
                }
            }
        ]);
    ;    

    checkAll.type = 'checkbox';

    highed.dom.on(mainInput, 'click', function (e) {
        return highed.dom.nodefault(e);
    });

    ////////////////////////////////////////////////////////////////////////////

    function emitChanged() {
        //We use an interval to stop a crazy amount of changes to be 
        //emitted in succession when e.g. loading sets.
        window.clearTimeout(changeTimeout);
        changeTimeout = window.setTimeout(function () {
            events.emit('Change', getHeaderTextArr(), toData());
        }, 50);
    }

    function makeEditable(target, value, fn, keyup, close) {
        if (mainInputCb.length) {
            mainInputCb = mainInputCb.filter(function (fn) {
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

        mainInputCb.push(highed.dom.on(mainInput, 'keydown', function (e) {
           //(highed.isFn(fn) && fn(mainInput.value));
           if (highed.isFn(keyup)) {
                return keyup(e);
           } 
        }));

        mainInputCb.push(highed.dom.on(mainInput, 'keyup', function (e) {
           return (highed.isFn(fn) && fn(mainInput.value));        
        }));

        highed.dom.ap(target, mainInput);
        mainInput.focus();

    }

    ////////////////////////////////////////////////////////////////////////////

    function Column(row, colNumber, val) {
        var value = val || '',
            col = highed.dom.cr('td'),
            colVal = highed.dom.cr('div', 'highed-dtable-col-val', value),
            input = highed.dom.cr('input'),
            exports = {}
        ;

        function goLeft() {
            if (colNumber >= 1) {
                row.columns[colNumber - 1].focus();
            } else {
                //Go up to the last column
                if (row.number - 1 >= 0 ) {
                    rows[row.number - 1].columns[rows[row.number - 1].columns.length - 1].focus();
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
            if (row.number > 0 && 
                rows[row.number - 1].columns.length > colNumber
            ) {
                rows[row.number - 1].columns[colNumber].focus();
            }
        }

        function goBelow() {
            if (row.number < rows.length - 1 && 
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
                if (row.number === rows.length - 1) {// && colNumber === rows.columns.length - 1) {
                    addRow();
                    rows[row.number + 1].columns[0].focus();                    
                } else {
                    goBelow();                    
                }
                return highed.dom.nodefault(e);            
            }
        };

        function selContents() {
            input.setSelectionRange(0, input.value.length);
        }

        function focus() {      
            mainInput.className = 'highed-dtable-input';      
            makeEditable(
                col, 
                value,
                function (val) {
                    var changed = value !== val;
                    value = val;
                    colVal.innerHTML = val;
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
            highed.dom.ap(row.node,           
                highed.dom.ap(col, colVal)
            );            
        }

        highed.dom.on(col, 'click', focus);

        addToDOM();

        exports = {
            focus: focus,
            value: getVal,
            destroy: destroy,
            addToDOM: addToDOM
        };

        return exports;
    }

    ////////////////////////////////////////////////////////////////////////////

    function Row() {
        var columns = [],
            row = highed.dom.cr('tr'),
            leftItem = highed.dom.cr('div', 'highed-dtable-left-bar-row', ''),
            checker = highed.dom.cr('input'),
            checked = false,
            exports = {}
        ;

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
        }

        function isChecked() {
            return checked;
        }

        function check(state) {
            checker.checked = checked = state;
        }

        function destroy() {
            leftBar.removeChild(leftItem);
            tbody.removeChild(row);
            row.innerHTML = '';
            rows = rows.filter(function (b) {
                return b !== exports;
            });
        }

        function addToDOM(number) {
            exports.number = number;

            highed.dom.ap(tbody,
                row
            );

            highed.dom.ap(leftBar, 
                highed.dom.ap(leftItem,
                    checker
                )
            );            
        }

        function rebuildColumns() {
            row.innerHTML = '';
            columns.forEach(function (col, i) {
                col.addToDOM(i);
            });
        }

        function delCol(which) {
            if (which >= 0 && which < columns.length) {
                columns[which].destroy();       
                columns.splice(which, 1);
            }
        }

        highed.dom.on(checker, 'change', function () {
            checked = checker.checked;
        });

        addToDOM(rows.length);

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
            delCol: delCol
        };

        rows.push(exports);

        resize();

        return exports;
    }

    ////////////////////////////////////////////////////////////////////////////

    function rebuildRows() {
        rows.forEach(function (row, i) {
            row.addToDOM(i);
        });
    }

    function rebuildColumns() {
        rows.forEach(function (row) {
            row.rebuildColumns();
        });
    }  

    function init() {
        clear();

        for (var i = 0; i < 1; i++) {
            var r = Row();
        }
     
        for (var j = 0; j < 2; j++) {
            addCol('Column ' + (j + 1));
        }

        highed.dom.ap(colgroup, highed.dom.cr('col'));
        resize();
    }

    function updateColumns() {
        colgroup.innerHTML = '';
        topBar.innerHTML = '';

        gcolumns.forEach(function (col, i) {
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
            options = highed.dom.cr('div', 'highed-dtable-top-bar-col-options fa fa-chevron-down'),
            exports = {
                col: col,
                header: header,
                headerTitle: headerTitle,
                colNumber: gcolumns.length
            },
            mover = highed.Movable(moveHandle, 'X', false, false, {
                x: 20,
                y: 0
            }, true),
            ctx = highed.ContextMenu([
                {
                    title: highed.L('dgSortAsc'),
                    icon: 'sort-amount-asc',
                    click: function () {
                        sortRows(exports.colNumber, 'asc');
                    }     
                },
                {
                    title: highed.L('dgSortDec'),
                    icon: 'sort-amount-desc',
                    click: function () {
                        sortRows(exports.colNumber, 'desc');
                    }        
                },
                '-',
                {
                    title: highed.L('dgSortAscMonth'),
                    icon: 'sort-amount-asc',
                    click: function () {
                        sortRows(exports.colNumber, 'asc', true);
                    }  
                },
                {
                    title: highed.L('dgSortDecMonth'),
                    icon: 'sort-amount-desc',
                    click: function () {
                        sortRows(exports.colNumber, 'desc', true);
                    }
                },
                '-',
                {
                    title: highed.L('dgDelCol'),
                    icon: 'trash',
                    click: function () {
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
                    click: function () {
                        insertCol(exports.colNumber);
                    }
                },
                {
                    title: highed.L('dgInsColAfter'),
                    icon: 'plus',
                    click: function () {
                        insertCol(exports.colNumber + 1);
                    }
                }
            ]),
            ox
        ;

        ////////////////////////////////////////////////////////////////////////

        exports.addToDOM = function () {
            highed.dom.ap(colgroup, col);
            highed.dom.ap(topBar, 
                highed.dom.ap(header,
                    headerTitle,
                    options,
                    moveHandle
                )
            );
        };

        exports.destroy = function () {
            colgroup.removeChild(col);
            topBar.removeChild(header);

            gcolumns = gcolumns.filter(function (b) {
                return b !== exports;
            });
        };

        ////////////////////////////////////////////////////////////////////////
       
        exports.addToDOM();

        highed.dom.showOnHover(header, options);

        col.width = 140;
        highed.dom.style([col, header], {
            width: col.width + 'px'
        });

        mover.on('StartMove', function (x) {
            ox = x;

            highed.dom.style(document.body, {
                cursor: 'ew-resize'
            });
        });

        mover.on('Moving', function (x) {
            col.width = x;
            
            highed.dom.style([col, header], {
                width: x + 'px'
            });

            moveHandle.className = 'highed-dtable-resize-handle highed-dtable-resize-handle-moving';
        });

        mover.on('EndMove', function (x) {
 
            highed.dom.style(document.body, {
                cursor: ''
            });

            moveHandle.className = 'highed-dtable-resize-handle';
        });

        highed.dom.on(options, 'click', function (e) {
            ctx.show(e.clientX, e.clientY);
            return highed.dom.nodefault(e);
        });

        highed.dom.on(header, 'click', function (e) {

            //Ugly.
            mainInput.className = 'highed-dtable-input highed-dtable-input-header'; 

            //Spawn an edit box in the node
            makeEditable(
                header, 
                value, 
                function (val) {                
                    headerTitle.innerHTML = value = val;
                    emitChanged();
                },
                function (e) {
                    if (e.keyCode === 13) {
                        mainInput.className = 'highed-dtable-input';
                        header.removeChild(mainInput);
                    }
                }
            );
        });

        rows.forEach(function (row) {
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

        rows.sort(function (a, b) {
            var ad = a.columns[column].value(),
                bd = b.columns[column].value()
            ;

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
                return bd < ad ? -1 : (bd > ad ? 1 : 0);            
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
    function clear() {
        rows = rows.filter(function (row) {
            row.destroy();
            return false;
        });

        gcolumns = gcolumns.filter(function (row) {
            //Destroy col here
            return false;
        });

        tbody.innerHTML = '';
        leftBar.innerHTML = '';
        topBar.innerHTML = '';
        colgroup.innerHTML = '';

        emitChanged();
    }

    /** Add a new row
      * @memberof highed.DataTable
      */
    function addRow() {
        var r = Row();
        gcolumns.forEach(function () {
            r.addCol();
        });
        emitChanged();
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

            rows.forEach(function (row) {            
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
            tb = highed.dom.size(toolbar.container)
        ;

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
    function getHeaderTextArr() {
        return gcolumns.map(function (item) {
            return item.headerTitle.innerHTML.length ? 
                   item.headerTitle.innerHTML : 
                   null;
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
            data.push(getHeaderTextArr());
        }

        rows.forEach(function (row) {
            var rarr = [],
                hasData = false
            ;

            row.columns.forEach(function (col) {
                var v = col.value(),
                    d
                ;

                if (v) {
                    hasData = true;
                }

                if (quoteStrings && !highed.isNum(v) && highed.isStr(v)) {
                    v = '"' + v.replace(/\"/g, '\"') + '"';
                }

                if (highed.isNum(v)) {
                    v = parseFloat(v);
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

        gcolumns.forEach(function (item, i) {

            if (i > 0) {
                res.series.push({
                    name: item.headerTitle.innerHTML.length ? 
                          item.headerTitle.innerHTML : 
                          null,
                    data: []
                });
            }

        });

        rows.forEach(function (row, i) {
            row.columns.forEach(function (col, ci) {
                var v = col.value();

                if (!ci) {
                    res.categories.push(v);
                    return;
                }

                ci--;

                if (highed.isNum(v)) {
                    v = parseFloat(v);
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
    function toCSV(delimiter) {  
        delimiter = delimiter || ',';      
        return toData(true, true).map(function (cols) {
            return cols.join(delimiter);
        }).join('\n')
    }

    ////////////////////////////////////////////////////////////////////////////

    importer.on('ImportCSV', function (data) {
        highed.snackBar(highed.L('dgDataImporting'));
        importModal.hide();

        if (data && data.csv) {
            clear();

            //Super primitive parser - we need a better one.
            data.csv = data.csv.split('\n');
            data.csv.forEach(function (r, i) {
                var cols = r.split(','),
                    row 
                ;

                if (i) {
                    row = Row();
                }

                cols.forEach(function (c) {
                    if (i === 0) {
                        addCol(c);  
                    } else {
                        row.addCol(c);
                    }
                });
            });

            highed.dom.ap(colgroup, highed.dom.cr('col'));
        }
        highed.snackBar(highed.L('dgDataImported'));
        resize();
    });

    ////////////////////////////////////////////////////////////////////////////

    table.cellPadding = 0;
    table.cellSpacing = 0;

    highed.dom.on(frame, 'scroll', function (e) {
        leftBar.style.top = -frame.scrollTop + 'px';
        topBar.style.left = -frame.scrollLeft + 'px';
    });

    parent = highed.dom.get(parent);
    highed.dom.ap(parent,
        highed.dom.ap(container,
            highed.dom.ap(frame,
                highed.dom.ap(table,
                    colgroup,
                    thead,
                    tbody
                )
            ),
            leftBar,
            topBar,
            highed.dom.ap(topLeftPanel,
                checkAll
            )
        )
    );

    ////////////////////////////////////////////////////////////////////////////

    toolbar = highed.Toolbar(container, {
        additionalCSS: ['highed-dtable-toolbar']
    });

    toolbar.addButton({
        css: 'fa-plus-circle',
        tooltip: 'Add row',
        title: highed.L('dgAddRow'),
        click: addRow
    });

    toolbar.addButton({
        css: 'fa-file-o',
        tooltip: 'Reset',
        title: highed.L('dgNewBtn'),
        click: function () {
           if (confirm('Start from scratch?')) {
            init();            
           }
        }
    });

    toolbar.addButton({
        css: 'fa-floppy-o',
        title: highed.L('dgExportBtn'),
        tooltip: 'Download data',
        click: function (e) {        
            //console.log(toCSV());    
            saveCtx.show(e.clientX, e.clientY);
        }
    });
    
    toolbar.addButton({
        title: highed.L('dgImportBtn'),
        click: function () {
            importModal.show();
            importer.resize();
        }
    });

    highed.dom.on(checkAll, 'change', function () {
        rows.forEach(function (row) {
            row.check(checkAll.checked);
        });
    });

    highed.dom.ap(toolbar.left,
        highed.dom.cr(
            'div', 
            'highed-dtable-toolbar-label', 
            highed.L('dgWithSelected') + ' '
        )
    );

     toolbar.addIcon({
        css: 'fa-trash',
        click: function () {
            if (!confirm(highed.L('dgDeleteRow'))) {
                return;
            }

            rows.forEach(function (row) {
                if (row.isChecked()) {
                    row.destroy();
                }
            });
        }
    }, 'left');

     toolbar.addIcon({
        css: 'fa-clone',
        click: function () {
            importModal.show();
            importer.resize();
        }
    }, 'left');

    ////////////////////////////////////////////////////////////////////////////

    highed.ready(function () {
        init();
    });

    ////////////////////////////////////////////////////////////////////////////

    return {
        sortRows: sortRows,
        clear: clear,
        addRow: addRow,
        insCol: insertCol,
        delCol: delCol,
        toData: toData,
        toCSV: toCSV,
        toDataSeries: toDataSeries,
        getHeaderTextArr: getHeaderTextArr,
        on: events.on,
        resize: resize
    };
}