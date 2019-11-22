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

highed.samples.addMapType('Point Map', {
  id: 'destinations',
  title: 'Top 25 Destinations in Europe',
  description: '',
  thumbnail: 'topdest.svg',
  map: 'custom/europe',
  type: 'csv',
  templateConfig: {
    title: {
      text: 'Top 25 Destinations in Europe'
    },
    subtitle: {
        text: 'According to Tripadvisor (2019)'
    }
  },
  useLatLong: true,
  dataset: [
    "Latitude,Longitude,Destination",
    "50.0619474,19.9368564,Krakow",
    "37.04858515,31.2799179,Manavgat",
    "48.2083537,16.3725042,Vienna",
    "59.938732,30.316229,St.Petersburg",
    "55.9533456,-3.1883749,Edinburgh",
    "52.5170365,13.3888599,Berlin",
    "35.8885993,14.4476911,Malta",
    "33.06578005,-16.3362371,Madeira islands",
    "47.4983815,19.0404707,Budapest",
    "42.18808965,9.068413771,Corsica",
    "45.4371908,12.3345898,Venice",
    "52.3745403,4.897975506,Amsterdam",
    "36.4379874,28.2233083,Rhodos",
    "43.7698712,11.2555757,Florence",
    "36.4106263,25.4436646,Cyclades island",
    "28.2935785,-16.62144712,Tenerife",
    "39.6134018,2.880430533,Mallorca",
    "38.7077507,-9.1365919,Lisbon",
    "50.0874654,14.4212535,Prague",
    "41.0096334,28.9651646,Istanbul",
    "41.3828939,2.1774322,Barcelona",
    "35.2788061,24.93428854,Crete",
    "41.894802,12.4853384,Rome",
    "48.8566969,2.3514616,Paris",
    "51.5073219,-0.1276474,London"
  ]
});
