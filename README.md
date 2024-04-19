# Alternative Copy
This is a tool that can be installed as an Extension (currently supported: Chrome) to map the keyboard shortcut Alt+C (Command+C for OSX) to copy the current address and apply helpful formatting.

### Description

This extension copies a shareable URL of the current tab to your clipboard. Many sites include long irrelevant strings of text in the URL bar that include tracking and advertising data that aren't friendly to share. Clicking the icon or pressing Alt+C will activate this extension, and the keyboard shortcut can be changed in your chrome://extensions/shortcuts page.

This extension removes the query string, and will further remove irrelevant data on supported sites to get to a short URL more appropriate for sharing.

Sites currently supported for enhanced shortening:

 - eBay items (removes item description from URL)
 - Amazon items (removes item description and referrer from URL)
 - YouTube videos (removes playlist and start time from URL)
 - Local File urls (formats to a local path)

For file:// urls that are on your local hard drive, Alternative Copy will put the native path string into the clipboard, and will surround the path with quotes if it contains any spaces. For example, file:///C:/Projects/AlternativeCopy/Test%20File%20URL.txt would copy as "C:\Projects\AlternativeCopy\Test File URL.txt" (windows), and file:///Temp/AlternativeCopy/TestFile.txt would copy as /Temp/AlternativeCopy/TestFile.txt (linux, BSD, MacOS).

### Webstore Links

 - Chrome: https://chrome.google.com/webstore/detail/alternative-copy/okpfaahmakpepeoahekhiehomdiikjjg

### Version History

 - v2.0 2024.xx.xx Migrating to Manifest v3, service worker
 - v1.6 2024.04.16 Added icon to manifest for Extensions page
 - v1.5 2024.04.14 Removing unused permission (ClipboardRead), explicit mac keybinding
 - v1.4 2022.12.07 Removing any hashtag / anchor tag content
 - v1.3 2019.12.15 Fixed issue with youtube videos with dashes in their video id
 - v1.2 2019.11.14 Added Support for youtube videos
 - v1.1 2019.11.13 Added Support for local files
 - v1.0 2019.11.12 Initial Release - supports eBay and Amazon items
