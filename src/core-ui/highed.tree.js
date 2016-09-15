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

highed.Tree = function (parent) {
    var container = highed.dom.cr('div', 'highed-tree'),
        selectedNode = false,
        events = highed.events()
    ;

    ///////////////////////////////////////////////////////////////////////////
    
    function build(tree, level, pnode) {

        level = level || 0;

        if (tree && tree.children) {
            Object.keys(tree.children).forEach(function (key) {
                var child = tree.children[key],
                    title = highed.dom.cr('div', 'parent-title', highed.uncamelize(key)),
                    icon = highed.dom.cr('div', 'exp-col-icon fa fa-plus'),
                    body = highed.dom.cr('div', 'parent-body'),
                    expanded = false
                ;

                if (child.entries.length === 0 && Object.keys(child.children).length === 0) {
                    return;
                }

                highed.dom.ap(pnode,
                    highed.dom.ap(highed.dom.cr('div', 'node'),
                        icon,
                        title
                    ),
                    body
                );

                highed.dom.style(body, {display: 'none'});

                function toggle() {
                    if (Object.keys(child.children).length === 0) {
                        return;
                    }

                    expanded = !expanded;
                    if (expanded) {
                        // highed.dom.style(icon, {
                        //     transform: 'rotate(90deg)',
                        //     left: '-5px'
                        // });
                        icon.className = 'exp-col-icon fa fa-minus';
                        highed.dom.style(body, {display: 'block'});
                    } else {
                        // highed.dom.style(icon, {
                        //     transform: '',
                        //     left: ''
                        // });
                        icon.className = 'exp-col-icon fa fa-plus';
                        
                        highed.dom.style(body, {display: 'none'});
                    }
                }

                highed.dom.on(icon, 'click', toggle);

                if (Object.keys(child.children).length === 0) {
                    icon.className = 'exp-col-icon fa fa-sliders'
                    // highed.dom.style(icon, {
                    //     display: 'none'
                    // });
                }

                highed.dom.on(title, 'click', function () {
                    if (Object.keys(child.children).length > 0) {
                       // toggle();
                        //return;
                    }

                    if (selectedNode) {
                        selectedNode.className = 'parent-title';
                    }
                    title.className = 'parent-title parent-title-selected';
                    selectedNode = title;

                    events.emit('Select', child, highed.uncamelize(key));
                });

                build(child, ++level, body);

            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(parent, container);

    ///////////////////////////////////////////////////////////////////////////
    
    return {
        on: events.on,
        build: function (tree) {
            build(tree, 0, container);
        }
    };
};