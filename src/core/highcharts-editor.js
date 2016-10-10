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


//////////////////////////////////////////////////////////////////////////////

/** The main highcharts editor namespace 
 * @ignore
 */
var highed = {
    schemas: {},
    meta: {
        chartTemplates: {},
        fonts: []
    },
    plugins: {},

    resources: {
        logo: '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Warstwa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"     width="425.197px" height="141.732px" viewBox="0 0 425.197 141.732" enable-background="new 0 0 425.197 141.732"     xml:space="preserve"><g>    <path fill="#eeeaea" d="M138.475,69.712h-17.02v9.77c0,1.037-0.813,1.851-1.849,1.851c-1.037,0-1.85-0.813-1.85-1.851V57.725        c0-1.037,0.813-1.852,1.85-1.852c1.036,0,1.849,0.813,1.849,1.852v8.436h17.02v-8.436c0-1.037,0.814-1.852,1.85-1.852        c1.036,0,1.85,0.813,1.85,1.852v21.754c0,1.037-0.814,1.851-1.85,1.851c-1.036,0-1.85-0.813-1.85-1.851V69.712z"/>    <path fill="#eeeaea" d="M156.973,79.479c0,1.037-0.814,1.851-1.852,1.851s-1.852-0.813-1.852-1.851V57.725        c0-1.037,0.814-1.852,1.852-1.852s1.852,0.813,1.852,1.852V79.479z"/>    <path fill="#eeeaea" d="M184.125,70.378c0-1.036,0.814-1.774,1.852-1.774c1.034,0,1.852,0.813,1.852,1.849v5.847        c0,0.444-0.226,1.109-0.595,1.479c-2.367,2.369-5.549,3.773-9.176,3.773c-7.178,0-12.949-5.771-12.949-12.948        c0-7.181,5.771-12.949,12.949-12.949c3.627,0,6.809,1.405,9.176,3.771c0.738,0.74,0.738,1.852,0,2.592        c-0.741,0.738-1.922,0.813-2.663,0.072c-1.702-1.699-3.923-2.736-6.513-2.736c-5.104,0-9.249,4.144-9.249,9.25        c0,5.104,4.146,9.25,9.249,9.25c2.367,0,4.441-0.813,6.067-2.222V70.378z"/>    <path fill="#eeeaea" d="M218.162,69.712h-17.019v9.77c0,1.037-0.817,1.851-1.852,1.851c-1.037,0-1.849-0.813-1.849-1.851V57.725        c0-1.037,0.812-1.852,1.849-1.852c1.034,0,1.852,0.813,1.852,1.852v8.436h17.019v-8.436c0-1.037,0.813-1.852,1.849-1.852        c1.037,0,1.852,0.813,1.852,1.852v21.754c0,1.037-0.813,1.851-1.852,1.851c-1.033,0-1.849-0.813-1.849-1.851V69.712z"/>    <path fill="#eeeaea" d="M242.948,81.552c-7.182,0-12.949-5.771-12.949-12.948c0-7.181,5.77-12.949,12.949-12.949        c3.627,0,6.809,1.405,9.176,3.771c0.738,0.74,0.738,1.852,0,2.592c-0.741,0.738-1.925,0.813-2.666,0.072        c-1.699-1.699-3.92-2.736-6.51-2.736c-5.106,0-9.249,4.144-9.249,9.25c0,5.104,4.143,9.25,9.249,9.25        c2.59,0,4.884-0.962,6.586-2.664c0.74-0.741,1.849-0.741,2.59,0c0.738,0.738,0.738,1.85,0,2.589        C249.756,80.146,246.574,81.552,242.948,81.552z"/>    <path fill="#eeeaea" d="M281.569,69.712h-17.02v9.77c0,1.037-0.813,1.851-1.852,1.851c-1.034,0-1.85-0.813-1.85-1.851V57.725        c0-1.037,0.813-1.852,1.85-1.852c1.035,0,1.852,0.813,1.852,1.852v8.436h17.02v-8.436c0-1.037,0.813-1.852,1.853-1.852        c1.034,0,1.849,0.813,1.849,1.852v21.754c0,1.037-0.813,1.851-1.849,1.851c-1.037,0-1.853-0.813-1.853-1.851V69.712z"/>    <path fill="#eeeaea" d="M308.758,57.503l10.507,20.646c0.223,0.443,0.445,1.036,0.445,1.554c0,1.036-0.668,1.628-1.702,1.628        c-0.741,0-1.481-0.222-2.001-1.258l-3.253-6.438h-13.547l-3.183,6.438c-0.517,1.036-1.256,1.258-1.994,1.258        c-1.037,0-1.702-0.593-1.702-1.628c0-0.519,0.22-1.109,0.442-1.554l10.506-20.646c0.668-1.405,2.002-1.628,2.74-1.628        C306.76,55.875,308.09,56.096,308.758,57.503z M300.985,70.083h9.988l-4.957-9.99L300.985,70.083z"/>    <path fill="#eeeaea" d="M340.159,56.023c4.441,0,8.064,3.255,8.064,7.694c0,3.923-2.813,6.884-6.511,7.549l6.731,7.104        c0.664,0.666,0.889,1.85,0.146,2.516c-0.736,0.741-2.145,0.521-2.886-0.296l-8.729-9.176h-6.511v8.142        c0,1.034-0.815,1.774-1.854,1.774c-1.033,0-1.85-0.813-1.85-1.851V57.873c0-1.035,0.814-1.85,1.85-1.85H340.159z M330.468,59.575        v8.288h9.691c2.59,0,4.367-1.776,4.367-4.146c0-2.365-1.777-4.144-4.367-4.144L330.468,59.575L330.468,59.575z"/>    <path fill="#eeeaea" d="M365.047,59.575h-9.249c-1.033,0-1.849-0.74-1.849-1.776c0-1.034,0.813-1.773,1.849-1.773h22.201        c1.037,0,1.852,0.74,1.852,1.773c0,1.037-0.813,1.776-1.852,1.776h-9.249V79.48c0,1.037-0.813,1.851-1.849,1.851        c-1.037,0-1.854-0.813-1.854-1.851V59.575z"/>    <path fill="#eeeaea" d="M388.724,66.013c0-9.25,5.698-10.359,9.99-10.359c1.035,0,1.85,0.813,1.85,1.85        c0,1.036-0.813,1.851-1.85,1.851c-3.479,0-6.29,0.738-6.29,6.66v5.18c0,9.25-5.698,10.358-9.989,10.358        c-1.035,0-1.85-0.813-1.85-1.85s0.814-1.85,1.85-1.85c3.479,0,6.289-0.74,6.289-6.66V66.013z"/></g><polygon fill="#8087E8" points="67.981,30.52 56.757,56.73 42.009,91.171 76.301,76.685 94.465,69.013 "/><polygon fill="#30426B" points="73.7,62.25 76.302,76.685 94.466,69.013 "/><polygon fill="#6699A1" points="67.981,30.52 73.7,62.251 94.465,69.013 "/><polygon fill="#78758C" points="73.7,62.25 94.466,69.013 56.758,56.729 42.009,91.171 76.302,76.685 "/><polygon fill="#A3EDBA" points="42.009,91.171 56.757,56.73 26.442,46.855 "/><polygon fill="#6699A1" points="76.302,76.685 79.628,95.13 94.466,69.013 "/><polygon fill="#8087E8" points="67.981,30.52 56.757,56.73 73.7,62.251 "/></svg>'
    },

    /** Trigger file download
     *  @param filename {string} - the filename
     *  @param data {string} - the contained data
     */
    download: function (filename, data) {
        var l = highed.dom.cr('a');
        l.download = filename || 'unkown';
        l.href = 'data:application/octet-stream,' + encodeURIComponent(data);
        highed.dom.ap(document.body, l);
        l.click();
        document.body.removeChild(l);
    },

    /** Clear an object 
      * Deletes all the object attributes.
      * Useful when needing to clear an object without invalidating references to it
      * @namespace highed
      * @param obj {object} - the object to clear
     */
    clearObj: function (obj) {
        Object.keys(obj).forEach(function (key) {
            delete obj[key];
        });
    },

    /** Preform an AJAX request. Same syntax as jQuery. 
     *  @namespace highed
     *  @param p {object} - options
     *    > url {string} - the URL to call
     *    > type {enum} - the type of request
     *    > dataType {enum} - the type of data expected
     *    > success {function} - function to call on success
     *    > error {function} - function to call on request fail
     *    > data {object} - the payload
     *    > autoFire {boolean} - wether or not to fire the request right away
     * 
     *   @emits Error {string} - when there's an error 
     *   @emits OK {string} - when the request succeeded
     *   @returns {object} - interface to the request
     */
    ajax: function (p) {
        var props = highed.merge({
            url: false,
            type: 'GET',
            dataType: 'json',
            success: false,
            error: false,
            data: {},
            autoFire: true
          }, p),
          headers = {
            json: 'application/json',
            xml: 'application/xml',
            text: 'text/plain',
            octet: 'application/octet-stream'
          },
          r = new XMLHttpRequest(),
          events = highed.events()
        ;

        if (!props.url) return false;

        r.open(props.type, props.url, true);
        r.setRequestHeader('Content-Type', headers[props.dataType] || headers.text);

        r.onreadystatechange = function () {
            events.emit('ReadyStateChange', r.readyState, r.status);

            if (r.readyState === 4 && r.status === 200) {         
              if (props.dataType === 'json') {        
                try {
                  var json = JSON.parse(r.responseText);
                  if (highed.isFn(props.success)) {
                    props.success(json);        
                  }
                  events.emit('OK', json);
                } catch(e) {
                  if (highed.isFn(props.error)) {
                    props.error(e.toString(), r.responseText);
                  }
                  events.emit('Error', e.toString(), r.status);
                }      
              } else {
                if (highed.isFn(props.success)) {
                  props.success(r.responseText);
                }        
                events.emit('OK', r.responseText);
              }         
            } else if (r.readyState === 4) {
              events.emit('Error', r.status, r.statusText);
              if (highed.isFn(props.error)) {
                props.error(r.status, r.statusText);
              }
            }
        };

        function fire() {
            try {
              r.send(JSON.stringify(props.data));            
            } catch (e) {
              r.send(props.data || true);      
            }    
        }

        if (props.autoFire) {
            fire();    
        }

        return {
            on: events.on,
            fire: fire,
            request: r
        };
    },

    /** Generate a uuid 
     *  Borrowed from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     *  @namespace highed
     *  @returns {string} - a UUID string
     */
    uuid: function () {
        var d = new Date().getTime(), uuid;
        
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },

    /** Map an array to an object
     *  @namespace highed
     *  @param {array} arr - the array to map
     *  @return {object} - an object with the array contents as keys, and their value set to true
     */
    arrToObj: function (arr) {
        var obj = {};

        if ((!highed.isArr(arr) && !highed.isBasic(arr)) || arr === false) {
            return arr;
        }

        if (highed.isStr(arr)) {
            arr = arr.split(' ');
        }

        arr.forEach(function (thing) {
            obj[thing] = true;
        });

        return obj;
    },

    /** Make a camel back string pretty
     *  Transforms e.g. `imACamelBackString` to `Im a camelback string`.
     *  @namespace highed
     *  @param str {string} - the input string
     *  @return {string} - the transformed string
     */
    uncamelize: function (str) {
        var s = '';

        if (!str) {
            return str;
        }

        if (str.length < 0 || !str) {
            return str;
        }

        for (var i = 0; i < str.length; i++) {
            if (str[i] === str[i].toUpperCase()) {
                s += ' ';
            }
            s += str[i];            
        }

        return s[0].toUpperCase() + s.substr(1);
    },

    /** Clamp a number between min/max
     *  @namespace highed
     *  @param min {number} - minimum value
     *  @param max {number} - maximum value
     *  @returns {number} - the clamped value
     */
    clamp: function (min, max, value) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    },

    /** Convert a hex value to RGB
     *
     *  @namespace highed
     *  @param {string} hex - the hex string
     *  @return {object} - an object with rgb components
     *    > r {number} - red
     *    > g {number} - green
     *    > b {number} - blue
     */
    hexToRgb: function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {
            r: 0, g: 0, b: 0
        };
    },

    /** Invert a color 
     *  @namespace highed
     *  @param {string} hex - the color to invert
     *  @return {string} - new hex color
     */
    invertHexColor: function (hex) {
        var rgb = highed.hexToRgb(hex),
            res = 0
        ;

        rgb.r = 255 - rgb.r;
        rgb.g = 255 - rgb.g;
        rgb.b = 255 - rgb.b;

        res = rgb.r << 16;
        res |= rgb.g << 8;
        res |= rgb.b;

        return '#' + res;
    },

    /** Return #FFF or #000 based on the intensity of a color
     *  @namespace highed
     *  @param {string} hex - input color
     *  @return {string} - the new hex color
     */
    getContrastedColor: function (hex) {
        var rgb = highed.hexToRgb(hex),
            avarage = (rgb.r + rgb.g + rgb.b) / 3
        ;

        if (avarage > 150) {
            return '#000';
        }
        return '#FFF';
    },

    /** Convert a string to a bool
     *  @namespace highed
     *  @param {string} what - the string to convert
     *  @return {bool} - the resulting bool
     */
    toBool: function (what) {
        return what === 'true' || what === true || what === 'on';
    },

    /** Set a property based on -- delimited path  
     *  @namespace highed
     *  @param {object} obj - the object to modify
     *  @param {string} path - the path to the attribute to change
     *  @param {anything} value - the value to set
     */
    setAttr: function (obj, path, value, index) {
        var current = obj;

        if (!current) return;

        if (highed.isArr(obj)) {
            obj.forEach(function (thing) {
                highed.setAttr(thing, path, value, index);
            });
            return;
        }

        path = path.replace(/\-\-/g, '.').replace(/\-/g, '.').split('.');

        path.forEach(function(p, i) {
            if (i === path.length - 1) {  
                current[p] = value;                                     
            } else {
                if (typeof current[p] === 'undefined') {
                    current = current[p] = {};
                } else {
                    current = current[p]; 

                    if (highed.isArr(current)) {
                        if (index > current.length - 1) {
                            for (var j = current.length; j <= index; j++ ) {
                                current.push({});
                            }
                        } 
                        if (index >= 0) {
                            current = current[index];                            
                        }
                    }                      
                }
            }
        });
    },

    /** Get a property based on -- delimited path  
     *  @namespace highed
     *  @param {object} obj - the object to traverse
     *  @param {string} path - the path to the attribute to get
     *  @returns {anything} - the value or false
     */
    getAttr: function (obj, path, index) {
        var current = obj,
            result = false
        ;

        if (!current) return false;

        if (highed.isArr(obj)) {
            obj.forEach(function (thing) {
                result = highed.getAttr(thing, path);
            });
            return result;
        }

        path = path.replace(/\-\-/g, '.').replace(/\-/g, '.').split('.');

        path.forEach(function(p, i) {
            if (i === path.length - 1) {  
                if (typeof current !== 'undefined') {
                    result = current[p];                                     
                } 
            } else {
                if (typeof current[p] === 'undefined') {
                    current = current[p] = {};
                } else {
                    current = current[p];         

                    if (highed.isArr(current) && index >= 0 && index < current.length) {
                        current = current[index];
                    }               
                }
            }
        });

        return result;
    },

    /** Deep merge two objects.
     * Note: this modifies object `a`!
     * @namespace highed
     * @param {object} a - the destination object
     * @param {object} b - the source object
     * @return {object} - argument a
     */
    merge: function (a, b) {
        if (!a || !b) return a || b;    
        Object.keys(b).forEach(function (bk) {
         if (highed.isNull(b[bk]) || highed.isBasic(b[bk])) {
            a[bk] = b[bk];
         } else if (highed.isArr(b[bk])) {
           
           a[bk] = [];
           
           b[bk].forEach(function (i) {
             if (highed.isNull(i) || highed.isBasic(i)) {
               a[bk].push(i);
             } else {
               a[bk].push(highed.merge({}, i));
             }
           });
         } else if (b[bk].tagName && b[bk].appendChild && b[bk].removeChild && b[bk].style) {  
            a[bk] = b[bk];
         } else {
            a[bk] = a[bk] || {};
            highed.merge(a[bk], b[bk]);
         }          
        });    
        return a;
    },

    /** Check if something is null or undefined
     *  @namespace highed
     *  @param {anything} what - the value to check
     *  @return {bool} - true if nulll
     */
    isNull: function (what) {
        return (typeof what === 'undefined' || what === null);
    },

    /** Check if something is a string 
     *  @namespace highed
     *  @param {anything} what - the value to check
     *  @return {bool} - true if string
     */
    isStr: function (what) {
        return (typeof what === 'string' || what instanceof String);
    },

    /** Check if something is a number
     * @namespace highed
     *  @param {anything} what - the value to check
     *  @return {bool} - true if number
     */
    isNum: function(what) {
        return !isNaN(parseFloat(what)) && isFinite(what);
    },

    /** Check if a value is a function
     * @namespace highed
     * @param {anything} what - the value to check
     * @return {bool} - true if function
     */
    isFn: function (what) {
        return (what && (typeof what === 'function') || (what instanceof Function));
    },

    /** Check if a value is an array
     * @namespace highed
     * @param {anything} what - the value to check
     * @return {bool} - true if array
     */
    isArr: function (what) {
        return (!highed.isNull(what) && what.constructor.toString().indexOf("Array") > -1);
    },

    /** Check if a value is a boolean
     * @namespace highed
     * @param {anything} what - the value to check
     * @return {bool} - true if bool
     */
    isBool: function (what) {
        return (what === true || what === false);
    },

    /** Check if a value is a basic type
     * A basic type is either a bool, string, or a number
     * @namespace highed
     * @param {anything} what - the value to check
     * @return {bool} - true if basic
     */
    isBasic: function (what) {
        return !highed.isArr(what) && (highed.isStr(what) || highed.isNum(what) || highed.isBool(what) || highed.isFn(what));
    }
};

