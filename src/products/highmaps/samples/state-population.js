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
  id: 'state-population',
  title: 'US State Population',
  description: '',
  thumbnail: 'mapchoropleth.svg',
  map: 'countries/us/us-all',
  type: 'csv',
  templateConfig: {
    title: {
      text: 'US State Population'
    },
    tooltip: {
      valueSuffix: 'M'
    }
  },
  dataset: [
    "state/region,population",
    "us-al,4833722",
    "us-ak,735132",
    "us-az,6626624",
    "us-ar,2959373",
    "us-ca,38332521",
    "us-co,5268367",
    "us-ct,3596080",
    "us-de,925749",
    "us-dc,646449",
    "us-fl,19552860",
    "us-ga,9992167",
    "us-hi,1404054",
    "us-id,1612136",
    "us-il,12882135",
    "us-in,6570902",
    "us-ia,3090416",
    "us-ks,2893957",
    "us-ky,4395295",
    "us-la,4625470",
    "us-me,1328302",
    "us-md,5928814",
    "us-ma,6692824",
    "us-mi,9895622",
    "us-mn,5420380",
    "us-ms,2991207",
    "us-mo,6044171",
    "us-mt,1015165",
    "us-ne,1868516",
    "us-nv,2790136",
    "us-nh,1323459",
    "us-nj,8899339",
    "us-nm,2085287",
    "us-ny,19651127",
    "us-nc,9848060",
    "us-nd,723393",
    "us-oh,11570808",
    "us-ok,3850568",
    "us-or,3930065",
    "us-pa,12773801",
    "us-ri,1051511",
    "us-sc,4774839",
    "us-sd,844877",
    "us-tn,6495978",
    "us-tx,26448193",
    "us-ut,2900872",
    "us-vt,626630",
    "us-va,8260405",
    "us-wa,6971406",
    "us-wv,1854304",
    "us-wi,5742713",
    "us-wy,582658",
    "us-pr,3615086"
  ]
});
