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
/** Map selector
 */

highed.MapModal = function(container, dataPage) {
  var events = highed.events(),
  
      editMapContainer = highed.dom.cr(
        'div',
        'highed-edit-map-container'
      ),
      editMapValue = highed.dom.cr('input', 'highed-map-value'),
      mapValue,
      editMapHeader = highed.dom.cr('div', 'highed-map-value-header', '');
  //////////////////////////////////////////////////////////////////////////////

  highed.dom.ap(
    container, 
    highed.dom.ap(
      editMapContainer,
      editMapHeader,
      highed.dom.cr('div', 'highed-map-value-label', 'Value:'),
      editMapValue
    )
  );
  
  function setValue(e) {
    if (e.keyCode === 13) {
      mapValue.setValue(e.target.value);
      editMapContainer.classList.remove('active');
    }
  }

  function editMapValues (data) {
    editMapHeader.innerHTML = data.properties.name;
    mapValue = dataPage.getMapValueFromCode(data.properties['hc-key']);
    editMapValue.value = mapValue.value();

    editMapValue.removeEventListener("keyup", setValue);
    highed.dom.on(editMapValue, 'keyup', setValue);

    if (!editMapContainer.classList.contains('active')) {
      editMapContainer.classList += ' active';
    }
    editMapValue.focus();
  }

  return {
    on: events.on,
    editMapValues: editMapValues
  };
};
