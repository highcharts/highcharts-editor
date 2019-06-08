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

highed.AnnotationModal = function() {

  var overlayAddTextModal = highed.OverlayModal(false, {
    width: 321,
    height: 219, 
    class: ' highed-annotations-modal highcharts-popup highcharts-popup-annotations',
    showOnInit: true
  }),
  events = highed.events(),
  addTextModalContainer = highed.dom.cr('div', 'highcharts-popup-wrapper'),
  addTextModalInput = highed.dom.cr('textarea', 'highed-imp-input-stretch'),
  colorDropdownParent = highed.dom.cr('div'),
  addTextModalHeader = highed.dom.cr('div', 'highed-modal-text', 'Text'),
  containerHeader = highed.dom.cr('div', 'highed-premium-feature-header', 'Edit'),
  addTextModalColorSelect = highed.DropDown(colorDropdownParent),
  addTextModalColorContainer = highed.dom.cr('div', 'highed-modal-color-container'),
  backgroundColorContainer = highed.dom.cr('div', 'highed-modal-color-container'),
  sizeInput = highed.dom.cr('input', 'highed-field-input highed-modal-font-size-input'),
  addTextModalBtnContainer = highed.dom.cr('div', 'highed-modal-button-container'),
  addTextModalSubmit = highed.dom.cr('button', 'highed-ok-button highed-import-button mini', 'Save'),
  addTextModalCancel = highed.dom.cr('button', 'highed-ok-button highed-import-button grey negative mini', 'Cancel'),
  annotationType,
  colorInputs = {
    color: {element: highed.dom.cr('div', 'highed-field-colorpicker', ''), value: '#000000'}, 
    background: {element: highed.dom.cr('div', 'highed-field-colorpicker', ''), value: '#000000'}
  };

  sizeInput.type = 'number';
  sizeInput.value = 14;

  addTextModalColorSelect.selectByIndex(0);

  inputMap = {
    shape: [

    ]
  }
  highed.dom.on(addTextModalCancel, 'click', function() {
    overlayAddTextModal.hide();
    events.emit("ClosePopup")
  });

  Object.keys(colorInputs).forEach(function(key){
    var object = colorInputs[key];
    highed.dom.style(object.element, {
      background: object.value,
      color: highed.getContrastedColor(object.value)
    });
  });

  addTextModalInput.placeholder = 'Write annotation here';

  function show(type) {

    /*
    highed.dom.style([addTextModalHeader, addTextModalInput], {
      display:  (type && type.langKey === 'label' ? 'block' : 'none') 
    });
*/

    /*
    if (type && (type.langKey === 'circle' || type.langKey === 'rect')) {
      colorInputs.color.value = type.shapes[0].fill;
      colorInputs.color.element.value = type.shapes[0].fill;    
      highed.dom.style(colorInputs.color.element, {
        background: colorInputs.color.value,
        color: highed.getContrastedColor(colorInputs.color.value)
      });
    }*/

    if (type && type.langKey === 'label') {
      annotationType = 'labels';
      resetLabelDOM();
    } else if (type && (type.langKey === 'circle' || type.langKey === 'rect')) {
      annotationType = 'shapes';
      resetShapeDOM()
    }
    overlayAddTextModal.show();
  }

  function update(col, element) {
    if (
      col &&
      col !== 'null' &&
      col !== 'undefined' &&
      typeof col !== 'undefined'
    ) {
      element.innerHTML = "";
      //box.innerHTML = col;
    } else {
      element.innerHTML = 'auto';
      col = '#FFFFFF';
    }

    highed.dom.style(element, {
      background: col,
      color: highed.getContrastedColor(col)
    });

  }

  function resetLabelDOM() {
    addTextModalContainer.innerHTML = '';
    
    highed.dom.ap(addTextModalContainer, 
      addTextModalHeader,
      addTextModalInput,
      //highed.dom.cr('div', 'highed-add-text-label', 'Type:'),
      //typeDropdownParent,
      highed.dom.ap(highed.dom.cr('table'), 
                    highed.dom.ap(highed.dom.cr('tr'), 
                                  highed.dom.cr('td', 'highed-modal-text', 'Color'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Size'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Background Color')),
                                  
                    highed.dom.ap(highed.dom.cr('tr'), 
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(addTextModalColorContainer, colorInputs.color.element)),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), sizeInput),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(backgroundColorContainer,  colorInputs.background.element)))),
      //colorDropdownParent,
      highed.dom.ap(addTextModalBtnContainer,
        addTextModalSubmit,
        addTextModalCancel
      )
    )
  }

  function resetShapeDOM() {
    addTextModalContainer.innerHTML = '';
    
    highed.dom.ap(addTextModalContainer, 
      highed.dom.ap(highed.dom.cr('table'), 
                    highed.dom.ap(highed.dom.cr('tr'), 
                                  highed.dom.cr('td', 'highed-modal-text', 'Color'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Border Color')),
                                  
                    highed.dom.ap(highed.dom.cr('tr'), 
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(addTextModalColorContainer, colorInputs.color.element)),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(backgroundColorContainer,  colorInputs.background.element)))),
      //colorDropdownParent,
      highed.dom.ap(addTextModalBtnContainer,
        addTextModalSubmit,
        addTextModalCancel
      )
    )
  }
  
  Object.keys(colorInputs).forEach(function(key){
    var obj = colorInputs[key];
    highed.dom.on(obj.element, 'click', function(e) {
      highed.pickColor(e.clientX, e.clientY, obj.value, function(col) {
        if (highed.isArr(obj.value)) {
          obj.value = '#000000';
        }
  
        obj.value = col;
        obj.value.value = obj.value;
        update(col, obj.element);
      });
    });
  })

  highed.dom.ap(overlayAddTextModal.body, containerHeader, addTextModalContainer);

  resetLabelDOM();

  highed.dom.on(addTextModalSubmit, 'click', function() {
    overlayAddTextModal.hide();
    
    var obj = {};

    obj[annotationType] = [{
      //text: addTextModalInput.value.replace('\n', '<br/>'),  
      fill: colorInputs.color.value, 
      stroke: colorInputs.background.value
    }];

    if (annotationType === 'labels') {
      obj[annotationType][0].text = addTextModalInput.value.replace('\n', '<br/>');
    }

    console.log(obj);

    events.emit("UpdateAnnotation", obj)
    //chartPreview.addAnnotationLabel(addLabelX, addLabelY, addTextModalInput.value.replace('\n', '<br/>'), addTextModalColorValue, addTextModalTypeValue);

    addTextModalInput.value = '';

  });


  return {
    show: show,
    hide: overlayAddTextModal.hide,
    on: events.on
  };
};
