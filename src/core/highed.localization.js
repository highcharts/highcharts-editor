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

(function () {
    var currentLang = 'en',
        langTree = {
            en: {
                //General
                confirmNewChart: 'Are you sure you want to abandon the current chart and start over?',

                //Main context menu
                previewChart: 'Preview Chart',
                newChart: 'New Chart',
                saveProject: 'Save Project',
                loadProject: 'Load Project',

                exportPNG: 'Export as PNG',
                exportJPEG: 'Export as JPEG',
                exportSVG: 'Export as SVG',
                exportPDF: 'Export as PDF',

                help: 'Help',
                licenseInfo: 'License Information',

                //Steps
                stepDone: 'Done',
                stepStart: 'Start',
                stepImport: 'Import',
                stepTemplates: 'Templates',
                stepCustomize: 'Customize',
                stepExport: 'Export',
                stepData: 'Data',

                //Done button caption
                doneCaption: 'Close & Generate Chart',

                //Customizer
                customizeSimple: 'SIMPLE',
                customizeAdvanced: 'ADVANCED'
            }
       }
    ;

    /** Get a localized string based on the current global language
     *  @param id {string} - the ID of the string to get
     */
    highed.getLocalizedStr = function (id) {
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

    /* Install a language pack from a json object
     *  @param translations {object} - translation objects
     */

    /* Install a language pack from a url
     *  @param url {string} - the location of the pack
     */

    /** Set the active language
     *  @param lang {string} - the language to activate
     *  @return {boolean} - true if the language exists, and was applied
     */ 
    highed.setLang = function (lang) {
        if (langTree[lang]) {
            currentLang = lang;
            return true;
        }
        return false;
    };

})();
