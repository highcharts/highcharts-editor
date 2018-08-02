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

  var defaultOptions = {
    'labels': {
      'name': "Categories",
      'desc': 'A column of names or times',
      'default': 'A',
      'value': 'A',
      'previousValue': null,
      'isLabel': true,
      'mandatory': true
    },
    "data": {
      'values': {
        'name': "Values",
        'desc': 'One or more columns of numbers',
        'default': 'B-C',
        'value': 'B-C',
        'multipleValues': true,
        'previousValue': null,
        'mandatory': true
      }
    },
    'names': {
      'name': "Names",
      'desc': 'The name of the point as shown in the legend, tooltip, dataLabel etc..',
      'default': '',
      'value': '',
      'previousValue': null,
      'mandatory': false,
      'linkedTo': 'label'
    }
  },
  options = {};

  Object.assign(options, defaultOptions);
  
  function resetValues() {
    Object.keys(options).forEach(function(key){
      if (key === 'data') {
        Object.keys(options[key]).forEach(function(dataKey) {
          options[key][dataKey].previousValue = null;
          options[key][dataKey].value = options[key][dataKey].default;
        });
      } else {
        options[key].previousValue = null;
        options[key].value = options[key].default;
      }
    });
  }

  function getMergedLabelAndData() {
    var arr = {},
        extraColumns = [];

    Object.keys(options).forEach(function(optionKeys){
      if (optionKeys === 'labels') {
        arr.labelColumn = highed.getLetterIndex(options[optionKeys].value.charAt(0));
      } else if (optionKeys === 'data') {

        const data = options.data.values;
        if (data) {
          const userValues = data.value.split(data.value.indexOf('-') > -1 ? '-' : ',').sort();
          var tempValue = highed.getLetterIndex(userValues[0]),
              values = [];  
          while(tempValue <= highed.getLetterIndex(userValues[userValues.length - 1])) {
            values.push(tempValue);
            tempValue++;
          }
          
          arr.dataColumns = values;
        } else {
          // Has more than one data value, need to loop through them and get their positions
          const data = options.data;
          var values = [];
          
          Object.keys(data).forEach(function(key){
            const option = data[key];
            if (option.value !== '') {
              values.push(highed.getLetterIndex(option.value));
            }
          });
          values = values.sort();
          arr.dataColumns = values;
        }
      } else {
        // Check for any extra fields, eg. Name
        const extraValue = options[optionKeys];
        if (extraValue.value !== '') {
          extraColumns.push(highed.getLetterIndex(extraValue.value));
        }
      }
    });

    arr.extraColumns = extraColumns.sort();

    return arr; //arr.concat(values);
  }

  function getLetterIndex(char) {
    return char.charCodeAt() - 65; 
  }

  function processField(input, overrideCheck, cb) {

    input.value = input.value.toUpperCase();
    var newOptions = [];

    var previousValues = [],
        values = [];
    
    
    if (input.multipleValues) {
      const delimiter = (input.value.indexOf('-') > -1 ? '-' : ',');
      values = input.value.split(delimiter).sort();
      if (input.previousValue) {
        const previousValueDelimiter = (input.previousValue.indexOf('-') > -1 ? '-' : ',');
        previousValues = input.previousValue.split(previousValueDelimiter).sort();
      }

      if (!overrideCheck) {
        const areEqual = (values.length === previousValues.length && 
          previousValues.every(function(item) { return values.indexOf(item) > -1 }));
        if (areEqual) return;
      }
      //if (key === 'Data') { //Get the label data
      
      newOptions = getMergedLabelAndData();
      //} else {
      /*values.forEach(function(value) {
        newOptions.push(highed.getLetterIndex(value));
      });*/
      //}
    } else {
      if (!overrideCheck) {
        if (input.previousValue === input.value || (input.value === '' && input.previousValue === null)) return;
      }

      values = [input.value.charAt(0)];
      if (input.previousValue) previousValues = [input.previousValue];
      
      if (!input.mandatory && input.value === '') {
        values = [];
      }

      newOptions = getMergedLabelAndData();
      //else newOptions.push(highed.getLetterIndex(input.value.charAt(0)));
    }
    
    input.previousValue = input.value.toUpperCase();
    
    cb(previousValues.map(function (x) {
      return highed.getLetterIndex(x);
    }), values.map(function (x) {
      return highed.getLetterIndex(x);
    }), input, newOptions);

  }

  function getFieldsToHighlight(cb, overrideCheck) {
    Object.keys(options).forEach(function(key) {

      var input = options[key];

      if (key === 'data') {
        Object.keys(input).forEach(function(dataKey) {
          processField(input[dataKey], overrideCheck, cb);
        });
      } else {
        processField(input, overrideCheck, cb);
      }
    });
    events.emit("ChangeData", options);
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
    labels = highed.dom.cr('div', 'highed-assigndatapanel-data-options'),
    selectContainer = highed.dom.cr('div', 'highed-assigndatapanel-select-container'),
    inputContainer = highed.dom.cr('div', 'highed-assigndatapanel-inputs-container'),
    seriesTypeSelect = highed.DropDown(selectContainer, ' highed-assigndatapanel-series-dropdown');

  seriesTypeSelect.addItems([{
    id: 'line',
    title: 'Line'
  }]);
  
  seriesTypeSelect.selectById('line');

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
  
  function getValues(input) {
    const delimiter = (input.indexOf('-') > -1 ? '-' : ',');
    const output = input.split(delimiter).sort();

    output.forEach(function(value, index){
      output[index] = getLetterIndex(value);
    });

    return output;
  }

  function setAssignDataFields(data) {
    if (!data) return;

    var seriesType;

    if (data.config) seriesType = data.config.chart.type;
    else seriesType = (data.template && data.template.chart ? data.template.chart.type || data.theme.options.chart.type || 'line' : 'line');

    seriesTypeSelect.clear();

    seriesTypeSelect.addItems([{
      id: seriesType,
      title: seriesType
    }]);
    seriesTypeSelect.selectById(seriesType);

    options = {};
    options = Object.assign(options, defaultOptions);

    //options = defaultOptions;
    chartTypeOptions = highed.meta.charttype[seriesType];
    if (chartTypeOptions && chartTypeOptions.data) {
      options.data = null;
    }

    highed.merge(options, highed.meta.charttype[seriesType]);

    resetDOM();
    events.emit('ChangeData', options);
  }
/*
  function checkValues(newValue, otherValue) {
    const values = getValues(newValue);
    const values2 = getValues(otherValue);        

    if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
      found = true;
      return false;
    }
  }
*/
  function valuesMatch(newValue, key) {
    var found = false,
        values = [],
        values2 = [];

    Object.keys(options).forEach(function(key2) {
        if (key === key2) return;
/*
        if (key === 'data') {
          Object.keys(options[key2]).forEach(function(key3) {

            if (key === key3) return;
            values = getValues(newValue);
            values2 = getValues(options[key2][key3].value);        
            if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
              found = true;
              return false;
            }
            
          });
        }*/
/*
        values = getValues(newValue);
        values2 = getValues(options[key2].value);

        if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
          found = true;
          return false;
        }*/
    });
    return found;
  }

  highed.dom.ap(body, header);
  highed.dom.ap(labels, selectContainer, inputContainer);

  function generateInputs(option, key) {

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
                                 highed.dom.cr('h6', '', option.name),
                                 highed.dom.cr('span', 'highed-assigndatapanel-data-mandatory ' + (option.mandatory ? 'active' : ''), 'Mandatory')),
                               highed.dom.cr('div', 'highed-assigndatapanel-data-desc', option.desc),
                               labelInput);
  
    highed.dom.ap(inputContainer, label);
  }

  function resetDOM() {
    
    inputContainer.innerHTML = '';

    Object.keys(options).forEach(function(key) {
      var option = options[key];
  
      if (key === 'data') {
        Object.keys(option).forEach(function(dataKey) {
          generateInputs(option[dataKey], dataKey);
        })
      } else {
        generateInputs(option, key);
      }
    });  
  }

  highed.dom.ap(body, labels);
  resetDOM();
  highed.dom.ap(parent, highed.dom.ap(container, bar, body));
  events.emit('AssignDataChanged', options);
  return {
    on: events.on,
    hide: hide,
    show: show,
    getOptions: getOptions,
    resetValues: resetValues,
    resize: resize,
    getFieldsToHighlight: getFieldsToHighlight,
    getMergedLabelAndData: getMergedLabelAndData,
    setAssignDataFields: setAssignDataFields
  };
};
