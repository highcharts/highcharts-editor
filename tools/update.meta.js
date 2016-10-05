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

/*  Take a fresh API dump and update the meta dictionary.
    
    This will override options as such:
        tooltipText: set if no text is defined in the meta already
        dataType: always set
        context: always set
        defaults: always set
        parent: always set
*/

var meta = require(__dirname + '/../dictionaries/meta.js'),
    api = {},
    apiSorted = {},
    fs = require('fs'),
    async = require('async'),
    license = fs.readFileSync(__dirname + '/../LICENSE'),
    request = require('request'),
    apiDumpURL = 'http://api.highcharts.com/highcharts/option/dump.json',
    argv = require('yargs')
                .string('exposed')
                .default('exposed', 'exposed', __dirname + '/../dictionaries/exposed.settings.json')
                argv  
;

require('colors');

function mapIncludedProperties(includedProperties) {
   var res = {};

   includedProperties.forEach(function (thing) {
        res[thing] = true;
   });

   return res;
}

function isArray(what) {
    return what !== null && typeof what !== 'undefined' && what.constructor.toString().indexOf("Array") > -1;
}

function sortAPI() {
    api.forEach(function (entry) {
        var st = extractType(entry.name);
        entry.name = removeType(entry.name);

        if (!apiSorted[entry.name]) {            

            apiSorted[entry.name] = entry;

            if (st !== false) {
                entry.subType = [st];            
            }
        } else if (st) {
            apiSorted[entry.name].subType = apiSorted[entry.name].subType || [];
            apiSorted[entry.name].subType.push(st);
            apiSorted[entry.name].values = apiSorted[entry.name].values || entry.values;
            apiSorted[entry.name].defaults = apiSorted[entry.name].defaults || entry.defaults;

            apiSorted[entry.name].subTypeDefaults = apiSorted[entry.name].subTypeDefaults || {};
            apiSorted[entry.name].subTypeDefaults[st] = entry.defaults;
        }
    });
}

function filterEachOption(root, fn, parent) {
    if (isArray(root)) {
        root.forEach(function (e) {
            filterEachOption(e, fn, root);
        });
    } else if (isArray(root.options)) {
        root.options.forEach(function (option) {
            filterEachOption(option, fn, root);
        });
    } else if (typeof root.options !== 'undefined') {
        Object.keys(root.options).forEach(function (key) {
            filterEachOption(root.options[key], fn);
        });
    } else if (typeof root.id !== 'undefined') {
        if (!fn(root, apiSorted[root.id])) {
            //This is not very efficient
            if (isArray(parent.options)) {
                parent.options = parent.options.filter(function (b) {
                    return b.id !== root.id;
                });
            }
        }
    } else {
        console.log('[warn]'.yellow, 'No id for object', root);
    }
}

function extractType(str) {
    var s = str.indexOf('<'),
        st 
    ;

    if (s >= 0) {
        return str.substr(s + 1, str.indexOf('>') - s - 1);
    }

    return false;
}
function removeType(str) {
    var t = extractType(str);

    if (t) {
        return str.replace('<' + t + '>', '');
    }
    return str;
}

function update(root) {
    var included = mapIncludedProperties(
            JSON.parse(fs.readFileSync(argv.exposed || __dirname + '/../dictionaries/exposed.settings.json'))
        )
    ;

    filterEachOption(root, function (entry, aentry) {   
        if (!included[entry.id]) {
            return false;
        }

        if (typeof apiSorted[entry.id] !== 'undefined') {
            aentry = apiSorted[entry.id];
            entry.dataType = (aentry.returnType || '').toLowerCase();
            entry.context = aentry.context || 'General';
            entry.tooltipText = entry.tooltipText || aentry.description;
            entry.defaults = aentry.defaults || entry.defaults;
            entry.parent = aentry.parent;
            entry.values = aentry.values;
            entry.text = entry.text || aentry.title;

            if (aentry.subType) {
                entry.subType = aentry.subType;                
                entry.subTypeDefaults = aentry.subTypeDefaults;
            }
            //entry.custom = aentry.custom;

            if (entry.dataType.indexOf('object') >= 0 && entry.dataType.indexOf('cssobject') < 0) {
                entry.attributes = [];
                //Need to gather the attributes.
                //We do it the lazy way.
                api.forEach(function (child) {
                    if (child.parent === entry.id) {
                        entry.attributes.push({
                            dataType: (child.returnType || '').toLowerCase(),
                            name: child.title,
                            title: child.title,
                            tooltipText: child.description,
                            defaults: child.defaults,
                            values: child.values
                        });
                    }
                });
            }

            return true;
        } else {    
            console.log('[warn]'.yellow, 'Unknown property:', entry.id.bold, 'skipping...');
            return false;
        }
    });
}

function process() {
    sortAPI();
    update(meta);

    fs.writeFile(__dirname + '/../api.js', JSON.stringify(apiSorted, false, '  '), function () {

    });

    fs.writeFile(__dirname + '/../src/meta/highed.meta.options.extended.js', license + '\n\n\nhighed.meta.optionsExtended = ' + JSON.stringify(meta, undefined, '  ') + ';', function (err) {
        if (err) {
            console.log('[error]'.red, err);
        }
    });
}

console.log('Higcharts Editor Meta Updater'.green);
console.log('Fetching latest API dump...'.bold);

request(apiDumpURL, function (error, response, body) {
    console.log('API Fetched, transforming...'.bold);
    if (error) {
        console.log('[error]'.red, error);
    } else {
        try {
            api = JSON.parse(body);
            process();
        } catch (e) {
            console.log('[error]'.red, e);
        }
    }
});
