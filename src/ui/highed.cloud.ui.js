/******************************************************************************

Copyright (c) 2016, Highsoft

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

(function () {

  function createTeamDropDown(target) {
    var dropdown = highed.DropDown(target);

    function refresh() {
      dropdown.clear();

      highed.cloud.getTeams(function (teamCollection) {
        teamCollection.forEach(function (team) {
          dropdown.addItem({
            id: team.id,
            title: team.name
          });
        });

        dropdown.selectByIndex(0);
      });
    }

    return {
      refresh: refresh,
      dropdown: dropdown
    };
  }

  var chartPreview = false,
    modal = highed.OverlayModal(document.body, { //eslint-disable-line no-undef
      showOnInit: false,
      width: '90%',
      height: '90%',
      zIndex: 10001
    }),
    mainContainer = highed.dom.cr('div'),
    charts = highed.dom.cr('div', 'highed-cloud-chart-container'),
    teams = createTeamDropDown(mainContainer),
    pageNavigation = highed.dom.cr('div', 'highed-cloud-paging'),
    activeTeam,
    activeChart,

    saveNewModal = highed.OverlayModal(document.body, { //eslint-disable-line no-undef
      showOnInt: false,
      width: 400,
      height: 300,
      zIndex: 10001
    }),
    saveNewTeamsContainer = highed.dom.cr('div'),
    saveNewTeams = createTeamDropDown(saveNewTeamsContainer),
    saveNewName = highed.dom.cr('input', 'highed-field-input'),
    saveNewBtn = highed.dom.cr('button', 'highed-ok-button', 'Save to cloud'),

    loginForm = false
  ;

  highed.dom.ap(saveNewModal.body,
    highed.dom.cr('h2', 'highed-titlebar', 'Save to Cloud'),
    highed.dom.cr('div', '', 'Team'),
    saveNewTeamsContainer,
    highed.dom.cr('br'),
    highed.dom.cr('div', '', 'Chart Name'),
    saveNewName,
    saveNewBtn
  );

  highed.dom.on(saveNewBtn, 'click', function () {

    saveNewBtn.disabled = true;
    saveNewBtn.innerHTML = 'SAVING TO CLOUD...';

    highed.cloud.saveNewChart(
      activeTeam,
      saveNewName.value,
      JSON.stringify(chartPreview.toProject()),
      function (data) {
        saveNewBtn.disabled = false;
        if (!data.error && data) {
          activeChart = data;
          saveNewModal.hide();
          saveNewBtn.innerHTML = 'SAVE TO CLOUD';
          highed.snackBar('SAVED TO CLOUD');
        } else {
          highed.snackBar('Error saving to cloud');
        }
      }
    );
  });

  saveNewTeams.dropdown.on('Change', function (item) {
    activeTeam = item.id();
  });

  function addChart(chart) {
    var container = highed.dom.cr('div', 'highed-cloud-chart'),
        thumbnail = highed.dom.cr('div', 'highed-cloud-thumbnail')
    ;

    highed.dom.ap(charts,
      highed.dom.ap(container,
        thumbnail,
        highed.dom.cr('div', 'highed-cloud-chart-title', chart.name)
      )
    );

    highed.dom.style(thumbnail, {
      'background-image': 'url(' + chart.thumbnail_url + '?t=' + (new Date()).getTime() + ')'
    });

    highed.dom.on(thumbnail, 'click', function () {
      if (chartPreview) {
        highed.cloud.getChart(chart.team_owner, chart.id, function (data) {
          try {
            chartPreview.loadProject(JSON.parse(data.data));
            activeChart = chart.id;
            activeTeam = chart.team_owner;
            modal.hide();
          } catch (e) {
            highed.snackbar(e);
          }
        });
      }
    });
  }

  highed.dom.ap(modal.body,
    highed.dom.cr('h2', 'highed-titlebar', 'Load project from Highcharts Cloud'),
    highed.dom.ap(mainContainer,
      charts,
      pageNavigation
    )
  );

  function getCharts(page, teamID) {
    // Load charts here
    charts.innerHTML = 'Loading Charts';
    highed.cloud.getCharts(teamID, function (chartCollection, full) {
      charts.innerHTML = '';
      pageNavigation.innerHTML = '';

      if (full.pageCount > 1) {
        for (var i = 1; i <= full.pageCount; i++) {
          (function (pageIndex) {
            var item = highed.dom.cr('span', 'highed-cloud-paging-item', i);

            if (pageIndex === page) {
              item.className += ' selected';
            }

            highed.dom.on(item, 'click', function () {
              getCharts(pageIndex, teamID);
            });

            highed.dom.ap(pageNavigation, item);
          })(i);
        }
      }

      chartCollection.forEach(addChart);
    }, page);

  }

  teams.dropdown.on('Change', function (item) {
    getCharts(false, item.id());
  });

  highed.cloud.flush = function () {
    activeChart = false;
    activeTeam = false;
  };

  highed.cloud.save = function (chartp) {
      highed.cloud.loginForm(function () {
          saveNewName.value = '';
          saveNewName.focus();
          chartPreview = chartp || chartPreview;
          if (activeChart && activeTeam) {
              // Save project
              highed.cloud.saveExistingChart(
                activeTeam,
                activeChart,
                JSON.stringify(chartPreview.toProject()),
                function () {
                  highed.snackbar('CHART SAVED TO CLOUD');
                }
              );
          } else {
              // Show save as new UI
              saveNewModal.show();
              saveNewTeams.refresh();
          }
      });
  };

  highed.cloud.showUI = function (preview) {
    highed.cloud.loginForm(function () {
      chartPreview = preview;
      modal.show();
      teams.refresh();
    });
  };


  function createLoginForm() {
    var body = highed.dom.cr('div', 'highed-cloud-login-container'),
        username = highed.dom.cr('input', 'highed-cloud-input'),
        password = highed.dom.cr('input', 'highed-cloud-input'),
        btn = highed.dom.cr('button', 'highed-ok-button', 'LOGIN'),
        notice = highed.dom.cr('div', 'highed-cloud-login-error'),
        loginCallback = false,
        modal = highed.OverlayModal(false, {
          height: 300,
          width: 250,
          zIndex: 10001
        })
    ;

    username.name = 'cloud-username';
    password.name = 'cloud-password';

    username.placeholder = 'E-Mail';
    password.placeholder = 'Your password';
    password.type = 'password';

    highed.dom.ap(modal.body,
      highed.dom.ap(body,
        highed.dom.cr('h3', '', 'Login to Highcharts Cloud'),
        notice,
        username,
        password,
        btn,
        highed.dom.cr('div', 'highed-cloud-login-notice', 'Requires a Highcharts Cloud account')
      )
    );

    highed.dom.on(btn, 'click', function () {
      btn.disabled = true;
      highed.dom.style(notice, { display: 'none' });

      highed.cloud.login(username.value, password.value, function (err, res) {
        btn.disabled = false;

        if (err || !res || typeof res.token === 'undefined') {
          notice.innerHTML = 'Error: Check username/password (' + (err || res.message) + ')';
          highed.dom.style(notice, { display: 'block' });
        } else {
          modal.hide();
          if (highed.isFn(loginCallback)) {
            loginCallback();
          }
        }
      });
    });

    return function (fn) {
      loginCallback = fn || function () {};
      if (highed.cloud.isLoggedIn()) {
        loginCallback();
      } else {
        modal.show();
      }
    };
  };

  highed.cloud.loginForm = function (fn) {
    if (!loginForm) {
      loginForm = createLoginForm();
    }
    loginForm(fn);
  };

}());
