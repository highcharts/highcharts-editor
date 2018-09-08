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
      'rawValue': [0],
      'previousValue': null,
      'linkedTo': 'x',
      'mandatory': true,
      'colors': {
        'light': 'rgba(66, 200, 192, 0.2)',
        'dark': 'rgb(66, 200, 192)',
      }
    },
    'values': {
      'name': "Values",
      'desc': 'Enter column with the values you want to chart.',
      'default': 'B',
      'linkedTo': 'y',
      'isData': true,
      'value': 'B',
      'rawValue': [1],
      'previousValue': null,
      'mandatory': true,
      'colors': {
        'light': 'rgba(145, 151, 229, 0.2)',
        'dark': 'rgb(145, 151, 229)',
      }
    },
    'label': {
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
  options = [],
  toggled = false,
  columnLength = 0,
  index = 0,
  maxColumnLength = 1;

  options.push(highed.merge({}, defaultOptions));
  
  Object.keys(defaultOptions).forEach(function(key) {
    defaultOptions[key].colors = null;
  });
  
  function init(colLength) {
    columnLength = colLength;
    
    highed.dom.ap(body, labels);
    resetDOM();
    highed.dom.ap(parent, highed.dom.ap(container, bar, body));
    events.emit('AssignDataChanged', options[index]);
  }
  
  function resetValues() {
    Object.keys(options[index]).forEach(function(key) {
      options[index][key].previousValue = null;
      options[index][key].value = options[index][key].default;
    });
  }

  function getAssignDataFields() {

    var all = [];

    options.forEach(function(option) {
      var arr = {};
      Object.keys(option).forEach(function(key) {
        if (option[key].value === '' || option[key].value === null) return;
        arr[key] = option[key].value;
      });
      all.push(highed.merge({}, arr));
    });

    return all;
  }

  function getMergedLabelAndData() {
    var arr = {},
        extraColumns = [],
        values = [];

    Object.keys(options[index]).forEach(function(optionKeys) {
      if (optionKeys === 'labels') {
        arr.labelColumn = highed.getLetterIndex(options[index][optionKeys].value.charAt(0));
      } else if (options[index][optionKeys].isData) { //(highed.isArr(options[index][optionKeys])) {

        const allData = options[index][optionKeys];
        values.push(allData.rawValue[0]);
        arr.dataColumns = values;
        arr.dataColumns.sort();
      } else {
        // Check for any extra fields, eg. Name
        const extraValue = options[index][optionKeys];
        if (extraValue.value !== '') {
          extraColumns.push(highed.getLetterIndex(extraValue.value));
        }
      }
    });

    arr.extraColumns = extraColumns.sort();
    
    return arr; //arr.concat(values);
  }

  function getAllMergedLabelAndData() {
    var seriesValues = [];
    options.forEach(function(serie, i) {
      var arr = {},
      extraColumns = [],
      values = [];
      Object.keys(serie).forEach(function(optionKeys) {
          if (optionKeys === 'labels') {
            arr.labelColumn = highed.getLetterIndex(options[i][optionKeys].value.charAt(0));
          } else if (options[i][optionKeys].isData) { //(highed.isArr(options[i][optionKeys])) {
            const allData = options[i][optionKeys];
            /*
            allData.forEach(function(data) {
              values.push(data.rawValue[0]);
              arr.dataColumns = values;
            });*/
            values.push(allData.rawValue[0]);
            arr.dataColumns = values;
            arr.dataColumns.sort();
          } else {
            // Check for any extra fields, eg. Name
            const extraValue = options[i][optionKeys];
            if (extraValue.value !== '') {
              extraColumns.push(highed.getLetterIndex(extraValue.value));
            }
          }
      });
      arr.extraColumns = extraColumns.sort();
      seriesValues.push(highed.merge({}, arr));
    });
    return seriesValues;
  }

  function getLetterIndex(char) {
    return char.charCodeAt() - 65; 
  }

  function getLetterFromIndex(num) {
    return String.fromCharCode(num + 65);
  }

  function getActiveSerie() {
    return index;
  }

  function processField(input, overrideCheck, cb) {

    input.value = input.value.toUpperCase();
    var newOptions = [];

    var previousValues = [],
        values = [];
  
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
  
    input.previousValue = input.value.toUpperCase();
    input.rawValue = values.map(function (x) {
      return highed.getLetterIndex(x);
    });
    
    cb(previousValues.map(function (x) {
      return highed.getLetterIndex(x);
    }), input.rawValue, input, newOptions);

  }

  function getFieldsToHighlight(cb, overrideCheck) {
    Object.keys(options[index]).forEach(function(key) {
      var input = options[index][key];
      processField(input, overrideCheck, cb);
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

  function addSeries(length) {
    for(var i=0; i<length; i++) {
      addSerie();
    }
    seriesTypeSelect.selectByIndex(0);
  }

  function getOptions() {
    return options[index];
  }

  function getAllOptions() {
    return options;
  }

  function resize(w, h) {
       
    highed.dom.style(container, {
      height: (h - 5) + 'px'
    });
  }

  function addSerie(seriesType, redrawDOM) {
    if (!seriesType) seriesType = 'line';

    seriesTypeSelect.addItems([{
      id: options.length,
      title: 'Series ' + (options.length + 1) + ' - ' + capitalizeFirstLetter(seriesType)
    }]);


    if (maxColumnLength + 1 < columnLength) {
      maxColumnLength++;
    }

    const newOptions = highed.merge({}, defaultOptions);

    highed.merge(newOptions, highed.meta.charttype[seriesType]);
    clean(newOptions);
    
    if (newOptions.values) {
      newOptions.values.rawValue = [maxColumnLength]; //TODO: Change later
      newOptions.values.value = getLetterFromIndex(maxColumnLength);
    }

    options.push(highed.merge({}, newOptions));

    seriesTypeSelect.selectById(options.length - 1);
    if (redrawDOM) resetDOM();
  }

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
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function clean(obj) {
    Object.keys(obj).forEach(function(key) {
      if (highed.isNull(obj[key])) delete obj[key];
    });
  }

  function getSeriesType(data, index) {
    if (data.config) return data.config.chart.type;
    else {
      if (data.options && data.options.series && data.options.series[index] && data.options.series[index].type) return data.options.series[index].type;
      if (data.template && data.template.chart && data.template.chart.type) return data.template.chart.type;
      else if (data.theme && data.theme.options.chart && data.theme.options.chart.type) return data.theme.options.chart.type;
      else return 'line';
    }
  }

  function setAssignDataFields(data, maxColumns, init, seriesIndex) {

    if (!data) return;
    columnLength = maxColumns;
    var seriesType = getSeriesType(data, 0);
/*
    if (data.config) seriesType = data.config.chart.type;
    else {
      if (data.template && data.template.chart && data.template.chart.type) seriesType = data.template.chart.type;
      else if (data.theme && data.theme.options.chart && data.theme.options.chart.type)seriesType = data.theme.options.chart.type;
      else seriesType = 'line';
    }*/

    seriesTypeSelect.updateByIndex(seriesIndex || index, {
      title: 'Series ' + ((seriesIndex || index) + 1) + ' - ' + capitalizeFirstLetter(seriesType)
    });
    seriesTypeSelect.selectByIndex(index);
    

    chartTypeOptions = highed.meta.charttype[seriesType.toLowerCase()];

    if (chartTypeOptions && chartTypeOptions.data) {
      options[seriesIndex || index].data = null;
    }

    highed.merge(options[seriesIndex || index], highed.meta.charttype[seriesType]);
    clean(options[seriesIndex || index]);
    if (init) {

      if (data.settings && data.settings.dataProvider && data.settings.dataProvider.assignDataFields) {
        const dataFields = data.settings.dataProvider.assignDataFields;
  
        dataFields.forEach(function(option, index) {
          const seriesType = getSeriesType(data, index);
          if(!options[index]) {
            addSerie(seriesType);
          }
          Object.keys(option).forEach(function(key) {
            if (options[index][key]) {
              options[index][key].value = option[key];
              options[index][key].rawValue = [getLetterIndex(option[key])];
            }
          })
        });
      } else {
        // Probably a legacy chart, change values to equal rest of chart
  
        const length = maxColumns - 1;
        for(var i=1; i<length; i++) {
          if(!options[i]) {
            addSerie();
          }
  
          options[i].labels.rawValue = [0];
          options[i].labels.value = "A";
          options[i].values.rawValue[0] = i + 1;
          options[i].values.value = getLetterFromIndex(i + 1);
        }
      }
      seriesTypeSelect.selectByIndex(0);
    }

    resetDOM();
    events.emit('ChangeData', options);
  }

  function checkValues(newValue, prevValue) {
    values = getValues(newValue);
    values2 = getValues(prevValue);
    if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
      return true;
    }
    return false;
  }

  function valuesMatch(newValue, objectKey) {

    var found = false
        values = [],
        values2 = [];
    Object.keys(options[index]).some(function(key) {
      if (objectKey === key || found) return;
      /*
      if (highed.isArr(options[index][key])) {

        (options[index][key]).some(function(o) {
          if (object.id === o.id || found) return;
          found = checkValues(newValue, o.value);
          if (found) return false;
        });
      } else {*/
        found = checkValues(newValue, options[index][key].value);
        if (found) return false;
      //}

    });
    return found;

  }

  function generateInputs(option, key) {

    var labelInput,
        valueContainer = highed.dom.cr('div', 'highed-assigndatapanel-input-container');

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
      if (valuesMatch(detailValue, key)) {
        option.value = option.previousValue;

        labelInput.selectById(option.previousValue);
        alert("This column has already been assigned a value. Please select a different column");
      }
      else {
        option.value = detailValue;
        option.rawValue = [getLetterIndex(option.value.toUpperCase())];
        if (getLetterIndex(option.value.toUpperCase()) > maxColumnLength) {
          maxColumnLength = getLetterIndex(option.value.toUpperCase());
        }
      }

      events.emit('AssignDataChanged', options[index]);
      //liveDataTypeSelect.selectById(detailValue || 'json');
    });
    
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
    
    Object.keys(options[index]).forEach(function(key) {
      var option = options[index][key];
      generateInputs(option, key);
    });  
  }

  ////////////////////////////////////////////////////////////////////////////////


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
    addNewSeriesBtn = highed.dom.cr('button', 'highed-assigndatapanel-add-series', '<i class="fa fa-plus"/>'),
    deleteSeriesBtn = highed.dom.cr('button', 'highed-assigndatapanel-add-series', '<i class="fa fa-trash"/>'),
    seriesTypeSelect = highed.DropDown(selectContainer, ' highed-assigndatapanel-series-dropdown');
      
  highed.dom.ap(selectContainer, addNewSeriesBtn, deleteSeriesBtn);

  highed.dom.on(deleteSeriesBtn, 'click', function() {
    
    if (index === 0) {
      highed.snackBar("Cannot delete this series");
      return;
    }

    if (confirm("Are you sure you want to delete this series?")) {
      options.splice(index, 1);
      seriesTypeSelect.deleteByIndex(index);
      const allSeries = seriesTypeSelect.selectAll();

      events.emit('DeleteSeries', index);
      setTimeout(function() {
        events.emit('AssignDataChanged');
      }, 1000);
  
      for(var i=index; i < options.length; i++) {
        seriesTypeSelect.updateByIndex(i, {
          title: 'Series ' + (i + 1) + ' -' + allSeries[i].title().split('-')[1]
        }, i);
      }
  
      seriesTypeSelect.selectByIndex(index - 1);
      highed.snackBar("Series " + (index + 2) + " Deleted");
    }

  });

  highed.dom.on(addNewSeriesBtn, 'click', function() {
    addSerie(null, true);
    events.emit('AssignDataChanged');
  });
  
  seriesTypeSelect.on('Change', function(selected) {
    index = selected.id();
    resetDOM();
    events.emit('RedrawGrid', true);
    events.emit('SeriesChanged', index);
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

  seriesTypeSelect.addItems([{
    id: 0,
    title: 'Series ' + (options.length) + ' - Line'
  }]);
  
  seriesTypeSelect.selectById(0);

  highed.dom.ap(body, header);
  highed.dom.ap(labels, selectContainer, inputContainer);

  return {
    on: events.on,
    hide: hide,
    show: show,
    getOptions: getOptions,
    resetValues: resetValues,
    resize: resize,
    getFieldsToHighlight: getFieldsToHighlight,
    getMergedLabelAndData: getMergedLabelAndData,
    getAllMergedLabelAndData: getAllMergedLabelAndData,
    setAssignDataFields: setAssignDataFields,
    getAssignDataFields: getAssignDataFields,
    getAllOptions: getAllOptions,
    getActiveSerie: getActiveSerie,
    addSeries: addSeries,
    init: init
  };
};
