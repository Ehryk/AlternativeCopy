/* --- background.js (Firefox) --- */
/* --- Eric Menze © 2024 --- */

// Variables

let platform;

let lastHref;
let lastUrl;
let lastProtocol;
let lastHost;
let lastResult;

// Initialization

browser.runtime.getPlatformInfo(function(info) {
  platform = info.os;
});

// Event Handler: (onCommand)

browser.commands.onCommand.addListener(function (command) {
  if (command === "alternative-copy") {
    copyActiveTab();
  }
});

// Event Handler: (onClicked)

browser.browserAction.onClicked.addListener(function () {
  copyActiveTab();
});

// For Manifest v3:
/* 
browser.action.onClicked.addListener(function () {
  copyActiveTab();
});
*/

// Extension Functions

function copyActiveTab() {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    let result = lastResult = shortenUrl(url);
    console.log(`Alternative Copy: ${result}`);
    copyUrl(url);
  });
}

function copyUrl(href) {
  var shortened = shortenUrl(href);
  copyText(shortened);
}

function copyText(text) {
  navigator.clipboard.writeText(text);
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
