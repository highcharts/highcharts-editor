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

/* Take a fresh API dump and bake it into the sources */

var apiDumpURL = 'http://api.highcharts.com/highcharts/option/dump.json',
    request = require('request'),
    fs = require('fs'), 
    apiSorted = {},
    license = fs.readFileSync(__dirname + '/../LICENSE'),
    ignores = {
        'chart--spacing': true,
        'chart--margin': true,
        // 'chart--marginLeft': true,
        // 'chart--marginBottom': true,
        // 'chart--marginTop': true,
        // 'chart--marginRight': true,
        'data': true,
        'responsive': true,
        'responsive--rules': true
    }
;

require('colors');

console.log('Higcharts Advanced Options Updater'.green);
console.log('Fetching latest API dump...'.bold);


function extractType(str) {
    var s = str.indexOf('<'),
        st 
    ;

    if (s >= 0) {
        return str.substr(s + 1, str.indexOf('>') - s - 1);
    }

    return false;
}

function removeType(str) {
    var t = extractType(str);

    if (t) {        
        return str.replace('<' + t + '>', '');
    }
    return str;
}

function sortAPI(api) {
    // api.sort(function (a, b) {
    //     return a.name.replace(/\-/g, ' ').localeCompare(b.name.replace(/\-/g, ''));
    // });

    api.forEach(function (entry) {
        var st = extractType(entry.name);
        entry.name = removeType(entry.name); 

        if (!apiSorted[entry.name]) {            

            apiSorted[entry.name] = entry;

            if (st !== false) {
                entry.subType = [st];            
            }
        } else if (st) {
            apiSorted[entry.name].subType = apiSorted[entry.name].subType || [];
            apiSorted[entry.name].subType.push(st);
            apiSorted[entry.name].values = apiSorted[entry.name].values || entry.values;
            apiSorted[entry.name].defaults = apiSorted[entry.name].defaults || entry.defaults;

            apiSorted[entry.name].subTypeDefaults = apiSorted[entry.name].subTypeDefaults || {};
            apiSorted[entry.name].subTypeDefaults[st] = entry.defaults;
        }
    });
}

function writeMeta(data) {
    var body = [
        license,
        'highed.meta.optionsAdvanced = ',
        data,
        ';'
    ].join('\n');

   fs.writeFile(__dirname + '/../src/meta/highed.meta.options.advanced.js', body, function (err) {
        return err && console.log('[error]'.red, err); 
   });
}

function process(data) {
    var tree = {
        children: {},
        entries: []
    };

    try {
        data = JSON.parse(data);
    } catch(e) {
        console.log('[error]'.red, e);
        return false;
    }
  
    data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    sortAPI(data);

    fs.writeFileSync(__dirname + '/../api.js', JSON.stringify(data, undefined, '  '));



    data.forEach(function (entry) {
        var parent = entry.parent || removeType(entry.name),
            current = tree,
            path,
            nitm
        ;

        //For now we skip functions and multi-types
        if (entry.returnType === 'Function' || entry.deprecated) {
            return;
        }

        //Temp
        entry.name = removeType(entry.name);
        

        parent = removeType(parent);
        path = parent.replace(/\-\-/g, '.').replace(/\-/g, '.').split('.');

        if (entry.name.indexOf('series') !== 0) {
           // return;
        }

        if (ignores[entry.name]) {
            return false;
        }

        if (ignores[path[0]]) {
            return false;
        }

        // if (path.length === 1) {

        //     current.children[path[0]] = current.children[path[0]] || {
        //         entries: [],
        //         children: {}
        //     };

        //     current.children[path[0]].id = entry.name;

        //     return;
        // }

        path.forEach(function(p, i) {
            var c;

            if (ignores[p]) {
                return;
            }

            if (i === path.length - 1) {                  

                current.children[p] = current.children[p] || {
                    entries: {},
                    children: {}
                };


                c = {
                    id: entry.name,
                    shortName: entry.name.substr(entry.name.lastIndexOf('-') + 1),
                    dataType: (entry.returnType || '').toLowerCase(),
                    description: entry.description,
                    values: entry.values || undefined,
                    defaults: entry.defaults,
                    subType: apiSorted[entry.name].subType                    
                };

                if (c.dataType.indexOf('array') >= 0 && entry.isParent) {
                    //current.children[p] = c;
                    if (current.children[p]) {
                        current.children[p].isInstancedArray = true;
                        current.children[p].shortName = p;
                        current.children[p].id = p;
                    } //else {
                    //     c.isInstancedArray = true;
                    //     current.children[p].entries[c.id] = c;                        
                    // }
                    //c.entries = [];
                    //c.children = {};
                
                //If it's an object, skip it. It will appear as a leaf.
                } else if (!entry.isParent) {
                    //current.children[p].entries[c.id] = c;
                    current.children[p].entries[c.id] = c;

                }  else if (entry.isParent) {
                    current.id = current.id || entry.name;
                    current.dataType = (entry.returnType || '').toLowerCase();
                } else if (c.dataType.indexOf('object') >= 0) {
                    //console.log('found object', entry.name, 'current', current.id);

                    // entry.attributes = [];

                    // data.forEach(function (child) {
                    //     if (child.parent === entry.name) {
                    //         console.log('found child to', entry.name, child.title);
                    //         entry.attributes.push({
                    //             dataType: (child.returnType || '').toLowerCase(),
                    //             name: child.title,
                    //             title: child.title,
                    //             tooltipText: child.description,
                    //             defaults: child.defaults,
                    //             values: child.values
                    //         });
                    //     }
                    // });
                }

            } else {
                if (typeof current.children[p] === 'undefined') {

                    current.children[p] = {
                        entries: {},
                        children: {}
                    };

                    current = current.children[p];
                } else {
                    current = current.children[p];                       
                }
            }
        });

    });

    return JSON.stringify(tree, undefined, 2);
}

request(apiDumpURL, function (error, response, body) {
    console.log('API Fetched, transforming...'.bold);
    if (error) {
        console.log('[error]'.red, error);
    } else {

        writeMeta(process(body));
    }
});