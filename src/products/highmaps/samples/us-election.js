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
  id: 'us-presidential',
  title: 'US Presidential Election 2016 Results',
  description: '',
  thumbnail: 'us-election.svg',
  map: 'countries/us/us-all',
  type: "Choropleth",
  type: 'csv',
  dataset: [
    "Key,Margin (Trump)",
    "AL,27.73",
    "AK,14.73",
    "AZ,3.5",
    "AR,26.92",
    "CA,-29.99",
    "CO,-4.91",
    "CT,-13.64",
    "DE,-11.37",
    "DC,-86.78",
    "FL,1.19",
    "GA,5.1",
    "HI,-32.18",
    "ID,32.18",
    "IL,-16.89",
    "IN,19.01",
    "IA,9.41",
    "KS,20.42",
    "KY,29.84",
    "LA,19.64",
    "ME,-2.96",
    "MD,-26.42",
    "MA,-27.2",
    "MI,0.22",
    "MN,-1.51",
    "MS,17.8",
    "MO,18.51",
    "MT,20.23",
    "NE,25.05",
    "NV,-2.42",
    "NH,-0.37",
    "NJ,-13.98",
    "NM,-8.21",
    "NY,-22.49",
    "NC,3.66",
    "ND,35.73",
    "OH,8.07",
    "OK,36.39",
    "OR,-10.98",
    "PA,0.72",
    "RI,-15.51",
    "SC,14.27",
    "SD,29.79",
    "TN,26.01",
    "TX,8.98",
    "UT,17.89",
    "VT,-26.41",
    "VA,-5.32",
    "WA,-15.71",
    "WV,41.68",
    "WI,0.76",
    "WY,46.3"
  ]
});
