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
  id: 'honeycomb-eu',
  title: 'European Union',
  description: '',
  thumbnail: {
    honeycomb: 'maphoneycomb_eu.svg',
    circle: 'mapcircle_eu.svg'
  },
  type: 'csv',
  inverted: true, 
  dataset: [
    "hc-a2,name,x,y,value",
    "BY,Belarus,3,7,4849377",
    "BA,Bosnia and Herzegovina,7,5,737732",
    "BG,Bulgaria,6,7,6745408",
    "HR,Croatia,6,5,2994079",
    "CZ,Czech Republic,4,5,39250017",
    "EE,Estonia,1,7,5540545",
    "HU,Hungary,5,6,3596677",
    "LV,Latvia,2,7,935614",
    "LT,Lithuania,2,6,7288000",
    "MD,Moldova,5,8,20612439",
    "PL,Poland,3,6,10310371",
    "RO,Romania,5,7,1419561",
    "RU,Russia,3,8,1634464",
    "SK,Slovakia,4,6,12801539",
    "UA,Ukraine,4,7,6596855",
    "KV,Kosovo,8,6,3107126",
    "MK,Macedonia,7,7,2904021",
    "ME,Montenegro,7,6,4413457",
    "RS,Republic of Serbia,6,6,4649676",
    "SI,Slovenia,6,4,1330089",
    "TR,Turkey,7,8,6016447",
    "DK,Denmark,2,4,6811779",
    "FO,Faroe Islands,0,2,9928301",
    "FI,Finland,0,6,5519952",
    "IS,Iceland,-1,2,2984926",
    "NO,Norway,0,4,6093000",
    "SE,Sweden,0,5,1023579",
    "IT,Italy,6,3,1881503",
    "GR,Greece,9,6,2839099",
    "MT,Malta,7,2,1326813",
    "AL,Albania,8,5,8944469",
    "PT,Portugal,5,1,2085572",
    "ES,Spain,5,2,19745289",
    "CY,Cyprus,9,8,10146788",
    "LI,Liechtenstein,5,4,739482",
    "AT,Austria,5,5,11614373",
    "BE,Belgium,3,3,3878051",
    "FR,France,4,2,3970239",
    "DE,Germany,3,5,12784227",
    "IE,Ireland,2,0,1055173",
    "LU,Luxembourg,4,3,4832482",
    "NL,Netherlands,3,4,853175",
    "CH,Switzerland,4,4,6651194",
    "GB,United Kingdom,2,1,27862596"
  ]
});
