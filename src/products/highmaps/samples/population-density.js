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
  id: 'population-density',
  title: 'Population density by country (/km²)',
  description: '',
  thumbnail: 'population-density.svg',
  map: 'custom/world',
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
          to: 3,
          color: 'rgba(19,64,117,0.05)'
      }, {
          from: 3,
          to: 10,
          color: 'rgba(19,64,117,0.2)'
      }, {
          from: 10,
          to: 30,
          color: 'rgba(19,64,117,0.4)'
      }, {
          from: 30,
          to: 100,
          color: 'rgba(19,64,117,0.5)'
      }, {
          from: 100,
          to: 300,
          color: 'rgba(19,64,117,0.6)'
      }, {
          from: 300,
          to: 1000,
          color: 'rgba(19,64,117,0.8)'
      }, {
          from: 1000,
          color: 'rgba(19,64,117,1)'
      }]
    },
    legend: {
      title: {
          text: 'Individuals per km²'
      },
      align: 'left',
      verticalAlign: 'bottom',
      floating: true,
      layout: 'vertical',
      valueDecimals: 0,
      symbolRadius: 0,
      symbolHeight: 14
    }
  },
  dataset: [
    "code,value",
    "aw,582",
    "af,53",
    "ao,23",
    "al,105",
    "ad,164",
    "ae,111",
    "ar,16",
    "am,103",
    "as,278",
    "ag,229",
    "au,3",
    "at,106",
    "az,118",
    "bi,410",
    "be,375",
    "bj,96",
    "bf,68",
    "bd,1252",
    "bg,66",
    "bh,1848",
    "bs,39",
    "ba,69",
    "by,47",
    "bz,16",
    "bm,1307",
    "bo,10",
    "br,25",
    "bb,663",
    "bn,80",
    "bt,21",
    "bw,4",
    "cf,7",
    "ca,4",
    "ch,212",
    "cl,866",
    "cn,24",
    "ci,147",
    "cm,75",
    "cd,50",
    "cg,35",
    "co,15",
    "km,44",
    "cv,428",
    "cr,134",
    "cu,95",
    "cw,110",
    "ky,360",
    "cy,253",
    "cz,127",
    "de,137",
    "dj,237",
    "dm,41",
    "dk,98",
    "do,136",
    "dz,220",
    "ec,17",
    "eg,66",
    "er,96",
    "es,93",
    "ee,31",
    "et,102",
    "fi,18",
    "fj,49",
    "fr,122",
    "fo,35",
    "fm,150",
    "ga,8",
    "gb,271",
    "ge,54",
    "gh,124",
    "gi,3441",
    "gn,50",
    "gm,201",
    "gw,65",
    "gq,44",
    "gr,83",
    "gd,316",
    "gl,0",
    "gt,155",
    "gu,302",
    "gy,4",
    "hk,6997",
    "hn,81",
    "hr,75",
    "ht,394",
    "hu,108",
    "id,144",
    "im,147",
    "in,445",
    "ie,69",
    "ir,49",
    "iq,86",
    "is,3",
    "il,395",
    "it,206",
    "jm,266",
    "jo,107",
    "jp,348",
    "kz,7",
    "ke,85",
    "kg,32",
    "kh,89",
    "ki,141",
    "kn,211",
    "kr,526",
    "kw,227",
    "la,29",
    "lb,587",
    "lr,48",
    "ly,4",
    "lc,292",
    "li,235",
    "lk,338",
    "ls,73",
    "lt,46",
    "lu,225",
    "lv,32",
    "mo,20406",
    "mf,592",
    "ma,79",
    "mc,19250",
    "md,108",
    "mg,43",
    "mv,1392",
    "mx,66",
    "mh,295",
    "mk,83",
    "ml,15",
    "mt,1365",
    "mm,81",
    "me,46",
    "mn,2",
    "mp,120",
    "mz,37",
    "mr,4",
    "mu,622",
    "mw,192",
    "my,95",
    "na,20",
    "nc,3",
    "ne,15",
    "ng,16",
    "ni,204",
    "nl,51",
    "no,505",
    "np,14",
    "nr,202",
    "nz,652",
    "om,18",
    "pk,14",
    "pa,251",
    "pe,54",
    "ph,25",
    "pw,347",
    "pg,47",
    "pl,18",
    "pr,124",
    "kp,385",
    "pt,211",
    "py,113",
    "ps,17",
    "pf,756",
    "qa,77",
    "ro,221",
    "ru,86",
    "rw,9",
    "sa,483",
    "sd,15",
    "sn,17",
    "sg,80",
    "sb,7909",
    "sl,21",
    "sv,102",
    "sm,306",
    "so,553",
    "rs,23",
    "ss,81",
    "st,208",
    "sr,4",
    "sk,113",
    "si,103",
    "se,24",
    "sz,78",
    "sx,1177",
    "sc,206",
    "sy,100",
    "tc,37",
    "td,11",
    "tg,140",
    "th,135",
    "tj,63",
    "tm,12",
    "tl,85",
    "to,149",
    "tt,266",
    "tn,73",
    "tr,103",
    "tv,370",
    "tz,63",
    "ug,207",
    "ua,78",
    "uy,20",
    "us,35",
    "uz,75",
    "vc,281",
    "ve,36",
    "vg,204",
    "vi,294",
    "vn,299",
    "vu,22",
    "ws,69",
    "ye,52",
    "za,46",
    "zm,22",
    "zw,42"
  ]
});
