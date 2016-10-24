/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.import.install('Difi', {
    description: 'Imports data from the Norwegian Agency for Public Management and eGovernment. <a href="http://difi.no" target="_blank">www.difi.no</a>',
    treatAs: 'csv',
    fetchAs: false,
    defaultURL: 'http://hotell.difi.no/api/json/fad/lonn/a-tabell',
    options: {
        includeFields: {
            type: 'string',
            label: 'Fields to include, separate by whitespace',
            default: 'trinn brutto-mnd'
        }
    },
    filter: function (data, options, fn) {
        var csv = [], header = [];

        try {
            data = JSON.parse(data);
        } catch (e) {
            fn(e);
        }

        options.includeFields = highed.arrToObj(options.includeFields.split(' '));

        if (highed.isArr(data.entries)) {

            //Only include things we're interested in
            data.entries = data.entries.map(function (d) {
                var r = {};
                Object.keys(options.includeFields).forEach(function (c) {
                    r[c] = d[c];
                });
                return r;
            });

            data.entries.forEach(function (row, i) {
                var rdata = [];                            
                
                Object.keys(row).forEach(function (key) {
                    var col = row[key];

                    if (!options.includeFields[key]) {
                        return;
                    }

                    if (i == 0) {
                        header.push(key);
                    }

                    //if (highed.isNum(col)) {
                        col = col.replace(',', '.');
                  //  }

                    rdata.push(col);
                    
                });
                csv.push(rdata.join(','));
            });
        }

        fn(false, [header.join(',')].concat(csv).join('\n'));
    }
}
);
