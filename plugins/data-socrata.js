/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.import.install('Socrata',  {
    description: 'Socrata is an open data format commonly used for various government sources. <a href="http://www.opendatanetwork.com/" target="_blank">http://www.opendatanetwork.com/</a>',
    treatAs: 'csv',
    fetchAs: 'json',
    defaultURL: 'https://finances.worldbank.org/resource/czdd-amke.json?$order=fiscal_year ASC&$where=vpu_group_code=\'REG\'',
    options: {
        includeFields: {
            type: 'string',
            label: 'Fields to include, separate by whitespace',
            default: 'fiscal_year amount_us_millions_'                        
        }
    },
    filter: function (data, options, fn) {
        var csv = [], header = [];

        options.includeFields = highed.arrToObj(options.includeFields.split(' '));

        if (highed.isArr(data)) {

            //Only include things we're interested in
            data = data.map(function (d) {
                var r = {};
                Object.keys(options.includeFields).forEach(function (c) {
                    r[c] = d[c];
                });
                return r;
            });

            data.forEach(function (row, i) {
                var rdata = [];                            
                
                Object.keys(row).forEach(function (key) {
                    var col = row[key];

                    if (!options.includeFields[key]) {
                        return;
                    }

                    if (i == 0) {
                        header.push(key);
                    }

                    rdata.push(parseInt(col) || col);
                    
                });
                csv.push(rdata.join(','));
            });
        }

        fn(false, [header.join(',')].concat(csv).join('\n'));
    }
});
