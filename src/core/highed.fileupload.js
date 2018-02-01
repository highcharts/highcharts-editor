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

/**
 * @ignore
 */
highed.ready(function() {
  var uploader = highed.dom.cr('input'),
    cb = false;

  uploader.type = 'file';
  uploader.accept = '.csv';

  highed.dom.ap(document.body, uploader);

  highed.dom.style(uploader, {
    display: 'none'
  });

  /** Upload and parse a local file
  *  Borrowed from almostvanilla which is licensed under MIT.
  *  @param props {object} - the upload settings
  *     > type {string} - the type of data to load
  *     > accept {string} - the accepted file extensions
  *     > multiple {boolean} - allow multiple files
  *     > progress {function} - progress callback
  *       > {number} - the progress in percent
  *     > success {function} - function called when the file is uploaded
  *       > {object} - the file information
  *         > filename {string} - the name of the file
  *         > size {number} - the size of the file in bytes
  *         > data {string} - the file data
  */
  highed.readLocalFile = function(props) {
    var p = highed.merge(
      {
        type: 'text',
        multiple: false,
        accept: '.csv'
      },
      props
    );

    uploader.accept = p.accept;

    if (highed.isFn(cb)) {
      cb();
    }

    cb = highed.dom.on(uploader, 'change', function() {
      function crReader(file) {
        var reader = new FileReader();

        reader.onloadstart = function(evt) {
          if (highed.isFn(p.progress)) {
            p.progress(Math.round(evt.loaded / evt.total * 100));
          }
        };

        reader.onload = function(event) {
          var data = reader.result;

          if (p.type === 'json') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              if (highed.isFn(p.error)) {
                p.error(e);
              }
            }
          }

          if (highed.isFn(p.success)) {
            p.success({
              filename: file.name,
              size: file.size,
              data: data
            });
          }
        };

        return reader;
      }

      for (var i = 0; i < uploader.files.length; i++) {
        if (!p.type || p.type === 'text' || p.type === 'json') {
          crReader(uploader.files[i]).readAsText(uploader.files[i]);
        } else if (p.type === 'binary') {
          crReader(uploader.files[i]).readAsBinaryString(uploader.files[i]);
        } else if (p.type === 'b64') {
          crReader(uploader.files[i]).readAsDataURL(uploader.files[i]);
        }
      }
      cb();
      uploader.value = '';
    });

    uploader.multiple = p.multiple;

    uploader.click();
  };
});
