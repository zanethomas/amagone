
const log = [];
const browser = chrome || browser;

function saveLog() {
  browser.storage.local.set({
    log: log
  });
}

function restoreLog() {
  // document.getElementById('log').innerText = res.log[0];
  browser.storage.local.get('log', res => {
    if(!res) {
      return;
    }
    
    const parent = document.getElementById('log');

    res.log.forEach(item => {
      const div = document.createElement('div');

      div.innerText = item;
      parent.appendChild(div);
    })
  });
}

function restoreOptions() {
  restoreLog();
}

function addSite(event) {
  log.push(event.target.id);
  saveLog();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('add-site').addEventListener('click', addSite);
