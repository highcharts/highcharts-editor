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
      });

      addMapPointInput.placeholder = 'New York';
  //////////////////////////////////////////////////////////////////////////////

  table.on('InputChanged', function(){
    events.emit('UpdateDataGridWithLatLong', table.getData());
  })


  highed.dom.on(addMapPointBtn, 'click', function() {
    if (addMapPointInput.value === '') return;
    getResult(addMapPointInput.value);
  });

  function getResult(location) {
    mapApi.getLatLong(location, function (result) {
      if (!result) return;
      table.addRow([result.lat,result.lon, addMapPointInput.value]);
      addMapPointInput.value = '';

      events.emit('UpdateDataGridWithLatLong', table.getData());
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