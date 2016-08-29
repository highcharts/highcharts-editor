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
        body = splitter.right
    ;

    ///////////////////////////////////////////////////////////////////////////

    function resize(w, h) {
        var bsize;
        
        tabs.resize(w, h);
        bsize = tabs.barSize();

        list.resize(w, h - bsize.h);
        splitter.resize(w, h - bsize.h - 10);
    }

    function selectGroup(group, table) {
        if (highed.isArr(group.options)) {
            table = highed.dom.cr('table', 'highed-customizer-table');

            highed.dom.ap(body, 
                highed.dom.cr('div', 'highed-customizer-table-heading', group.text),
                table
            );

            group.options.forEach(function (sub) {
                selectGroup(sub, table);
            });
        } else if (typeof group.id !== 'undefined') {          
            //highed.dom.ap(sub, highed.dom.cr('span', '', referenced[0].returnType));
            highed.dom.ap(table, 
                highed.InspectorField(
                    group.values ? 'options' : group.dataType, 
                    (owner.flatOptions[group.id] || group.defaults), 
                    {
                        title: group.text,
                        tooltip: group.tooltipText,
                        values: group.values   
                    },
                    function (newValue) {           
                        events.emit('PropertyChange', group.id, newValue);
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
        entry.forEach(selectGroup);
    });

    build();

    return {
        /* Listen to an event */
        on: events.on,
        resize: resize
    };
};