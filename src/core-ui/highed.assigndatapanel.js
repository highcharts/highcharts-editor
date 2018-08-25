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
      'id': 'labels',
      'name': "Categories",
      'desc': 'A column of names or times',
      'default': 'A',
      'value': 'A',
      'rawValue': [0],
      'previousValue': null,
      'linkedTo': 'x',
      'mandatory': true,
      'colors': {
        'light': 'rgba(66, 200, 192, 0.2)',
        'dark': 'rgb(66, 200, 192)',
      }
    },
    "data": [{
        'id': 'values',
        'name': "Values",
        'desc': 'Enter columns with the values you want to chart. You can enter a range using a hyphen.',
        'default': 'B-C',
        'linkedTo': 'y',
        'value': 'B-C',
        'rawValue': [1, 2],
        'multipleValues': true,
        'previousValue': null,
        'mandatory': true,
        'colors': {
          'light': 'rgba(145, 151, 229, 0.2)',
          'dark': 'rgb(145, 151, 229)',
        }
      }
    ],
    'label': {
      'id': 'label',
      'name': "Label",
      'desc': 'The name of the point as shown in the legend, tooltip, data label etc.',
      'default': '',
      'value': '',
      'rawValue': null,
      'previousValue': null,
      'mandatory': false,
      'linkedTo': 'label',        
      'colors': {
        'light': 'rgba(229, 145, 145, 0.2)',
        'dark': 'rgb(229, 145, 145)',
      }
    }
  },
  options = {},
  toggled = false,
  columnLength = 0;

  Object.assign(options, defaultOptions);
  
  function init(colLength) {
    columnLength = colLength;
    
    highed.dom.ap(body, labels);
    resetDOM();
    highed.dom.ap(parent, highed.dom.ap(container, bar, body));
    events.emit('AssignDataChanged', options);
  }
  
  function resetValues() {
    Object.keys(options).forEach(function(key) {
      if (highed.isArr(options[key])) {
        options[key].forEach(function(object) {
          object.previousValue = null;
          object.value = object.default;
        });
        //Object.keys(options[key]).forEach(function(dataKey) {
         // options[key][dataKey].previousValue = null;
         // options[key][dataKey].value = options[key][dataKey].default;
        //});
      } else {
        options[key].previousValue = null;
        options[key].value = options[key].default;
      }
    });
  }

  function getAssignDataFields() {
    
    var arr = {
      data: {}
    };

    Object.keys(options).forEach(function(key){
      if (highed.isArr(options[key])) {
        
        options[key].forEach(function(object) {
          arr[key][object.id] = object.value;
        });
      } else {
        if (options[key].value === '' || options[key].value === null) return;
        arr[key] = options[key].value;
      }
    });

    return arr;
  }

  function getMergedLabelAndData() {
    var arr = {},
        extraColumns = [];
    Object.keys(options).forEach(function(optionKeys) {
      if (optionKeys === 'labels') {
        arr.labelColumn = highed.getLetterIndex(options[optionKeys].value.charAt(0));
      } else if (highed.isArr(options[optionKeys])) {

        const allData = options[optionKeys];
        var values = [];
        allData.forEach(function(data) {
          if (data.multipleValues) {
            const userValues = data.value.split(data.value.indexOf('-') > -1 ? '-' : ',').sort();
            var tempValue = highed.getLetterIndex(userValues[0]);
            values = [];  
            while(tempValue <= highed.getLetterIndex(userValues[userValues.length - 1])) {
              values.push(tempValue);
              tempValue++;
            }
            arr.dataColumns = values;
          } else {
            values.push(data.rawValue[0]);
            arr.dataColumns = values;
          }
        });
        arr.dataColumns.sort();
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

  function getLetterFromIndex(num) {
    return String.fromCharCode(num + 65);
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
    input.rawValue = values.map(function (x) {
      return highed.getLetterIndex(x);
    });

    cb(previousValues.map(function (x) {
      return highed.getLetterIndex(x);
    }), input.rawValue, input, newOptions);

  }

  function getFieldsToHighlight(cb, overrideCheck) {
    Object.keys(options).forEach(function(key) {

      var input = options[key];

      if (highed.isArr(input)) {
        /*
        Object.keys(input).forEach(function(dataKey) {
          processField(input[dataKey], overrideCheck, cb);
        });*/
        input.forEach(function(object) {
          processField(object, overrideCheck, cb);
        })
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
      height: (h - 5) + 'px'
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
    headerToggle = highed.dom.cr('span', '', '<i class="fa fa-chevron-down highed-assigndatapanel-toggle" aria-hidden="true"></i>'),
    header = highed.dom.ap(
              highed.dom.cr('div', 'highed-assigndatapanel-header-container'), 
              highed.dom.ap(highed.dom.cr('h3', 'highed-assigndatapanel-header', 'Assign columns for this chart'), headerToggle)),
    labels = highed.dom.cr('div', 'highed-assigndatapanel-data-options'),
    selectContainer = highed.dom.cr('div', 'highed-assigndatapanel-select-container'),
    inputContainer = highed.dom.cr('div', 'highed-assigndatapanel-inputs-container'),
    seriesTypeSelect = highed.DropDown(selectContainer, ' highed-assigndatapanel-series-dropdown');
  
  highed.dom.style(selectContainer, {
    display: "none"
  });

  highed.dom.on(headerToggle, 'click', function() {

    const height = (toggled ? '48px' : 'initial');
    const overflow = (toggled ? 'hidden' : 'auto');
    
    highed.dom.style(container, {
      height: height,
      overflow: overflow
    });

    toggled = !toggled;
  });
/*
  seriesTypeSelect.addItems([{
    id: 'line',
    title: 'Line'
  }]);
  
  seriesTypeSelect.selectById('line');
*/
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

  function setAssignDataFields(data, maxColumns, init) {
    if (!data) return;

    columnLength = maxColumns;
    var seriesType;

    if (data.config) seriesType = data.config.chart.type;
    else seriesType = (data.template && data.template.chart ? data.template.chart.type || data.theme.options.chart.type || 'line' : 'line');
/*
    seriesTypeSelect.clear();

    seriesTypeSelect.addItems([{
      id: seriesType,
      title: seriesType
    }]);
    seriesTypeSelect.selectById(seriesType);
*/

    options = {};
    options = Object.assign(options, defaultOptions);

    //options = defaultOptions;
    chartTypeOptions = highed.meta.charttype[seriesType];
    if (chartTypeOptions && chartTypeOptions.data) {
      options.data = null;
    }

    highed.merge(options, highed.meta.charttype[seriesType]);
    
    if (data.settings && data.settings.dataProvider && data.settings.dataProvider.assignDataFields) {
      const dataFields = data.settings.dataProvider.assignDataFields;
      Object.keys(dataFields).forEach(function(key){
        if (highed.isArr(dataFields[key])) {
          dataFields[key].forEach(function(object, i) {
            if (object) object.value = dataFields[key][object.id];
          });
        } else {
          if (options[key]) options[key].value = dataFields[key];
        }
      });
    } else {
      // Probably a legacy chart, change values to equal rest of chart
      if (options.data.values && init) {
        options.data.values.value = 'B' + (getLetterFromIndex(maxColumns - 1) !== 'B' ? '-' + getLetterFromIndex(maxColumns - 1) : '');
      }
    }

    resetDOM();
    events.emit('ChangeData', options);
  }

  function checkValues(newValue, prevValue) {
    values = getValues(newValue);
    values2 = getValues(prevValue);
    console.log(values, values2);
    if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
      return true;
    }
    return false;
  }

  function valuesMatch(newValue, object) {

    var found = false
        values = [],
        values2 = [];
    Object.keys(options).forEach(function(key) {
      if (object.id === options[key].id || found) return;
      if (highed.isArr(options[key])) {

        (options[key]).forEach(function(o) {
          console.log(object.id, o.id)
          if (object.id === o.id) return;
          console.log("comparing: ", newValue, o.value);
          found = checkValues(newValue, o.value);
          if (found) return false;
        });
      } else {
        found = checkValues(newValue, options[key].value);
        if (found) return false;
      }

    });
    console.log(found);
    return found;

  }

  
  highed.dom.ap(body, header);
  highed.dom.ap(labels, selectContainer, inputContainer);

  function generateInputs(option, key) {

    var labelInput,
        valueContainer = highed.dom.cr('div', 'highed-assigndatapanel-input-container');

    if (option.multipleValues) {
      labelInput = highed.dom.cr('input', 'highed-assigndatapanel-input');
      highed.dom.ap(valueContainer, labelInput);

      highed.dom.on(labelInput, 'focus', function() {
        option.previousValue = (option.multipleValues ? labelInput.value : labelInput.value.charAt(0)).toUpperCase(); //labelInput.value;
      });

      highed.dom.on(labelInput, 'blur', function() {
        /*
        if (labelInput.value === '' && option.mandatory) {
          option.value = option.previousValue;
          labelInput.value = option.previousValue;
        } else*/ if (valuesMatch(labelInput.value.toUpperCase(), option)) {
          option.value = option.previousValue;
          labelInput.value = option.previousValue;
          alert("This column has already been assigned a value. Please select a different column");
        }
        else option.value = labelInput.value.toUpperCase();

        events.emit('AssignDataChanged', options);
      });
    }
    else {
      labelInput = highed.DropDown(valueContainer, 'highed-assigndata-dropdown');
      if(!option.mandatory){
        labelInput.addItem({
          id: '',
          title: ''
        });
      }
      for(var i = 0; i < columnLength; i++) {
        labelInput.addItem({
          id: getLetterFromIndex(i),
          title: getLetterFromIndex(i),
        });
      }
      
      labelInput.selectById(option.value);

      labelInput.on('Change', function(selected) {
        //detailIndex = selected.index();
        detailValue = selected.id();
        console.log(detailValue, option);
        if (valuesMatch(detailValue, option)) {
          option.value = option.previousValue;

          labelInput.selectById(option.previousValue);
          alert("This column has already been assigned a value. Please select a different column");
        }
        else option.value = detailValue;

        events.emit('AssignDataChanged', options);
        //liveDataTypeSelect.selectById(detailValue || 'json');
      });
    }
    var colors = option.colors || generateColors();

    option.colors = colors;

  
    labelInput.value = option.value;
    const colorDiv = highed.dom.cr('div', 'highed-assigndatapanel-color');
    
    highed.dom.style(colorDiv, {
      "background-color": option.colors.light,
      "border": '1px solid ' + option.colors.dark,
    });

    var label = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'), 
                               colorDiv,
                               highed.dom.ap(highed.dom.cr('p', '', option.name + ':'),
                                             highed.dom.cr('span', 'highed-assigndatapanel-data-mandatory', option.mandatory ? '*' : '')),
                                             valueContainer,
                               highed.dom.cr('div', 'highed-assigndatapanel-data-desc', option.desc));
  
    highed.dom.ap(inputContainer, label);
  }

  function resetDOM() {
    
    inputContainer.innerHTML = '';

    Object.keys(options).forEach(function(key) {
      var option = options[key];
  
      if (highed.isArr(option)) {
        
        
        (option).forEach(function(object) {
          generateInputs(object, key);
        })
        /*
        Object.keys(option).forEach(function(dataKey) {
          generateInputs(option[dataKey], dataKey);
        })*/

      } else {
        generateInputs(option, key);
      }
    });  
  }

  return {
    on: events.on,
    hide: hide,
    show: show,
    getOptions: getOptions,
    resetValues: resetValues,
    resize: resize,
    getFieldsToHighlight: getFieldsToHighlight,
    getMergedLabelAndData: getMergedLabelAndData,
    setAssignDataFields: setAssignDataFields,
    getAssignDataFields: getAssignDataFields,
    init: init
  };
};
