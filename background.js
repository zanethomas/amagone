
const browser = chrome || browser;

let state;
let icon = 'icons/grey-38.png';

const icons = {
  on: 'icons/no-a-38.png',
  off: 'icons/a-38.png',
  disabled: 'icons/grey-a-38.png'
};

const query = async params => {
  return new Promise((resolve, reject) => {
    browser.tabs.query({active: true, currentWindow: true}, resolve);
  });
}

const sendMessage = async (tab, message) => {
  return new Promise(async (resolve, reject) => {
    const tabs = await query({active: true, currentWindow: true});

    browser.tabs.sendMessage(tab.id, message, resolve);
  });
}

const toggle = async (tab) => {
  if(state !== 'disabled') {
    response = await sendMessage(tab, {toggle: true});
    state = response.state;
    setIcon();
  }
}

const setIcon = () => {
  browser.browserAction.setIcon({
    path: {
      38: icon
    }
  });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse();

  if(request.state) {
    state = request.state;
    icon = icons[request.state];
  }
  setIcon();
});

browser.browserAction.onClicked.addListener(toggle);
