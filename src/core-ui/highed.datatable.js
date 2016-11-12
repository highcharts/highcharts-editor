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
        gcolumns = []
    ;    

    checkAll.type = 'checkbox';

    highed.dom.on(mainInput, 'click', function (e) {
        return highed.dom.nodefault(e);
    });

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

        mainInputCb.push(highed.dom.on(mainInput, 'keyup', function (e) {
           (highed.isFn(fn) && fn(mainInput.value));
           if (highed.isFn(keyup)) {
                return keyup(e);
           } 
        }));

        highed.dom.ap(target, mainInput);
        mainInput.focus();

    }

    function Column(row, colNumber, val) {
        var value = val || '',
            col = highed.dom.cr('td'),
            colVal = highed.dom.cr('div', 'highed-dtable-col-val', value),
            input = highed.dom.cr('input')
        ;


        function goLeft() {
            if (colNumber >= 1) {
                row.columns[colNumber - 1].focus();
            }   
        }

        function goRight() {
            if (colNumber < row.columns.length - 1) {
                row.columns[colNumber + 1].focus();
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
            } else if (e.keyCode === 39) {
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
                    value = val;
                    colVal.innerHTML = val;
                }, 
                handleKeyup
            );
                  
            row.select();  
        }

        highed.dom.on(col, 'click', focus);

        highed.dom.ap(row.node,           
            highed.dom.ap(col, colVal)
        );

        return {
            focus: focus
        };
    }

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

        function addToDOM() {
            highed.dom.ap(tbody,
                row
            );

            highed.dom.ap(leftBar, 
                highed.dom.ap(leftItem,
                    checker
                )
            );            
        }

        highed.dom.on(checker, 'change', function () {
            checked = checker.checked;
        });

        addToDOM();

        exports = {
            destroy: destroy,
            select: select,
            columns: columns,
            number: rows.length,
            addCol: addCol,
            isChecked: isChecked,
            check: check,
            node: row,
            addToDOM: addToDOM
        };

        rows.push(exports);

        resize();

        return exports;
    }

    function rebuildRows() {
        rows.forEach(function (row) {
            row.addToDOM();
        });
    }

    function clear() {
        tbody.innerHTML = '';
        leftBar.innerHTML = '';
        topBar.innerHTML = '';
        colgroup.innerHTML = '';
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

    function addRow() {
        var r = Row();
        gcolumns.forEach(function () {
            r.addCol();
        });
    }

    function addCol(value) {
        //The header columns control the colgroup
        var col = highed.dom.cr('col'),
            header = highed.dom.cr('span', 'highed-dtable-top-bar-col'),
            headerTitle = highed.dom.cr('div', '', value),
            moveHandle = highed.dom.cr('div', 'highed-dtable-resize-handle'),
            options = highed.dom.cr('div', 'highed-dtable-top-bar-col-options fa fa-chevron-down'),
            mover = highed.Movable(moveHandle, 'X', false, false, {
                x: 20,
                y: 0
            }, true),
            ctx = highed.ContextMenu([
                {
                    title: 'Sort Asccending',
                    icon: 'sort-amount-asc'     
                },
                {
                    title: 'Sort Decending',
                    icon: 'sort-amount-desc'     
                },
                '-',
                {
                    title: 'Sort as Month Names Asccending',
                    icon: 'sort-amount-asc'     
                },
                {
                    title: 'Sort as Month Names Decending',
                    icon: 'sort-amount-desc'     
                },
                '-',
                {
                    title: 'Delete Column',
                    icon: 'trash'
                },
                {
                    title: 'Clone Column',
                    icon: 'clone'
                },
                '-',
                {
                    title: 'Insert Column Before',
                    icon: 'plus'
                },
                {
                    title: 'Insert Column After',
                    icon: 'plus'
                }
            ]),
            ox
        ;

        highed.dom.showOnHover(header, options);

        col.width = 140;
        highed.dom.style([col, header], {
            width: col.width + 'px'
        });

        highed.dom.ap(colgroup, col);
        highed.dom.ap(topBar, 
            highed.dom.ap(header,
                headerTitle,
                options,
                moveHandle
            )
        );

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
            row.addCol();
        });

        gcolumns.push({
            col: col,
            header: header
        });
    }

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

    function toCSV() {

    }

    ////////////////////////////////////////////////////////////////////////////

    importer.on('ImportCSV', function (data) {
        highed.snackBar('Importing data');
        importModal.hide();

        if (data && data.csv) {
            clear();

            //Super primitive parser
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
        highed.snackBar('data imported');
        resize();
    });

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

    toolbar = highed.Toolbar(container, {
        additionalCSS: ['highed-dtable-toolbar']
    });

    toolbar.addIcon({
        css: 'fa-plus-circle',
        tooltip: 'Add row',
        click: addRow
    });

    toolbar.addIcon({
        css: 'fa-undo',
        tooltip: 'Add row',
        click: function () {
           if (confirm('Start from scratch?')) {
            init();            
           }
        }
    });

    toolbar.addIcon({
        css: 'fa-upload',
        tooltip: 'Import data',
        click: function () {
            importModal.show();
            importer.resize();
        }
    });

    toolbar.addIcon({
        css: 'fa-download',
        tooltip: 'Download data',
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
        highed.dom.cr('div', 'highed-dtable-toolbar-label', 'With Selected rows: ')
    );

     toolbar.addIcon({
        css: 'fa-trash',
        click: function () {
            if (!confirm('Really delete the selected rows?')) {
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

    init();

    ////////////////////////////////////////////////////////////////////////////

    return {
        on: events.on,
        resize: resize
    };
}