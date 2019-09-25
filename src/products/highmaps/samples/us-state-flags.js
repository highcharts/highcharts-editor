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

highed.samples.addMapType('Pattern Fill', {
  id: 'us-state-flag',
  title: 'US State Flags',
  description: '',
  thumbnail: 'mappatternfill.png',
  map: 'countries/us/us-all',
  type: "Pattern Fill",
  type: 'csv',
  templateConfig: {
    title: {
      text: 'US State Flags'
    }
  },
  dataset: [
    "us-al,https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg",
    "us-ak,https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg",
    "us-az,https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg",
    "us-ar,https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg",
    "us-ca,https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/640px-Flag_of_California.svg.png",
    "us-co,https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg",
    "us-ct,https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Flag_of_Connecticut.svg/621px-Flag_of_Connecticut.svg.png",
    "us-de,https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flag_of_Delaware.svg/640px-Flag_of_Delaware.svg.png",
    "us-fl,https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/640px-Flag_of_Florida.svg.png",
    "us-ga,https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Georgia_%28U.S._state%29.svg/640px-Flag_of_Georgia_%28U.S._state%29.svg.png",
    "us-hi,https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg",
    "us-id,https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_Idaho.svg/609px-Flag_of_Idaho.svg.png",
    "us-il,https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Illinois.svg/800px-Flag_of_Illinois.svg.png",
    "us-in,https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg",
    "us-ia,https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Iowa.svg/640px-Flag_of_Iowa.svg.png",
    "us-ks,https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Kansas.svg/800px-Flag_of_Kansas.svg.png",
    "us-ky,https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Kentucky.svg/640px-Flag_of_Kentucky.svg.png",
    "us-la,https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Louisiana.svg/640px-Flag_of_Louisiana.svg.png",
    "us-me,https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Maine.svg/640px-Flag_of_Maine.svg.png",
    "us-md,https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg",
    "us-ma,https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Massachusetts.svg/800px-Flag_of_Massachusetts.svg.png",
    "us-mi,https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/640px-Flag_of_Michigan.svg.png",
    "us-mn,https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Minnesota.svg/640px-Flag_of_Minnesota.svg.png",
    "us-ms,https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg",
    "us-mo,https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Missouri.svg/640px-Flag_of_Missouri.svg.png",
    "us-mt,https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Montana.svg/640px-Flag_of_Montana.svg.png",
    "us-ne,https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Nebraska.svg/640px-Flag_of_Nebraska.svg.png",
    "us-nv,https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flag_of_Nevada.svg/640px-Flag_of_Nevada.svg.png",
    "us-nh,https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_New_Hampshire.svg/640px-Flag_of_New_Hampshire.svg.png",
    "us-nj,https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/640px-Flag_of_New_Jersey.svg.png",
    "us-nm,https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_New_Mexico.svg",
    "us-ny,https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/640px-Flag_of_New_York.svg.png",
    "us-nc,https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg",
    "us-nd,https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_North_Dakota.svg/613px-Flag_of_North_Dakota.svg.png",
    "us-oh,https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg",
    "us-ok,https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Oklahoma.svg/640px-Flag_of_Oklahoma.svg.png",
    "us-or,https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/640px-Flag_of_Oregon.svg.png",
    "us-pa,https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Pennsylvania.svg/640px-Flag_of_Pennsylvania.svg.png",
    "us-ri,https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Rhode_Island.svg",
    "us-sc,https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_South_Carolina.svg/640px-Flag_of_South_Carolina.svg.png",
    "us-sd,https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_South_Dakota.svg/640px-Flag_of_South_Dakota.svg.png",
    "us-tn,https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg",
    "us-tx,https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg",
    "us-ut,https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Utah_%282011-present%29.svg/800px-Flag_of_Utah_%282011-present%29.svg.png",
    "us-vt,https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Vermont.svg/640px-Flag_of_Vermont.svg.png",
    "us-va,https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/640px-Flag_of_Virginia.svg.png",
    "us-wa,https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Washington.svg/640px-Flag_of_Washington.svg.png",
    "us-wv,https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_West_Virginia.svg/640px-Flag_of_West_Virginia.svg.png",
    "us-wi,https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_Wisconsin.svg/640px-Flag_of_Wisconsin.svg.png",
    "us-wy,https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Wyoming.svg"
  ]
});
