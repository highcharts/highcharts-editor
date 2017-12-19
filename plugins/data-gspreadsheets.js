/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.import.install('Google Spreadsheets', {
    description: 'Import from Google Spreadsheets. The worksheet option may be left blank to load the first sheet.',
    surpressURL: true,
    options: {
        key: {
            type: 'string',
            label: 'Spreadsheet key',
            default: '0AoIaUO7wH1HwdENPcGVEVkxfUDJkMmFBcXMzOVVPdHc'
        },
        sheet: {
            type: 'string',
            label: 'Worksheet',
            default: ''
        }
    },
    dependencies: [
        'https://code.jquery.com/jquery-2.2.4.min.js'
    ],
    request: function (url, options, fn) {
        fn(false, {
            data: {
              googleSpreadsheetKey: options.key,
              googleSpreadsheetWorksheet: options.sheet || false
            }
        });
    }
});
