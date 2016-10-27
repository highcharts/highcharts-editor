
const fs = require('fs');
const hb = require('handlebars');
const mainTemplateSrc = fs.readFileSync(__dirname + '/../views/layouts/main.handlebars');
const mainTemplate = hb.compile(mainTemplateSrc.toString());
const mkdirp = require('mkdirp');
const package = require(__dirname + '/../package.json');
const scripts = [
    'highcharts-editor.min.js'
];

var settings = {
    static: 'yes',
    scripts: scripts,
    package: package
};

mkdirp(__dirname + '/../demos', function () {
    fs.readdir(__dirname + '/../views', function (err, files) {
        if (err) return console.log(err);

        files.forEach(function (file) {
            var f;
            if (file.indexOf('.handlebars') >= 0) {
                fs.readFile(__dirname + '/../views/' + file, function (err, data) {                    
                    if (err) return console.log(err);

                    var t = hb.compile(data.toString()),
                        result = ''
                    ;

                    settings.body = t(settings);                    
                    result = mainTemplate(settings);

                    fs.writeFile(__dirname + '/../demos/' + file.substr(0, file.lastIndexOf('.')) + '.html', result, function (err) {
                        if (err) return console.log(err);
                    });
                });
            }
        });
    });
});

