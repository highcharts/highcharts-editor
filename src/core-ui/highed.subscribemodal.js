/******************************************************************************

Copyright (c) 2016-2018, Highsoft

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

// @format

highed.SubscribeModal = function() {

  var payupModal = highed.OverlayModal(false, {
    width: 321,
    height: 219 
  }),
  events = highed.events(),
  changePlanBtn = highed.dom.cr('button', 'highed-import-button', "Choose a plan"),
  createAccountLink = highed.dom.cr('a', '', 'Create one')

  highed.dom.ap(payupModal.body, 
    highed.dom.cr("div", 'highed-premium-feature-header', 'Premium Feature'),
    highed.dom.cr("div", 'highed-premium-feature-text', "Annotate isn't available to free users. To use this feature, please choose a subscription plan"),
    highed.dom.ap(highed.dom.cr("div", 'highed-premium-feature-text'), changePlanBtn),
    highed.dom.ap(
      highed.dom.cr("div", 'highed-premium-feature-text', "Dont have an account? "),
      highed.dom.ap(highed.dom.cr("span"), createAccountLink)
    )

    );

  highed.dom.on(changePlanBtn, 'click', function() {
    //Hook for cloud to pick up
    events.emit("SwitchToSubscriptionPage");
    payupModal.hide()
  })

  highed.dom.on(createAccountLink, 'click', function() {
    //Hook for cloud to pick up
    events.emit("SwitchToCreateAccountPage");
    payupModal.hide()
  })


  return {
    show: payupModal.show,
    hide: payupModal.hide,
    on: events.on
  };
};
