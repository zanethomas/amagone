let beenhere = false;

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
}

function duck() {
  const divs = document.querySelectorAll("[data-domain='www.amazon.com']");

  divs.forEach(div => div.remove());
  document.getElementById('ads')?.remove();
}

function unk() {
  debugger;
}

const observer = new MutationObserver((mutations) => {

  const zapper =
    location.host.indexOf('duckduckgo') >= 0 ? duck :
    location.host.indexOf('google') >= 0 ? goog :
    location.host.indexOf('bing') >= 0 ? bing : unk;


  setTimeout(() => {
    if(beenhere) {
      return;
    }
    beenhere = true;
    zapper();
  },10)
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
