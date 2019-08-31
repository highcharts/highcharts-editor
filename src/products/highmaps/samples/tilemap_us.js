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
  id: 'honeycomb-us',
  title: 'United States of America',
  description: '',
  thumbnail: {
    circle: 'mapcircle_usa.svg',
    honeycomb: 'maphoneycomb.svg'
  },
  type: 'csv',
  inverted: true, 
  dataset: [
    "hc-a2,name,x,y,value",
    "AL,Alabama,6,7,4849377",
    "AK,Alaska,0,0,737732",
    "AZ,Arizona,5,3,6745408",
    "AR,Arkansas,5,6,2994079",
    "CA,California,5,2,39250017",
    "CO,Colorado,4,3,5540545",
    "CT,Connecticut,3,11,3596677",
    "DE,Delaware,4,9,935614",
    "DC,District of Columbia,4,10,7288000",
    "FL,Florida,8,8,20612439",
    "GA,Georgia,7,8,10310371",
    "HI,Hawaii,8,0,1419561",
    "ID,Idaho,3,2,1634464",
    "IL,Illinois,3,6,12801539",
    "IN,Indiana,3,7,6596855",
    "IA,Iowa,3,5,3107126",
    "KS,Kansas,5,5,2904021",
    "KY,Kentucky,4,6,4413457",
    "LA,Louisiana,6,5,4649676",
    "ME,Maine,0,11,1330089",
    "MD,Maryland,4,8,6016447",
    "MA,Massachusetts,2,10,6811779",
    "MI,Michigan,2,7,9928301",
    "MN,Minnesota,2,4,5519952",
    "MS,Mississippi,6,6,2984926",
    "MO,Missouri,4,5,6093000",
    "MT,Montana,2,2,1023579",
    "NE,Nebraska,4,4,1881503",
    "NV,Nevada,4,2,2839099",
    "NH,New Hampshire,1,11,1326813",
    "NJ,New Jersey,3,10,8944469",
    "NM,New Mexico,6,3,2085572",
    "NY,New York,2,9,19745289",
    "NC,North Carolina,5,9,10146788",
    "ND,North Dakota,2,3,739482",
    "OH,Ohio,3,8,11614373",
    "OK,Oklahoma,6,4,3878051",
    "OR,Oregon,4,1,3970239",
    "PA,Pennsylvania,3,9,12784227",
    "RI,Rhode Island,2,11,1055173",
    "SC,South Carolina,6,8,4832482",
    "SD,South Dakota,3,4,853175",
    "TN,Tennessee,5,7,6651194",
    "TX,Texas,7,4,27862596",
    "UT,Utah,5,4,2942902",
    "VT,Vermont,1,10,626011",
    "VA,Virginia,5,8,8411808",
    "WA,Washington,2,1,7288000",
    "WV,West Virginia,4,7,1850326",
    "WI,Wisconsin,2,5,5778708",
    "WY,Wyoming,3,3,584153"
  ]
});
