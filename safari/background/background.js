/*global safari, SafariBrowserTab, SafariBrowserWindow, wrapper, extensionLog */

/**
 * @fileOverview This file adds support for the Chrome API in the global page
 * script context.
 * @name background.js<safari>
 * @author Etienne Prud’homme
 * @license GPLv3
 */

// Initializes the logs if not created
safari.extension.settings.logs = safari.extension.settings.logs || [];

/**
 * Chrome adapter module for the global page context.
 * @returns {object} The chrome namespace.
 * @throws {Error} TO FIX. We should set `lastError` instead.
 */
var global = (function() {
  var exports = {
    tabs: {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back. The
       * {@link global.runtime.onMessage} event is fired in each content script
       * running in the specified tab for the current extension.
       * @param {int} tabId - The tab to send the message to.
       * @param {*} message - Any object that can be serialized.
       * @param {object} [options]
       * @param {int} [options.frameId] - Send a message to a specific frame
       * identified by {@link frameId} instead of all frames in the tabn.
       * @param {global.tabs.sendMessage~responseCallback} [responseCallback] -
       * Function called when there’s a response. Note: The response can be any
       * object.
       */
      sendMessage: function(tabId, message, options, responseCallback) {
        var channel = Math.floor(Math.random() * 100000000);
        wrapper.tabs.sendMessage(tabId, message, options, channel)
          .then(function(response) {
            if(typeof(responseCallback) === typeof(Function)) {
              responseCallback(response);
            }
          }).catch(function(reason) {
            extensionLog(reason);
          });
      },
      /**
       * @namespace
       * @property {int} [id] - The ID of the tab. Tab IDs are unique within a
       * browser session. Under some circumstances a Tab may not be assigned an
       * ID, for example when querying foreign tabs using the sessions API, in
       * which case a session ID may be present.

       * @property {int} index - The zero-based index of the tab within its
       * window.
       * @property {int} windowId - The ID of the window the tab is contained
       * within.
       * @property {int} [openerTabId] - The ID of the tab that opened this tab,
       * if any. This property is only present if the opener tab still exists.
       * @property {bool} highlighted - Whether the tab is highlighted.
       * @property {bool} active - Whether the tab is active in its
       * window. (Does not necessarily mean the window is focused.)
       * @property {bool} pinned - Whether the tab is pinned.
       * @property {string} [url] - The URL the tab is displaying. This property
       * is only present if the extension’s manifest includes the “tabs”
       * permission.
       * @property {string} [title] - The title of the tab. This property is
       * only present if the extension’s manifest includes the “tabs”
       * permission.
       * @property {string} [favIconUrl] - The URL of the tab's favicon. This
       * property is only present if the extension's manifest includes the
       * "tabs" permission. It may also be an empty string if the tab is
       * loading.
       * @property {string} [status] - Either loading or complete.
       * @property {bool} incognito - Whether the tab is in an incognito window.
       * @property {int} width - The width of the tab in pixels.
       * @property {int} height - The height of the tab in pixels.
       * @property {string} sessionId - The session ID used to uniquely identify
       * a Tab obtained from the sessions API.
       */
      Tab: {
        id: null,
        index: null,
        windowId: null,
        openerTabId: null,
        highlighted: null,
        active: null,
        pinned: null,
        url: null,
        title: null,
        favIconUrl: null,
        status: null,
        incognito: null,
        width: null,
        height: null,
        sessionId: null
      },
      /**
       * Whether the tabs have completed loading.
       * @readonly
       * @enum {string}n
       */
      tabStatus: {
        loading: 'loading',
        complete: 'complete'
      },
      /**
       * The type of window.
       * @readonly
       * @enum {string}
       */
      windowType: {
        normal: 'normal',
        popup: 'popup',
        panel: 'panel',
        app: 'app',
        devtool: 'devtool'
      },
      /**
       * Gets all tabs that have the specified properties, or all tabs if no
       * properties are specified.
       * @param {object} queryInfo
       * @param {bool} [queryInfo.active] - Whether the tabs are active in their
       * windows.
       * @todo @param {bool} [queryInfo.pinned] - Whether the tabs are pinned.
       * @todo @param {bool} [queryInfo.highlighted] - Whether the tabs are
       * highlighted.
       * @param {bool} [queryInfo.currentWindow] - Whether the tabs are in the
       * /current window/.
       * @todo @param {bool} [queryInfo.lastFocusedWindow] - Whether the tabs
       * are in the last focused window.
       * @todo @param {tabStatus} [queryInfo.status] - Whether the tabs have
       * completed loading.
       * @todo @param {string} [queryInfo.title] - Match page titles against a
       * pattern.
       * @todo @param {string|string[]} [queryInfo.url] - Match tabs against one
       * or more /URL patterns/. Note that fragment identifiers are not matched.
       * @param {int} [queryInfo.windowId] - The ID of the parent window, or
       * {@link global.windows.WINDOW_ID_CURRENT} for the current window.
       * @todo @param {windowType} [queryInfo.windowType] - The type of window
       * the tabs are in.
       * @todo @param {int} [queryInfo.index] - The position of the tabs within
       * their windows.
       * @param {global.tabs.query~callback} callback - Threats returned tabs.
       */
      query: function(queryInfo, callback) {
        try {
          var values = wrapper.tabs.query(queryInfo);
          if(typeof(callback) === typeof(Function)) {
            callback(values);
          } else {
            console.warn('No callback function is provided');
          }
        }
        catch(e) {
          throw e;
        }
      }
    }
  };
  return exports;
})();

var chrome = global;

// background.js<safari>