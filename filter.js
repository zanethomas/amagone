function zapSearchResults (node) {
  if(node.id === 'ads' || (node.dataset && node.dataset.domain === 'www.amazon.com')) {
    console.log(node.dataset.domain);
    node.innerHTML = '';
    return;
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        zapSearchResults(newNode);
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
