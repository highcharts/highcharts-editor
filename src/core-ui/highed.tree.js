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

/** Tree component
 *
 *  @example
 *  var tree = highed.Tree(document.body).build({
 *     //Tree data here   
 *  });
 * 
 *  @emits Select {object} - when a node is selected
 *
 *  @constructor
 *  @param parent {domnode} - the node to attach the tree to
 */
highed.Tree = function (parent) {
    var container = highed.dom.cr('div', 'highed-tree'),
        selectedNode = false,
        reselectFn = false,
        events = highed.events()
    ;

    ///////////////////////////////////////////////////////////////////////////

    function createNode(child, key, pnode, dataIndex, arrayHeader) {
        var title = highed.dom.cr('div', 'parent-title', child.title || highed.uncamelize(key)),
            icon = highed.dom.cr('div', 'exp-col-icon fa fa-plus'),
            body = highed.dom.cr('div', 'parent-body'),
            expanded = false,
            noInspectSelf = false
        ;

        if (!arrayHeader && child.entries.length === 0 && Object.keys(child.children).length === 0) {
            return;
        }

        child.dataIndex = dataIndex;

        highed.dom.ap(pnode,
            highed.dom.ap(highed.dom.cr('div', 'node'),
                icon,
                title
            ),
            body
        );

        highed.dom.style(body, {display: 'none'});

        function toggle() {
            if (!arrayHeader && Object.keys(child.children).length === 0) {
                return;
            }

            expanded = !expanded;
            if (expanded) {
                icon.className = 'exp-col-icon fa fa-minus';
                highed.dom.style(body, {display: 'block'});
            } else {
                icon.className = 'exp-col-icon fa fa-plus';                        
                highed.dom.style(body, {display: 'none'});
            }
        }

        highed.dom.on(icon, 'click', toggle);

        if (!arrayHeader && Object.keys(child.children).length === 0) {
            icon.className = 'exp-col-icon fa fa-sliders'
        }

        highed.dom.on(title, 'click', function () {
            if (arrayHeader || noInspectSelf) {
                return;
            }

            if (selectedNode) {
                selectedNode.className = 'parent-title';
            }

            title.className = 'parent-title parent-title-selected';
            selectedNode = title;

            reselectFn = function () {
                events.emit('Select', child, highed.uncamelize(key));
            };

            events.emit('Select', child, highed.uncamelize(key));
        });

        return body;
    }
    
    /** Build the tree
     *  @memberof highed.Tree
     *  @param tree {object} - the tree to display
     *    > children {object} - the children of the node
     *    > entries {array} - array of orphan children 
     */
    function build(tree, level, pnode, instancedData, dataIndex) {

        dataIndex = tree.dataIndex || dataIndex;

        if (tree.isInstancedArray) {

            //This requires some special handling. We actually need
            //access to instanced data to build it. 
            //What this means is that we need to create a sub-tree
            //for each of the elements in the instanced array.
            //Problem is we need to insert one element per. entry
            var arr = highed.getAttr(instancedData, tree.id, dataIndex),
                children = {}
            ;

            if (highed.isArr(arr)) {
                arr.forEach(function (data, i) {
                    children[tree.shortName + ' #' + (i + 1)] = {                        
                        children: tree.children,
                        entries: tree.entries,
                        dataIndex: i
                    };
                });

                return build(
                    {
                        children: children,
                        entries: []
                    }, 
                    ++level, 
                    createNode(tree, tree.shortName, pnode, dataIndex, true),
                    instancedData, 
                    dataIndex
                );  
            } else {
               // console.log('no elements for', tree.id);
            }                

            return;
        } 

        level = level || 0;

        // if (tree.shortName) {
        //     instancedData = instancedData[tree.shortName];

        //     if (highed.isArr(instancedData) && dataIndex >= 0) {
        //         instancedData = instancedData[dataIndex];
        //     }
        // }

        if (tree && tree.entries) {
            Object.keys(tree.entries).forEach(function (key) {
                var entry = tree.entries[key];
                entry.data = instancedData;
            });
        }

        if (tree && tree.children) {
            Object.keys(tree.children).forEach(function (key) {
                var child = tree.children[key],
                    title = highed.dom.cr('div', 'parent-title', child.title || highed.uncamelize(key)),
                    icon = highed.dom.cr('div', 'exp-col-icon fa fa-plus'),
                    body = highed.dom.cr('div', 'parent-body'),
                    expanded = false,
                    noInspectSelf = false
                ;

                //If the child is an instanced array, we should abort 
                if (child.isInstancedArray) {
                    return build(child, level, pnode, instancedData, dataIndex);
                }

                if (child.entries.length === 0 && Object.keys(child.children).length === 0) {
                    return;
                }

                child.dataIndex = dataIndex;
                child.data = instancedData;


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
                        icon.className = 'exp-col-icon fa fa-minus';
                        highed.dom.style(body, {display: 'block'});
                    } else {
                        icon.className = 'exp-col-icon fa fa-plus';                        
                        highed.dom.style(body, {display: 'none'});
                    }
                }

                highed.dom.on(icon, 'click', toggle);

                if (Object.keys(child.children).length === 0) {
                    icon.className = 'exp-col-icon fa fa-sliders'
                }

                highed.dom.on(title, 'click', function () {
                    if (noInspectSelf) {
                        return;
                    }

                    if (selectedNode) {
                        selectedNode.className = 'parent-title';
                    }

                    title.className = 'parent-title parent-title-selected';
                    selectedNode = title;

                    reselectFn = function () {
                        events.emit('Select', child, highed.uncamelize(key), dataIndex);
                    };

                    events.emit('Select', child, highed.uncamelize(key), dataIndex);
                });

                build(child, ++level, body, instancedData, dataIndex);
            });
        }
    }

    /** Reselect the currently selected node
     *  @memberof highed.Tree
     */
    function reselect() {
        if (selectedNode && highed.isFn(reselectFn)) {
            reselectFn();
        }
    }

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(parent, container);

    ///////////////////////////////////////////////////////////////////////////
    
    return {
        on: events.on,
        reselect: reselect,
        build: function (tree, data) {
            container.innerHTML = '';
            build(tree, 0, container, data, 0);
        }
    };
};