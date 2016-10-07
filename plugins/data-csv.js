/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.import.install('CSV', {
    description: 'Import a standard formatted CSV file.',
    treatAs: 'csv',
    filter: function (data, options, fn) {
        fn(false, data);
    }
});
