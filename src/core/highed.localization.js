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

/*
    Note that the localization system uses attribute names
    rather than a default string. This is to make it easier to
    modify translations.

*/

(function() {
  var currentLang = highed.option('defaultLanguage'),
    langTree = {};

  /** Get a localized string based on the current global language
     *  @param id {string} - the ID of the string to get
     */
  highed.getLocalizedStr = function(id) {
    if (langTree[currentLang]) {
      if (langTree[currentLang][id]) {
        return langTree[currentLang][id];
      }
    } else {
      //The current language is invalid, fall back to 'en'
      if (langTree.en[id]) {
        return langTree.en[id];
      }
    }

    //404
    return 'bad localized string: ' + id;
  };

  /** This is an alias for highed.getLocalizedStr
     *  @type {function}
     *  @param id {string} - the string to get
     */
  highed.L = highed.getLocalizedStr;

  /** Install a language pack from a json object
     *  @param translations {object} - translation object
     */
  highed.installLanguage = function(translations) {
    if (translations && translations.language && translations.entries) {
      langTree[translations.language] = translations.entries;
    }
  };

  /** Install a language pack from a url
     *  @param url {string} - the location of the pack
     */
  highed.installLanguageFromURL = function(url, fn) {
    highed.ajax({
      url: url,
      success: function(res) {
        if (res) {
          if (highed.installLanguage(res)) {
            return fn && fn(false);
          }
          return fn && fn(true);
        }
      },
      error: function(err) {
        return fn && fn(err);
      }
    });
  };

  /** Set the active language
     *  @param lang {string} - the language to activate
     *  @return {boolean} - true if the language exists, and was applied
     */
  highed.setLang = function(lang) {
    if (langTree[lang]) {
      currentLang = lang;
      return true;
    }
    return false;
  };
})();
