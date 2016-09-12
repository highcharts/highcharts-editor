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

highed.ChartCustomizer = function (parent, owner) {
    var events = highed.events(),
        tabs = highed.TabControl(parent, true),
        simpleTab = tabs.createTab({title: 'SIMPLE'}),
        advancedTab = tabs.createTab({title: 'ADVANCED'}),
        
        splitter = highed.HSplitter(simpleTab.body, {leftWidth: 30}),
        list = highed.List(splitter.left),
        body = splitter.right,

        advSplitter = highed.HSplitter(advancedTab.body, {leftWidth: 30}),
        advBody = advSplitter.right,
        advTree = highed.Tree(advSplitter.left),

        flatOptions = {}
    ;

    ///////////////////////////////////////////////////////////////////////////

    function resize(w, h) {
        var bsize;
        
        tabs.resize(w, h);
        bsize = tabs.barSize();

        list.resize(w, h - bsize.h);
        splitter.resize(w, h - bsize.h - 10);
    }

    function init(foptions) {
        flatOptions = foptions || {};
    }

    function buildBody(entry) {

    }

    function selectGroup(group, table, options, detailIndex) {
        var master, vals;

        options = options || flatOptions;

        if (highed.isArr(group.options)) {
            table = highed.dom.cr('table', 'highed-customizer-table');

            highed.dom.ap(body, 
                highed.dom.cr('div', 'highed-customizer-table-heading', group.text)
            );

            if (group.controlledBy) {
                master = highed.dom.cr('select', 'highed-box-size highed-stretch');
            
                if (highed.isStr(group.controlledBy.options)) {
                    vals = highed.getAttr(options, group.controlledBy.options);

                    if (highed.isArr(vals)) {
                        if (vals.length === 0) {
                            highed.dom.ap(body, highed.dom.cr('i', '', 'No data to display..'));
                            return;
                        }

                        highed.dom.options(master,
                            vals.map(function (t) {
                                return group.controlledBy.optionsTitle ? t[group.controlledBy.optionsTitle] : t;
                            })
                        );  

                        highed.dom.on(master, 'change', function () {
                            detailIndex = master.selectedIndex;

                            table.innerHTML = '';

                            group.options.forEach(function (sub) {
                                selectGroup(sub, table, options, detailIndex);
                            });
                        });

                        highed.dom.ap(body, master);               
                        detailIndex = 0;
                    } else {
                        return;
                    }
                }
            } 

            highed.dom.ap(body, table);

            group.options.forEach(function (sub) {
                selectGroup(sub, table, options, detailIndex);
            });
                   
        } else if (typeof group.id !== 'undefined') {          
            //highed.dom.ap(sub, highed.dom.cr('span', '', referenced[0].returnType));
            highed.dom.ap(table, 
                highed.InspectorField(
                    group.values ? 'options' : group.dataType, 
                    (highed.getAttr(options, group.id, detailIndex) || group.defaults), 
                    {
                        title: group.text,
                        tooltip: group.tooltipText,
                        values: group.values,
                        custom: group.custom,
                        attributes: group.attributes || []   
                    },
                    function (newValue) {        
                        events.emit('PropertyChange', group.id, newValue, detailIndex);
                    }
                )
            );
        }
    }

    function build() {
        Object.keys(highed.meta.optionsExtended.options).forEach(function (key) {
            list.addItem({
                id: key,
                title: key
            });
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    
    list.on('Select', function (id){
        var entry = highed.meta.optionsExtended.options[id];
        body.innerHTML = '';
        entry.forEach(function (thing) {
            selectGroup(thing);
        });
    });

    advTree.on('Select', function (item, selected) {
        var table = highed.dom.cr('table', 'highed-customizer-table');
        advBody.innerHTML = '';

        item.entries.forEach(function (entry) {
            highed.dom.ap(table,
                highed.InspectorField(
                    entry.values ?  'options' : (entry.dataType || 'string'), 
                    (highed.getAttr(flatOptions, entry.id)  || entry.defaults), 
                    {
                        title: highed.uncamelize(entry.shortName),
                        tooltip: entry.description,
                        values: entry.values,
                        custom: {},
                        attributes: entry.attributes || []
                    },
                    function (newValue) {           
                        events.emit('PropertyChange', entry.id, newValue);
                    }
                )
            );
        });

        highed.dom.ap(advBody, 
            highed.dom.cr('div', 'highed-customizer-table-heading', selected),
            table
        );
    });

    build();

    if (highed.isNull(highed.meta.optionsAdvanced)) {
        advancedTab.hide();
    } else {
        advTree.build(highed.meta.optionsAdvanced);        
    }

    return {
        /* Listen to an event */
        on: events.on,
        resize: resize,
        init: init
    };
};