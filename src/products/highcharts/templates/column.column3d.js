/*

Highcharts Editor 

Copyright (c) 2016-2017, Highsoft

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

*/


highed.templates.add('Column', {
    "title": "Column 3D",
    "description": "",
    "thumbnail": "https://cloud.highcharts.com/images/ahyqyx/1/136.svg",
    "dataValidator": false,
    "sampleSets": [],
    "config": {
        "chart": {
            "type": "column",
            "margin": 75,
            "options3d": {
                "enabled": true,
                "alpha": 15,
                "beta": 15,
                "depth": 50,
                "viewDistance": 15
            },
            "polar": false
        },
        "plotOptions": {
            "column": {
                "depth": 25
            }
        }
    }
});
