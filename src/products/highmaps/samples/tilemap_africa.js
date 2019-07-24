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
  id: 'circle-africa',
  title: 'Africa',
  thumbnail: {
    honeycomb: 'maphoneycomb_africa.svg',
    circle: 'mapcircle.svg'
  },
  description: '',
  type: 'csv',
  dataset: [
    "hc-a2,name,region,x,y,value",
    "ZW,Zimbabwe,Eastern Africa,12,1,1.7",
    "ZM,Zambia,Eastern Africa,11,2,3.2",
    "MG,Madagascar,Eastern Africa,17,2,4.6",
    "MW,Malawi,Eastern Africa,12,2,3.7",
    "MZ,Mozambique,Eastern Africa,13,2,5.5",
    "BI,Burundi,Eastern Africa,10,2,2",
    "TZ,United Republic of Tanzania,Eastern Africa,13,3,6.9",
    "RW,Rwanda,Eastern Africa,11,3,6.6",
    "KE,Kenya,Eastern Africa,12,3,6.4",
    "UG,Uganda,Eastern Africa,10,3,5.8",
    "SO,Somalia,Eastern Africa,17,4,2.5",
    "ET,Ethiopia,Eastern Africa,12,4,3.3",
    "SX,Somaliland,Eastern Africa,15,4,2.5",
    "SS,South Sudan,Eastern Africa,10,4,3.5",
    "DJ,Djibouti,Eastern Africa,14,4,7",
    "ER,Eritrea,Eastern Africa,13,5,3.3",
    "AO,Angola,Middle Africa,9,2,1.2",
    "CD,Democratic Republic of the Congo,Middle Africa,8,2,4.5",
    "GA,Gabon,Middle Africa,8,3,3",
    "GQ,Equatorial Guinea,Middle Africa,6,3,5.8",
    "CG,Republic of Congo,Middle Africa,9,3,4.4",
    "CM,Cameroon,Middle Africa,9,4,5.5",
    "CF,Central African Republic,Middle Africa,11,4,4",
    "TD,Chad,Middle Africa,13,4,1.7",
    "SD,Sudan,Northern Africa,11,5,3.5",
    "EH,Western Sahara,Northern Africa,2,5,3.5",
    "DZ,Algeria,Northern Africa,6,5,2.3",
    "LY,Libya,Northern Africa,10,5,19.3",
    "EG,Egypt,Northern Africa,12,5,3.2",
    "MA,Morocco,Northern Africa,4,5,3.7",
    "TN,Tunisia,Northern Africa,8,5,1.9",
    "ZA,South Africa,Southern Africa,9,1,1.2",
    "LS,Lesotho,Southern Africa,11,1,2.5",
    "SZ,Swaziland,Southern Africa,13,1,0.9",
    "NA,Namibia,Southern Africa,8,1,4",
    "BW,Botswana,Southern Africa,10,1,4.1",
    "LR,Liberia,Western Africa,2,4,4",
    "TG,Togo,Western Africa,3,4,5.5",
    "SL,Sierra Leone,Western Africa,0,4,4",
    "CI,Ivory Coast,Western Africa,4,4,8",
    "GH,Ghana,Western Africa,6,4,6.3",
    "NG,Nigeria,Western Africa,7,4,1.5",
    "SN,Senegal,Western Africa,1,5,6.7",
    "GM,Gambia,Western Africa,1,4,4",
    "GN,Guinea,Western Africa,9,5,4",
    "BF,Burkina Faso,Western Africa,5,5,4",
    "BJ,Benin,Western Africa,5,4,5.5",
    "GW,Guinea Bissau,Western Africa,7,5,5.5",
    "ML,Mali,Western Africa,3,5,4.8",
    "NE,Niger,Western Africa,8,4,5.5",
    "MR,Mauritania,Western Africa,-1,5,4.3"
  ]
});
