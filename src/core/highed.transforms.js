/******************************************************************************

Copyright (c) 2016-2018, Highsoft

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

// @format

// There be dragons here...
(function() {
  var hasTransformedAdvanced = false;

  /**
     * Merges/extends advanced meta
     *  1. Find the source
     *  2. If source is also extending:
     *      2a. Recursively merge source
     *  3. Remove the extends attribute from target
     *  4. Merge source children
     */
  function mergeAdv(superset, dest, src, trigger) {
    var path = src.split('.'),
      current = superset,
      seriesNames = {
        pie: true,
        line: true
      };

    // console.log(
    //     'extending',
    //     (dest.meta.ns ? dest.meta.ns + '.' : '') + dest.meta.name,
    //     'with',
    //     src
    // );

    path.some(function(p) {
      if (current.subtree[p]) {
        current = current.subtree[p];
      } else {
        // console.log(
        //     'unable to resolve path for merge:',
        //     src,
        //     'from',
        //     dest.meta.name
        // );

        current = false;
        return true;
      }
    });

    // Stop from trying to extend this multiple times
    dest.meta.extends = dest.meta.extends.replace(src, '');

    if (current) {
      // Extend the source if needed
      extend(superset, current);

      // Unfortunatly we need to take series into special consideration
      // until we have a more robust way of handling its meta
      if (trigger && trigger.indexOf('series') === 0) {
        Object.keys(current.subtree || {}).forEach(function(key) {
          dest.subtree[key] =
            dest.subtree[key] || highed.merge({}, current.subtree[key]);
          dest.subtree[key].meta.validFor =
            dest.subtree[key].meta.validFor || {};

          if (
            dest.meta.excludes &&
            Object.keys(dest.meta.excludes).length > 0
          ) {
            dest.subtree[key].meta.validFor[current.meta.name] = !dest.meta
              .excludes[key];
          } else {
            dest.subtree[key].meta.validFor[current.meta.name] = 1;
          }
        });

        // console.log(dest);
      } else {
        // Do actual extending
        highed.merge(dest.subtree, current.subtree, false, dest.meta.excludes);
      }
    }
  }

  /**
      * Extend a node
      */
  function extend(superset, node, trigger) {
    if (node.meta.extends && node.meta.extends.length > 0) {
      node.meta.extends = node.meta.extends.replace('{', '').replace('}', '');

      if (trigger === 'series') {
        node.meta.extends += ',plotOptions.line';
      }

      node.meta.extends.split(',').forEach(function(part) {
        if (part && part.length > 0) {
          mergeAdv(superset, node, part.trim(), trigger);
        }
      });
    }
  }

  /**
     * Transform the tree
     * - merges
     * - arrifies
     * - sorts
     *
     * Duplicating children is faster than arrifying and replacing
     *
     */
  function transformAdv(input, onlyOnce) {
    var res;

    if (onlyOnce && hasTransformedAdvanced) {
      return input;
    }

    function visit(node, pname) {
      var children = (node.subtree = node.subtree || {});

      node.meta = node.meta || {};
      node.meta.ns = pname;
      node.children = [];

      // Take care of merging
      extend(input, node, (pname ? pname + '.' : '') + node.meta.name);

      node.meta.hasSubTree = false;

      node.children = [];

      Object.keys(children).forEach(function(child) {
        if (Object.keys(children[child].subtree).length > 0) {
          node.meta.hasSubTree = true;
        }

        node.children.push(
          visit(
            children[child],
            (pname ? pname + '.' : '') + (node.meta.name || '')
          )
        );
      });

      node.children.sort(function(a, b) {
        return a.meta.name.localeCompare(b.meta.name);
      });

      if (node.children.length === 0) {
        node.meta.leafNode = true;
      }

      return node;
    }

    // console.time('tree transform');
    res = visit(input);
    // console.timeEnd('tree transform');

    return res;
  }

  // Removes all empty objects and arrays from the input object
  function removeBlanks(input) {
    function rewind(stack) {
      if (!stack || stack.length === 0) return;

      var t = stack.pop();

      if (Object.keys(t).length === 0) {
        rewind(stack);
      } else {
        Object.keys(t || {}).forEach(function(key) {
          var child = t[key];

          if (key[0] === '_') {
            delete t[key];
          } else if (
            child &&
            !highed.isBasic(child) &&
            !highed.isArr(child) &&
            Object.keys(child).length === 0
          ) {
            delete t[key];
          } else if (highed.isArr(child) && child.length === 0) {
            delete t[key];
          } else if (highed.isArr(child)) {
            child = child.map(function(sub) {
              return removeBlanks(sub);
            });
          }
        });
      }

      rewind(stack);
    }

    function visit(node, parentStack) {
      parentStack = parentStack || [];

      if (node) {
        if (parentStack && Object.keys(node).length === 0) {
          rewind(parentStack.concat([node]));
        } else {
          Object.keys(node).forEach(function(key) {
            var child = node[key];
            if (key[0] === '_') {
              rewind(parentStack.concat([node]));
            } else if (!highed.isBasic(child) && !highed.isArr(child)) {
              visit(child, parentStack.concat([node]));
            }
          });
        }
      }
    }

    visit(input);
    return input;
  }

  highed.transform = {
    advanced: transformAdv,
    remBlanks: removeBlanks
  };
})();
