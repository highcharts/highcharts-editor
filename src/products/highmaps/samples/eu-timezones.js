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

highed.samples.addMapType('Choropleth', {
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
      type: undefined,
      min: undefined,
      minColor: undefined,
      maxColor: undefined,
      stops: undefined,
      dataClasses: [{
          from: 0,
          to: 0,
          color: '#7CB5EC',
          name: 'UTC'
      }, {
          from: 1,
          to: 1,
          color: '#434348',
          name: 'UTC+1'
      }, {
        from: 2,
        to: 2,
        color: '#90ED7D',
        name: 'UTC+2'
      },{
        from: 3,
        to: 3,
        color: '#F7A35B',
        name: 'UTC+3'
      }]
    }
  },
  dataset: [
    "code,value",
    "ie,0",
    "is,0",
    "gb,0",
    "pt,0",
    "no,1",
    "si,1",
    "se,1",
    "it,1",
    "dk,1",
    "sm,1",
    "de,1",
    "hr,1",
    "nl,1",
    "ba,1",
    "be,1",
    "yf,1",
    "lu,1",
    "me,1",
    "es,1",
    "al,1",
    "fr,1",
    "mk,1",
    "pl,1",
    "cz,1",
    "at,1",
    "ch,1",
    "li,1",
    "sk,1",
    "hu,1",
    "fi,2",
    "ee,2",
    "lv,2",
    "lt,2",
    "by,2",
    "ua,2",
    "md,2",
    "ro,2",
    "bg,2",
    "gr,2",
    "tr,2",
    "cy,2",
    "ru,3"
  ]
});
