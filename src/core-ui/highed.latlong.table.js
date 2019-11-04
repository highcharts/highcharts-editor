/******************************************************************************

Copyright (c) 2016-2019, Highsoft

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
/** Map Data Table for Lat/Long points (Map Point)
 */

highed.LatLongTable = function() {
  var events = highed.events(),
      container = highed.dom.cr('div', 'highed-maps-datatable'),
      mapApi = highed.MapApi(),
      addMapPointInput = highed.dom.cr('input', 'highed-map-add-latlong'),
      addMapPointBtn = highed.dom.cr('button', 'highed-map-add-latlong-btn highed-ok-button highed-import-button negative', 'Add'),
      table = highed.MapTable(container, {
        selects: [],
        header: 'Add Data Points',
        description: [
          'With this template type, we use latitude/longitude values to map points.',
          'If you do not know these for a specific point, simply add the address below and we will add it in for you.', 
          'These can be removed from the table by clicking on the trash icon or you can edit the value by selecting it in the table.',
          highed.config && highed.config.mapApi && highed.config.mapApi.credit ? ' <a target="_blank" class="highed-sponsored-link" href="' + highed.config.mapApi.credit.href + '">' + highed.config.mapApi.credit.text + '</a>' : '']
          .join(' '),
        className: 'highed-map-add-points',
        extra: highed.dom.ap(
          highed.dom.cr('div', 'highed-add-map-point-container'),
          highed.dom.cr('span', '', 'Add New Point: '),
          addMapPointInput,
          addMapPointBtn
        ),
        noSaveBtn: true,
        canDelete: true,
        hiddenValues: [0, 1]
      }),
      resultModal = highed.OverlayModal(false, {
        width: 450,
        height: 350, 
        class: ' highed-annotations-modal highcharts-popup highcharts-popup-annotations',
        showOnInit: true
      }),
      results = [],
      resultContainer = highed.dom.cr('div', 'highed-latlong-results'),
      resultBtn = highed.dom.btn('Select', 'highed-ok-button highed-import-button negative highed-latlong-result-btn', 'highed-latlong-result-btn', function(){

        const val = document.querySelector('input[name="results"]:checked').value;
        table.addRow([results[val].lat,results[val].lon, addMapPointInput.value]);
        addMapPointInput.value = '';

        events.emit('UpdateDataGridWithLatLong', table.getData());
        hideModal()
        results = [];

      }),
      selectPointHeader = highed.dom.cr('div', 'highed-premium-feature-header'),
      selectPointCloseBtn = highed.dom.btn('', 'close-btn', '', function(){
        resultModal.hide();
      });

      highed.dom.ap(selectPointCloseBtn, highed.dom.cr('span', 'fas fa-times'));
      highed.dom.ap(selectPointHeader, highed.dom.cr('span', '', 'Select Point'), selectPointCloseBtn)

      addMapPointInput.placeholder = 'New York';

      highed.dom.ap(resultModal.body,selectPointHeader,resultContainer, resultBtn);

  //////////////////////////////////////////////////////////////////////////////

  table.on('InputChanged', function(){
    events.emit('UpdateDataGridWithLatLong', table.getData());
  })


  highed.dom.on(addMapPointBtn, 'click', function() {
    if (addMapPointInput.value === '') return;
    getResult(addMapPointInput.value);
  });

  function hideModal(){
    resultModal.hide();
  }
  
  function truncate(input, length) {
    if (input.length > length) return input.substring(0,length) + '...';
    return input;
  }

  function showModal(results){

    resultContainer.innerHTML = '';
    results.forEach(function(result, index) {
      var radioContainer = highed.dom.cr('div', 'latlong-result-container');

      var radio = highed.dom.cr('input', '');
      radio.type = 'radio';
      radio.value = index;
      radio.name = 'results';
      
      if (index === 0) radio.checked = true;

      var span = highed.dom.cr('span', '', truncate(result.name, 50));
      span.title = result.name;

      highed.dom.ap(resultContainer, highed.dom.ap(radioContainer, radio, span));
    });

    resultModal.show();
  }

  function getResult(location) {
    mapApi.getLatLong(location, function (latlongResults) {
      if (!latlongResults) return;

      results = latlongResults;
      showModal(latlongResults);


    });
  }

  function createTable() {

    highed.dom.ap(container,
      table.createTable([['Latitude', 'Longitude', 'Name']], function(){
    }));

    return container;
  }

  function resize(){
    table.resize();
  }

  function hide(){
    table.hide(); 
  }

  return {
    on: events.on,
    resize: resize,
    createTable: createTable,
    hide: hide
  };
};
