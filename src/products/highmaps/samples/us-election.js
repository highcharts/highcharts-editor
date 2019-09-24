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
  templateConfig: {
    colorAxis: {
      type: undefined,
      min: undefined,
      minColor: undefined,
      maxColor: undefined,
      stops: undefined,
      dataClasses: [{
          from: -100,
          to: 0,
          color: '#C40401',
          name: 'Clinton'
      }, {
          from: 0,
          to: 100,
          color: '#0200D0',
          name: 'Trump'
      }]
    }
  },
  dataset: [
    "Key,Margin (Trump)",
    "us-al,27.73",
    "us-ak,14.73",
    "us-az,3.5",
    "us-ar,26.92",
    "us-ca,-29.99",
    "us-co,-4.91",
    "us-ct,-13.64",
    "us-de,-11.37",
    "us-dc,-86.78",
    "us-fl,1.19",
    "us-ga,5.1",
    "us-hi,-32.18",
    "us-id,32.18",
    "us-il,-16.89",
    "us-in,19.01",
    "us-ia,9.41",
    "us-ks,20.42",
    "us-ky,29.84",
    "us-la,19.64",
    "us-me,-2.96",
    "us-md,-26.42",
    "us-ma,-27.2",
    "us-mi,0.22",
    "us-mn,-1.51",
    "us-ms,17.8",
    "us-mo,18.51",
    "us-mt,20.23",
    "us-ne,25.05",
    "us-nv,-2.42",
    "us-nh,-0.37",
    "us-nj,-13.98",
    "us-nm,-8.21",
    "us-ny,-22.49",
    "us-nc,3.66",
    "us-nd,35.73",
    "us-oh,8.07",
    "us-ok,36.39",
    "us-or,-10.98",
    "us-pa,0.72",
    "us-ri,-15.51",
    "us-sc,14.27",
    "us-sd,29.79",
    "us-tn,26.01",
    "us-tx,8.98",
    "us-ut,17.89",
    "us-vt,-26.41",
    "us-va,-5.32",
    "us-wa,-15.71",
    "us-wv,41.68",
    "us-wi,0.76",
    "us-wy,46.3"
  ]
});
