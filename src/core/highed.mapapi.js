/*******************************************************************************

Copyright (c) 2017-2018, Highsoft

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

*******************************************************************************/

// @format
// Map Api

highed.MapApi = function() {
  
  const config = highed.config.mapApi;

  ///////////////////////////////////////////////////////////////////////////

  function getLatLong(location, cb) {
    if (!config) return;

    var request_url = config.url
    + '?'
    + 'key=' + config.api_key
    + '&q=' + encodeURIComponent(location)
    + '&pretty=1'
    + '&no_annotations=1';

    highed.ajax({
      url: request_url,
      success: function(request){

        
        if (request.status && request.status.code == 200) { 
          // Success!
          if (request.results.length > 0) cb(request.results[0]);
          else alert("We are unable to find any results that match the search query.");
        } else if (request.status <= 500) { 
          // We reached our target server, but it returned an error
          
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log(data.status.message);
        } else {
          console.log("server error");
        }
      },
      error: function(err) {
        
      },
      skipContentType: true
    });

  }

  return {
    getLatLong: getLatLong
  };

};