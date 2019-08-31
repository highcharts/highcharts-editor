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
  id: 'honeycomb-southamerica',
  title: 'South America',
  description: '',
  thumbnail: {
    honeycomb: 'maphoneycomb_southamerica.svg',
    circle: 'mapcircle_southamerica.svg'
  },
  type: 'csv',
  inverted: true, 
  dataset: [
    "iso-a3,capital,x,y,value",
    "ARG,Buenos Aires,7,15,4849377",
    "FLK,Stanley,6,16,737732",
    "CHL,Santiago,5,14,6745408",
    "URY,Montevideo,6,14,2994079",
    "PRY,Asunción,5,15,39250017",
    "BOL,Sucre,4,14,5540545",
    "PRU,Lima,4,13,3596677",
    "BRA,Brasília,4,15,935614",
    "SUR,Paramaribo,3,16,7288000",
    "GUF,Cayenne,2,15,20612439",
    "GUY,Georgetown,3,15,10310371",
    "VEN,Caracas,2,14,1419561",
    "COL,Bogotá,4,13,1634464",
    "ECU,Quito,3,14,12801539"
  ]
});
