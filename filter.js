const browser = chrome || browser;

let state = 'on';

function saveState() {
  browser.storage.local.set({
    state
  });
}

function restoreState() {
    browser.storage.local.get('state', res => {
      state = res.state;
      browser.runtime.sendMessage({
        type: "state",
        state
      });
    });
}

function bing() {
  const results = document.getElementById('b_results');

  if(!results) {
    return;
  }
  const links = results.querySelectorAll('a');

  links.forEach(l => {
    if(l.host === 'www.amazon.com') {
      let parent = l.parentElement;

      while(parent && parent.tagName !== 'LI') {
        parent = parent.parentElement;
      }
      if(parent) {
        parent.remove();
      }
    }
  });
}

function goog() {
  const search = document.getElementById('search');

  if(!search) {
    return;
  }

  search.querySelectorAll('.g').forEach(g => {
    if(g.querySelector('a').host.indexOf('amazon') >= 0) {
      g.remove();
    }
  });
  document.getElementById('tads')?.remove();
}

function duck() {
  const divs = document.querySelectorAll("[data-domain='www.amazon.com']");

  divs.forEach(div => div.remove());
  document.getElementById('ads')?.remove();
}

function unk() {
}


const zapper =
  location.host.indexOf('duckduckgo') >= 0 ? duck :
  location.host.indexOf('google') >= 0 ? goog :
  location.host.indexOf('bing') >= 0 ? bing : null;

if(!zapper) {
  browser.runtime.sendMessage({
    type: "state",
    state:'disabled'
  });
} else {
  const observer = new MutationObserver((mutations) => {
    restoreState();

    if(state === 'off') {
      return;
    }


    setTimeout(() => {
      zapper();
    },10)
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.toggle) {
        state = state === 'on' ? 'off' : 'on';
        sendResponse({state});
        saveState();
        window.location.reload();
      } else if(request.getState) {
        sendResponse({state});
      }
    }
  );

  restoreState();
}
