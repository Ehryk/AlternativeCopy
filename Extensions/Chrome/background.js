// background.js

platform = "";

chrome.runtime.getPlatformInfo(function(info) {
  platform = info.os;
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  var href = tab.url;
  copyUrl(href);
});

function copyUrl(href) {
  var shortened = shortenUrl(href);
  copyText(shortened);
}

function copyText(text) {
  console.log('URL to Copy: ' + text);
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
  var protocol = getProtocol(href);

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
    var host = getHost(href);
    if (host.indexOf("ebay") > -1) {
      // eBay
      href = href.replace(/(.*\/itm\/)([^/]*)\/(.*)/, '$1$3');
      href = removeQueryString(href);
    }
    else if (host.indexOf("amazon") > -1) {
      // Amazon
      href = href.replace(/(.*:\/\/[^/]*)\/([^/]*)(\/dp\/.*)/i, '$1$3');
      href = href.replace(/(.*)(\/ref=[^?^/^&]*)(.*)/i, '$1$3');
      href = removeQueryString(href);
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
    }
}

  return href;
}

function getProtocol(href){
  return Object.assign(document.createElement('a'), { href: href }).protocol.toLowerCase();
}

function getHost(href){
  return Object.assign(document.createElement('a'), { href: href }).host.toLowerCase();
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

chrome.commands.onCommand.addListener(function(command) {
  if (command === "copy-url") {
    copyUrl(command.text);
  }
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "copy-text") {
    copyText(command.text);
  }
});
