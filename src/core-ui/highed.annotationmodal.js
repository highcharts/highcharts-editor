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
    height: 300, 
    class: ' highed-annotations-modal highcharts-popup highcharts-popup-annotations',
    showOnInit: true
  }),
  events = highed.events(),
  addTextModalContainer = highed.dom.cr('div', 'highcharts-popup-wrapper'),
  addTextModalInput = highed.dom.cr('textarea', 'highed-imp-input-stretch highed-popup-textarea'),
  colorDropdownParent = highed.dom.cr('div'),
  addTextModalHeader = highed.dom.cr('div', 'highed-modal-text', 'Text'),
  containerHeader = highed.dom.cr('div', 'highed-premium-feature-header'),
  addTextModalColorSelect = highed.DropDown(colorDropdownParent),
  addTextModalColorContainer = highed.dom.cr('div', 'highed-modal-color-container'),
  backgroundColorContainer = highed.dom.cr('div', 'highed-modal-color-container'),
  sizeInput = highed.dom.cr('input', 'highed-field-input highed-modal-font-size-input'),
  addTextModalBtnContainer = highed.dom.cr('div', 'highed-modal-button-container'),
  addTextModalSubmit = highed.dom.cr('button', 'highed-ok-button highed-import-button mini', 'Save'),
  addTextModalCancel = highed.dom.cr('button', 'highed-ok-button highed-import-button grey negative mini', 'Cancel'),
  annotationLabel = highed.dom.cr('span', '', 'Edit'),
  closeBtn = highed.dom.ap(highed.dom.cr('span', 'fa fa-times close-btn')),
  annotationType,
  annotationKey,
  typeDropdownParent = highed.dom.cr('div', 'highed-modal-label-type'),
  addTextModalTypeOptions = [{
    text: 'Callout',
    icon: 'comment',
    value: 'callout'
  }, {
    text: 'Connector',
    icon: 'external-link-alt',
    value: 'connector'
  }, {
    text: 'Circle',
    icon: 'circle',
    value: 'circle'
  }],
  addTextModalTypeValue = 'callout',
  colorInputs = {
    color: {element: highed.dom.cr('div', 'highed-field-colorpicker', ''), value: '#000000'}, 
    background: {element: highed.dom.cr('div', 'highed-field-colorpicker', ''), value: '#000000'}
  };

  sizeInput.type = 'number';
  sizeInput.value = 11;

  addTextModalColorSelect.selectByIndex(0);
  highed.dom.on(addTextModalCancel, 'click', function() {
    overlayAddTextModal.hide();
    events.emit("ClosePopup");
  });


  highed.dom.on(closeBtn, 'click', function() {
    overlayAddTextModal.hide();
    events.emit("ClosePopup");
  });

  highed.dom.ap(containerHeader, annotationLabel, closeBtn);


  Object.keys(colorInputs).forEach(function(key){
    var object = colorInputs[key];
    highed.dom.style(object.element, {
      background: object.value,
      color: highed.getContrastedColor(object.value)
    });
  });

  addTextModalTypeOptions.forEach(function(option) {

    var container = highed.dom.cr('div', 'highed-annotation-modal-container ' + (addTextModalTypeValue === option.value ? ' active' : '')),
        icon = highed.dom.cr('div', 'highed-modal-icon fas fa-' + option.icon),
        text = highed.dom.cr('div', 'highed-modal-text', option.text);
        option.element = container;
    
    highed.dom.on(container, 'click', function() {
      addTextModalTypeOptions.forEach(function(o) {
        if (o.element.classList.contains('active'))  o.element.classList.remove('active');
      })
      option.element.classList += ' active';
      addTextModalTypeValue = option.value;
    })
    
    highed.dom.ap(typeDropdownParent, highed.dom.ap(container, icon, text));
  });

  addTextModalInput.placeholder = 'Write annotation here';

  function show(type) {

    annotationLabel.innerHTML = 'Edit ' + type.langKey;
    if (type && type.langKey === 'label') {
      annotationType = 'labels';
      annotationKey = 'label'
      if (type.labels[0].style) {
        colorInputs.color.value = type.labels[0].style.color;
        colorInputs.color.element.value = type.labels[0].style.color;    
        highed.dom.style(colorInputs.color.element, {
          background: colorInputs.color.value,
          color: highed.getContrastedColor(colorInputs.color.value)
        });

        sizeInput.value = type.labels[0].style.fontSize;
      }

      colorInputs.background.value = type.labels[0].backgroundColor;
      colorInputs.background.element.value = type.labels[0].backgroundColor;    
      highed.dom.style(colorInputs.background.element, {
        background: colorInputs.background.value,
        color: highed.getContrastedColor(colorInputs.background.value)
      });

      if (type.labels[0].format) {

        if( type.labels[0].format.replace('<br/>', '\n') !== '') {
          addTextModalInput.value = type.labels[0].format.replace('<br/>', '\n');
        }
      }

      resetLabelDOM();
    } else if (type && (type.type === 'crookedLine' || type.type === 'elliottWave')) {
      annotationType = 'shapes';
      annotationKey = 'line'

      if (type.typeOptions.line.stroke) {
        colorInputs.background.value = type.typeOptions.line.stroke;
        colorInputs.background.element.value = type.typeOptions.line.stroke;

        highed.dom.style(colorInputs.background.element, {
          background: colorInputs.background.value,
          color: highed.getContrastedColor(colorInputs.background.value)
        });
      }

      if (type.typeOptions.line.strokeWidth) {
        sizeInput.value = type.typeOptions.line.strokeWidth;
      }

      resetLineDOM();
    } else if (type && (type.langKey === 'circle' || type.langKey === 'rectangle')) {
      annotationType = 'shapes';
      annotationKey = 'shape';

      colorInputs.color.value = type.shapes[0].fill;
      colorInputs.color.element.value = type.shapes[0].fill;    
      highed.dom.style(colorInputs.color.element, {
        background: colorInputs.color.value,
        color: highed.getContrastedColor(colorInputs.color.value)
      });

      colorInputs.background.value = type.shapes[0].stroke;
      colorInputs.background.element.value = type.shapes[0].stroke;    
      highed.dom.style(colorInputs.background.element, {
        background: colorInputs.background.value,
        color: highed.getContrastedColor(colorInputs.background.value)
      });

      resetShapeDOM();
    } else {
      annotationType = 'shapes';
      annotationKey = 'verticalCounter';

      if (type && type.typeOptions && type.typeOptions.label) {
        if(type.typeOptions.label.text.replace('<br/>', '\n') !== '') {
          addTextModalInput.value = type.typeOptions.label.text.replace('<br/>', '\n');
        }
        
        colorInputs.background.element.value = type.typeOptions.label.stroke;
        sizeInput.value = type.typeOptions.label.strokeWidth || 1;
      }      

      resetVerticalCounterDOM();
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

  function resetVerticalCounterDOM() {
    overlayAddTextModal.resize(321, 230);
    
    addTextModalContainer.innerHTML = '';
    
    highed.dom.ap(addTextModalContainer, 
      addTextModalHeader,
      addTextModalInput,
      highed.dom.ap(highed.dom.cr('table'), 
                    highed.dom.ap(highed.dom.cr('tr'), 
                                  highed.dom.cr('td', 'highed-modal-text', 'Line Color'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Arrow Size')),
                                  
                    highed.dom.ap(highed.dom.cr('tr'), 
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(backgroundColorContainer, colorInputs.background.element)),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), sizeInput))),
      //colorDropdownParent,
      highed.dom.ap(addTextModalBtnContainer,
        addTextModalSubmit,
        addTextModalCancel
      )
    )
  }

  function resetLabelDOM() {

    overlayAddTextModal.resize(321, 300);

    addTextModalContainer.innerHTML = '';

    highed.dom.ap(addTextModalContainer, 
      addTextModalHeader,
      addTextModalInput,
      highed.dom.ap(highed.dom.cr('table'), 
                    highed.dom.ap(highed.dom.cr('tr'), 
                                  highed.dom.cr('td', 'highed-modal-text', 'Color'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Size'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Background Color')),
                                  
                    highed.dom.ap(highed.dom.cr('tr'), 
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(addTextModalColorContainer, colorInputs.color.element)),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), sizeInput),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(backgroundColorContainer,  colorInputs.background.element)))),
      highed.dom.cr('div', 'highed-add-text-label', 'Type:'),
      typeDropdownParent,
      highed.dom.ap(addTextModalBtnContainer,
        addTextModalSubmit,
        addTextModalCancel
      )
    )
  }

  function resetShapeDOM() {

    overlayAddTextModal.resize(321, 150);

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
  

  function resetLineDOM() {

    overlayAddTextModal.resize(321, 150);
    
    addTextModalContainer.innerHTML = '';
    
    highed.dom.ap(addTextModalContainer, 
      highed.dom.ap(highed.dom.cr('table'), 
                    highed.dom.ap(highed.dom.cr('tr'), 
                                  highed.dom.cr('td', 'highed-modal-text', 'Line Color'),
                                  highed.dom.cr('td', 'highed-modal-text', 'Line Width')),
                                  
                    highed.dom.ap(highed.dom.cr('tr'), 
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), highed.dom.ap(backgroundColorContainer, colorInputs.background.element)),
                    highed.dom.ap(highed.dom.cr('td', 'highed-modal-text'), sizeInput))),
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
    obj[annotationType] = [{}];

    if (annotationType === 'labels') {
      if( addTextModalInput.value.replace('\n', '<br/>') !== '') {
        obj[annotationType][0].format = addTextModalInput.value.replace('\n', '<br/>');
      }

      if (!obj[annotationType][0].style) obj[annotationType][0].style = {};

      obj[annotationType][0].backgroundColor = colorInputs.background.value;
      obj[annotationType][0].borderColor = colorInputs.background.value;
      obj[annotationType][0].shape = addTextModalTypeValue;
      obj[annotationType][0].style.color = colorInputs.color.value;
      obj[annotationType][0].style.fontSize = sizeInput.value;


    } else if (annotationKey === 'line') {
    //Highcharts.charts[Highcharts.charts.length-1].annotations[0].shapes[0].update({strokeWidth: 10})
      obj = {
          stroke: colorInputs.background.value,
          strokeWidth: parseInt(sizeInput.value)
      };
    } else if (annotationKey === 'verticalCounter') {
      obj = {
        stroke: colorInputs.background.value,
        fill: colorInputs.background.value,
        strokeWidth: parseInt(sizeInput.value),
        text: addTextModalInput.value.replace('<br/>', '\n')
      };

    } else {
      obj[annotationType] = [{
        //text: addTextModalInput.value.replace('\n', '<br/>'),  
        fill: colorInputs.color.value, 
        stroke: colorInputs.background.value
      }];
    }

    events.emit("UpdateAnnotation", obj, annotationKey)
    //chartPreview.addAnnotationLabel(addLabelX, addLabelY, addTextModalInput.value.replace('\n', '<br/>'), addTextModalColorValue, addTextModalTypeValue);

    addTextModalInput.value = '';

  });


  return {
    show: show,
    hide: overlayAddTextModal.hide,
    on: events.on
  };
};
