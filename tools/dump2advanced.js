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

/*
 * We are currently altering the dumps for the API docs.
 * The changes are not yet live, but we need the additional information
 * the new format supplies.
 *
 * So for now, we're bundling in a dictionary with the new format.
 * This will in the future work the same as the old meta->advanced baker,
 * where it fetches the current dump from api.highcharts.com rather than from
 * a local file.
 *
 */

const fs = require('fs');
const mkdir = require('mkdirp');
const dump = {children: require(__dirname + '/../res/tree.json')};
const package = require(__dirname + '/../package.json');
const license = fs.readFileSync(__dirname + '/../LICENSE', 'utf-8')
                    .replace('<%= version %>', package.version);

// Extract array type
function extractArrayType(def) {
    var s = def.indexOf('<'),
        s2 = def.indexOf('>'),
        res
    ;

    if (s >= 0 && s2 >= 0) {
        res = def.substr(s + 1, s2 - s - 1);

        return res;
    }

    return 'object';
}

function merge(target, path) {

}

// We need to post-process the series
// Everything that has sub-entries should be merge in on the series top-level
// with an added "for" meta field
function processSeries(tree) {

    function process(node) {
        node.doclet = node.doclet || {};
        var ext = [node.doclet.extends || '', 'plotOptions.series'];

        Object.keys(node.children).forEach(function (key) {
            var child = node.children[key],
                excludes = {}
            ;

            if (child.doclet && child.doclet.tags) {
                child.doclet.tags.forEach(function (tag) {
                    var ar;
                    if (tag.title === 'excluding') {
                        ar = tag.value.trim().split(',');

                        ar.forEach(function (p) {
                            excludes[p] = true;
                        });
                    }
                });
            }

            if (child.doclet && child.doclet.extends) {
                ext.push(child.doclet.extends.replace('series,', ''));
            }

            if (child.children && Object.keys(child.children).length > 0) {
                // Move to the main child
                Object.keys(child.children).forEach(function (skey) {
                    var schild = child.children[skey];

                    node.children[skey] = node.children[skey] || schild;
                    node.children[skey].meta = node.children[skey].meta || {};
                    node.children[skey].meta.validFor = node.children[skey].meta.validFor || {};

                    node.children[skey].meta.validFor[key] = excludes[key] ? false : true;
                });

                delete node.children[key];
            }
        });

        node.doclet.extends = ext.join(',');
        console.log(node.doclet.extends);
    }

    if (tree && tree.children.series) {
        process(tree.children.series);
    }

    return tree;
}

function extend(targetName, target, path, ignores) {
    var current = dump;

    path = path.replace('{', '').replace('}', '');

    if (path.indexOf(',') >= 0) {
        path = path.split(',');
        path.forEach(function (subPath) {
            extend(targetName, target, subPath, ignores);
        });
        return;
    }

    path = path.split('.');

    function merge(target, source) {
        if (target && source) {

            // If source also extends something, we need to deduce that first.
            if (source.meta && source.meta.extends) {
                console.log('merge - recursing', path.join('.'), 'to', source.meta.extends);
                extend(
                    source.meta.ns + source.meta.name,
                    source,
                    source.meta.extends
                );
            }

            Object.keys(source.children || {}).forEach(function (key) {
                if (ignores && !ignores[key]) {
                    //if (!target.children[key]) {
                        target.children[key] = source.children[key];
                    //}
                }
            });
        } else {
            console.log('merge - target and/or source is empty:', path.join('.'));
        }
    }

    if (path.length === 1) {
        return merge(target, current.children[path[0]]);
    }

    path.some(function (p, i) {
        try {
            if (current.children[p].children) {
                current = current.children[p];
            } else {
                console.log('merge - itterated out of bounds:', p, path.join('.'));
                return true;
            }
        } catch (e) {
            console.log('could not find', path.join('.'));
            current = false;
            return true;
        }
    });

    if (current) {
        merge(target, current);
    } else {
        console.log('merge - unable to find', path.join('.'));
    }
}

