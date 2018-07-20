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
      'previousValue': null
    },
    'Values': {
      'desc': 'One or more columns of numbers',
      'default': 'B-C',
      'value': 'B-C',
      'multipleValues': true,
      'previousValue': null
    }
  };

  
  /*
    {
      name: 'Labels',
      desc: 'A column of names or times',
      default: 'A',
      value: 'A',
      previousValue: null
    },
    {
      name: 'Values',
      desc: 'One or more columns of numbers',
      default: 'B-C',
      value: 'B-C',
      multipleValues: true,
      previousValue: null
    }
  ];*/
  
  function generateColors() {
    const hue = Math.floor(Math.random()*(357-202+1)+202), // Want a colour blue/red/purple colour
          saturation =  Math.floor(Math.random() * 100),
          lightness =  60;

    return {
      "light": "hsl(" + hue + ", " + saturation + "%, " + (lightness + 20) + "%)",
      "dark": "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
    };
  }

  function getOptions() {
    return options;
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
              highed.dom.cr('p', 'highed-assigndatapanel-header-desc', 'Fill in the column id you want to visualise. Add multiple columns with a comma or hyphen (eg. A,B or A-C)'));
  
  var labels = highed.dom.cr('div', 'highed-assigndatapanel-data-options');


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
      option.value = labelInput.value.toUpperCase();
      events.emit('AssignDataChanged', options);
    });
  
    labelInput.value = option.default;
  
    var label = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'), 
                               highed.dom.cr('h6', '', key),
                               highed.dom.cr('div', 'highed-assigndatapanel-data-desc', option.desc),
                               labelInput);
  
    highed.dom.ap(labels, label);

  });
/*
  options.forEach(function(option) {
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
      option.value = labelInput.value.toUpperCase();
      events.emit('AssignDataChanged', options);
    });
  
    labelInput.value = option.default;
  
    var label = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'), 
                               highed.dom.cr('h6', '', option.name),
                               highed.dom.cr('div', 'highed-assigndatapanel-data-desc', option.desc),
                               labelInput);
  
    highed.dom.ap(labels, label);

  });*/

  highed.dom.ap(body, labels);
  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  events.emit('AssignDataChanged', options);
  return {
    on: events.on,
    hide: hide,
    show: show,
    getOptions: getOptions
  };
};
