/*

    Simple plug-in demo.

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.install('jquery-simple-rest', {

    //Contains information about the plugin - optional
    meta: {
        version: '1.0.0',
        author: 'Highsoft',
        homepage: 'https://github.com/highcharts/highcharts-editor/plugins/jquery-simple-rest.js'
    },
    
    //Add additional external dependencies here
    dependencies: [
        'https://code.jquery.com/jquery-3.1.0.min.js'
    ],

    //This is the prototype options which the plugin accepts
    options: {
        'url': {
            required: true,
            type: 'string'
        }
    },

    //Called when the chart changes
    chartchange: function (chart, options) {
        jQuery.ajax({
            url: options.url,
            data: chart.json,
            dataType: 'json',
            type: 'post',
            success: function () {
                highed.snackBar('CHART SAVED');
            },
            error: function (xhr, errString) {
                highed.snackBar('unable to save chart: ' + errString);
            }
        })
    }
})