function filter(dumpProperties, input, name, pname) {
    var node = {
            meta: {
                types: {},
               // ns: pname,
                name: name
            },
            subtree: {}
        },
        excludes = {}
    ;

    node.meta.excludes = excludes;

    if (input.meta) {

        node.meta.default = input.meta.default;
        node.meta.validFor = input.meta.validFor;

        // Insert a GitHub link to the field
        // if (input.meta.filename) {
        //     node.meta.gh = [
        //         //'https://github.com/highcharts/highcharts/tree/',
        //         dumpProperties.commit,
        //         '/',
        //         input.meta.filename.substr(input.meta.filename.indexOf('highcharts/') + 11),
        //         '#L',
        //         input.meta.line
        //     ].join('');
        // }
    }

    if ((!pname || pname.length === 0) && name === 'series') {
      console.log('Overriding series type');
      node.meta = node.meta || {};
      node.meta.types = node.meta.types || {};
      node.meta.types.array = 'series';
    }

    if (name === 'dataLabels') {
      node.meta.types.object = 1;
    }

    if (input.doclet) {

        if (input.doclet.products) {
            // Turn the products array into a hash map for quicker checks in UI
            node.meta.products = {};
            input.doclet.products.forEach(function (prod) {
                node.meta.products[prod] = 1;
            });
        }

        // Override the axis, temproary until the meta is up to speed
        if ((!pname || pname.length === 0) && (name === 'xAxis' || name === 'yAxis' || name === 'zAxis')) {
            input.doclet.type = {
                names: [
                    'array<' + name + '>'
                ]
            };
        }

        if (input.doclet.type) {
            input.doclet.type.names.forEach(function (t) {

                if (t.trim().toLowerCase().indexOf('array') === 0) {

                    // Unfortunatly we need some special handling here..
                    if ((!pname || pname.length === 0) && name === 'series') {
                        node.meta.types['array'] = 'series';
                    } else {
                        node.meta.types['array'] = extractArrayType(t);
                    }
                } else {
                    node.meta.types[t.trim().toLowerCase()] = 1;
                }
            });
        }

        if (input.doclet.description) {
            node.meta.description = input.doclet.description;
        }

        if (input.doclet.defaultvalue) {
            node.meta.default = input.doclet.defaultvalue;
        } else {
            node.meta.default = node.meta.default;
        }

        if (input.doclet.tags) {
            input.doclet.tags.forEach(function (tag) {

                if (tag.title === 'validvalue') {
                    // There are two primary formats here, JSON and , split..
                    // We want to have these end up in a drop-down

                    tag.value = tag.value.trim().replace('undefined', '"undefined"');

                    node.meta.types['enum'] = 1;

                    if (tag.value[0] === '[' && tag.value[tag.value.length - 1] === ']') {
                        try {
                            node.meta.enumValues = JSON.parse(tag.value);
                        } catch (e) {
                            console.log('WARNING: Invalid @validvalue', tag.value, 'for', node.meta);
                        }
                    } else {
                        node.meta.enumValues = tag.value.split(',').map(function (e) {
                            return e.trim();
                        });
                    }
                }

                if (tag.title === 'excluding') {
                    tag.value.split(',').forEach(function (attr) {
                        excludes[attr.trim()] = 1;
                    });
                }
            });
        }

        if (input.doclet.extends) {
            node.meta.extends = input.doclet.extends;
           // extend(node.meta.ns + '.' + node.meta.name, input, input.doclet.extends, excludes);
        }
    }

    // if (Object.keys(input.children || {}).length === 0) {
    //     node.meta.leafNode = 1;
    // }

    // Filter children
    Object.keys(input.children || {}).forEach(function (child) {
        if (child === '' || child === '_meta' || child === 'data') return;

        if (child === 'dataLabels' && input.children && Object.keys(input.children[child].children).length === 0) {
          return 0;
        }

        // // We don't include functions, so check that first
        // if (input.children[child].doclet && input.children[child].doclet.type) {
        //     if (input.children[child].doclet.type.names.filter(function (a) {
        //         return a.toUpperCase() === 'FUNCTION';
        //     }).length > 0) {
        //         return;
        //     }
        // }

        node.subtree[child] = (
            filter(
                dumpProperties,
                input.children[child],
                child,
                (typeof pname !== 'undefined' && pname.length > 0 ? pname + '.' : '') + (name || '')
            )
        );

        // if (node.children[node.children.length - 1].children.length > 0) {
        //     node.meta.hasSubTree = 1;
        // }
    });

    // node.children.sort(function (a, b) {
    //     return a.meta.name.localeCompare(b.meta.name);
    // });

    return node;
}

mkdir(__dirname + '/../generated_src/', function () {
  fs.writeFile(
      __dirname + '/../generated_src/highed.meta.options.advanced.js',
      [
          license,
          '\n',
          'highed.meta.optionsAdvanced = ',
          JSON.stringify(
              filter(
                  dump.children._meta,
                  processSeries(dump)
              ),
              undefined, '  '
          ),
          ';\n'
      ].join(''),
      (err) => {

      }
  );
});