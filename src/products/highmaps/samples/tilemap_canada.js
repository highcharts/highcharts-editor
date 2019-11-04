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

highed.samples.addMapType('Tilemap', {
  id: 'honeycomb-canada',
  title: 'Canada',
  description: '',
  thumbnail: {
    honeycomb: 'maphoneycomb_canada.svg',
    circle: 'mapcircle_canada.svg'
  },
  type: 'csv',
  inverted: true, 
  dataset: [
    "hc-a2,name,x,y,value",
    "BC,British Columbia,2,10,4849377",
    "AB,Alberta,2,11,737732",
    "SK,Saskatchewan,2,12,6745408",
    "MB,Manitoba,2,13,2994079",
    "ON,Ontario,2,14,39250017",
    "NS,Nova Scotia,3,17,5540545",
    "YT,Yukon,1,11,3596677",
    "NT,Northwest Territories,1,13,935614",
    "NU,Nunavut,1,12,7288000",
    "QC,Quebec,2,15,20612439",
    "NB,New Brunswick,1,17,10310371",
    "NL, Newfoundland and Labrador,1,16,1419561",
    "PE,Prince Edward Island,2,17,1634464"
  ]
});
