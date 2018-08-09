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

highed.SearchAdvancedOptions = function(parent, attr) {

  var timeout = null;

  function resize(w, h) {
       
    highed.dom.style(container, {
      height: (h - 15) + 'px'
    });
  }

  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-assigndatapanel highed-searchadvancedoptions highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-searchadvancedoptions-bar highed-box-size'),
    body = highed.dom.cr(
      'div',
      'highed-searchadvancedoptions-body highed-box-size highed-transition'
    ),
    header = highed.dom.ap(
              highed.dom.cr('div', 'highed-searchadvancedoptions-header-container'), 
              highed.dom.cr('h3', 'highed-searchadvancedoptions-header', 'Search'),
              highed.dom.cr('p', 'highed-searchadvancedoptions-header-desc')),
    labels = highed.dom.cr('div', 'highed-searchadvancedoptions-data-options'),
    searchResultContainer = highed.dom.cr('div', 'highed-searchadvancedoptions-results'),
    inputContainer = highed.dom.cr('div', 'highed-searchadvancedoptions-inputs-container'),
    searchInput = highed.dom.cr('input', 'highed-searchadvancedoptions-search highed-field-input');

  var searchResults = [];


  function compareValues(str, queryArr) {
    var foundCount = 0;

    queryArr.forEach(function(q, index) {
      if (str.indexOf(q) > - 1) {
        foundCount ++;
      }
    });

    return foundCount;
  }

  function search(node, str) {
    if (highed.isArr(node)) {
      node.forEach(function(child) {
        search(child, str);
      });
    } else {
      function checker(value) {
        var prohibited = ['banana', 'apple'];
      
        for (var i = 0; i < prohibited.length; i++) {
          if (value.indexOf(prohibited[i]) > -1) {
            return false;
          }
        }
        return true;
      }
      //console.log(node.meta);
      var foundCount = compareValues(highed.uncamelize(node.meta.name).toLowerCase(), str);
      foundCount += compareValues(highed.uncamelize(node.meta.ns).toLowerCase(), str);
      if (node.meta.description) foundCount += compareValues(highed.uncamelize(node.meta.description).toLowerCase(), str);

      if (foundCount > 0) {
      //if (highed.uncamelize(node.meta.name).toLowerCase().indexOf(str) > -1 ) {
        if (Object.keys(node.meta.types)[0] === 'function' || (
          node.meta.products &&
          Object.keys(node.meta.products) > 0)) {
          return;
        } else {
          searchResults.push({
            name: highed.uncamelize(node.meta.name),
            parents: (node.meta.ns.split('.')).map(function(e){ return highed.uncamelize(e); }),
            foundCount: foundCount
          }); 
        }
      }
      if (node.children && node.children.length > 0) {
        search(node.children, str);
      }
    }
  }

  highed.dom.on(searchInput, 'keyup', function(e) {


    clearTimeout(timeout);
    timeout = setTimeout(function () {
    const optionsAdvanced = highed.meta.optionsAdvanced.children,
    searchString = searchInput.value.toLowerCase(),
    searchArray = searchInput.value.toLowerCase().split(' ');

    searchResults = [];
    optionsAdvanced.forEach(function(child) {
      search(child, searchArray);
    });

    resetDOM();
    }, 500);

  });

  function hide() {
    highed.dom.style(container, {
      display: 'none'
    });
  }

  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
  }

  highed.dom.ap(body, header);

  function resetDOM() {
    searchResultContainer.innerHTML = '';
    searchResults.sort(function(a,b) {return (a.foundCount < b.foundCount) ? 1 : ((b.foundCount < a.foundCount) ? -1 : 0);} ); 
    //console.log(searchResults);
    searchResults.forEach(function(result, i) {
      if (i > 50) return;
      const resultContainer = highed.dom.cr('div', 'highed-searchadvancedoptions-result-container'),
            resultTitle = highed.dom.cr('div', 'highed-searchadvancedoptions-result-title', result.name),
            resultParents = highed.dom.cr('div', 'highed-searchadvancedoptions-result-parents', result.parents.join(' <i class="fa fa-circle highed-parent-splitter" aria-hidden="true"></i> '));
      
      highed.dom.ap(resultContainer, resultTitle, resultParents);
      highed.dom.ap(searchResultContainer, resultContainer);
    });

  }

  highed.dom.ap(inputContainer, searchInput);
  highed.dom.ap(body, labels, inputContainer, searchResultContainer);
  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  return {
    on: events.on,
    hide: hide,
    show: show,
    resize: resize
  };
};
