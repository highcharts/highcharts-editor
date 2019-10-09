/*******************************************************************************

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

******************************************************************************/

highed.samples.addMapType('Categories', {
  id: 'eu-timezones',
  title: 'Europe time zones',
  description: '',
  thumbnail: 'eu-timezones.svg',
  map: 'custom/europe',
  type: 'csv',
  templateConfig: {
    title: {
      text: 'Europe time zones'
    },
    colorAxis: {
      type: null,
      min: null,
      minColor: null,
      maxColor: null,
      stops: null,
      dataClasses: [{
          from: 1,
          to: 2,
          color: '#7CB5EC',
          name: 'UTC'
      }, {
          from: 2,
          to: 3,
          color: '#434348',
          name: 'UTC+1'
      }, {
        from: 3,
        to: 4,
        color: '#90ED7D',
        name: 'UTC+2'
      },{
        from: 4,
        to: 5,
        color: '#F7A35B',
        name: 'UTC+3'
      }]
    }
  },
  dataset: [
    "code,value",
    "ie,1",
    "is,1",
    "gb,1",
    "pt,1",
    "no,2",
    "si,2",
    "se,2",
    "it,2",
    "dk,2",
    "sm,2",
    "de,2",
    "hr,2",
    "nl,2",
    "ba,2",
    "be,2",
    "yf,2",
    "lu,2",
    "me,2",
    "es,2",
    "al,2",
    "fr,2",
    "mk,2",
    "pl,2",
    "cz,2",
    "at,2",
    "ch,2",
    "li,2",
    "sk,2",
    "hu,2",
    "fi,3",
    "ee,3",
    "lv,3",
    "lt,3",
    "by,3",
    "ua,3",
    "md,3",
    "ro,3",
    "bg,3",
    "gr,3",
    "tr,3",
    "cy,3",
    "ru,5"
  ]
});
