var fs            = require('fs');
var jsonStringify = require('json-pretty');
var path          = require('path');
var uniq          = require('lodash.uniq');

var match;
var results = [];
var regex = /i18next\.t\(\'(.*)\'\)/g;

var translationFile = fs.readFileSync(path.join(__dirname, '../dictionaries/meta.js'), 'utf-8');

while (match = regex.exec(translationFile)) {
  results.push(match[1]);
}

var filtered = uniq(results);

fs.writeFileSync(path.join(__dirname, '../dictionaries/translations.json'), jsonStringify(filtered), 'utf-8');
