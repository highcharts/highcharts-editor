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

(function() {
  var token = false,
    url = highed.option('cloudAPIURL');

  // Set up namespace for the cloud API
  highed.cloud = {};

  highed.cloud.isLoggedIn = function() {
    return token !== false;
  };

  highed.cloud.login = function(username, password, fn) {
    url = highed.option('cloudAPIURL');

    highed.ajax({
      url: url + 'login',
      type: 'post',
      data: {
        username: username,
        password: password
      },
      success: function(data) {
        if (data && data.token) {
          token = data.token;
        }
        return highed.isFn(fn) && fn(typeof data.token === 'undefined', data);
      },
      error: function(err) {
        return highed.isFn(fn) && fn(err);
      }
    });
  };

  highed.cloud.getTeams = function(fn) {
    url = highed.option('cloudAPIURL');

    highed.ajax({
      url: url + 'teams',
      type: 'get',
      headers: {
        'X-Auth-Token': token
      },
      success: function(data) {
        if (data.error) {
          return highed.snackBar(data.message);
        }
        return highed.isFn(fn) && fn(data);
      }
    });
  };

  highed.cloud.getCharts = function(teamID, fn, page) {
    url = highed.option('cloudAPIURL');

    highed.ajax({
      url: url + 'team/' + teamID + '/charts/' + '?page=' + page,
      type: 'get',
      headers: {
        'X-Auth-Token': token
      },
      success: function(data) {
        if (data.error) {
          return highed.snackBar(data.message);
        }
        return highed.isFn(fn) && fn(data.data, data);
      }
    });
  };

  highed.cloud.getChart = function(teamID, chartID, fn) {
    url = highed.option('cloudAPIURL');

    highed.ajax({
      url: url + 'team/' + teamID + '/chart/' + chartID,
      type: 'get',
      headers: {
        'X-Auth-Token': token
      },
      success: function(data) {
        if (data.error) {
          return highed.snackBar(data.message);
        }
        return highed.isFn(fn) && fn(data);
      }
    });
  };

  highed.cloud.saveExistingChart = function(teamID, chartID, chart, fn) {
    url = highed.option('cloudAPIURL');

    highed.ajax({
      url: url + 'team/' + teamID + '/chart/' + chartID,
      type: 'post',
      headers: {
        'X-Auth-Token': token
      },
      data: {
        data: chart
      },
      success: function(data) {
        if (data.error) {
          return highed.snackbar(data.message);
        }
        return highed.isFn(fn) && fn(data);
      }
    });
  };

  highed.cloud.saveNewChart = function(teamID, name, chart, fn) {
    url = highed.option('cloudAPIURL');

    highed.ajax({
      url: url + 'team/' + teamID + '/chart',
      type: 'post',
      headers: {
        'X-Auth-Token': token
      },
      data: {
        name: name,
        data: chart
      },
      success: function(data) {
        if (data.error) {
          return highed.snackbar(data.message);
        }
        return highed.isFn(fn) && fn(data);
      }
    });
  };
})();
