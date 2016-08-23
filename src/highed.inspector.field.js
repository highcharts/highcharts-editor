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
            string: function () {
                var input = highed.dom.cr('input', 'highed-field-input');

                input.value = value;

                highed.dom.on(input, 'change', function () {
                    if (highed.isFn(fn)) {
                        fn(input.value);
                    }
                });

                return input;
            },
            number: function () {
                return fields.string();             
            },
            range: function () {
                return fields.string();             
            },
            boolean: function () {
                var input = highed.dom.cr('input');             
                input.type = 'checkbox';

                input.checked = highed.toBool(value);

                highed.dom.on(input, 'change', function () {
                    if (highed.isFn(fn)) {
                        fn(input.checked);
                    }
                });

                return input;
            },
            color: function () {
                var box = highed.dom.cr('div', 'highed-field-colorpicker'); 

                function update(col) {
                    box.innerHTML = col;
                    highed.dom.style(box, {
                        background: col,
                        color: highed.getContrastedColor(col)
                    });
                }           

                highed.dom.on(box, 'click', function (e) {
                    highed.pickColor(e.clientX, e.clientY, value, function (col) {
                        update(col);
                        if (highed.isFn(fn)) {
                            fn(col);
                        }
                    });
                });

                update(value);

                return box;
            },
            font: function () {
                return fields.string();             

            },
            configset: function () {
                return fields.string();             
                
            },
            cssobject: function () {
                var picker = highed.FontPicker(fn, value);
                return picker.container;
            },
            options: function () {
                var options = highed.dom.cr('select', 'highed-field-select');

                highed.dom.options(options, properties.values);

                highed.dom.on(options, 'change', function () {
                    if (highed.isFn(fn)) {
                        fn(highed.dom.val(options));
                    }
                });

                return options;
            },
            array: function () {
                var container = highed.dom.cr('div'),
                    add = highed.dom.cr('span', 'highed-field-array-add fa fa-plus', ''),
                    itemsNode = highed.dom.cr('div', 'highed-inline-blocks'),
                    items = {},
                    itemCounter = 0
                ;

                function addItem(col) {
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
                        addItem('#000');
                    });

                    if (highed.isArr(value)) {
                        value.forEach(addItem);
                    }
                }

                highed.dom.ap(container, itemsNode, add);

                return container;
            }
        },
        help = highed.dom.cr('span', 'highed-icon fa fa-question-circle')
    ;

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