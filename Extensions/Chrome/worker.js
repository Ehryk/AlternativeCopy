// worker.js (Manifest v3)

let platform;

let lastHref;
let lastUrl;
let lastProtocol;
let lastHost;
let lastResult;

chrome.runtime.getPlatformInfo(function(info) {
  platform = info.os;
});

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Listen for action
chrome.action.onClicked.addListener((tab) => {
  let result = lastResult = shortenUrl(tab.url);
  console.log(`Alternative Copy Invoked: ${result}`);
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: copyText,
    args: [ result ]
  });
});

function copyUrl(href) {
  let shortened = shortenUrl(href);
  copyText(shortened);
}

function copyText(text) {
  console.log(`Alternative Copy: ${text}`);
  _temp_element = document.createElement('textarea');
  _temp_element.value = text;
  _temp_element.setAttribute('readonly', '');
  _temp_element.style.position = 'absolute';
  _temp_element.style.left = '-9999px';
  document.body.appendChild(_temp_element);
  _temp_element.select();
  document.execCommand('copy');
  document.body.removeChild(_temp_element);
  delete _temp_element;
}

function shortenUrl(href) {
  let url = lastUrl = new URL(href);
  let protocol = lastProtocol = url.protocol.toLowerCase();
  let host = lastHost = url.hostname.toLowerCase();

  if (protocol === "file:") {
    // Handle File URLs
    var root = href.replace("file:///", "").split('/')[0];
    if (root.indexOf(':') > -1)
      href = href.replace("file:///", "");
    else
      href = href.replace("file://", "");
    href = decodeURIComponent(href);
    if (href.indexOf(' ') > -1)
      href = '"' + href + '"';
    if (platform === "win")
      href = href.replace(/\//g, "\\");
  } else {
    // Handle Web URLs
    if (host.indexOf("ebay") > -1) {
      // eBay
      href = href.replace(/(.*\/itm\/)([^/]*)\/(.*)/, '$1$3');
      href = removeQueryString(href);
      href = removeAnchorTag(href);
    }
    else if (host.indexOf("amazon") > -1) {
      // Amazon
      href = href.replace(/(.*:\/\/[^/]*)\/([^/]*)(\/dp\/.*)/i, '$1$3');
      href = href.replace(/(.*)(\/ref=[^?^/^&]*)(.*)/i, '$1$3');
      href = removeQueryString(href);
      href = removeAnchorTag(href);
    }
    else if (host.indexOf("youtube") > -1) {
      // YouTube
      var queryString = "";
      if (href.indexOf('?') > -1) {
        queryString = href.split('?')[1];
      }
      var video = queryString.replace(/(.*)(v=[a-zA-Z0-9_\-]*)(.*)/, "$2");
      href = removeQueryString(href);
      href = removeAnchorTag(href);
      if (video != "")
        href = href + "?" + video;
    }
    else {
      // Default
      href = removeQueryString(href);
      href = removeAnchorTag(href);
    }
}

  return href;
}

function removeQueryString(href) {
  if (href.indexOf('?') > -1) {
    href = href.split('?')[0];
  }
  return href;
}

function removeAnchorTag(href) {
  if (href.indexOf('#') > -1) {
    href = href.split('#')[0];
  }
  return href;
}
