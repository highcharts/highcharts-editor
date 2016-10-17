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
 *  For an example of formatting, build the editor with `gulp with-advanced`,
 *  and look in `src/meta/highed.options.advanced.js`.
 * 
 *  @example
 *  var tree = highed.Tree(document.body).build({
 *      
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
        events = highed.events(),
        expands = {},
        expandState = {},
        selectedID = false
    ;

    ///////////////////////////////////////////////////////////////////////////

    function createNode(child, key, pnode, instancedData, dataIndex, arrayHeader, alwaysExpand) {
        var title = highed.dom.cr('div', 'parent-title', child.title || highed.uncamelize(key)),
            icon = highed.dom.cr('div', 'exp-col-icon fa fa-folder-o'),
            body = highed.dom.cr('div', 'parent-body'),
            node = highed.dom.cr('div', 'node', '', (child.id || key)),

            rightIcons = highed.dom.cr('div', 'right-icons'),
            remIcon = highed.dom.cr('div', 'highed-icon fa fa-minus-square-o'),
            addIcon = highed.dom.cr('div', 'highed-icon fa fa-plus-square-o'),

            expanded = false,
            noInspectSelf = false
        ;

        if (!key && !child.title) {
            return;
        }

        child.dataIndex = child.dataIndex || dataIndex;

        if (!arrayHeader && child.entries.length === 0 && Object.keys(child.children).length === 0) {
           // return;
        }

        if (arrayHeader || child.isArrayParent) {
            highed.dom.ap(node, rightIcons);

            if (arrayHeader) {
                highed.dom.ap(rightIcons,
                    addIcon
                );
            }

            if (child.isArrayParent) {
                highed.dom.ap(rightIcons,
                    remIcon
                );
            }

            highed.dom.on(remIcon, 'click', function () {
                if (confirm('Really delete the entry?')) {
                    arr = highed.getAttr(instancedData, child.id, dataIndex);
                    
                    arr = arr.filter(function (b, i) {
                        return i !== dataIndex;
                    });

                    highed.setAttr(instancedData, child.id, arr);  

                    events.emit('DataUpdate', child.id, arr);
                    events.emit('Dirty');
                }
            });

            highed.dom.on(addIcon, 'click', function () {
                arr = highed.getAttr(instancedData, child.id, dataIndex);
                if (highed.isArr(arr)) {
                    arr.push({});
                    highed.setAttr(instancedData, child.id, arr);                       
                } else {
                    highed.setAttr(instancedData, child.id, [{}]);
                }
                if (highed.isFn(reselectFn)) {
                    reselectFn();
                }
                expandTo(child.id);
                events.emit('Dirty');
            });
        }

        //child.dataIndex = dataIndex;

        highed.dom.ap(pnode,
            highed.dom.ap(node,
                icon,
                title
            ),
            body
        );

        highed.dom.style(body, {display: 'none'});

        function select() {
            if (selectedNode) {
                selectedNode.className = 'parent-title';
            }

            title.className = 'parent-title parent-title-selected';
            selectedNode = title;
            

            reselectFn = function () {
                events.emit('Select', child, highed.uncamelize(key), child.dataIndex);
            };

            events.emit('Select', child, highed.uncamelize(key), child.dataIndex);
        }

        function pushExpandState() {
            var id = (child.id || key).replace(/\-\-/g, '.').replace(/\-/g, '.');

            if (child.isArrayParent) {
                id += ':' + child.dataIndex;
            }

            expandState[id] = expanded;  
            //We actually need to check everything starting with this id
            if (!expanded) {
                Object.keys(expandState).forEach(function (key) {
                    if (key.indexOf(id) === 0) {
                        expandState[key] = false;
                    }
                });
            }
        }

        function expand() {            
            if (!expanded && Object.keys(child.children).length) {
                icon.className = 'exp-col-icon fa fa-folder-open-o';
                highed.dom.style(body, {display: 'block'});
                expanded = true;      
                pushExpandState();
            } 
            //Trigger a selection
            select();        
        }

        function toggle() {
            if (alwaysExpand || (!arrayHeader && Object.keys(child.children).length === 0)) {
                return;
            }

            expanded = !expanded;
            if (expanded) {
                icon.className = 'exp-col-icon fa fa-folder-open-o';
                highed.dom.style(body, {display: 'block'});
            } else {
                icon.className = 'exp-col-icon fa fa-folder-o';                        
                highed.dom.style(body, {display: 'none'});
            }

            pushExpandState();                      
        }

        if (alwaysExpand) {

            expand();
        }

        if (arrayHeader) {
            icon.className = 'exp-col-icon fa fa-list-ul';
        }

        if (child.isArrayParent) {
            expands[(child.id || key).replace(/\-\-/g, '.').replace(/\-/g, '.') + ':' + child.dataIndex] = expand;                        
        } else {
            expands[(child.id || key).replace(/\-\-/g, '.').replace(/\-/g, '.')] = expand;            
        }        

        highed.dom.on(icon, 'click', toggle);

        if (child.entries) {
            Object.keys(child.entries).forEach(function (ekey) {
                var schild = child.entries[ekey];
                if (schild.id) {
                    expands[schild.id.replace(/\-\-/g, '.').replace(/\-/g, '.')] = expand;            
                }
            });
        }

        if (!arrayHeader && Object.keys(child.children).length === 0) {
            icon.className = 'exp-col-icon fa fa-sliders';
        }

        highed.dom.on(title, 'click', function () {
            selectedID = child.id || key;

            if (arrayHeader) {
                return toggle();
            }

            if (noInspectSelf) {
                return;
            }

            select();
        });

        return body;
    }

    /** Expand to show a given ID
     *  @memberof highed.Tree
     *  @param id {string} - the ID of the element to expand
     */
    function expandTo(id) {
        var prev = '';

        if (!id) return;

        id = id.replace(/\-\-/g, '.').replace(/\-/g, '.').split('.');

        id.forEach(function (seg) {
            seg = prev + seg;
            if (expands[seg]) expands[seg]();
            prev += seg + '.';
        });
    }
    
    /** Build the tree
     *  @memberof highed.Tree
     *  @param tree {object} - the tree to display
     *    > children {object} - the children of the node
     *    > entries {array} - array of orphan children 
     *  @param pnode {domnode} - the parent node
     *  @param instancedData {object} - the actual tree data
     *  @param dataIndex {number} - the path to data in arrays
     */
    function build(tree, pnode, instancedData, dataIndex) {

       // dataIndex = tree.dataIndex || dataIndex;

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
                    children[tree.shortName + ' ' + (i + 1)] = {                        
                        children: tree.children,
                        entries: tree.entries,
                        dataIndex: i,
                        id: tree.id,
                        isArrayParent: true
                    };
                });

               // tree.alwaysExpand =  true;

                return build(
                    {
                        children: children,
                        entries: []
                    }, 
                    createNode(tree, tree.shortName, pnode, instancedData, dataIndex, true, true),
                    instancedData, 
                    dataIndex
                );  
            } 
        } 

        if (tree && tree.entries) {
            Object.keys(tree.entries).forEach(function (key) {
                var entry = tree.entries[key];
                entry.data = instancedData;
            });
        }

        if (tree && tree.children) {
            Object.keys(tree.children).forEach(function (key) {
                var child = tree.children[key],
                    body = highed.dom.cr('div', 'parent-body')
                ;

                if (child.isInstancedArray) {
                    arr = highed.getAttr(instancedData, child.id, dataIndex);
                    if (highed.isArr(arr)) {
                        //Skip node creation - will be done later
                        return build(child, pnode, instancedData, dataIndex);                        
                    } 
                }

                body = createNode(child, key, pnode, instancedData, child.dataIndex || tree.dataIndex || dataIndex);                        

                build(child, body, instancedData, child.dataIndex || tree.dataIndex || dataIndex);
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
        expandTo: expandTo,
        build: function (tree, data) {
            container.innerHTML = '';
            build(tree, container, data, 0);
            //Apply the active expand state
            Object.keys(expandState).forEach(function (key) {
                var index = 0;

                // if (key.indexOf(':') > 0) {
                //     //This is an array thing
                //     index = parseInt(key(key.indexOf(':') + 1));
                //     key = key.substr(0, key.indexOf(':') - 1);
                // }

                if (expandState[key] && expands[key]) {
                    expands[key]();
                }
            });
            expandTo(selectedID);
        }
    };
};
