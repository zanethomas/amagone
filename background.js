
const browser = chrome || browser;

let state;
let icon = 'icons/grey-38.png';

const icons = {
  on: 'icons/strike-38.png',
  off: 'icons/a-38.png',
  disabled: 'icons/grey-a-38.png'
};

browser.browserAction.onClicked.addListener(toggle);

const query = async params => {
  return new Promise((resolve, reject) => {
    browser.tabs.query({active: true, currentWindow: true}, resolve);
  });
}

const sendMessage = async (message) => {
  return new Promise(async (resolve, reject) => {
    const tabs = await query({active: true, currentWindow: true});

    browser.tabs.sendMessage(tabs[0].id, message, resolve);
  });
}

async function toggle() {
  if(state !== 'disabled') {
    response = await sendMessage({toggle: true});
    state = response.state;
    setIcon();    
  }
}

function setIcon() {
  browser.browserAction.setIcon({
    path: {
      38: icon
    }
  });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse();

  console.log(request);
  if(request.state) {
    state = request.state;
    icon = icons[request.state];
  }
  setIcon();
});
