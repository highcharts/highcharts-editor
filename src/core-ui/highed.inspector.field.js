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

/** An editable field
 *
 *  Creates a table row with thre columns:
 *    - label
 *    - widget
 *    - help icon
 *  @todo This needs a proper cleaning now that the requirements are set.
 *  @example
 *  //Create a table, append to body, add a color picker to it.
 *  highed.dom.ap(document.body,
 *      highed.dom.ap(highed.dom.cr('table'),
 *          highed.InspectorField('color', '#FFF', {
 *              title: 'Set the color!'  
 *          }, function (newValue) {
 *              highed.dom.style(document.body, {
 *                  backgroundColor: newValue   
 *              });
 *          })
 *      )
 *  );
 *
 *  @param type {enum} - the type of widget to use
 *    > string
 *    > number
 *    > range
 *    > boolean
 *    > color
 *    > font
 *    > options
 *    > object
 *  @param value {anything} - the current value of the field
 *  @param properties {object} - the properties for the widget
 *  @param fn {function} - the function to call when the field is changed
 *     > {anything} - the changed value
 *  @param nohint {boolean} - if true, the help icon will be skipped
 *  @param fieldID {anything} - the id of the field
 *  @returns {domnode} - a DOM node containing the field + label wrapped in a tr
 */
highed.InspectorField = function (type, value, properties, fn, nohint, fieldID) {
    var createReset = function (resetTo, callback) {
            var node = highed.dom.cr('div', 'highed-field-reset fa fa-undo');

            highed.dom.on(node, 'click', function () {
                if (highed.isFn(callback)) {
                    callback(properties.defaults || resetTo);
                }
            });

            return node;
        },
        fields = {
            string: function (val, callback) {
                var input = highed.dom.cr('input', 'highed-field-input', '', fieldID),
                    reset = createReset(properties.defaults || val || value, function (v) {
                        input.value = val = v;
                        tryCallback(callback, v);
                    })
                ;

                highed.dom.on(input, 'change', function (e) {
                    tryCallback(callback, input.value);
                    e.cancelBubble = true;          
                });

                input.value = val || value;
                
                return highed.dom.ap(highed.dom.cr('div', 'highed-field-container'), reset, input);
            },
            number: function (val, callback) {
                var input = highed.dom.cr('input', 'highed-field-input', '', fieldID),
                    reset = createReset(properties.defaults || val || value, function (v) {                        
                        input.value = val = v;
                        tryCallback(callback, parseFloat(v));
                    })
                ;

                input.type = 'number';

                if (!highed.isNull(properties.custom)) {
                    input.step = properties.custom.step;
                    input.min = properties.custom.minValue;
                    input.max = properties.custom.maxValue;                    
                }

                highed.dom.on(input, 'change', function () {
                    tryCallback(callback, parseFloat(input.value));
                });

                input.value = val || value;
                
                return highed.dom.ap(highed.dom.cr('div', 'highed-field-container'), reset, input);
            },
            range: function (val, callback) {
                var slider = highed.Slider(false, {
                    min: properties.custom.minValue,
                    max: properties.custom.maxValue,
                    step: properties.custom.step,
                    resetTo: val || value
                });

                slider.on('Change', function (v) {
                    tryCallback(callback, v);
                });

                return slider.container;
            },
            boolean: function (val, callback) {
                var input = highed.dom.cr('input', '', '', fieldID),
                    reset = createReset(properties.defaults || val || value, function (v) {                        
                        input.checked = val = highed.toBool(v);
                        tryCallback(callback, v);
                    })
                ;

                input.type = 'checkbox';

                input.checked = highed.toBool(val || value);

                highed.dom.on(input, 'change', function () {                    
                    tryCallback(callback, input.checked);
                });

                return highed.dom.ap(highed.dom.cr('div', 'highed-field-container'), reset, input);
            },
            color: function (val, callback) {
                var box = highed.dom.cr('div', 'highed-field-colorpicker', '', fieldID),
                    reset = highed.dom.cr('div', 'highed-field-reset fa fa-undo'),
                    resetTo = val || value
                ; 

                function update(col, callback) {
                    if (col && col !== 'null' && col !== 'undefined' && typeof col !== 'undefined') {
                        box.innerHTML = col;                        
                    } else {
                        box.innerHTML = 'auto';
                        col = '#FFFFFF';
                    }

                    highed.dom.style(box, {
                        background: col,
                        color: highed.getContrastedColor(col)
                    });
                }           

                highed.dom.on(box, 'click', function (e) {
                    highed.pickColor(e.clientX, e.clientY, val || value, function (col) {
                        val = col;
                        update(col);
                        tryCallback(callback, col);
                    });
                });

                highed.dom.on(reset, 'click',function () {
                    val = resetTo;
                    update(resetTo);
                    tryCallback(callback, resetTo);
                });

                update(val || value);

                return highed.dom.ap(highed.dom.cr('div', 'highed-field-container'), box, reset);
            },
            font: function (val, callback) {                
                 return  fields.string(val, callback)                    
            },
            configset: function (val, callback) {
                return fields.string(val, callback);              
            },
            cssobject: function (val, callback) {
                var picker = highed.FontPicker(callback || fn, val || value),
                    reset = createReset(properties.defaults || val || value, function (v) {                        
                        val = v;
                        picker.set(val);
                        tryCallback(callback, v);
                    })
                ;

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'), 
                    reset,
                    picker.container
                );     
            },
            options: function (val, callback) {
                var ddown = highed.DropDown(),
                    reset = createReset(properties.defaults || val || value, function (v) {                        
                        val = v;
                        ddown.selectById(val);
                        tryCallback(callback, parseFloat(v));
                    })
                ;

                if (highed.isStr(properties.values)) {
                    try {
                        properties.values = JSON.parse(properties.values);
                    } catch (e) {
                        properties.values = properties.values.split(' ');
                    }
                }

                ddown.addItem({title: 'auto', id: properties.defaults});
                ddown.addItems(properties.values);

                ddown.selectById(val || value);
                
                ddown.on('Change', function (selected) {
                    tryCallback(callback, selected.id());
                });

                return highed.dom.ap(highed.dom.cr('div', 'highed-field-container'), ddown.container, reset);
            },
            object: function (val, callback) {
                //Create a sub-table of options
                var stable = highed.dom.cr('table', 'highed-customizer-table', '', fieldID),
                    wasUndefined = highed.isNull(val || value)
                ;

                val = val || {};

                if (properties && highed.isArr(properties.attributes)) {
                    properties.attributes.forEach(function (attr) {

                        val[attr.name] = val[attr.name] || attr.defaults || (attr.dataType.indexOf('object') >= 0 ? {} : '');

                        attr.title = highed.uncamelize(attr.title);

                        highed.dom.ap(stable, 
                            highed.InspectorField(
                                attr.dataType, 
                                val[attr.name] || attr.default, 
                                attr, 
                                function (nval) {
                                    val[attr.name] = nval;
                                    tryCallback(callback, val);
                                }
                            )
                        );
                    });
                }

                if (wasUndefined) {
                    tryCallback(callback, val);
                }

                return stable;
            },
            array: function () {
                var container = highed.dom.cr('div', '', '', fieldID),
                    add = highed.dom.cr('span', 'highed-field-array-add fa fa-plus', ''),
                    itemsNode = highed.dom.cr('div', 'highed-inline-blocks'),
                    items = {},
                    itemCounter = 0,
                    itemTable = highed.dom.cr('table', 'highed-field-table')
                ;         

                if (highed.isStr(value)) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {

                    }
                }

                function addCompositeItem(val, supressCallback) {
                    var item,
                        rem = highed.dom.cr('span', 'highed-icon fa fa-trash'),
                        row = highed.dom.cr('tr'),
                        id = ++itemCounter
                    ;

                    function processChange(newVal) {
                        if (newVal) {
                            items[id].value = newVal;
                            doEmitCallback();                            
                        }
                    }

                    function doEmitCallback() {
                        if (highed.isFn(fn)) {
                            fn(Object.keys(items).map(function (key) {
                                return items[key].value;  
                            }));
                        }    
                    }

                    items[id] = {
                        id: id,
                        row: row,
                        value: val
                    };

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

                    if (!supressCallback) {
                        processChange();
                    }
                }       

                highed.dom.ap(container, itemTable);

                highed.dom.on(add, 'click', function () {
                    addCompositeItem();
                });

          

                if (highed.isArr(value)) {
                    value.forEach(function (item) {
                        addCompositeItem(item, true);
                    });
                }

                highed.dom.ap(container, itemsNode, add);

                return container;
            }
        },
        help = highed.dom.cr('span', 'highed-icon highed-field-help fa fa-question-circle'),
        helpTD = highed.dom.cr('td', 'highed-customizer-table-help'),
        widgetTD = highed.dom.cr('td', 'highed-field-table-widget-column'),
        titleCol = highed.dom.cr('td'),
        typeIndicator = highed.dom.cr('span', 'highed-customize-type')
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

    if (type === 'cssobject') {
        // properties = properties || {};
        // properties.attributes = [
        //     {name: 'x', title: 'x', title: 'X', values: '0', dataType: 'number'}

        // ];
        // type = 'object';
    }

    //Choose a type
    if (type && type.indexOf('|') >= 0) {
        type = type.indexOf('object') >= 0 ? 'object' : type.split('|')[0];
    }

    if (!highed.isNull(properties.custom) && 
        !highed.isNull(properties.custom.minValue) && 
        !highed.isNull(properties.custom.maxValue) && 
        !highed.isNull(properties.custom.step)) {
        type = 'range';
    }

    if (type && type.indexOf('array') === 0) {
        properties.subType = type.substr(6, type.length - 7);
        type = 'array';
    }

    if (type === 'object') {
        if ((!properties.attributes || !properties.attributes.length) && properties.defaults) {
            properties.attributes = [];

            //There's no attributes but it's an object.
            //Check if there are default values we can use 
            //to figure out the structure.
            properties.defaults = JSON.parse(properties.defaults);
            Object.keys(properties.defaults).forEach(function (k) {
                properties.attributes.push({
                    id: k,
                    title: k,
                    dataType: highed.isNum(properties.defaults[k]) ? 'number' : 'string',
                    default: properties.defaults[k],
                    tooltip: ''
                });
            });
        }
        nohint = true;
    }


    highed.dom.on([help], 'mouseover', function (e) {
        highed.Tooltip(e.clientX, e.clientY, properties.tooltip || properties.tooltipText);
    });      

    highed.dom.on(help, 'touchstart', function () {
        highed.Tooltip(0, 0, properties.tooltip || properties.tooltipText, true);
    });

    if (nohint) {
        highed.dom.style(help, {display: 'none'});
        widgetTD.colSpan = 2;
    }

    typeIndicator.className += ' highed-customize-type-' + type;

    return highed.dom.ap(
        highed.dom.ap(highed.dom.cr('tr'),
            highed.dom.ap(titleCol,
                highed.dom.cr('span', 'highed-customize-field-label', properties.title),
                typeIndicator
            ),
            highed.dom.ap(widgetTD,
                fields[type] ? fields[type]() : fields.string()
            ),
            (!nohint ? 
             highed.dom.ap(helpTD,
                 //highed.dom.cr('span', 'highed-field-tooltip', properties.tooltip) 
                 help
            ) : false)
        )
    );
};
