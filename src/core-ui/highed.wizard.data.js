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


/** Wizard Data
 * 
*/
highed.WizardData = function(importer, mapImporter, chartContainer) {

  events = highed.events(),
  latLongTable = null,
  mapDataTableElement = null,
  dropzone = null,
  container = highed.dom.cr('div', 'highed-table-dropzone-container'),
  downloadCSVLink = highed.dom.cr('a', 'highed-download-csv', 'Download Map Data'),
  dropCSVFileHere = highed.dom.cr('div', 'highed-table-dropzone-title', 'Drop CSV files here');

////////////////////////////////////////////////////////////////////////////


  highed.dom.on(downloadCSVLink, 'click', function(){
    events.emit('DownloadMapCSVStub');
  });

  function createTableInputs(inputs, maxColSpan, extraClass) {

    var table = highed.dom.cr('table', 'highed-createchartwizard-table'),
    maxColSpan = maxColSpan,
    currentColSpan = maxColSpan,
    tr;

    inputs.forEach(function(input) {
      if (currentColSpan >= maxColSpan) {
        tr = highed.dom.cr('tr', extraClass);
        highed.dom.ap(table, tr);
        currentColSpan = 0;
      }

      currentColSpan += input.colspan;
      input.element = {};

      if (input.type && input.type === 'select') {
        input.element.dropdown = highed.DropDown(null, 'highed-wizard-dropdown-container');
        input.element.dropdown.addItems([
          {id: 'columnsURL', title: "JSON (Column Ordered)"},
          {id: 'rowsURL', title: "JSON (Row Ordered)"},
          {id: 'csvURL', title: "CSV"}
        ]);
        input.element.dropdown.selectByIndex(0);
        input.element.dropdown.on('Change', function(selected) {
          detailValue = selected.id();
        });

        input.element.input = input.element.dropdown.container;

      } else input.element.input = highed.dom.cr('input','highed-imp-input-stretch');
      if (input.placeholder) input.element.input.placeholder = input.placeholder
      input.element.label = highed.dom.cr('span', '', input.label);
      
      const tdLabel = highed.dom.ap(highed.dom.cr('td', 'highed-modal-label'), input.element.label),
            tdInput = highed.dom.ap(highed.dom.cr('td', ''), input.element.input);
      
      tdLabel.colSpan = 1;
      tdInput.colSpan = input.colspan - 1;

      highed.dom.ap(tr, tdLabel, tdInput);
    });
    return table;
  }

  function createCancelBtn() {
    cancel = highed.dom.cr('button', 'highed-ok-button highed-import-button grey', 'Cancel');
    highed.dom.on(cancel, 'click', function() {
      dataModal.hide();
    });
    return cancel;
  }

  function createLiveDataContainer(toNextPage, props) {
    const container = highed.dom.cr('div', 'highed-modal-container'),
    inputs = [
      { label: 'URL', placeholder: 'Spreadsheet ID', colspan: 2, linkedTo: props.liveDataInput},
      { label: 'Refresh Time in Seconds', placeholder: 'Refresh time  (leave blank for no refresh)', colspan: 2, linkedTo: props.liveDataIntervalInput},
      { label: 'Type', colspan: 2, linkedTo: props.liveDataTypeSelect, type:'select'}],
    table = createTableInputs(inputs, 2, 'highed-live-data'),
    importData = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Import Data'),
    cancel = createCancelBtn();

    highed.dom.on(importData, 'click', function() {
      showLiveData(true);
      dataModal.hide();
      inputs.forEach(function(input) {
        if (input.type && input.type === 'select') {
          input.linkedTo.selectByIndex(input.element.dropdown.getSelectedItem().index());
        }
        else input.linkedTo.value = input.element.input.value;
      });
      liveDataLoadButton.click();
      toNextPage();
    });
    highed.dom.ap(container, 
      highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', 'Import Live Data'),
      highed.dom.ap(highed.dom.cr('div'), 
        highed.dom.cr('div', 'highed-modal-text', 'Live data needs a url to your JSON data to reference.'),
        highed.dom.cr('div', 'highed-modal-text', 'This means that the published chart always loads the latest version of your data.')),
      highed.dom.ap(highed.dom.cr('div', 'highed-table-container'), table),
      highed.dom.ap(highed.dom.cr('div', 'highed-button-container'), importData, cancel));
    
    return container;
  }

  function createGSheetContainer(toNextPage, props) {
    const container = highed.dom.cr('div', 'highed-modal-container');
    inputs = [
      { label: 'Google Spreadsheet ID', placeholder: 'Spreadsheet ID', colspan: 4, linkedTo: props.gsheetID},
      { label: 'Worksheet', placeholder: 'Worksheet (leave blank for first)', colspan: 4, linkedTo: props.gsheetWorksheetID},
      { label: 'Refresh Time in Seconds', placeholder: 'Refresh time  (leave blank for no refresh)', colspan: 4, linkedTo: props.gsheetRefreshTime},
      { label: 'Start Row', colspan: 2, linkedTo: props.gsheetStartRow},
      { label: 'End Row', colspan: 2, linkedTo: props.gsheetEndRow},
      { label: 'Start Column', colspan: 2, linkedTo: props.gsheetStartCol},
      { label: 'End Column', colspan: 2, linkedTo: props.gsheetEndCol}],
    table = createTableInputs(inputs, 4),
    connectSheet = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Connect Sheet');
    cancel = createCancelBtn();

    highed.dom.on(connectSheet, 'click', function() {
      showGSheet(true);
      dataModal.hide();
      inputs.forEach(function(input) {
        input.linkedTo.value = input.element.input.value;
      });
      gsheetLoadButton.click();
      toNextPage();
    });

    highed.dom.ap(container, 
                  highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', 'Connect Google Sheet'),
                  highed.dom.ap(highed.dom.cr('div'), 
                    highed.dom.cr('div', 'highed-modal-text', 'When using Google Spreadsheet, Highcharts references the sheet directly.'),
                    highed.dom.cr('div', 'highed-modal-text', 'This means that the published chart always loads the latest version of the sheet.'),
                    highed.dom.cr('div', 'highed-modal-text', 'For more information on how to set up your spreadsheet, visit the documentation.')),
                  highed.dom.ap(highed.dom.cr('div', 'highed-table-container'), table),
                  highed.dom.ap(highed.dom.cr('div', 'highed-button-container'), connectSheet, cancel));

    return container;
  }

  function createCutAndPasteContainer(toNextPage) {
    const container = highed.dom.cr('div', 'highed-modal-container');
    importData = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Import Data');
    input = highed.dom.cr('textarea', 'highed-table-input'),
    cancel = createCancelBtn();

    highed.dom.on(importData, 'click', function() {
      importer.emitCSVImport(input.value);
      dataModal.hide();
      toNextPage();
    });

    highed.dom.ap(container, 
                  highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', 'Cut And Paste Data'),
                  highed.dom.ap(
                    highed.dom.cr('div'), 
                    highed.dom.cr('div', 'highed-modal-text', 'Paste CSV into the below box, or upload a file. Click Import to import your data.')
                  ),
                  highed.dom.ap(highed.dom.cr('div'), input),
                  highed.dom.ap(highed.dom.cr('div', 'highed-button-container'), importData, cancel));

    return container;
  }

  function createSampleData(toNextPage, loading) {
    const container = highed.dom.cr('div', 'highed-modal-container'),
          buttonsContainer = highed.dom.cr('div', 'highed-modal-buttons-container');

    highed.samples.each(function(sample) {
      var data = sample.dataset.join('\n'),
        loadBtn = highed.dom.cr(
          'button',
          'highed-box-size highed-imp-button',
          sample.title
        );

      highed.dom.style(loadBtn, { width: '99%' });

      highed.dom.on(loadBtn, 'click', function() {
        loading(true);
        dataModal.hide();
        importer.emitCSVImport(data, function() {
          loading(false);
          if (toNextPage) toNextPage();
        });
      });

      highed.dom.ap(
        buttonsContainer,
        //highed.dom.cr('div', '', name),
        //highed.dom.cr('br'),
        loadBtn,
        highed.dom.cr('br')
      );
    });

    highed.dom.ap(container, buttonsContainer);
    
    return container;
  }

  function createSimpleDataTable(toNextPage, loading, props) {
    var selectFile = highed.dom.cr('button', 'highed-ok-button highed-import-button', 'Select File'),
        buttonsContainer = highed.dom.cr('div'),
        modalContainer = highed.dom.cr('div', 'highed-table-modal'),
        gSheetContainer = createGSheetContainer(toNextPage, props),
        liveContainer = createLiveDataContainer(toNextPage, props),
        sampleDataContainer = createSampleData(toNextPage, loading);
        cutAndPasteContainer = createCutAndPasteContainer(toNextPage);

        latLongTable = highed.LatLongTable(toNextPage);

        latLongTable.on('UpdateDataGridWithLatLong', function(data){
          events.emit('UpdateDataGridWithLatLong', data);
        })
        mapDataTableElement =  latLongTable.createTable();
        mapImporter.init(container, toNextPage);

    var buttons = []; 
    
    if (highed.chartType !== 'Map') {
      buttons = [ { title: 'Load Sample Data', linkedTo: sampleDataContainer},
                  { title: 'Connect Google Sheet', linkedTo: gSheetContainer}, 
                  { title: 'Import Live Data', linkedTo: liveContainer, height: 321}, 
                  { title: 'Cut and Paste Data', linkedTo: cutAndPasteContainer, height: 448, width: 518}];
    }
    
    mapDataTableElement.classList += ' hide';
    //mapDataTableElement = highed.dom.cr('div');

    buttons.forEach(function(buttonProp) {
      const button = highed.dom.cr('button', 'highed-ok-button highed-import-button', buttonProp.title);
      highed.dom.on(button, 'click', function() {
        dataModal.resize(buttonProp.width || 530, buttonProp.height || 530);
        modalContainer.innerHTML = '';
        highed.dom.ap(modalContainer, buttonProp.linkedTo);
        dataModal.show();
      });
      highed.dom.ap(buttonsContainer, button);
    });

    highed.dom.on(selectFile, 'click', function() {
      highed.readLocalFile({
        type: 'text',
        accept: '.csv',
        success: function(info) {
          if (highed.chartType === 'Map') {
            hideMapDataSection(loading);
            mapImporter.show(info.data);
          }
          else {
            highed.snackBar('File uploaded');
            importer.emitCSVImport(info.data);
            //events.emit("AssignDataForFileUpload", info.data); - Does this later in loadCSV
            toNextPage();
          }
        }
      });
    });
    
    dataModal = highed.OverlayModal(false, {
      minWidth: 530,
      minHeight: 530,
      showCloseIcon: true
    });

    highed.dom.ap(dataModal.body, modalContainer);

    container.ondragover = function(e) {
      e.preventDefault();
    };

    container.ondrop = function(e) {
      e.preventDefault();

      var d = e.dataTransfer;
      var f;
      var i;

      if (d.items) {
        for (i = 0; i < d.items.length; i++) {
          f = d.items[i];
          if (f.kind === 'file') {

            if (f.getAsFile().type !== 'text/csv') return highed.snackBar('The file is not a valid CSV file');
            hideMapDataSection(loading);

            events.emit('HandleFileUpload', f.getAsFile(), function() {
              highed.snackBar('File uploaded');
              toNextPage();
            });
          }
        }
      } else {
        for (i = 0; i < d.files.length; i++) {
          f = d.files[i];

          if (f.type !== 'text/csv') return highed.snackBar('The file is not a valid CSV file');
          hideMapDataSection(loading);

          events.emit('HandleFileUpload', f, function() {
            highed.snackBar('File uploaded');
            toNextPage();
          });
        }
      }
    };

    var dropzoneSpan = highed.dom.cr('span');

    highed.dom.ap(dropzoneSpan,
      highed.dom.cr('div', 'highed-table-dropzone-subtitle', 'or'),
      highed.dom.ap(
        highed.dom.cr('div', 'highed-table-dropzone-button'),
        selectFile
      )
    );

    dropzone = highed.dom.cr('div','highed-table-dropzone ' + (highed.chartType === 'Map' ? 'highed-table-map-dropzone' : ''));

    if (highed.chartType !== 'Map') {
      highed.dom.style(downloadCSVLink, {
        display: 'none'
      });
    }

    highed.dom.ap(container, 
      mapDataTableElement,
      //chartContainer,
      highed.dom.ap(
        dropzone,
        dropCSVFileHere,
        dropzoneSpan,
        highed.dom.cr('div', 'highed-table-dropzone-subtitle highed-table-dropzone-message', buttons.length > 0 ? 'You can also:' : ''),
        buttonsContainer,
        downloadCSVLink
      ),
      chartContainer
    );

    return container;
  }

  function hideMapDataSection(loading){
    latLongTable.hide();
    highed.dom.style(dropzone, {
      display: 'none'
    })
    loading(true);
  }


  function showLatLongTable(type) {
    if (mapDataTableElement) {

      highed.dom.style(downloadCSVLink, {
        display: 'none'
      });

      mapImporter.addToSelects([{
        name: 'Latitude',
        value: 'latitude',
        colors: {
          light: 'rgba(196, 202, 212, 0.5)',
          dark: 'rgb(66, 200, 192)'
        }
      },{
        name: 'Longitude',
        value: 'longitude',
        colors: {
          light: 'rgba(247, 161, 170, 0.5)',
          dark: 'rgb(66, 200, 192)'
        }
      },{
        name: 'Labels',
        value: 'label',
        colors: {
          light: 'rgba(247, 161, 170, 0.5)',
          dark: 'rgb(66, 200, 192)'
        }
      }], 2);

      if (type === 'mappoint') {
        mapDataTableElement.classList.remove('hide');
        mapDataTableElement.classList += ' active';
        dropCSVFileHere.innerHTML = 'Or drop CSV files here';
        
        if (!container.classList.contains('map-data')) container.classList += ' map-data';
  
        mapImporter.removeFromSelects(1);
        resize();
        highed.dom.style(container, {
          marginLeft: 0 + 'px'
        })
      }

    }
  }

  function getMapValueFromCode(key, assignedValue) {
    rows.some(function(row) {
      if (row.columns[0].element.children[0].getAttribute('data-value') === key) {
        value = row.columns[assignedValue.dataColumns[0]];
        return true;
      }
    });
    return value;
  }

  function resize() {
    
    setTimeout(function() {
      highed.dom.style(mapDataTableElement, {
        width: (highed.dom.size(container).w - highed.dom.size(chartContainer).w) - 13 + 'px'
      });
      highed.dom.style(dropzone, {
        width: highed.dom.size(chartContainer).w + highed.dom.size(mapDataTableElement).w + 3 + 'px'
      })
    }, 10);

    latLongTable.resize();
  }
  ////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    createSimpleDataTable: createSimpleDataTable,
    getMapValueFromCode: getMapValueFromCode,
    showLatLongTable: showLatLongTable,
    resize: resize,
    container: function() {
      return container;
    }
  };
};
