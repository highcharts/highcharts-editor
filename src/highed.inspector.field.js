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

/* An editable field
 * @type - the type of widget to use
 * @value - the current value of the field
 * @properties - the properties for the widget
 * @fn - the function to call when the field is changed
 * @returns a DOM node containing the field + label
 */
highed.InspectorField = function (type, value, properties, fn) {
    var 
        fields = {
            string: function (val, callback) {
                var input = highed.dom.cr('input', 'highed-field-input');

                highed.dom.on(input, 'change', function () {
                    tryCallback(callback, input.value);
                });

                input.value = val || value;
                
                return input;
            },
            number: function (val, callback) {
                return fields.string(val, callback);             
            },
            range: function (val, callback) {
                return fields.string(val, callback);             
            },
            boolean: function (val, callback) {
                var input = highed.dom.cr('input');             
                input.type = 'checkbox';

                input.checked = highed.toBool(val || value);

                highed.dom.on(input, 'change', function () {                    
                    tryCallback(callback, input.checked);
                });

                return input;
            },
            color: function (val, callback) {
                var box = highed.dom.cr('div', 'highed-field-colorpicker'); 

                function update(col, callback) {
                    box.innerHTML = col;
                    highed.dom.style(box, {
                        background: col,
                        color: highed.getContrastedColor(col)
                    });
                }           

                highed.dom.on(box, 'click', function (e) {
                    highed.pickColor(e.clientX, e.clientY, value, function (col) {
                        update(col);
                        tryCallback(callback, col);
                    });
                });

                update(val || value);

                return box;
            },
            font: function (val, callback) {
                return fields.string(val, callback);             

            },
            configset: function (val, callback) {
                return fields.string(val, callback);              
            },
            cssobject: function (val, callback) {
                var picker = highed.FontPicker(callback || fn, val || value);
                return picker.container;
            },
            options: function (val, callback) {
                var options = highed.dom.cr('select', 'highed-field-select');

                highed.dom.options(options, properties.values);

                highed.dom.on(options, 'change', function () {                    
                    tryCallback(callback, highed.dom.val(options));
                });

                return options;
            },
            array: function () {
                var container = highed.dom.cr('div'),
                    add = highed.dom.cr('span', 'highed-field-array-add fa fa-plus', ''),
                    itemsNode = highed.dom.cr('div', 'highed-inline-blocks'),
                    items = {},
                    itemCounter = 0,
                    itemTable = highed.dom.cr('table', 'highed-field-table')
                ;         

                function addCompositeItem(val, supressCallback) {
                    var item,
                        rem = highed.dom.cr('span', 'highed-icon fa fa-trash'),
                        row = highed.dom.cr('tr'),
                        id = ++itemCounter
                    ;

                    function processChange(newVal) {
                        items[id].value = newVal;
                        doEmitCallback();
                    }

                    function doEmitCallback() {
                        if (highed.isFn(fn)) {
                            fn(Object.keys(items).map(function (key) {
                                return items[key].value;  
                            }));
                        }    
                    }

                    item = fields[properties.subType] ? 
                           fields[properties.subType](val, processChange) : 
                           fields.string(val, processChange);
                    
                    highed.dom.ap(itemTable, 
                        highed.dom.ap(row,
                            highed.dom.ap(highed.dom.cr('td'),
                                item
                            ),
                            highed.dom.ap(highed.dom.cr('td'),
                                rem
                            )
                        )
                    );      

                    highed.dom.on(rem, 'click', function (e) {
                        delete items[id];
                        itemTable.removeChild(row);

                        doEmitCallback();

                        e.cancelBubble = true;
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        return false;
                    });

                    items[id] = {
                        id: id,
                        row: row,
                        value: val
                    };

                    if (!supressCallback) {
                        processChange();
                    }

                }       

                function addColorItem(col) {
                    var thing = highed.dom.cr('span', 'highed-field-colorpicker-compact', '&nbsp;'),
                        rem = highed.dom.cr('span', 'highed-field-array-remove fa fa-trash'),
                        id = ++itemCounter
                    ;

                    function update(col) {
                        highed.dom.style(thing, {
                            background: col
                        });

                        items[id] = col;
                        doCallback();
                    }

                    function doCallback() {
                        if (highed.isFn(fn)) {
                            fn(Object.keys(items).map(function (key) {
                                return items[key];  
                            }));
                        }
                    }

                    highed.dom.on(thing, 'click', function (e) {
                        highed.pickColor(e.clientX, e.clientY, 'col', function (col) {
                            update(col);
                        });
                    });

                    highed.dom.on(rem, 'click', function (e) {
                        delete items[id];
                        itemsNode.removeChild(thing);
                        doCallback();

                        e.cancelBubble = true;
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        return false;
                    });

                    update(col);

                    highed.dom.showOnHover(thing, rem);

                    highed.dom.ap(itemsNode, highed.dom.ap(thing, rem));
                }
                
                if (properties.subType === 'color') {
                    highed.dom.on(add, 'click', function () {
                        addColorItem('#000');
                    });

                    if (highed.isArr(value)) {
                        value.forEach(addColorItem);
                    }
                } else {
                    highed.dom.ap(container, itemTable);

                    highed.dom.on(add, 'click', function () {
                        addCompositeItem();
                    });
                }

                highed.dom.ap(container, itemsNode, add);

                return container;
            }
        },
        help = highed.dom.cr('span', 'highed-icon fa fa-question-circle')
    ;

    function tryCallback(cb, val) {
        cb = cb || fn;
        if (highed.isFn(cb)) {
            cb(val);
        }
    }

    if (highed.isNull(value)) {
        value = '';
    }

    if (type.indexOf('array') === 0) {
        properties.subType = type.substr(6, type.length - 7);
        type = 'array';
    }

    highed.dom.on(help, 'mouseover', function (e) {
        highed.Tooltip(e.clientX, e.clientY, properties.tooltip);
    });

    return highed.dom.ap(
        highed.dom.ap(highed.dom.cr('tr'),
            highed.dom.ap(highed.dom.cr('td'),
                highed.dom.cr('span', '', properties.title)
            ),
            highed.dom.ap(highed.dom.cr('td'),
                fields[type] ? fields[type]() : fields.string()
            ),
            highed.dom.ap(highed.dom.cr('td'),
                //highed.dom.cr('span', 'highed-field-tooltip', properties.tooltip) 
                help
            )
        )
    );
};