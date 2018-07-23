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

highed.AssignDataPanel = function(parent, attr) {

  var options = {
    'Labels': {
      'desc': 'A column of names or times',
      'default': 'A',
      'value': 'A',
      'previousValue': null,
      'isLabel': true,
      'mandatory': true
    },
    'Values': {
      'desc': 'One or more columns of numbers',
      'default': 'B-C',
      'value': 'B-C',
      'multipleValues': true,
      'previousValue': null,
      'isData': true,
      'mandatory': true
    }
  };
  
  function resetValues() {
    Object.keys(options).forEach(function(key){
      options[key].previousValue = null;
      options[key].value = options[key].default;
    });
  }

  function generateColors() {
    const hue = Math.floor(Math.random()*(357-202+1)+202), // Want a blue/red/purple colour
          saturation =  Math.floor(Math.random() * 100),
          lightness =  60,
          alpha = 0.5;

    return {
      "light": "hsl(" + hue + ", " + saturation + "%, " + (lightness + 20) + "%, " + alpha + ")",
      "dark": "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
    };
  }

  function getOptions() {
    return options;
  }

  function resize(w, h) {
       
    highed.dom.style(container, {
      height: (h - 15) + 'px'
    });
  }

  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-assigndatapanel highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-assigndatapanel-bar highed-box-size'),
    body = highed.dom.cr(
      'div',
      'highed-assigndatapanel-body highed-box-size highed-transition'
    ),
    header = highed.dom.ap(
              highed.dom.cr('div', 'highed-assigndatapanel-header-container'), 
              highed.dom.cr('h3', 'highed-assigndatapanel-header', 'Select columns for this chart'),
              highed.dom.cr('p', 'highed-assigndatapanel-header-desc', 'Fill in the column id you want to visualise. Add multiple columns with a hyphen (eg. A-C)')),
    labels = highed.dom.cr('div', 'highed-assigndatapanel-data-options');


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

  function getLetterIndex(char) {
    return char.charCodeAt() - 65; 
  }
  
  function getValues(input){
    const delimiter = (input.indexOf('-') > -1 ? '-' : ',');
    const output = input.split(delimiter).sort();

    output.forEach(function(value, index){
      output[index] = getLetterIndex(value);
    });

    return output;
  }

  function valuesMatch(newValue, key) {
    var found = false,
        values = [],
        values2 = [];

    Object.keys(options).forEach(function(key2){
        if (key === key2) return;

        values = getValues(newValue);
        values2 = getValues(options[key2].value);

        if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
          found = true;
          return false;
        }

    });
    return found;
  }

  highed.dom.ap(body, header);

  var chartInput = highed.dom.cr('select', 'highed-assigndatapanel-select-input');
  highed.dom.ap(labels, chartInput);

  Object.keys(options).forEach(function(key) {
    var option = options[key];
    var labelInput = highed.dom.cr('input', 'highed-assigndatapanel-input');

    var colors = generateColors();
    highed.dom.style(labelInput, {
      "background": colors.light,
      "border-color": colors.dark
    });

    option.colors = colors;

    highed.dom.on(labelInput, 'focus', function() {
      option.previousValue = (option.multipleValues ? labelInput.value : labelInput.value.charAt(0)).toUpperCase(); //labelInput.value;
    });

    highed.dom.on(labelInput, 'blur', function() {
      console.log(key, option);
      if (labelInput.value === '' && option.mandatory) {
        option.value = option.previousValue;
        labelInput.value = option.previousValue;
      } else if (valuesMatch(labelInput.value.toUpperCase(), key)) {
        option.value = option.previousValue;
        labelInput.value = option.previousValue;
        alert("Error");
      }
      else option.value = labelInput.value.toUpperCase();

      events.emit('AssignDataChanged', options);
    });
  
    labelInput.value = option.default;
  
    var label = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'), 
                               highed.dom.ap(
                                 highed.dom.cr('h6', '', key),
                                 highed.dom.cr('span', 'highed-assigndatapanel-data-mandatory ' + (option.mandatory ? 'active' : ''), 'Mandatory')),
                               highed.dom.cr('div', 'highed-assigndatapanel-data-desc', option.desc),
                               labelInput);
  
    highed.dom.ap(labels, label);

  });

  highed.dom.ap(body, labels);
  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  events.emit('AssignDataChanged', options);
  return {
    on: events.on,
    hide: hide,
    show: show,
    getOptions: getOptions,
    resetValues: resetValues,
    resize: resize
  };
};
