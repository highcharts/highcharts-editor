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
  id: 'honeycomb-brazil',
  title: 'Brazil',
  description: '',
  thumbnail: {
    honeycomb: 'maphoneycomb_brazil.svg',
    circle: 'mapcircle_brazil.svg'
  },
  type: 'csv',
  dataset: [
    "hc-a2,name,x,y,value",
    "AC,Acre,1,3,4849377",
    "AL,Alagoas,7,3,737732",
    "AM,Amazonas,2,3,6745408",
    "AP,Amapá,3,4,2994079",
    "BA,Bahia,6,1,39250017",
    "CE,Ceará,5,4,5540545",
    "DF,Distrito Federal,5,2,3596677",
    "ES,Espírito Santo,5,1,935614",
    "GO,Goiás,4,1,7288000",
    "MA,Maranhão,4,3,20612439",
    "MG,Minas Gerais,4,0,10310371",
    "MS,Mato Grosso do Sul,3,1,1419561",
    "MT,Mato Grosso,3,2,1634464",
    "PA,Pará,3,3,12801539",
    "PB,Paraíba,7,4,6596855",
    "PE,Pernambuco,6,3,3107126",
    "PI,Piauí,5,3,2904021",
    "PR,Paraná,3,-1,4413457",
    "RJ,Rio de Janeiro,5,0,4649676",
    "RN,Rio Grande do Norte,6,4,1330089",
    "RO,Rondônia,2,2,6016447",
    "RR,Roraima,2,4,6811779",
    "RS,Rio Grande do Sul,3,-2,9928301",
    "SC,Santa Catarina,4,-2,5519952",
    "SE,Sergipe,6,2,2984926",
    "SP,São Paulo,4,-1,6093000",
    "TO,Tocantins,4,2,1023579"
  ]
});
