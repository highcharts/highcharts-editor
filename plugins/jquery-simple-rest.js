

highed.plugins.reg('jquery-simple-rest', {

    //Contains information about the plugin - optional
    meta: {
        version: '1.0.0',
        author: 'Highsoft',
        homepage: 'https://github.com/highcharts/highcharts-editor/plugins/jquery-simple-rest.js'
    }
    
    //Add additional external dependencies here
    dependencies: [
        'https://code.jquery.com/jquery-3.1.0.slim.min.js'
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
            type: 'post',
            success: function () {
                highed.snackBar('CHART SAVED');
            },
            error: function (err) {
                highed.snackBar('unable to save chart ' + err);
            }
        })
    }
})