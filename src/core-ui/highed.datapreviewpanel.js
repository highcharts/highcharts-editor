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

highed.DataPreviewPanel = function(parent, attr) {
  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-datapreviewpanel highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-datapreviewpanel-bar highed-box-size'),
    body = highed.dom.cr(
      'div',
      'highed-datapreviewpanel-body highed-box-size highed-transition'
    ),
    dataBtn = highed.dom.cr(
      'button',
      'highed-ok-button highed-datapreviewpanel-button ', 
      '<i class="fa fa-table"></i>&nbsp;Data'
    ),
    previewBtn = highed.dom.cr(
      'button',
      'highed-ok-button highed-datapreviewpanel-button ', 
      '<i class="fa fa-pie-chart"></i>&nbsp;Preview'
    );
    
    highed.dom.ap(body,dataBtn );
    highed.dom.ap(body,previewBtn );

  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  return {
    on: events.on
  };
};
