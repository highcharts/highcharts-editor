/******************************************************************************

Copyright (c) 2016, Highsoft

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

/* A modal editor
 * @summoner - the node which spawns the editor
 * @attributes - properties sent to the editor
 * @fn - function to call when done editing, argument is embeddable HTML
 * @returns a highed.ModalEditor instance.
 */
highed.ModalEditor = function (summoner, attributes, fn) {
    var modal = highed.OverlayModal(false, {
            width: '90%',
            height: '580',
            showOnInit: false
        }),
        editor = highed.Editor(modal.body, attributes),
        //We don't always know the summoner at create time..
        sumFn = false,
        doneEditing = highed.dom.cr('button', 'highed-done-button', 'Close &amp; Use')
    ;

    ///////////////////////////////////////////////////////////////////////////

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

    //Resize the editor when showing the modal
    modal.on('Show', editor.resize);
    
    highed.dom.on(doneEditing, 'click', function () {
        if (highed.isFn(fn)) {
            fn(editor.getEmbeddableHTML(), editor.getEmbeddableSVG());
        }
        modal.hide();
    });

    attachToSummoner();

    if (attributes && attributes.allowDone) {
        highed.dom.ap(editor.toolbar.center, doneEditing);           
    }

    ///////////////////////////////////////////////////////////////////////////

    return {
        show: modal.show,
        hide: modal.hide,
        on: editor.on,
        attachToSummoner: attachToSummoner       
    };
};