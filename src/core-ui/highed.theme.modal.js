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

highed.ThemeModal = function(chartPreview) {

  var modalWindow = highed.OverlayModal(false, {
    width: 321,
    height: 219
  }),
  theme,
  customizedOptions,
  matchValues,
  events = highed.events(),
  //useManualOptionsBtn = highed.dom.cr('button', 'highed-import-button', "Use manually set options (Default)"),
  useThemeOptionsBtn = highed.dom.cr('button', 'highed-import-button', "Continue"),//"Use theme options"),
  headerLabel = highed.dom.cr('span', '', 'Attention'),//'Conflicts'),
  //body = highed.dom.cr('div', 'highed-modal-body highed-modal-theme-body'),
  closeBtn = highed.dom.ap(highed.dom.cr('span', 'fa fa-times close-btn'));

  highed.dom.ap(modalWindow.body, 
    highed.dom.ap(highed.dom.cr("div", 'highed-premium-feature-header'), headerLabel, closeBtn),
    highed.dom.cr("div", 'highed-premium-feature-text highed-theme-modal-text', "This theme has some options set that you have also set manually. These settings will be overwritten"),

    highed.dom.ap(
      highed.dom.cr('div', 'highed-theme-modal-buttons'),
      highed.dom.ap(highed.dom.cr("div", ''), useThemeOptionsBtn)
    )
    /*
    highed.dom.cr("div", 'highed-premium-feature-text highed-theme-modal-text', "This theme has some options set that you have also set manually. Would you like to overide these with the theme properties?"),
    body,
    highed.dom.ap(
      highed.dom.cr('div', 'highed-theme-modal-buttons'),
      highed.dom.ap(highed.dom.cr("div", ''), useManualOptionsBtn),
      highed.dom.ap(highed.dom.cr("div", ''), useThemeOptionsBtn)
    )*/
  );

  highed.dom.on(closeBtn, 'click', function() {
    modalWindow.hide();
  });
  
  /*
  highed.dom.on(useManualOptionsBtn, 'click', function() {
    //Default setting
    matchValues.forEach(function(id) {
      var val = document.querySelector('input[name="' + (id + '_radio') + '"]:checked').value;
      if (val === 'theme') {
        const value = highed.getObjectValueByString(theme.options, id);
        highed.setAttr(customizedOptions, id, value);
      }
    });

    chartPreview.assignTheme(theme);
    modalWindow.hide();
  });*/
  
  highed.dom.on(useThemeOptionsBtn, 'click', function() {
    //Override customized options with theme options
    matchValues.forEach(function(id) {
      const value = highed.getObjectValueByString(theme.options, id);
      highed.setAttr(customizedOptions, id, value);
    });

    chartPreview.assignTheme(theme);
    modalWindow.hide();
  });

  function show(matched, themeConfig, customizedOptionsConfig) {

    matchValues = matched;
    theme = themeConfig;
    customizedOptions = customizedOptionsConfig;
    /*
    body.innerHTML = '';

    matchValues = matched;
    theme = themeConfig;
    customizedOptions = customizedOptionsConfig;

    matchValues.forEach(function(value) {
      const container = highed.dom.cr('div', 'highed-modal-theme-option-container'), 
            title = highed.dom.cr('div', 'highed-modal-theme-title', value.split('--').join('<i class="fa fa-circle highed-parent-splitter" aria-hidden="true"></i>')),
            themeVal = highed.dom.cr('div', 'highed-modal-theme-value-container'),
            userVal = highed.dom.cr('div', 'highed-modal-theme-value-container'),
            userValRadio = highed.dom.cr('input', 'highed-modal-theme-radio'),
            themeValRadio = highed.dom.cr('input', 'highed-modal-theme-radio');

      userValRadio.type = themeValRadio.type = 'radio';
      userValRadio.name = themeValRadio.name = value + '_radio';
      userValRadio.checked = true;

      userValRadio.value = 'user';
      themeValRadio.value = 'theme';

      highed.dom.ap(
        body,
        highed.dom.ap(container, title),
        highed.dom.ap(highed.dom.cr('div', 'highed-modal-theme-values-container'),
          highed.dom.ap(themeVal, 
            highed.dom.ap(
              highed.dom.cr('div', 'highed-modal-theme-value-header'),
              highed.dom.cr('span', '', 'Theme Options'), 
              themeValRadio
            ),
            highed.dom.ap(
              highed.dom.cr('div', 'highed-modal-theme-value-header'),
              highed.dom.cr('span', '', 'User Options'), 
              userValRadio
            )
          ),
          highed.dom.ap(userVal, 
            highed.dom.cr('div', 'highed-modal-theme-value', highed.getObjectValueByString(theme.options, value)),
            highed.dom.cr('div', 'highed-modal-theme-value', highed.getObjectValueByString(customizedOptions, value))
          )
        )
      );
    });
*/
    modalWindow.show();
  }

  return {
    show: show,
    hide: modalWindow.hide,
    on: events.on
  };
};
