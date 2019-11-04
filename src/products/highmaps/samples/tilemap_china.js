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
  id: 'honeycomb-china',
  title: 'China',
  description: '',
  thumbnail: {
    circle: 'mapcircle_china.svg',
    honeycomb: 'maphoneycomb_china.svg'
  },
  type: 'csv',
  inverted: true,
  dataset: [
    "hc-a2,capital,x,y,value",
    "琼,Haikou,7,5,4849377",
    "桂,Nanning,5,4,737732",
    "粤,Guangzhou,6,3,6745408",
    "湘,Changsha,4,4,2994079",
    "鄂,Wuhan,5,3,39250017",
    "豫,Zhengzhou,3,4,5540545",
    "港,Hong Kong,6,5,3596677",
    "澳,Macau,6,4,935614",
    "云(滇),Kunming,3,2,7288000",
    "川(蜀),Chengdu,3,1,20612439",
    "贵(黔),Guiyang,4,3,10310371",
    "渝,Chongqing,3,3,1419561",
    "藏,Lhasa,2,0,1634464",
    "闽,Fuzhou,6,6,12801539",
    "赣,Nanchang,4,6,6596855",
    "浙,Hangzhou,5,6,3107126",
    "皖,Hefei,3,5,2904021",
    "苏,Nanjing,4,5,4413457",
    "沪,Shanghai,5,7,4649676",
    "鲁,Jinan,5,5,1330089",
    "台,Taipei,7,8,6016447",
    "青,Xining,2,1,6811779",
    "甘(陇),Lanzhou,2,2,9928301",
    "陕(秦),Xi'an,1,2,5519952",
    "新,Ürümqi,1,1,2984926",
    "宁,Yinchuan,2,3,6093000",
    "辽,Shenyang,1,7,1023579",
    "黑,Harbin,0,8,1881503",
    "吉,Changchun,1,8,2839099",
    "冀,Shijiazhuang,1,6,1326813",
    "津,Tianjin,3,6,8944469",
    "晋,Taiyuan,2,5,2085572",
    "京,Beijing,2,6,19745289",
    "內蒙古(蒙),Hohhot,2,4,10146788"
  ]
});
