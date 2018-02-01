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

/** A modal editor
 * The modal editor connects to a "summoner", which is the DOM node that should
 * spawn the editor. This arg is however optional, and if not present,
 * `show()` should be called instead when wanting to display it.
 *
 * The contained editor can either be a full editor, or a simple editor.
 *
 * @example
 * highed.ModalEditor('icon', {allowDone: true}, function (html) {
 *    doSomethingWithTheExportedHTML(html);
 * });
 *
 * @constructor
 *
 * @param summoner {domnode} - the node which spawns the editor
 * @param attributes {object} - properties. Note that this object is also passed to the editor constructor.
 *   > type {string} - either `full` or `simple`.
 *   > allowDone {bool} - if set to true (default is false) a "Close and use" button will appear on the top bar
 * @param fn {function} - function to call when done editing, argument is an instance of highed.ChartPreview
 *
 */
highed.ModalEditor = function(summoner, attributes, fn) {
  var properties = highed.merge(
      {
        type: 'full',
        allowDone: false
      },
      attributes
    ),
    modal = highed.OverlayModal(false, {
      width: '95%',
      height: '95%',
      showOnInit: false
    }),
    editor =
      properties.type === 'full'
        ? highed.Editor(modal.body, attributes)
        : highed.SimpleEditor(modal.body, attributes),
    //We don't always know the summoner at create time..
    sumFn = false,
    doneEditing = highed.dom.cr(
      'button',
      'highed-done-button',
      'Close &amp; Use'
    );

  ///////////////////////////////////////////////////////////////////////////

  /** Attach to a new summoner
     *  @memberof highed.ModalEditor
     *  @param nn {domnode} - the new node to attach to
     */
  function attachToSummoner(nn) {
    nn = nn || summoner;

    if (!nn) {
      return;
    }

    if (highed.isFn(sumFn)) {
      sumFn();
    }

    //Show the modal when clicking the summoner
    sumFn = highed.dom.on(highed.dom.get(nn), 'click', modal.show);
  }

  function doDone() {
    if (highed.isFn(fn)) {
      fn(editor.chart);
    }
    modal.hide();
  }

  //Resize the editor when showing the modal
  modal.on('Show', editor.resize);

  highed.dom.on(doneEditing, 'click', doDone);

  attachToSummoner(summoner);

  if (properties.allowDone) {
    highed.dom.ap(editor.toolbar.center, doneEditing);
  }

  editor.on('Done', doDone);
  editor.resize();

  ///////////////////////////////////////////////////////////////////////////

  return {
    editor: editor,
    show: modal.show,
    hide: modal.hide,
    on: editor.on,
    attachToSummoner: attachToSummoner
  };
};