//Stateful functions
(function () {
    var logLevels = [
            'error',
            'warn',
            'notice',
            'verbose'
        ],
        currentLogLevel = 4,
        initQueue = [],
        isReady = false,
        includedScripts = {},
        cdnScripts = [
            "https://code.highcharts.com/stock/highstock.js",   
            "http://code.highcharts.com/adapters/standalone-framework.js",  
            "https://code.highcharts.com/highcharts-more.js",   
            "https://code.highcharts.com/highcharts-3d.js", 
            "https://code.highcharts.com/modules/data.js",  
            "https://code.highcharts.com/modules/exporting.js"
        ]
    ;

    ///////////////////////////////////////////////////////////////////////////
    
    function pollForReady() {
        if (!isReady) {
            if (document.body) {
                isReady = true;
                initQueue.forEach(function (fn) {
                    fn();
                });
            } else {
                window.setTimeout(pollForReady, 100);
            }
        }
    }

    pollForReady();

    ///////////////////////////////////////////////////////////////////////////

    /** Add a function to call when the document is ready
     * @param {function} fn - the function to call
     */
    highed.ready = function (fn) {
        if (highed.isFn(fn)) {
            if (isReady) {
                fn();
            } else {
                initQueue.push(fn);
            }
        }
    };

    /** Log something
     * Accepts a variable amount of arguments after `level` which will be
     * the log message (similar to `console.log`).
     * @param {number} level - the log level 1..4    
     */
    highed.log = function (level) {
        var things = (Array.prototype.slice.call(arguments));
        things.splice(0, 1);

        if (level <= currentLogLevel) {
            console.log.apply(undefined, [logLevels[level - 1] + ':'].concat(things));
        }
    };

    /** Set the current log level
     *  @param level {number} - the current log level
     */
    highed.setLogLevel = function (level) {
        if (level <= logLevels.length) {
            currentLogLevel = level;
        }
    };

    /** Include something 
     *  @namespace highed
     *  @param what {string} - URL to a css or javascript file
     *  @param fn {function} - function to call when done including the script
     */
    highed.include = function (what, fn, asCSS) {
        var n;

        function next() {
            if (n < what.length - 1) {
                highed.include(what[++n], next);
            }

            return highed.isFn(fn) && fn();
        }

        if (highed.isArr(what)) {
            n = -1;
            return next();            
        }

        if (includedScripts[what]) {
            highed.log(3, 'script already included, skipping:', what);
            return fn();
        }
        
        highed.log(3, 'including script', what);
        includedScripts[what] = true;

        if (asCSS || what.lastIndexOf('.css') === what.length - 4) {
            n = highed.dom.cr('link');
            n.rel = 'stylesheet';
            n.type = 'text/css';
            n.href = what;
            n.onload = fn;
        } else {
            n = highed.dom.cr('script');
            n.src = what;
            n.onload = fn;
        }

        highed.dom.ap(document.head, n);
    };

    ///////////////////////////////////////////////////////////////////////////

    //Inject dependencies
    highed.ready(function () {
        highed.include('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css');
        highed.include('https://fonts.googleapis.com/css?family=Roboto:400,300,100,700|Source Sans:400,300,100', false, true);
    });

 //   highed.ready(function () {
        //Include the highcharts scripts
    // function tryAddScripts() {
    //     if (document.head) {
    //         cdnScripts.forEach(function (script) {
    //             var s = document.createElement('script');
    //             s.src = script;
    //             document.head.appendChild(s);
    //         });            
    //     } else {
    //         window.setTimeout(tryAddScripts, 10);            
    //     }
    // }

    // tryAddScripts();


    // function include(script, next) {
    //     var sc=document.createElement("script");
    //     sc.src = script;
    //     sc.type="text/javascript";
    //     sc.onload=function() {
    //         if (++next < incl.length) {
    //             include(incl[next], next);
    //         } else {
    //             loadedScripts = true;
    //         }
    //     };
    //     document.head.appendChild(sc);
    // }

    // var inc = {},
    //     incl = []
    // ; 

    // document.querySelectorAll("script").forEach(function(t) {inc[t.src.substr(0, t.src.indexOf("?"))] = 1;});

    // Object.keys(cdnScripts).forEach(function (k){
    //     if (!inc[k] && k && k.length > 0) {
    //         incl.push(k)
    //     }
    // });

    // if (incl.length > 0) { include(incl[0], 0); } else {loadedScripts = true;}
})();
