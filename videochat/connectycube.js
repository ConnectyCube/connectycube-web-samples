(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("form-data"), require("node-fetch"));
	else if(typeof define === 'function' && define.amd)
		define(["form-data", "node-fetch"], factory);
	else if(typeof exports === 'object')
		exports["ConnectyCube"] = factory(require("form-data"), require("node-fetch"));
	else
		root["ConnectyCube"] = factory(root["form-data"], root["node-fetch"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_form_data__, __WEBPACK_EXTERNAL_MODULE_node_fetch__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/cubeMain.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/cubeAddressBook.js":
/*!********************************!*\
  !*** ./lib/cubeAddressBook.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var AddressBookService =
/*#__PURE__*/
function () {
  function AddressBookService(proxy) {
    (0, _classCallCheck2["default"])(this, AddressBookService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(AddressBookService, [{
    key: "uploadAddressBook",
    value: function uploadAddressBook(list, opts) {
      if (!Utils.isArray(list)) {
        new Error('First parameter must be an Array.');
        return;
      }

      var data = {
        contacts: list
      };

      if (opts) {
        if (opts.force) {
          data.force = opts.force;
        }

        if (opts.udid) {
          data.udid = opts.udid;
        }
      }

      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(config.urls.addressbook),
        data: data
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "get",
    value: function get(udid) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.addressbook)
      };

      if (udid) {
        ajaxParams.data = {
          udid: udid
        };
      }

      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "getRegisteredUsers",
    value: function getRegisteredUsers(isCompact) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.addressbookRegistered)
      };

      if (isCompact) {
        ajaxParams.data = {
          compact: 1
        };
      }

      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return AddressBookService;
}();

module.exports = AddressBookService;

/***/ }),

/***/ "./lib/cubeAuth.js":
/*!*************************!*\
  !*** ./lib/cubeAuth.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var AuthService =
/*#__PURE__*/
function () {
  function AuthService(proxy) {
    (0, _classCallCheck2["default"])(this, AuthService);
    this.proxy = proxy;
    this.webSessionCheckInterval = null;
  }

  (0, _createClass2["default"])(AuthService, [{
    key: "setSession",
    value: function setSession(session) {
      this.proxy.setSession(session);
    }
  }, {
    key: "getSession",
    value: function getSession() {
      var _this = this;

      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.session)
      };
      return new Promise(function (resolve, reject) {
        _this.proxy.ajax(ajaxParams).then(function (res) {
          resolve(res.session);
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "createSession",
    value: function createSession(params) {
      var _this2 = this;

      if (config.creds.appId === '' || config.creds.authKey === '' || config.creds.authSecret === '') {
        throw new Error('Cannot create a new session without app credentials (app ID, auth key and auth secret)');
      }

      var route = params && params.hasOwnProperty('long') ? config.urls.webSession : config.urls.session;
      var sessionParams = Utils.generateCreateSessionParams(params);
      sessionParams.signature = Utils.signParams(sessionParams, config.creds.authSecret);
      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(route),
        data: sessionParams
      };
      return new Promise(function (resolve, reject) {
        _this2.proxy.ajax(ajaxParams).then(function (res) {
          var response = res.qr_code ? res.qr_code : res.session;

          _this2.proxy.setSession(res.session);

          _this2.proxy.setCurrentUserId(res.session.user_id);

          resolve(response);
        })["catch"](function (error) {
          console.log("error", error);
          reject(error);
        });
      });
    }
  }, {
    key: "destroySession",
    value: function destroySession() {
      var _this3 = this;

      var ajaxParams = {
        type: 'DELETE',
        url: Utils.getUrl(config.urls.session),
        dataType: 'text'
      };
      return new Promise(function (resolve, reject) {
        _this3.proxy.ajax(ajaxParams).then(function (res) {
          _this3.proxy.setSession(null);

          _this3.proxy.setCurrentUserId(null);

          resolve();
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "createWebSession",
    value: function createWebSession(params) {
      if (!params) {
        params = {
          "long": 0
        };
      }

      return this.createSession(params);
    }
  }, {
    key: "checkWebSessionUntilUpgrade",
    value: function checkWebSessionUntilUpgrade(callback) {
      var _this4 = this;

      var interval = config.webSession.getSessionTimeInterval;
      var timeoutError = new Error('The web session check interval was stopped (timeout)');
      var timeleft = config.webSession.getSessionTimeout;

      var _clearWebSessionCheckTimer = function _clearWebSessionCheckTimer() {
        _this4.webSessionCheckInterval && clearInterval(_this4.webSessionCheckInterval);
      };

      _clearWebSessionCheckTimer();

      this.webSessionCheckInterval = setInterval(function () {
        _this4.getSession().then(function (session) {
          if (session.user_id !== 0) {
            _clearWebSessionCheckTimer();

            _this4.proxy.setCurrentUserId(session.user_id);

            _this4.proxy.setSession(session);

            callback(null, session);
          } else {
            if (timeleft > interval) {
              timeleft -= interval;
            } else {
              _clearWebSessionCheckTimer();

              callback(timeoutError, null);
            }
          }
        })["catch"](function (error) {
          _clearWebSessionCheckTimer();

          callback(error, null);
        });
      }, interval * 1000);
      return this.webSessionCheckInterval;
    }
  }, {
    key: "upgradeWebSession",
    value: function upgradeWebSession(webToken) {
      var ajaxParams = {
        type: 'PATCH',
        url: Utils.getUrl(config.urls.webSession),
        dataType: 'text',
        data: {
          web_token: webToken
        }
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "login",
    value: function login(params) {
      var _this5 = this;

      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(config.urls.login),
        data: params
      };
      return new Promise(function (resolve, reject) {
        _this5.proxy.ajax(ajaxParams).then(function (res) {
          _this5.proxy.setCurrentUserId(res.user.id);

          resolve(res.user);
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "logout",
    value: function logout() {
      var ajaxParams = {
        type: 'DELETE',
        url: Utils.getUrl(config.urls.login),
        dataType: 'text'
      };
      this.proxy.setCurrentUserId(null);
      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return AuthService;
}();

module.exports = AuthService;

/***/ }),

/***/ "./lib/cubeConfig.js":
/*!***************************!*\
  !*** ./lib/cubeConfig.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var config = {
  version: __webpack_require__(/*! ../package.json */ "./package.json").version,
  creds: {
    appId: '',
    authKey: '',
    authSecret: ''
  },
  endpoints: {
    api: 'api.connectycube.com',
    chat: 'chat.connectycube.com',
    muc: 'muc.chat.connectycube.com'
  },
  hash: 'sha1',
  chatProtocol: {
    bosh: 'https://chat.connectycube.com:5281',
    websocket: 'wss://chat.connectycube.com:5291',
    active: 2
  },
  webSession: {
    getSessionTimeInterval: 3,
    getSessionTimeout: 120
  },
  chat: {
    contactList: {
      subscriptionMode: {
        mutual: true
      }
    },
    reconnectionTimeInterval: 5,
    streamManagement: {
      enable: false
    },
    ping: {
      enable: false,
      timeInterval: 60
    }
  },
  videochat: {
    answerTimeInterval: 60,
    dialingTimeInterval: 5,
    disconnectTimeInterval: 30,
    statsReportTimeInterval: false,
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }, {
      urls: 'stun:turn.connectycube.com'
    }, {
      urls: 'turn:turn.connectycube.com:5349?transport=udp',
      username: 'connectycube',
      credential: '4c29501ca9207b7fb9c4b4b6b04faeb1'
    }, {
      urls: 'turn:turn.connectycube.com:5349?transport=tcp',
      username: 'connectycube',
      credential: '4c29501ca9207b7fb9c4b4b6b04faeb1'
    }]
  },
  conference: {
    server: 'wss://janus.connectycube.com:8989'
  },
  urls: {
    session: 'session',
    webSession: 'session/web',
    login: 'login',
    users: 'users',
    chat: 'chat',
    blobs: 'blobs',
    subscriptions: 'subscriptions',
    events: 'events',
    data: 'data',
    addressbook: 'address_book',
    addressbookRegistered: 'address_book/registered_users',
    type: '.json'
  },
  on: {
    sessionExpired: null,
    xmppDataWrite: null,
    xmppDataRead: null
  },
  timeout: null,
  debug: {
    mode: 0
  }
};

config.set = function (options) {
  if ((0, _typeof2["default"])(options.endpoints) === 'object' && options.endpoints.chat) {
    config.endpoints.muc = 'muc.' + options.endpoints.chat;
    config.chatProtocol.bosh = 'https://' + options.endpoints.chat + ':5281';
    config.chatProtocol.websocket = 'wss://' + options.endpoints.chat + ':5291';
  }

  Object.keys(options).forEach(function (key) {
    if (key !== 'set' && config.hasOwnProperty(key)) {
      if ((0, _typeof2["default"])(options[key]) !== 'object') {
        config[key] = options[key];
      } else {
        Object.keys(options[key]).forEach(function (nextkey) {
          if (config[key].hasOwnProperty(nextkey)) {
            config[key][nextkey] = options[key][nextkey];
          }
        });
      }
    }
  });
};

module.exports = config;

/***/ }),

/***/ "./lib/cubeData.js":
/*!*************************!*\
  !*** ./lib/cubeData.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var DataService =
/*#__PURE__*/
function () {
  function DataService(proxy) {
    (0, _classCallCheck2["default"])(this, DataService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(DataService, [{
    key: "create",
    value: function create(className, data) {
      var ajaxParams = {
        type: 'POST',
        data: data,
        url: Utils.getUrl(config.urls.data, className)
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "list",
    value: function list(className, filters) {
      var ajaxParams = {
        url: Utils.getUrl(config.urls.data, className),
        data: filters
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "update",
    value: function update(className, data) {
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(config.urls.data, className + '/' + data._id),
        data: data
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "delete",
    value: function _delete(className, requestedData) {
      var typesData = {
        id: 1,
        ids: 2,
        criteria: 3
      };
      var ajaxParams = {
        type: 'DELETE'
      };
      /** Define what type of data passed by client */

      var requestedTypeOf;

      if (typeof requestedData === 'string') {
        requestedTypeOf = typesData.id;
      } else if (Utils.isArray(requestedData)) {
        requestedTypeOf = requestedData.length > 1 ? typesData.ids : typesData.id;
      } else if (Utils.isObject(requestedData)) {
        requestedTypeOf = typesData.criteria;
      }

      if (requestedTypeOf === typesData.id) {
        ajaxParams.url = Utils.getUrl(config.urls.data, className + '/' + requestedData);
        ajaxParams.dataType = 'text';
      } else if (requestedTypeOf === typesData.ids) {
        ajaxParams.url = Utils.getUrl(config.urls.data, className + '/' + requestedData.toString());
      } else if (requestedTypeOf === typesData.criteria) {
        ajaxParams.url = Utils.getUrl(config.urls.data, className + '/by_criteria');
        ajaxParams.data = requestedData;
      }

      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return DataService;
}();

module.exports = DataService;

/***/ }),

/***/ "./lib/cubeDependencies.js":
/*!*********************************!*\
  !*** ./lib/cubeDependencies.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var fetchImpl, formDataImpl;
var RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, MediaStream, mediaDevices;

var XMPPClient = __webpack_require__(/*! @xmpp/client/react-native */ "./node_modules/@xmpp/client/react-native.js"); // https://github.com/xmppjs/xmpp.js/issues/807


if (Utils.getEnv().browser) {
  fetchImpl = fetch;
  formDataImpl = FormData;
  RTCPeerConnection = window.RTCPeerConnection;
  RTCSessionDescription = window.RTCSessionDescription;
  RTCIceCandidate = window.RTCIceCandidate;
  MediaStream = window.MediaStream;
  mediaDevices = navigator.mediaDevices;
} else if (Utils.getEnv().nativescript) {
  fetchImpl = fetch;
  formDataImpl = FormData;
} else if (Utils.getEnv().node) {
  fetchImpl = __webpack_require__(/*! node-fetch */ "node-fetch");
  formDataImpl = __webpack_require__(/*! form-data */ "form-data");
} else if (Utils.getEnv().reactnative) {
  fetchImpl = fetch;
  formDataImpl = FormData;
}

module.exports = {
  fetchImpl: fetchImpl,
  formDataImpl: formDataImpl,
  XMPPClient: XMPPClient,
  RTCPeerConnection: RTCPeerConnection,
  RTCSessionDescription: RTCSessionDescription,
  RTCIceCandidate: RTCIceCandidate,
  MediaStream: MediaStream,
  mediaDevices: mediaDevices
};

/***/ }),

/***/ "./lib/cubeInternalUtils.js":
/*!**********************************!*\
  !*** ./lib/cubeInternalUtils.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Buffer) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var IS_BROWSER_ENV = typeof document !== 'undefined';
var IS_RN_ENV = typeof navigator !== 'undefined' && navigator.product == 'ReactNative';
var IS_NS_ENV = (typeof global === "undefined" ? "undefined" : (0, _typeof2["default"])(global)) === 'object' && (typeof global.android !== 'undefined' || typeof global.NSObject !== 'undefined');

var InternalUtils =
/*#__PURE__*/
function () {
  function InternalUtils() {
    (0, _classCallCheck2["default"])(this, InternalUtils);
  }

  (0, _createClass2["default"])(InternalUtils, null, [{
    key: "getEnv",
    value: function getEnv() {
      return {
        nativescript: IS_NS_ENV,
        reactnative: IS_RN_ENV,
        browser: IS_BROWSER_ENV,
        node: !IS_BROWSER_ENV && !IS_NS_ENV && !IS_RN_ENV
      };
    }
  }, {
    key: "isWebRTCAvailble",
    value: function isWebRTCAvailble() {
      return IS_RN_ENV || IS_BROWSER_ENV && window.RTCPeerConnection && window.RTCIceCandidate && window.RTCSessionDescription;
    }
  }, {
    key: "safeCallbackCall",
    value: function safeCallbackCall() {
      var callback = arguments[0];

      if (typeof callback !== 'function') {
        return;
      }

      var callbackString = callback.toString();
      var callbackName = callbackString.split('(')[0].split(' ')[1];
      var argumentsCopy = [];
      var listenerCall;

      for (var i = 0; i < arguments.length; i++) {
        argumentsCopy.push(arguments[i]);
      }

      listenerCall = argumentsCopy.shift();

      try {
        listenerCall.apply(null, argumentsCopy);
      } catch (err) {
        if (callbackName === '') {
          console.error('Error: ' + err);
        } else {
          console.error('Error in listener ' + callbackName + ': ' + err);
        }
      }
    }
  }, {
    key: "randomNonce",
    value: function randomNonce() {
      return Math.floor(Math.random() * 10000);
    }
  }, {
    key: "unixTime",
    value: function unixTime() {
      return Math.floor(Date.now() / 1000);
    }
  }, {
    key: "getUrl",
    value: function getUrl(base, id, extension) {
      var resource = "".concat(id ? '/' + id : '');
      extension = "".concat(extension ? '/' + extension : '');
      return "https://".concat(config.endpoints.api, "/").concat(base).concat(resource).concat(extension).concat(config.urls.type);
    }
  }, {
    key: "isArray",
    value: function isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
  }, {
    key: "isObject",
    value: function isObject(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    }
  }, {
    key: "getBsonObjectId",
    value: function getBsonObjectId() {
      var timestamp = this.unixTime().toString(16);
      var increment = (ObjectId.increment++).toString(16);
      if (increment > 0xffffff) ObjectId.increment = 0;
      return '00000000'.substr(0, 8 - timestamp.length) + timestamp + '000000'.substr(0, 6 - ObjectId.machine.length) + ObjectId.machine + '0000'.substr(0, 4 - ObjectId.pid.length) + ObjectId.pid + '000000'.substr(0, 6 - increment.length) + increment;
    }
  }, {
    key: "DLog",
    value: function DLog() {
      if (this.loggers) {
        for (var i = 0; i < this.loggers.length; ++i) {
          this.loggers[i](arguments);
        }

        return;
      }

      var logger;
      this.loggers = [];

      var consoleLoggerFunction = function consoleLoggerFunction() {
        var logger = function logger(args) {
          console.log.apply(console, Array.prototype.slice.call(args));
        };

        return logger;
      };

      if ((0, _typeof2["default"])(config.debug) === 'object') {
        if (typeof config.debug.mode === 'number') {
          if (config.debug.mode == 1) {
            logger = consoleLoggerFunction();
            this.loggers.push(logger);
          }
        } else if ((0, _typeof2["default"])(config.debug.mode) === 'object') {
          config.debug.mode.forEach(function (mode) {
            if (mode === 1) {
              logger = consoleLoggerFunction();
              this.loggers.push(logger);
            }
          });
        }
      }

      if (this.loggers) {
        for (var j = 0; j < this.loggers.length; ++j) {
          this.loggers[j](arguments);
        }
      }
    }
  }, {
    key: "isExpiredSessionError",
    value: function isExpiredSessionError(error) {
      try {
        return error && error.code === 401 && error.info.errors.base[0] === 'Required session does not exist';
      } catch (ex) {
        return false;
      }
    }
  }, {
    key: "mergeArrays",
    value: function mergeArrays(arrayTo, arrayFrom) {
      var merged = JSON.parse(JSON.stringify(arrayTo));

      firstLevel: for (var i = 0; i < arrayFrom.length; i++) {
        var newItem = arrayFrom[i];

        for (var j = 0; j < merged.length; j++) {
          if (newItem.user_id === merged[j].user_id) {
            merged[j] = newItem;
            continue firstLevel;
          }
        }

        merged.push(newItem);
      }

      return merged;
    }
  }, {
    key: "toBase64",
    value: function toBase64(str) {
      if (this.getEnv().browser) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode('0x' + p1);
        }));
      } else if (this.getEnv().reactnative) {
        return global.encodeToBase64(str);
      } else {
        // Node.js & Native Script
        return new Buffer(str).toString('base64');
      }
    }
  }, {
    key: "generateCreateSessionParams",
    value: function generateCreateSessionParams(params) {
      var message = {
        application_id: config.creds.appId,
        auth_key: config.creds.authKey,
        nonce: this.randomNonce(),
        timestamp: this.unixTime()
      };

      if (params) {
        if (params.login && params.password) {
          message.user = {
            login: params.login,
            password: params.password
          };
        } else if (params.email && params.password) {
          message.user = {
            email: params.email,
            password: params.password
          };
        } else if (params.provider) {
          // Via social networking provider (e.g. facebook, twitter etc.)
          message.provider = params.provider;

          if (params.scope) {
            message.scope = params.scope;
          }

          if (params.keys && params.keys.token) {
            message.keys = {
              token: params.keys.token
            };
          }

          if (params.keys && params.keys.secret) {
            message.keys.secret = params.keys.secret;
          }
        } else if (params.hasOwnProperty('long')) {
          message["long"] = params["long"];
        }
      }

      return message;
    }
  }, {
    key: "signParams",
    value: function signParams(message, secret) {
      var sessionMsg = Object.keys(message).map(function (val) {
        if ((0, _typeof2["default"])(message[val]) === 'object') {
          return Object.keys(message[val]).map(function (val1) {
            return val + '[' + val1 + ']=' + message[val][val1];
          }).sort().join('&');
        } else {
          return val + '=' + message[val];
        }
      }).sort().join('&');
      var cryptoSessionMsg;

      if (config.hash === 'sha1') {
        var sha1 = __webpack_require__(/*! crypto-js/hmac-sha1 */ "./node_modules/crypto-js/hmac-sha1.js");

        cryptoSessionMsg = sha1(sessionMsg, secret).toString();
      } else if (config.hash === 'sha256') {
        var sha256 = __webpack_require__(/*! crypto-js/hmac-sha256 */ "./node_modules/crypto-js/hmac-sha256.js");

        cryptoSessionMsg = sha256(sessionMsg, secret).toString();
      } else {
        throw new Error('Unknown crypto standards, available sha1 or sha256');
      }

      return cryptoSessionMsg;
    }
  }, {
    key: "getSizeOfString",
    value: function getSizeOfString(str) {
      return new Blob([str]).size;
    }
  }, {
    key: "getDateSize",
    value: function getDateSize(data) {
      var size = 0;

      if (data.body) {
        var body = data.body;

        if (typeof body != 'string') {
          body = JSON.stringify(body);
        }

        size += this.getSizeOfString(body);
      }

      if (data.headers) {
        size += this.getSizeOfString(JSON.stringify(data.headers));
      }

      return size;
    }
  }, {
    key: "callTrafficUsageCallback",
    value: function callTrafficUsageCallback(callbackName, data) {
      if (typeof config.on[callbackName] === 'function') {
        config.on[callbackName](this.getDateSize(data));
      }
    }
  }]);
  return InternalUtils;
}(); // The object for type MongoDB.Bson.ObjectId
// http://docs.mongodb.org/manual/reference/object-id/


var ObjectId = {
  machine: Math.floor(Math.random() * 16777216).toString(16),
  pid: Math.floor(Math.random() * 32767).toString(16),
  increment: 0
};
module.exports = InternalUtils;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../node_modules/buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./lib/cubeMain.js":
/*!*************************!*\
  !*** ./lib/cubeMain.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var ConnectyCube =
/*#__PURE__*/
function () {
  function ConnectyCube() {
    (0, _classCallCheck2["default"])(this, ConnectyCube);

    // React Native RTCView
    if (Utils.getEnv().reactnative) {
      this.RTCView = __webpack_require__(/*! ./cubeDependencies */ "./lib/cubeDependencies.js").RTCView;
    }
  }

  (0, _createClass2["default"])(ConnectyCube, [{
    key: "init",
    value: function init(credentials, configMap) {
      if (configMap && (0, _typeof2["default"])(configMap) === 'object') {
        config.set(configMap);
      }

      var Proxy = __webpack_require__(/*! ./cubeProxy */ "./lib/cubeProxy.js");

      var Auth = __webpack_require__(/*! ./cubeAuth */ "./lib/cubeAuth.js");

      var Users = __webpack_require__(/*! ./cubeUsers */ "./lib/cubeUsers.js");

      var Storage = __webpack_require__(/*! ./cubeStorage */ "./lib/cubeStorage.js");

      var PushNotifications = __webpack_require__(/*! ./cubePushNotifications */ "./lib/cubePushNotifications.js");

      var Data = __webpack_require__(/*! ./cubeData */ "./lib/cubeData.js");

      var AddressBook = __webpack_require__(/*! ./cubeAddressBook */ "./lib/cubeAddressBook.js");

      var Chat = __webpack_require__(/*! ./messaging/cubeChat */ "./lib/messaging/cubeChat.js");

      var DialogProxy = __webpack_require__(/*! ./messaging/cubeDialog */ "./lib/messaging/cubeDialog.js");

      var MessageProxy = __webpack_require__(/*! ./messaging/cubeMessage */ "./lib/messaging/cubeMessage.js");

      this.service = new Proxy();
      this.auth = new Auth(this.service);
      this.users = new Users(this.service);
      this.storage = new Storage(this.service);
      this.pushnotifications = new PushNotifications(this.service);
      this.data = new Data(this.service);
      this.addressbook = new AddressBook(this.service);
      this.chat = new Chat(this.service);
      this.chat.dialog = new DialogProxy(this.service);
      this.chat.message = new MessageProxy(this.service);
      this.utils = Utils; // add WebRTC API if API is avaible

      if (Utils.isWebRTCAvailble()) {
        // p2p calls client
        var WebRTCClient = __webpack_require__(/*! ./videocalling/cubeWebRTCClient */ "./lib/videocalling/cubeWebRTCClient.js");

        this.videochat = new WebRTCClient(this.chat.xmppClient);
        this.chat.webrtcSignalingProcessor = this.videochat.signalingProcessor; // conf calls client

        var ConferenceClient = __webpack_require__(/*! ./videocalling_conference/cubeConferenceClient */ "./lib/videocalling_conference/cubeConferenceClient.js");

        this.videochatconference = new ConferenceClient(this.service);
      } else {
        this.videochat = null;
        this.videochatconference = null;
      } // Initialization by outside token


      if (credentials.token) {
        config.creds.appId = credentials.appId;
        this.service.setSession({
          token: credentials.token
        });
      } else {
        config.creds.appId = credentials.appId;
        config.creds.authKey = credentials.authKey;
        config.creds.authSecret = credentials.authSecret;
      }
    }
  }, {
    key: "setSession",
    value: function setSession(session) {
      this.auth.setSession(session);
    }
  }, {
    key: "getSession",
    value: function getSession() {
      return this.auth.getSession();
    }
  }, {
    key: "createSession",
    value: function createSession(params) {
      return this.auth.createSession(params);
    }
  }, {
    key: "destroySession",
    value: function destroySession() {
      return this.auth.destroySession();
    }
  }, {
    key: "createWebSession",
    value: function createWebSession(params) {
      return this.auth.createWebSession(params);
    }
  }, {
    key: "checkWebSessionUntilUpgrade",
    value: function checkWebSessionUntilUpgrade(callback) {
      return this.auth.checkWebSessionUntilUpgrade(callback);
    }
  }, {
    key: "upgradeWebSession",
    value: function upgradeWebSession(webToken) {
      return this.auth.upgradeWebSession(webToken);
    }
  }, {
    key: "login",
    value: function login(params) {
      return this.auth.login(params);
    }
  }, {
    key: "logout",
    value: function logout() {
      return this.auth.logout();
    }
  }]);
  return ConnectyCube;
}();

var CB = new ConnectyCube();
CB.ConnectyCube = ConnectyCube;
module.exports = CB;

/***/ }),

/***/ "./lib/cubeProxy.js":
/*!**************************!*\
  !*** ./lib/cubeProxy.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var fetchImpl = __webpack_require__(/*! ./cubeDependencies */ "./lib/cubeDependencies.js").fetchImpl;

var formDataImpl = __webpack_require__(/*! ./cubeDependencies */ "./lib/cubeDependencies.js").formDataImpl;

var HTTPProxy =
/*#__PURE__*/
function () {
  function HTTPProxy() {
    (0, _classCallCheck2["default"])(this, HTTPProxy);
    this.sdkInstance = {
      config: config,
      session: null
    };
    this.currentUserId = null;
    this.requestsNumber = 0;
  }

  (0, _createClass2["default"])(HTTPProxy, [{
    key: "setSession",
    value: function setSession(session) {
      this.sdkInstance.session = session;

      if (session && session.user_id) {
        this.setCurrentUserId(session.user_id);
      }
    }
  }, {
    key: "getSession",
    value: function getSession() {
      return this.sdkInstance.session;
    }
  }, {
    key: "setCurrentUserId",
    value: function setCurrentUserId(userId) {
      this.currentUserId = userId;
    }
  }, {
    key: "getCurrentUserId",
    value: function getCurrentUserId() {
      return this.currentUserId;
    }
  }, {
    key: "logRequest",
    value: function logRequest(params) {
      ++this.requestsNumber;
      Utils.DLog('[Request][' + this.requestsNumber + ']', (params.type || 'GET') + ' ' + params.url, params);
    }
  }, {
    key: "logResponse",
    value: function logResponse(response) {
      Utils.DLog('[Response][' + this.requestsNumber + ']', response);
    }
  }, {
    key: "buildRequestAndURL",
    value: function buildRequestAndURL(params) {
      var isGetOrHeadType = !params.type || params.type === 'GET' || params.type === 'HEAD';
      var isPostOrPutType = params.type && (params.type === 'POST' || params.type === 'PUT');
      var token = this.sdkInstance && this.sdkInstance.session && this.sdkInstance.session.token;
      var isInternalRequest = params.url.indexOf('s3.amazonaws.com') === -1;
      var isMultipartFormData = params.contentType === false;
      var requestBody;
      var requestURL = params.url;
      var requestObject = {};
      var responseObject;
      requestObject.method = params.type || 'GET';

      if (params.data) {
        requestBody = this.buildRequestBody(params, isMultipartFormData, isPostOrPutType);

        if (isGetOrHeadType) {
          requestURL += '?' + requestBody;
        } else {
          requestObject.body = requestBody;
        }
      }

      if (!isMultipartFormData) {
        requestObject.headers = {
          'Content-Type': isPostOrPutType ? 'application/json;charset=utf-8' : 'application/x-www-form-urlencoded; charset=UTF-8'
        };
      }

      if (isInternalRequest) {
        if (!requestObject.headers) {
          requestObject.headers = {};
        }

        requestObject.headers['CB-SDK'] = 'JS ' + config.version + ' - Client';

        if (token) {
          requestObject.headers['CB-Token'] = token;
        }
      }

      if (config.timeout) {
        requestObject.timeout = config.timeout;
      }

      return [requestObject, requestURL];
    }
  }, {
    key: "buildRequestBody",
    value: function buildRequestBody(params, isMultipartFormData, isPostOrPutType) {
      var _this = this;

      var data = params.data;
      var dataObject;

      if (isMultipartFormData) {
        dataObject = new formDataImpl();
        Object.keys(data).forEach(function (item) {
          if (params.fileToCustomObject && item === 'file') {
            dataObject.append(item, data[item].data, data[item].name);
          } else {
            dataObject.append(item, params.data[item]);
          }
        });
      } else if (isPostOrPutType) {
        dataObject = JSON.stringify(data);
      } else {
        dataObject = Object.keys(data).map(function (k) {
          if (Utils.isObject(data[k])) {
            return Object.keys(data[k]).map(function (v) {
              return _this.encodeURIComponent(k) + '[' + (Utils.isArray(data[k]) ? '' : v) + ']=' + _this.encodeURIComponent(data[k][v]);
            }).sort().join('&');
          } else {
            return _this.encodeURIComponent(k) + (Utils.isArray(data[k]) ? '[]' : '') + '=' + _this.encodeURIComponent(data[k]);
          }
        }).sort().join('&');
      }

      return dataObject;
    }
  }, {
    key: "encodeURIComponent",
    value: function (_encodeURIComponent) {
      function encodeURIComponent(_x) {
        return _encodeURIComponent.apply(this, arguments);
      }

      encodeURIComponent.toString = function () {
        return _encodeURIComponent.toString();
      };

      return encodeURIComponent;
    }(function (str) {
      return encodeURIComponent(str).replace(/[#$&+,/:;=?@\[\]]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    })
  }, {
    key: "ajax",
    value: function ajax(params) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.logRequest(params);

        var requestAndURL = _this2.buildRequestAndURL(params);

        var requestObject = requestAndURL[0];
        var requestURL = requestAndURL[1];
        var response; // The Promise returned from fetch() won’t reject on HTTP error
        // status even if the response is an HTTP 404 or 500.
        // Instead, it will resolve normally (with ok status set to false),
        // and it will only reject on network failure or if anything prevented the request from completing.

        fetchImpl(requestURL, requestObject).then(function (resp) {
          response = resp;
          var dataType = params.dataType || 'json';
          return dataType === 'text' ? response.text() : response.json();
        }).then(function (body) {
          if (!response.ok) {
            _this2.processAjaxError(response, body, null, reject, resolve, params);
          } else {
            _this2.processAjaxResponse(body, resolve);
          }
        })["catch"](function (error) {
          _this2.processAjaxError(response, ' ', error, reject, resolve, params);
        });
      });
    }
  }, {
    key: "processAjaxResponse",
    value: function processAjaxResponse(body, resolve) {
      var responseBody = body && body !== ' ' ? body : 'empty body';
      this.logResponse(responseBody);
      resolve(body);
    }
  }, {
    key: "processAjaxError",
    value: function processAjaxError(response, body, error, reject, resolve, params) {
      var statusCode = response && (response.status || response.statusCode);
      var errorObject = {
        code: response && statusCode || error && error.code,
        info: (body && typeof body === 'string' && body !== ' ' ? JSON.parse(body) : body) || error && error.errno
      };
      var responseBody = body || error || body.errors;
      this.logResponse(responseBody);

      if (response.url.indexOf(config.urls.session) === -1) {
        if (Utils.isExpiredSessionError(errorObject) && typeof config.on.sessionExpired === 'function') {
          this.handleExpiredSessionResponse(errorObject, null, reject, resolve, params);
        } else {
          reject(errorObject);
        }
      } else {
        reject(errorObject);
      }
    }
  }, {
    key: "handleExpiredSessionResponse",
    value: function handleExpiredSessionResponse(error, response, reject, resolve, params) {
      var _this3 = this;

      var handleResponse = function handleResponse() {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      };

      var retryCallback = function retryCallback(session) {
        if (session) {
          _this3.setSession(session);

          _this3.ajax(params).then(resolve)["catch"](reject);
        }
      };

      config.on.sessionExpired(handleResponse, retryCallback);
    }
  }]);
  return HTTPProxy;
}();

module.exports = HTTPProxy;

/***/ }),

/***/ "./lib/cubePushNotifications.js":
/*!**************************************!*\
  !*** ./lib/cubePushNotifications.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var PushNotificationsService = function PushNotificationsService(proxy) {
  (0, _classCallCheck2["default"])(this, PushNotificationsService);
  this.proxy = proxy;
  this.subscriptions = new SubscriptionsService(proxy);
  this.events = new EventsService(proxy);

  this.base64Encode = function (str) {
    return Utils.toBase64(str);
  };
};

var SubscriptionsService =
/*#__PURE__*/
function () {
  function SubscriptionsService(proxy) {
    (0, _classCallCheck2["default"])(this, SubscriptionsService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(SubscriptionsService, [{
    key: "create",
    value: function create(params) {
      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(config.urls.subscriptions),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "list",
    value: function list() {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.subscriptions)
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var ajaxParams = {
        type: 'DELETE',
        dataType: 'text',
        url: Utils.getUrl(config.urls.subscriptions, id)
      };
      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return SubscriptionsService;
}();

var EventsService =
/*#__PURE__*/
function () {
  function EventsService(proxy) {
    (0, _classCallCheck2["default"])(this, EventsService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(EventsService, [{
    key: "create",
    value: function create(params) {
      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(config.urls.events),
        data: {
          event: params
        }
      };
      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return EventsService;
}();

module.exports = PushNotificationsService;

/***/ }),

/***/ "./lib/cubeStorage.js":
/*!****************************!*\
  !*** ./lib/cubeStorage.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var StorageService =
/*#__PURE__*/
function () {
  function StorageService(proxy) {
    (0, _classCallCheck2["default"])(this, StorageService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(StorageService, [{
    key: "list",
    value: function list(params) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.blobs),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "create",
    value: function create(params) {
      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(config.urls.blobs),
        data: {
          blob: params
        }
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var ajaxParams = {
        type: 'DELETE',
        url: Utils.getUrl(config.urls.blobs, id),
        dataType: 'text'
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "createAndUpload",
    value: function createAndUpload(params) {
      var _this = this;

      var createParams = {};
      var file;
      var name;
      var type;
      var size;
      var fileId;
      var result;
      var clonedParams = JSON.parse(JSON.stringify(params));
      clonedParams.file.data = '...';
      file = params.file;
      name = params.name || file.name;
      type = params.type || file.type;
      size = params.size || file.size;
      createParams.name = name;
      createParams.content_type = type;

      if (params["public"]) {
        createParams["public"] = params["public"];
      }

      return this.create(createParams).then(function (_ref) {
        var blob = _ref.blob;
        var uri = parseUri(blob.blob_object_access.params);
        var uploadUrl = uri.protocol + '://' + uri.authority + uri.path;
        var ajaxParams = {
          url: uploadUrl
        };
        var data = {};
        fileId = blob.id;
        result = _objectSpread({}, blob, {
          size: size
        });
        Object.keys(uri.queryKey).forEach(function (val) {
          data[val] = decodeURIComponent(uri.queryKey[val]);
        });
        data.file = file;
        ajaxParams.data = data;
        return _this.upload(ajaxParams);
      }).then(function (uploadResult) {
        var ajaxParams = {
          id: fileId,
          size: size
        };
        return _this.markUploaded(ajaxParams);
      }).then(function () {
        return result;
      });
    }
  }, {
    key: "upload",
    value: function upload(params) {
      var ajaxParams = {
        type: 'POST',
        url: params.url,
        dataType: 'text',
        contentType: false,
        data: params.data
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "markUploaded",
    value: function markUploaded(params) {
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(config.urls.blobs, params.id + '/complete'),
        data: {
          size: params.size
        },
        dataType: 'text'
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "getInfo",
    value: function getInfo(id) {
      var ajaxParams = {
        url: Utils.getUrl(config.urls.blobs, id)
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "getFile",
    value: function getFile(uid) {
      var ajaxParams = {
        url: Utils.getUrl(config.urls.blobs, uid)
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "update",
    value: function update(params) {
      var data = {};
      data.blob = {};

      if (typeof params.name !== 'undefined') {
        data.blob.name = params.name;
      }

      var ajaxParams = {
        url: Utils.getUrl(config.urls.blobs, params.id),
        data: data
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "privateUrl",
    value: function privateUrl(fileUID) {
      return 'https://' + config.endpoints.api + '/blobs/' + fileUID + '?token=' + this.proxy.getSession().token;
    }
  }, {
    key: "publicUrl",
    value: function publicUrl(fileUID) {
      return 'https://' + config.endpoints.api + '/blobs/' + fileUID;
    }
  }]);
  return StorageService;
}();

module.exports = StorageService; // parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// http://blog.stevenlevithan.com/archives/parseuri

function parseUri(str) {
  var o = parseUri.options;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    uri[o.key[i]] = m[i] || '';
  }

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2;
    }
  });
  return uri;
}

parseUri.options = {
  strictMode: false,
  key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

/***/ }),

/***/ "./lib/cubeUsers.js":
/*!**************************!*\
  !*** ./lib/cubeUsers.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ./cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ./cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var UsersService =
/*#__PURE__*/
function () {
  function UsersService(proxy) {
    (0, _classCallCheck2["default"])(this, UsersService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(UsersService, [{
    key: "get",
    value: function get(params) {
      var url;
      var filters = [];
      var item;

      if (params.order) {
        params.order = generateOrder(params.order);
      }

      if (params && params.filter) {
        if (Utils.isArray(params.filter)) {
          params.filter.forEach(function (el) {
            item = generateFilter(el);
            filters.push(item);
          });
        } else {
          item = generateFilter(params.filter);
          filters.push(item);
        }

        params.filter = filters;
      }

      if (typeof params === 'number') {
        url = params;
        params = {};
      } else {
        if (params.login) {
          url = 'by_login';
        } else if (params.full_name) {
          url = 'by_full_name';
        } else if (params.facebook_id) {
          url = 'by_facebook_id';
        } else if (params.twitter_id) {
          url = 'by_twitter_id';
        } else if (params.phone) {
          url = 'phone';
        } else if (params.email) {
          url = 'by_email';
        } else if (params.tags) {
          url = 'by_tags';
        } else if (params.external) {
          url = 'external/' + params.external;
          params = {};
        }
      }

      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.users, url),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "signup",
    value: function signup(params) {
      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(config.urls.users),
        data: {
          user: params
        }
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "update",
    value: function update(params) {
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(config.urls.users, this.proxy.getCurrentUserId()),
        data: {
          user: params
        }
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "delete",
    value: function _delete() {
      var ajaxParams = {
        type: 'DELETE',
        url: Utils.getUrl(config.urls.users, this.proxy.getCurrentUserId()),
        dataType: 'text'
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(email) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(config.urls.users + '/password/reset'),
        data: {
          email: email
        },
        dataType: 'text'
      };
      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return UsersService;
}();

module.exports = UsersService;
var DATE_FIELDS = ['created_at', 'updated_at', 'last_request_at'];
var NUMBER_FIELDS = ['id', 'external_user_id'];

function generateFilter(obj) {
  var type = obj.field in DATE_FIELDS ? 'date' : (0, _typeof2["default"])(obj.value);

  if (Utils.isArray(obj.value)) {
    if (type === 'object') {
      type = (0, _typeof2["default"])(obj.value[0]);
    }

    obj.value = obj.value.toString();
  }

  return [type, obj.field, obj.param, obj.value].join(' ');
}

function generateOrder(obj) {
  var type = obj.field in DATE_FIELDS ? 'date' : obj.field in NUMBER_FIELDS ? 'number' : 'string';
  return [obj.sort, type, obj.field].join(' ');
}

/***/ }),

/***/ "./lib/messaging/cubeChat.js":
/*!***********************************!*\
  !*** ./lib/messaging/cubeChat.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js"),
    Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js"),
    ChatUtils = __webpack_require__(/*! ./cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js"),
    ChatHelpers = __webpack_require__(/*! ./cubeChatHelpers */ "./lib/messaging/cubeChatHelpers.js"),
    StreamManagement = __webpack_require__(/*! ./cubeStreamManagement */ "./lib/messaging/cubeStreamManagement.js"),
    ContactListProxy = __webpack_require__(/*! ./cubeContactList */ "./lib/messaging/cubeContactList.js"),
    PrivacyListProxy = __webpack_require__(/*! ./cubePrivacyList */ "./lib/messaging/cubePrivacyList.js"),
    MucProxy = __webpack_require__(/*! ./cubeMultiUserChat */ "./lib/messaging/cubeMultiUserChat.js"),
    XMPPClient = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").XMPPClient;

var ChatService =
/*#__PURE__*/
function () {
  function ChatService(proxy) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, ChatService);
    this.proxy = proxy;
    this.xmppClient = XMPPClient.client({
      service: Config.chatProtocol.websocket,
      credentials: function credentials(auth, mechanism) {
        var crds = {
          username: _this.xmppClient.options.username,
          password: _this.xmppClient.options.password
        };
        return auth(crds);
      }
    });
    this.webrtcSignalingProcessor = null;
    this.stanzasCallbacks = {};
    this.earlyIncomingMessagesQueue = [];
    this.isConnected = false;
    this._isConnecting = false;
    this._isLogout = false;
    this._checkConnectionTimer = undefined;
    this._checkPingTimer = undefined;
    this.helpers = new ChatHelpers();
    this.xmppClientListeners = []; // Chat additional modules

    var options = {
      xmppClient: this.xmppClient,
      helpers: this.helpers,
      stanzasCallbacks: this.stanzasCallbacks
    };
    this.contactList = new ContactListProxy(options);
    this.privacylist = new PrivacyListProxy(options);
    this.muc = new MucProxy(options);

    if (Config.chat.streamManagement.enable) {
      if (Config.chatProtocol.active === 2) {
        this.streamManagement = new StreamManagement();

        this._sentMessageCallback = function (messageLost, messageSent) {
          if (typeof _this.onSentMessageCallback === 'function') {
            if (messageSent) {
              _this.onSentMessageCallback(null, messageSent);
            } else {
              _this.onSentMessageCallback(messageLost);
            }
          }
        };
      }
    }
  }

  (0, _createClass2["default"])(ChatService, [{
    key: "connect",
    value: function connect(params) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        Utils.DLog('[Chat]', 'Connect with parameters ', params);
        var userJid = ChatUtils.buildUserJid(params),
            isInitialConnect = typeof callback === 'function';

        if (_this2._isConnecting) {
          if (isInitialConnect) {
            var err = {
              code: 422,
              info: 'Already in CONNECTING state'
            };
            reject(err);
          }

          return;
        }

        if (_this2.isConnected) {
          Utils.DLog('[Chat]', 'CONNECTED - You are already connected');

          if (isInitialConnect) {
            resolve();
          }

          return;
        }

        _this2._isConnecting = true;
        _this2._isLogout = false; // remove all old listeners

        _this2.xmppClientListeners.forEach(function (listener) {
          _this2.xmppClient.removeListener(listener.name, listener.callback);
        });

        var callbackConnect = function callbackConnect() {
          Utils.DLog('[Chat]', 'CONNECTING');
        };

        _this2.xmppClient.on('connect', callbackConnect);

        _this2.xmppClientListeners.push({
          name: 'connect',
          callback: callbackConnect
        });

        var callbackOnline = function callbackOnline(jid) {
          Utils.DLog('[Chat]', 'ONLINE');

          _this2.startPingTimer();

          _this2._postConnectActions(isInitialConnect);

          resolve();
        };

        _this2.xmppClient.on('online', callbackOnline);

        _this2.xmppClientListeners.push({
          name: 'online',
          callback: callbackOnline
        });

        var callbackOffline = function callbackOffline() {
          Utils.DLog('[Chat]', 'OFFLINE');
        };

        _this2.xmppClient.on('offline', callbackOffline);

        _this2.xmppClientListeners.push({
          name: 'offline',
          callback: callbackOffline
        });

        var callbackDisconnect = function callbackDisconnect() {
          Utils.DLog('[Chat]', 'DISCONNECTED');

          if (typeof _this2.onDisconnectedListener === 'function') {
            Utils.safeCallbackCall(_this2.onDisconnectedListener);
          }

          _this2.stopPingTimer();

          _this2.isConnected = false;
          _this2._isConnecting = false; // reconnect to chat and enable check connection

          _this2._establishConnection(params);
        };

        _this2.xmppClient.on('disconnect', callbackDisconnect);

        _this2.xmppClientListeners.push({
          name: 'disconnect',
          callback: callbackDisconnect
        });

        var callbackStatus = function callbackStatus(status, value) {
          Utils.DLog('[Chat]', 'status', status, value ? value.toString() : '');
        };

        _this2.xmppClient.on('status', callbackStatus);

        _this2.xmppClientListeners.push({
          name: 'status',
          callback: callbackStatus
        });

        var callbackStanza = function callbackStanza(stanza) {
          // it can be a case,
          // when message came after xmpp auth but before resource bindging,
          // and it can cause some crashes, e.g.
          // https://github.com/ConnectyCube/connectycube-js-sdk-releases/issues/28
          if (stanza.is('message') && !_this2.isConnected) {
            _this2.earlyIncomingMessagesQueue.push(stanza);

            Utils.DLog('[Chat]', "on 'stanza': enqueue incoming stanza (isConnected=false)");
            return;
          } // console.log('stanza', stanza.toString())
          // after 'input' and 'element' (only if stanza, not nonza)


          if (stanza.is('presence')) {
            _this2._onPresence(stanza);
          } else if (stanza.is('iq')) {
            _this2._onIQ(stanza);
          } else if (stanza.is('message')) {
            if (stanza.attrs.type === 'headline') {
              _this2._onSystemMessageListener(stanza);
            } else if (stanza.attrs.type === 'error') {
              _this2._onMessageErrorListener(stanza);
            } else {
              _this2._onMessage(stanza);
            }
          }
        };

        _this2.xmppClient.on('stanza', callbackStanza);

        _this2.xmppClientListeners.push({
          name: 'stanza',
          callback: callbackStanza
        });

        var callbackError = function callbackError(err) {
          Utils.DLog('[Chat]', 'ERROR:', err);

          if (isInitialConnect) {
            if (err.name == 'SASLError') {
              err = err.condition;
            }

            reject(err);
          }

          _this2.isConnected = false;
          _this2._isConnecting = false;
        };

        _this2.xmppClient.on('error', callbackError);

        _this2.xmppClientListeners.push({
          name: 'error',
          callback: callbackError
        });

        var callbackOutput = function callbackOutput(str) {
          Utils.callTrafficUsageCallback('xmppDataWrite', {
            body: str
          });
          Utils.DLog('[Chat]', 'SENT:', str);
        };

        _this2.xmppClient.on('output', callbackOutput);

        _this2.xmppClientListeners.push({
          name: 'output',
          callback: callbackOutput
        });

        var callbackInput = function callbackInput(str) {
          Utils.callTrafficUsageCallback('xmppDataRead', {
            body: str
          });
          Utils.DLog('[Chat]', 'RECV:', str);
        };

        _this2.xmppClient.on('input', callbackInput);

        _this2.xmppClientListeners.push({
          name: 'input',
          callback: callbackInput
        }); // save user connection data so they will be used when authenticate (above)


        _this2.xmppClient.options.username = ChatUtils.buildUserJidLocalPart(params.userId);
        _this2.xmppClient.options.password = params.password; //

        _this2.xmppClient.start();
      });
    }
    /**
     * @deprecated since version 2.0
     */

  }, {
    key: "getContacts",
    value: function getContacts() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.contactList.get().then(function (contacts) {
          _this3.contactList.contacts = contacts;
          resolve(contacts);
        })["catch"](function (error) {
          reject(reject);
        });
      });
    }
  }, {
    key: "ping",
    value: function ping() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var iqParams = {
          id: ChatUtils.getUniqueId('ping'),
          to: Config.endpoints.chat,
          type: 'get'
        };
        var iqStanza = ChatUtils.createIqStanza(iqParams);
        iqStanza.c('ping', {
          xmlns: 'urn:xmpp:ping'
        });

        _this4.stanzasCallbacks[iqParams.id] = function (stanza) {
          var error = ChatUtils.getElement(stanza, 'error');

          if (error) {
            reject(ChatUtils.buildErrorFromXMPPErrorStanza(error));
          } else {
            resolve();
          }
        };

        _this4.xmppClient.send(iqStanza);
      });
    }
  }, {
    key: "startPingTimer",
    value: function startPingTimer() {
      var _this5 = this;

      if (Config.chat.ping.enable) {
        var validTime = Config.chat.pingTimeInterval < 60 ? 60 : Config.chat.pingTimeInterval;
        this._checkPingTimer = setInterval(function () {
          _this5.ping();
        }, validTime * 1000);
      }
    }
  }, {
    key: "stopPingTimer",
    value: function stopPingTimer() {
      clearInterval(this._checkPingTimer);
    }
  }, {
    key: "send",
    value: function send(jidOrUserId, message) {
      var stanzaParams = {
        from: this.helpers.getUserCurrentJid(),
        to: this.helpers.jidOrUserId(jidOrUserId),
        type: message.type ? message.type : 'chat',
        id: message.id ? message.id : Utils.getBsonObjectId()
      };
      var messageStanza = ChatUtils.createMessageStanza(stanzaParams);

      if (message.body) {
        messageStanza.c('body', {
          xmlns: 'jabber:client'
        }).t(message.body).up();
      }

      if (message.markable) {
        messageStanza.c('markable', {
          xmlns: 'urn:xmpp:chat-markers:0'
        }).up();
      }

      if (message.extension) {
        messageStanza.c('extraParams', {
          xmlns: 'jabber:client'
        });
        messageStanza = ChatUtils.filledExtraParams(messageStanza, message.extension);
      }

      if (Config.chat.streamManagement.enable) {
        message.id = stanzaParams.id;
        this.xmppClient.send(messageStanza, message);
      } else {
        this.xmppClient.send(messageStanza);
      }

      return stanzaParams.id;
    }
  }, {
    key: "sendSystemMessage",
    value: function sendSystemMessage(jidOrUserId, message) {
      var stanzaParams = {
        type: 'headline',
        id: message.id ? message.id : Utils.getBsonObjectId(),
        to: this.helpers.jidOrUserId(jidOrUserId)
      };
      var messageStanza = ChatUtils.createMessageStanza(stanzaParams);

      if (message.body) {
        messageStanza.c('body', {
          xmlns: 'jabber:client'
        }).t(message.body).up();
      } // custom parameters


      if (message.extension) {
        messageStanza.c('extraParams', {
          xmlns: 'jabber:client'
        }).c('moduleIdentifier').t('SystemNotifications').up();
        messageStanza = ChatUtils.filledExtraParams(messageStanza, message.extension);
      }

      this.xmppClient.send(messageStanza);
      return stanzaParams.id;
    }
  }, {
    key: "sendIsTypingStatus",
    value: function sendIsTypingStatus(jidOrUserId) {
      var stanzaParams = {
        from: this.helpers.getUserCurrentJid(),
        to: this.helpers.jidOrUserId(jidOrUserId),
        type: this.helpers.typeChat(jidOrUserId)
      };
      var messageStanza = ChatUtils.createMessageStanza(stanzaParams);
      messageStanza.c('composing', {
        xmlns: 'http://jabber.org/protocol/chatstates'
      });
      this.xmppClient.send(messageStanza);
    }
  }, {
    key: "sendIsStopTypingStatus",
    value: function sendIsStopTypingStatus(jidOrUserId) {
      var stanzaParams = {
        from: this.helpers.getUserCurrentJid(),
        to: this.helpers.jidOrUserId(jidOrUserId),
        type: this.helpers.typeChat(jidOrUserId)
      };
      var messageStanza = ChatUtils.createMessageStanza(stanzaParams);
      messageStanza.c('paused', {
        xmlns: 'http://jabber.org/protocol/chatstates'
      });
      this.xmppClient.send(messageStanza);
    }
  }, {
    key: "sendDeliveredStatus",
    value: function sendDeliveredStatus(params) {
      var stanzaParams = {
        type: 'chat',
        from: this.helpers.getUserCurrentJid(),
        id: Utils.getBsonObjectId(),
        to: this.helpers.jidOrUserId(params.userId)
      };
      var messageStanza = ChatUtils.createMessageStanza(stanzaParams);
      messageStanza.c('received', {
        xmlns: 'urn:xmpp:chat-markers:0',
        id: params.messageId
      }).up();
      messageStanza.c('extraParams', {
        xmlns: 'jabber:client'
      }).c('dialog_id').t(params.dialogId);
      this.xmppClient.send(messageStanza);
    }
  }, {
    key: "sendReadStatus",
    value: function sendReadStatus(params) {
      var stanzaParams = {
        type: 'chat',
        from: this.helpers.getUserCurrentJid(),
        to: this.helpers.jidOrUserId(params.userId),
        id: Utils.getBsonObjectId()
      };
      var messageStanza = ChatUtils.createMessageStanza(stanzaParams);
      messageStanza.c('displayed', {
        xmlns: 'urn:xmpp:chat-markers:0',
        id: params.messageId
      }).up();
      messageStanza.c('extraParams', {
        xmlns: 'jabber:client'
      }).c('dialog_id').t(params.dialogId);
      this.xmppClient.send(messageStanza);
    }
  }, {
    key: "getLastUserActivity",
    value: function getLastUserActivity(jidOrUserId) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var iqParams = {
          from: _this6.helpers.getUserCurrentJid(),
          id: ChatUtils.getUniqueId('lastActivity'),
          to: _this6.helpers.jidOrUserId(jidOrUserId),
          type: 'get'
        };
        var iqStanza = ChatUtils.createIqStanza(iqParams);
        iqStanza.c('query', {
          xmlns: 'jabber:iq:last'
        });

        _this6.stanzasCallbacks[iqParams.id] = function (stanza) {
          var error = ChatUtils.getElement(stanza, 'error');
          var from = ChatUtils.getAttr(stanza, 'from');

          var userId = _this6.helpers.getUserIdFromJID(from);

          var query = ChatUtils.getElement(stanza, 'query');
          var seconds = +ChatUtils.getAttr(query, 'seconds'); // trigger onLastUserActivityListener callback

          Utils.safeCallbackCall(_this6.onLastUserActivityListener, userId, seconds);

          if (error) {
            reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza));
          } else {
            resolve({
              userId: userId,
              seconds: seconds
            });
          }
        };

        _this6.xmppClient.send(iqStanza);
      });
    }
  }, {
    key: "markActive",
    value: function markActive() {
      var iqParams = {
        id: this.helpers.getUniqueId('markActive'),
        type: 'set'
      };
      var iqStanza = ChatUtils.createIqStanza(iqParams);
      iqStanza.c('mobile', {
        xmlns: "http://tigase.org/protocol/mobile#v2",
        enable: "false"
      });
      this.xmppClient.send(iqStanza);
    }
  }, {
    key: "markInactive",
    value: function markInactive() {
      var iqParams = {
        id: this.helpers.getUniqueId('markActive'),
        type: 'set'
      };
      var iqStanza = ChatUtils.createIqStanza(iqParams);
      iqStanza.c('mobile', {
        xmlns: "http://tigase.org/protocol/mobile#v2",
        enable: "true"
      });
      this.xmppClient.send(iqStanza);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      Utils.DLog('[Chat]', 'disconnect');
      clearInterval(this._checkConnectionTimer);
      this._checkConnectionTimer = undefined;
      this.muc.joinedRooms = {};
      this._isLogout = true;
      this.helpers.setUserCurrentJid('');
      this.xmppClient.stop();
    }
  }, {
    key: "search",
    value: function search(params) {
      var query = Object.assign({}, params);

      if (query.start_date) {
        query.start_date = new Date(query.start_date).toISOString();
      }

      if (query.end_date) {
        query.end_date = new Date(query.end_date).toISOString();
      }

      if (Utils.isArray(query.chat_dialog_ids)) {
        query.chat_dialog_ids = query.chat_dialog_ids.join(',');
      }

      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl("".concat(Config.urls.chat, "/search")),
        data: query
      };
      return this.proxy.ajax(ajaxParams);
    } /// PRIVATE ///

  }, {
    key: "_onMessage",
    value: function _onMessage(rawStanza) {
      var forwaredStanza = ChatUtils.getElementTreePath(rawStanza, ['sent', 'forwarded', 'message']),
          stanza = forwaredStanza || rawStanza,
          from = ChatUtils.getAttr(stanza, 'from'),
          type = ChatUtils.getAttr(stanza, 'type'),
          messageId = ChatUtils.getAttr(stanza, 'id'),
          markable = ChatUtils.getElement(stanza, 'markable'),
          delivered = ChatUtils.getElement(stanza, 'received'),
          read = ChatUtils.getElement(stanza, 'displayed'),
          composing = ChatUtils.getElement(stanza, 'composing'),
          paused = ChatUtils.getElement(stanza, 'paused'),
          invite = ChatUtils.getElement(stanza, 'invite'),
          delay = ChatUtils.getElement(stanza, 'delay'),
          extraParams = ChatUtils.getElement(stanza, 'extraParams'),
          bodyContent = ChatUtils.getElementText(stanza, 'body'),
          forwarded = ChatUtils.getElement(stanza, 'forwarded');
      var extraParamsParsed, recipientId, recipient;
      var forwardedMessage = forwarded ? ChatUtils.getElement(forwarded, 'message') : null;
      recipient = forwardedMessage ? ChatUtils.getAttr(forwardedMessage, 'to') : null;
      recipientId = recipient ? this.helpers.getUserIdFromJID(recipient) : null;
      var dialogId = type === 'groupchat' ? this.helpers.getDialogIdFromJID(from) : null,
          userId = type === 'groupchat' ? this.helpers.getIdFromResource(from) : this.helpers.getUserIdFromJID(from),
          marker = delivered || read || null; // ignore invite messages from MUC

      if (invite) return true;

      if (extraParams) {
        extraParamsParsed = ChatUtils.parseExtraParams(extraParams);

        if (extraParamsParsed.dialogId) {
          dialogId = extraParamsParsed.dialogId;
        }
      }

      if (composing || paused) {
        if (typeof this.onMessageTypingListener === 'function' && (type === 'chat' || type === 'groupchat' || !delay)) {
          Utils.safeCallbackCall(this.onMessageTypingListener, !!composing, userId, dialogId);
        }

        return true;
      }

      if (marker) {
        if (delivered) {
          if (typeof this.onDeliveredStatusListener === 'function' && type === 'chat') {
            Utils.safeCallbackCall(this.onDeliveredStatusListener, ChatUtils.getAttr(delivered, 'id'), dialogId, userId);
          }
        } else {
          if (typeof this.onReadStatusListener === 'function' && type === 'chat') {
            Utils.safeCallbackCall(this.onReadStatusListener, ChatUtils.getAttr(read, 'id'), dialogId, userId);
          }
        }

        return;
      } // autosend 'received' status (ignore messages from yourself)


      if (markable && userId != this.helpers.getUserIdFromJID(this.helpers.userCurrentJid(this.xmppClient))) {
        var autoSendReceiveStatusParams = {
          messageId: messageId,
          userId: userId,
          dialogId: dialogId
        };
        this.sendDeliveredStatus(autoSendReceiveStatusParams);
      }

      var message = {
        id: messageId,
        dialog_id: dialogId,
        recipient_id: recipientId,
        type: type,
        body: bodyContent,
        extension: extraParamsParsed ? extraParamsParsed.extension : null,
        delay: delay
      };

      if (markable) {
        message.markable = 1;
      }

      if (typeof this.onMessageListener === 'function' && (type === 'chat' || type === 'groupchat')) {
        Utils.safeCallbackCall(this.onMessageListener, userId, message);
      }
    }
  }, {
    key: "_onPresence",
    value: function _onPresence(stanza) {
      var from = ChatUtils.getAttr(stanza, 'from'),
          id = ChatUtils.getAttr(stanza, 'id'),
          type = ChatUtils.getAttr(stanza, 'type'),
          currentUserId = this.helpers.getUserIdFromJID(this.helpers.userCurrentJid(this.xmppClient)),
          x = ChatUtils.getElement(stanza, 'x');
      var xXMLNS, status, statusCode;

      if (x) {
        xXMLNS = ChatUtils.getAttr(x, 'xmlns');
        status = ChatUtils.getElement(x, 'status');

        if (status) {
          statusCode = ChatUtils.getAttr(status, 'code');
        }
      } // MUC presences


      if (xXMLNS && xXMLNS.startsWith('http://jabber.org/protocol/muc')) {
        // Error
        if (type === 'error') {
          // JOIN to dialog error
          if (id.endsWith(':join')) {
            if (typeof this.stanzasCallbacks[id] === 'function') {
              this.stanzasCallbacks[id](stanza);
            }
          }

          return;
        }

        var dialogId = this.helpers.getDialogIdFromJID(from);

        var _userId = this.helpers.getUserIdFromRoomJid(from); // self presence


        if (status) {
          // KICK from dialog event
          if (statusCode == '301') {
            if (typeof this.onKickOccupant === 'function') {
              var actorElement = ChatUtils.getElement(ChatUtils.getElement(x, 'item'), 'actor');
              var initiatorUserJid = ChatUtils.getAttr(actorElement, 'jid');
              Utils.safeCallbackCall(this.onKickOccupant, dialogId, this.helpers.getUserIdFromJID(initiatorUserJid));
            }

            delete this.muc.joinedRooms[this.helpers.getRoomJidFromRoomFullJid(from)];
            return;
          } else {
            if (type === 'unavailable') {
              // LEAVE response
              if (status && statusCode == '110') {
                if (typeof this.stanzasCallbacks['muc:leave'] === 'function') {
                  Utils.safeCallbackCall(this.stanzasCallbacks['muc:leave'], null);
                }
              }

              return;
            } // JOIN response


            if (id.endsWith(':join') && status && statusCode == '110') {
              if (typeof this.stanzasCallbacks[id] === 'function') {
                this.stanzasCallbacks[id](stanza);
              }

              return;
            }
          } // Occupants JOIN/LEAVE events

        } else {
          if (_userId != currentUserId) {
            // Leave
            if (type === 'unavailable') {
              if (typeof this.onLeaveOccupant === 'function') {
                Utils.safeCallbackCall(this.onLeaveOccupant, dialogId, parseInt(_userId));
              }

              return; // Join
            } else {
              if (typeof this.onJoinOccupant === 'function') {
                Utils.safeCallbackCall(this.onJoinOccupant, dialogId, parseInt(_userId));
              }

              return;
            }
          }
        }
      } // ROSTER presences


      var userId = this.helpers.getUserIdFromJID(from);
      var contact = this.contactList.contacts[userId];

      if (!type) {
        if (typeof this.onContactListListener === 'function' && contact && contact.subscription !== 'none') {
          Utils.safeCallbackCall(this.onContactListListener, userId);
        }
      } else {
        switch (type) {
          case 'subscribe':
            if (contact && contact.subscription === 'to') {
              contact ? contact.ask = null : contact = {
                ask: null
              };
              contact.subscription = 'both';

              this.contactList._sendSubscriptionPresence({
                jid: from,
                type: 'subscribed'
              });
            } else {
              if (typeof this.onSubscribeListener === 'function') {
                Utils.safeCallbackCall(this.onSubscribeListener, userId);
              }
            }

            break;

          case 'subscribed':
            if (contact && contact.subscription === 'from') {
              contact ? contact.ask = null : contact = {
                ask: null
              };
              contact.subscription = 'both';
            } else {
              contact ? contact.ask = null : contact = {
                ask: null
              };
              contact.subscription = 'to';

              if (typeof this.onConfirmSubscribeListener === 'function') {
                Utils.safeCallbackCall(this.onConfirmSubscribeListener, userId);
              }
            }

            break;

          case 'unsubscribed':
            contact ? contact.ask = null : contact = {
              ask: null
            };
            contact.subscription = 'none';

            if (typeof this.onRejectSubscribeListener === 'function') {
              Utils.safeCallbackCall(this.onRejectSubscribeListener, userId);
            }

            break;

          case 'unsubscribe':
            contact ? contact.ask = null : contact = {
              ask: null
            };
            contact.subscription = 'to';
            break;

          case 'unavailable':
            if (typeof this.onContactListListener === 'function' && contact && contact.subscription !== 'none') {
              Utils.safeCallbackCall(this.onContactListListener, userId, type);
            } // send initial presence if one of client (instance) goes offline


            if (userId === currentUserId) {
              this.xmppClient.send(ChatUtils.createPresenceStanza());
            }

            break;
        }
      }
    }
  }, {
    key: "_onIQ",
    value: function _onIQ(stanza) {
      var stanzaId = ChatUtils.getAttr(stanza, 'id');

      if (this.stanzasCallbacks[stanzaId]) {
        Utils.safeCallbackCall(this.stanzasCallbacks[stanzaId], stanza);
        delete this.stanzasCallbacks[stanzaId];
      }
    }
  }, {
    key: "_onSystemMessageListener",
    value: function _onSystemMessageListener(rawStanza) {
      var forwaredStanza = ChatUtils.getElementTreePath(rawStanza, ['sent', 'forwarded', 'message']),
          stanza = forwaredStanza || rawStanza,
          from = ChatUtils.getAttr(stanza, 'from'),
          messageId = ChatUtils.getAttr(stanza, 'id'),
          extraParams = ChatUtils.getElement(stanza, 'extraParams'),
          userId = this.helpers.getUserIdFromJID(from),
          delay = ChatUtils.getElement(stanza, 'delay'),
          moduleIdentifier = ChatUtils.getElementText(extraParams, 'moduleIdentifier'),
          bodyContent = ChatUtils.getElementText(stanza, 'body'),
          extraParamsParsed = ChatUtils.parseExtraParams(extraParams);

      if (moduleIdentifier === 'SystemNotifications' && typeof this.onSystemMessageListener === 'function') {
        var message = {
          id: messageId,
          userId: userId,
          body: bodyContent,
          extension: extraParamsParsed.extension
        };
        Utils.safeCallbackCall(this.onSystemMessageListener, message);
      } else if (this.webrtcSignalingProcessor && !delay && moduleIdentifier === 'WebRTCVideoChat') {
        this.webrtcSignalingProcessor._onMessage(userId, extraParams);
      }
    }
  }, {
    key: "_onMessageErrorListener",
    value: function _onMessageErrorListener(stanza) {
      // <error code="503" type="cancel">
      //   <service-unavailable xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/>
      //   <text xmlns="urn:ietf:params:xml:ns:xmpp-stanzas" xml:lang="en">Service not available.</text>
      // </error>
      var messageId = ChatUtils.getAttr(stanza, 'id'); //

      var error = ChatUtils.buildErrorFromXMPPErrorStanza(stanza);

      if (typeof this.onMessageErrorListener === 'function') {
        Utils.safeCallbackCall(this.onMessageErrorListener, messageId, error);
      }
    }
  }, {
    key: "_postConnectActions",
    value: function _postConnectActions(isInitialConnect) {
      Utils.DLog('[Chat]', 'CONNECTED');
      var presence = ChatUtils.createPresenceStanza();

      if (Config.chat.streamManagement.enable && Config.chatProtocol.active === 2) {
        this.streamManagement.enable(this.xmppClient);
        this.streamManagement.sentMessageCallback = this._sentMessageCallback;
      }

      this.helpers.setUserCurrentJid(this.helpers.userCurrentJid(this.xmppClient));
      this.isConnected = true;
      this._isConnecting = false;

      this._enableCarbons();

      this.xmppClient.send(presence); // initial presence
      // reconnect

      if (!isInitialConnect) {
        if (typeof this.onReconnectListener === 'function') {
          Utils.safeCallbackCall(this.onReconnectListener);
        }
      }

      if (this.earlyIncomingMessagesQueue.length > 0) {
        Utils.DLog('[Chat]', "Flush 'earlyIncomingMessagesQueue' (length=".concat(this.earlyIncomingMessagesQueue.length, ")"));
        var stanzasCallback = this.xmppClientListeners.filter(function (listener) {
          return listener.name === 'stanza';
        })[0].callback;
        this.earlyIncomingMessagesQueue.forEach(function (stanza) {
          stanzasCallback(stanza);
        });
        this.earlyIncomingMessagesQueue = [];
      }
    }
  }, {
    key: "_establishConnection",
    value: function _establishConnection(params) {
      var _this7 = this;

      if (this._isLogout || this._checkConnectionTimer) {
        return;
      }

      var _connect = function _connect() {
        if (!_this7.isConnected && !_this7._isConnecting) {
          _this7.connect(params);
        } else {
          clearInterval(_this7._checkConnectionTimer);
          _this7._checkConnectionTimer = undefined;
        }
      };

      _connect();

      this._checkConnectionTimer = setInterval(function () {
        _connect();
      }, Config.chat.reconnectionTimeInterval * 1000);
    }
  }, {
    key: "_enableCarbons",
    value: function _enableCarbons() {
      var carbonParams = {
        type: 'set',
        from: this.helpers.getUserCurrentJid(),
        id: ChatUtils.getUniqueId('enableCarbons')
      };
      var iqStanza = ChatUtils.createIqStanza(carbonParams);
      iqStanza.c('enable', {
        xmlns: 'urn:xmpp:carbons:2'
      });
      this.xmppClient.send(iqStanza);
    }
  }, {
    key: "_setSubscriptionToUserLastActivity",
    value: function _setSubscriptionToUserLastActivity(jidOrUserId, _isEnable) {
      var iqParams = {
        id: this.helpers.getUniqueId('statusStreaming'),
        type: 'set'
      };
      var iqStanza = ChatUtils.createIqStanza(iqParams);
      iqStanza.c('subscribe', {
        xmlns: 'https://connectycube.com/protocol/status_streaming',
        user_jid: this.helpers.jidOrUserId(jidOrUserId),
        enable: _isEnable
      });
      this.xmppClient.send(iqStanza);
    }
  }, {
    key: "subscribeToUserLastActivityStatus",
    value: function subscribeToUserLastActivityStatus(jidOrUserId) {
      this._setSubscriptionToUserLastActivity(jidOrUserId, true);
    }
  }, {
    key: "unsubscribeFromUserLastActivityStatus",
    value: function unsubscribeFromUserLastActivityStatus(jidOrUserId) {
      this._setSubscriptionToUserLastActivity(jidOrUserId, false);
    }
  }]);
  return ChatService;
}();

module.exports = ChatService;

/***/ }),

/***/ "./lib/messaging/cubeChatHelpers.js":
/*!******************************************!*\
  !*** ./lib/messaging/cubeChatHelpers.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js"),
    Config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js"),
    ChatUtils = __webpack_require__(/*! ./cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js");

var ChatHelpers =
/*#__PURE__*/
function () {
  function ChatHelpers() {
    (0, _classCallCheck2["default"])(this, ChatHelpers);
    this._userCurrentJid = null;
  }

  (0, _createClass2["default"])(ChatHelpers, [{
    key: "getUniqueId",
    value: function getUniqueId(suffix) {
      return ChatUtils.getUniqueId(suffix);
    }
  }, {
    key: "jidOrUserId",
    value: function jidOrUserId(_jidOrUserId) {
      var jid;

      if (typeof _jidOrUserId === 'string' && _jidOrUserId.includes('@')) {
        // jid
        jid = _jidOrUserId;
      } else {
        // user id
        jid = _jidOrUserId + '-' + Config.creds.appId + '@' + Config.endpoints.chat;
      }

      return jid;
    }
  }, {
    key: "typeChat",
    value: function typeChat(jidOrUserId) {
      var chatType;

      if (typeof jidOrUserId === 'string') {
        chatType = jidOrUserId.indexOf('muc') > -1 ? 'groupchat' : 'chat';
      } else if (typeof jidOrUserId === 'number') {
        chatType = 'chat';
      } else {
        throw new Error('Unsupported chat type');
      }

      return chatType;
    }
  }, {
    key: "getUserJid",
    value: function getUserJid(userId, appId) {
      if (!appId) {
        return userId + '-' + Config.creds.appId + '@' + Config.endpoints.chat;
      }

      return userId + '-' + appId + '@' + Config.endpoints.chat;
    }
  }, {
    key: "getUserNickWithMucDomain",
    value: function getUserNickWithMucDomain(userId) {
      return Config.endpoints.muc + '/' + userId;
    }
  }, {
    key: "getUserIdFromJID",
    value: function getUserIdFromJID(jid) {
      return jid.indexOf('@') < 0 ? null : parseInt(jid.split('@')[0].split('-')[0]);
    }
  }, {
    key: "getDialogIdFromJID",
    value: function getDialogIdFromJID(jid) {
      if (jid.indexOf('@') < 0) return null;
      return jid.split('@')[0].split('_')[1];
    }
  }, {
    key: "getRoomJidFromDialogId",
    value: function getRoomJidFromDialogId(dialogId) {
      return Config.creds.appId + '_' + dialogId + '@' + Config.endpoints.muc;
    }
  }, {
    key: "getRoomJid",
    value: function getRoomJid(jid) {
      return jid + '/' + this.getUserIdFromJID(this._userCurrentJid);
    }
  }, {
    key: "getIdFromResource",
    value: function getIdFromResource(jid) {
      var s = jid.split('/');
      if (s.length < 2) return null;
      s.splice(0, 1);
      return parseInt(s.join('/'));
    }
  }, {
    key: "getRoomJidFromRoomFullJid",
    value: function getRoomJidFromRoomFullJid(jid) {
      var s = jid.split('/');
      if (s.length < 2) return null;
      return s[0];
    }
  }, {
    key: "getBsonObjectId",
    value: function getBsonObjectId() {
      return Utils.getBsonObjectId();
    }
  }, {
    key: "getUserIdFromRoomJid",
    value: function getUserIdFromRoomJid(jid) {
      var arrayElements = jid.toString().split('/');

      if (arrayElements.length === 0) {
        return null;
      }

      return arrayElements[arrayElements.length - 1];
    }
  }, {
    key: "userCurrentJid",
    value: function userCurrentJid(client) {
      return client.jid._local + '@' + client.jid._domain + '/' + client.jid._resource;
    }
  }, {
    key: "getUserCurrentJid",
    value: function getUserCurrentJid() {
      return this._userCurrentJid;
    }
  }, {
    key: "setUserCurrentJid",
    value: function setUserCurrentJid(jid) {
      this._userCurrentJid = jid;
    }
  }, {
    key: "getDialogJid",
    value: function getDialogJid(identifier) {
      return identifier.indexOf('@') > 0 ? identifier : this.getRoomJidFromDialogId(identifier);
    }
  }]);
  return ChatHelpers;
}();

module.exports = ChatHelpers;

/***/ }),

/***/ "./lib/messaging/cubeChatInternalUtils.js":
/*!************************************************!*\
  !*** ./lib/messaging/cubeChatInternalUtils.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js"),
    Config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js"),
    XMPP = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").XMPPClient;

var ChatInternalUtils =
/*#__PURE__*/
function () {
  function ChatInternalUtils() {
    (0, _classCallCheck2["default"])(this, ChatInternalUtils);
  }

  (0, _createClass2["default"])(ChatInternalUtils, null, [{
    key: "buildUserJid",
    value: function buildUserJid(params) {
      var jid;

      if ('userId' in params) {
        jid = params.userId + '-' + Config.creds.appId + '@' + Config.endpoints.chat;

        if ('resource' in params) {
          jid = jid + '/' + params.resource;
        }
      } else if ('jid' in params) {
        jid = params.jid;
      }

      return jid;
    }
  }, {
    key: "buildUserJidLocalPart",
    value: function buildUserJidLocalPart(userId) {
      return userId + '-' + Config.creds.appId;
    }
  }, {
    key: "createMessageStanza",
    value: function createMessageStanza(params) {
      return XMPP.xml('message', params);
    }
  }, {
    key: "createIqStanza",
    value: function createIqStanza(params) {
      return XMPP.xml('iq', params);
    }
  }, {
    key: "createPresenceStanza",
    value: function createPresenceStanza(params) {
      return XMPP.xml('presence', params);
    }
  }, {
    key: "createNonza",
    value: function createNonza(elementName, params) {
      return XMPP.xml(elementName, params);
    }
  }, {
    key: "getAttr",
    value: function getAttr(el, attrName) {
      if (!el) {
        return null;
      }

      var attr;

      if (typeof el.getAttribute === 'function') {
        attr = el.getAttribute(attrName);
      } else if (el.attrs) {
        attr = el.attrs[attrName];
      }

      return attr;
    }
  }, {
    key: "getElement",
    value: function getElement(stanza, elName) {
      var el;

      if (typeof stanza.querySelector === 'function') {
        el = stanza.querySelector(elName);
      } else if (typeof stanza.getChild === 'function') {
        el = stanza.getChild(elName);
      }

      return el;
    }
  }, {
    key: "isErrorStanza",
    value: function isErrorStanza(stanza) {
      return !!stanza.getChild('error');
    }
  }, {
    key: "getAllElements",
    value: function getAllElements(stanza, elName) {
      var el;

      if (typeof stanza.querySelectorAll === 'function') {
        el = stanza.querySelectorAll(elName);
      } else if (typeof stanza.getChild === 'function') {
        el = stanza.getChild(elName);
      }

      return el;
    }
  }, {
    key: "getElementText",
    value: function getElementText(stanza, elName) {
      var el, txt;

      if (typeof stanza.querySelector === 'function') {
        el = stanza.querySelector(elName);
        txt = el ? el.textContent : null;
      } else if (typeof stanza.getChildText === 'function') {
        txt = stanza.getChildText(elName);
      }

      return txt;
    }
  }, {
    key: "getElementTreePath",
    value: function getElementTreePath(stanza, elementsPath) {
      var _this = this;

      return elementsPath.reduce(function (prevStanza, elem) {
        return prevStanza ? _this.getElement(prevStanza, elem) : prevStanza;
      }, stanza);
    }
  }, {
    key: "_JStoXML",
    value: function _JStoXML(title, obj, msg) {
      var _this2 = this;

      msg = msg.c(title);
      Object.keys(obj).forEach(function (field) {
        if ((0, _typeof2["default"])(obj[field]) === 'object') {
          _this2._JStoXML(field, obj[field], msg);
        } else {
          msg = msg.c(field).t(obj[field]).up();
        }
      });
      msg = msg.up();
    }
  }, {
    key: "_XMLtoJS",
    value: function _XMLtoJS(extension, title, obj) {
      extension[title] = {};
      var objChildNodes = obj.childNodes || obj.children;

      for (var i = 0; i < objChildNodes.length; i++) {
        var subNode = objChildNodes[i];
        var subNodeChildNodes = subNode.childNodes || subNode.children;
        var subNodeTagName = subNode.tagName || subNode.name;
        var subNodeTextContent = subNode.textContent || subNode.children[0];

        if (subNodeChildNodes.length > 1) {
          extension[title] = this._XMLtoJS(extension[title], subNodeTagName, subNode);
        } else {
          extension[title][subNodeTagName] = subNodeTextContent;
        }
      }

      return extension;
    }
  }, {
    key: "filledExtraParams",
    value: function filledExtraParams(stanza, extension) {
      var _this3 = this;

      Object.keys(extension).forEach(function (field) {
        if (field === 'attachments') {
          extension[field].forEach(function (attach) {
            stanza.getChild('extraParams').c('attachment', attach).up();
          });
        } else if ((0, _typeof2["default"])(extension[field]) === 'object') {
          _this3._JStoXML(field, extension[field], stanza);
        } else {
          stanza.getChild('extraParams').c(field).t(extension[field]).up();
        }
      });
      stanza.up();
      return stanza;
    }
  }, {
    key: "parseExtraParams",
    value: function parseExtraParams(extraParams) {
      if (!extraParams) {
        return null;
      }

      var extension = {};
      var dialogId, attach, attributes;
      var attachments = [];

      for (var c = 0, lenght = extraParams.children.length; c < lenght; c++) {
        if (extraParams.children[c].name === 'attachment') {
          attach = {};
          attributes = extraParams.children[c].attrs;
          var attrKeys = Object.keys(attributes);

          for (var l = 0; l < attrKeys.length; l++) {
            if (attrKeys[l] === 'size') {
              attach.size = parseInt(attributes.size);
            } else {
              attach[attrKeys[l]] = attributes[attrKeys[l]];
            }
          }

          attachments.push(attach);
        } else if (extraParams.children[c].name === 'dialog_id') {
          dialogId = extraParams.getChildText('dialog_id');
          extension.dialog_id = dialogId;
        }

        if (extraParams.children[c].children.length === 1) {
          var child = extraParams.children[c];
          extension[child.name] = child.children[0];
        }
      }

      if (attachments.length > 0) {
        extension.attachments = attachments;
      }

      if (extension.moduleIdentifier) {
        delete extension.moduleIdentifier;
      }

      return {
        extension: extension,
        dialogId: dialogId
      };
    }
  }, {
    key: "buildErrorFromXMPPErrorStanza",
    value: function buildErrorFromXMPPErrorStanza(errorStanza) {
      var errorElement = this.getElement(errorStanza, 'error');
      var code = parseInt(this.getAttr(errorElement, 'code'));
      var info = this.getElementText(errorElement, 'text');
      return {
        code: code,
        info: info
      };
    }
  }, {
    key: "getUniqueId",
    value: function getUniqueId(suffix) {
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });

      if (typeof suffix == 'string' || typeof suffix == 'number') {
        return uuid + ':' + suffix;
      } else {
        return uuid + '';
      }
    }
  }]);
  return ChatInternalUtils;
}();

module.exports = ChatInternalUtils;

/***/ }),

/***/ "./lib/messaging/cubeContactList.js":
/*!******************************************!*\
  !*** ./lib/messaging/cubeContactList.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var ChatUtils = __webpack_require__(/*! ./cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js"),
    Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js"),
    Config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var ContactListService =
/*#__PURE__*/
function () {
  function ContactListService(options) {
    (0, _classCallCheck2["default"])(this, ContactListService);
    this.helpers = options.helpers;
    this.xmppClient = options.xmppClient;
    this.stanzasCallbacks = options.stanzasCallbacks; //

    this.contacts = {};
    this.xmlns = "jabber:iq:roster";
  }

  (0, _createClass2["default"])(ContactListService, [{
    key: "get",
    value: function get() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var stanzaId = ChatUtils.getUniqueId('getRoster');
        var contacts = {},
            iqStanza = ChatUtils.createIqStanza({
          type: 'get',
          from: _this.helpers.getUserCurrentJid(),
          id: stanzaId
        });
        iqStanza.c('query', {
          xmlns: _this.xmlns
        });

        _this.stanzasCallbacks[stanzaId] = function (stanza) {
          var items = stanza.getChild('query').children;

          for (var i = 0, len = items.length; i < len; i++) {
            var userId = _this.helpers.getUserIdFromJID(ChatUtils.getAttr(items[i], 'jid')),
                ask = ChatUtils.getAttr(items[i], 'ask'),
                subscription = ChatUtils.getAttr(items[i], 'subscription'),
                name = ChatUtils.getAttr(items[i], 'name'),
                isUniqName = userId + '-' + Config.creds.appId !== name;

            contacts[userId] = {
              subscription: subscription,
              ask: ask || null,
              name: isUniqName ? name : null
            };
          }

          resolve(contacts);
        };

        _this.xmppClient.send(iqStanza);
      });
    }
  }, {
    key: "add",
    value: function add(params) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var userId = params.userId || params,
            userJid = _this2.helpers.jidOrUserId(userId),
            stanzaId = ChatUtils.getUniqueId('addContactInRoster');

        var iqStanza = ChatUtils.createIqStanza({
          type: 'set',
          from: _this2.helpers.getUserCurrentJid(),
          id: stanzaId
        });
        _this2.contacts[userId] = {
          subscription: 'none',
          ask: 'subscribe',
          name: params.name || null
        };
        iqStanza.c('query', {
          xmlns: _this2.xmlns
        }).c('item', {
          jid: userJid,
          name: params.name || null
        });

        _this2.stanzasCallbacks[stanzaId] = function () {
          _this2._sendSubscriptionPresence({
            jid: userJid,
            type: 'subscribe'
          });

          resolve();
        };

        _this2.xmppClient.send(iqStanza);
      });
    }
  }, {
    key: "confirm",
    value: function confirm(params) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var userId = params.userId || params,
            userJid = _this3.helpers.jidOrUserId(userId);

        _this3._sendSubscriptionPresence({
          jid: userJid,
          type: 'subscribed'
        });

        if (Config.chat.contactList.subscriptionMode.mutual) {
          _this3.add(params, function () {
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "reject",
    value: function reject(userId) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var userJid = _this4.helpers.jidOrUserId(userId);

        _this4.contacts[userId] = {
          subscription: 'none',
          ask: null
        };

        _this4._sendSubscriptionPresence({
          jid: userJid,
          type: 'unsubscribed'
        });

        resolve();
      });
    }
  }, {
    key: "updateName",
    value: function updateName(params) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var userJid = _this5.helpers.jidOrUserId(params.userId),
            stanzaId = ChatUtils.getUniqueId('updateContactInRoster');

        var contact = _this5.contacts[params.userId];

        if (Utils.isObject(contact)) {
          contact.name = params.name || null;
        } else {
          reject('No contact exists with provided user id');
          return;
        }

        var iqStanza = ChatUtils.createIqStanza({
          type: 'set',
          from: _this5.helpers.getUserCurrentJid(),
          id: stanzaId
        });
        iqStanza.c('query', {
          xmlns: _this5.xmlns
        }).c('item', {
          jid: userJid,
          name: params.name || null
        });

        _this5.stanzasCallbacks[stanzaId] = function (res) {
          res.attrs.type === "result" ? resolve() : reject(res);
        };

        _this5.xmppClient.send(iqStanza);
      });
    }
  }, {
    key: "remove",
    value: function remove(userId) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var userJid = _this6.helpers.jidOrUserId(userId),
            stanzaId = ChatUtils.getUniqueId('removeConactInRoster');

        var iqStanza = ChatUtils.createIqStanza({
          type: 'set',
          from: _this6.helpers.getUserCurrentJid(),
          id: stanzaId
        });
        iqStanza.c('query', {
          xmlns: _this6.xmlns
        }).c('item', {
          jid: userJid,
          subscription: 'remove'
        });

        _this6.stanzasCallbacks[stanzaId] = function () {
          delete _this6.contacts[userId];
          resolve();
        };

        _this6.xmppClient.send(iqStanza);
      });
    }
  }, {
    key: "_sendSubscriptionPresence",
    value: function _sendSubscriptionPresence(params) {
      var presenceParams = {
        to: params.jid,
        type: params.type
      };
      var presenceStanza = ChatUtils.createPresenceStanza(presenceParams);
      this.xmppClient.send(presenceStanza);
    }
  }]);
  return ContactListService;
}();

module.exports = ContactListService;

/***/ }),

/***/ "./lib/messaging/cubeDialog.js":
/*!*************************************!*\
  !*** ./lib/messaging/cubeDialog.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var DIALOGS_API_URL = Config.urls.chat + '/Dialog';

var ChatDialogsService =
/*#__PURE__*/
function () {
  function ChatDialogsService(proxy) {
    (0, _classCallCheck2["default"])(this, ChatDialogsService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(ChatDialogsService, [{
    key: "list",
    value: function list(params) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(DIALOGS_API_URL),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "create",
    value: function create(params) {
      if (params && params.occupants_ids && Utils.isArray(params.occupants_ids)) {
        params.occupants_ids = params.occupants_ids.join(', ');
      }

      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(DIALOGS_API_URL),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "update",
    value: function update(id, params) {
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(DIALOGS_API_URL, id),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "delete",
    value: function _delete(idOrIds, params) {
      var ajaxParams = {
        type: 'DELETE',
        url: Utils.getUrl(DIALOGS_API_URL, idOrIds)
      };

      if (typeof idOrIds === 'string' || Utils.isArray(idOrIds) && idOrIds.length === 1) {
        ajaxParams.dataType = 'text';
      }

      if (params) {
        ajaxParams.data = params;
      }

      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "addAdmins",
    value: function addAdmins(id, admins_ids) {
      var params = {
        push_all: {
          admins_ids: admins_ids
        }
      };
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'admins'),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "removeAdmins",
    value: function removeAdmins(id, admins_ids) {
      var params = {
        pull_all: {
          admins_ids: admins_ids
        }
      };
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'admins'),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "subscribeToPublic",
    value: function subscribeToPublic(id) {
      var ajaxParams = {
        type: 'POST',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'subscribe')
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "unsubscribeFromPublic",
    value: function unsubscribeFromPublic(id) {
      var ajaxParams = {
        type: 'DELETE',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'subscribe'),
        dataType: 'text'
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "updateNotificationsSettings",
    value: function updateNotificationsSettings(id, enabled) {
      var settings = {
        enabled: enabled ? 1 : 0
      };
      var ajaxParams = {
        type: 'PUT',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'notifications'),
        data: settings
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "getNotificationsSettings",
    value: function getNotificationsSettings(id) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'notifications')
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "getPublicOccupants",
    value: function getPublicOccupants(id, params) {
      var ajaxParams = {
        type: 'GET',
        url: Utils.getUrl(DIALOGS_API_URL, id, 'occupants'),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return ChatDialogsService;
}();

module.exports = ChatDialogsService;

/***/ }),

/***/ "./lib/messaging/cubeMessage.js":
/*!**************************************!*\
  !*** ./lib/messaging/cubeMessage.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var MESSAGES_API_URL = Config.urls.chat + '/Message';

var ChatMessagesService =
/*#__PURE__*/
function () {
  function ChatMessagesService(proxy) {
    (0, _classCallCheck2["default"])(this, ChatMessagesService);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(ChatMessagesService, [{
    key: "list",
    value: function list(params) {
      var ajaxParams = {
        url: Utils.getUrl(MESSAGES_API_URL),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "create",
    value: function create(params) {
      var ajaxParams = {
        url: Utils.getUrl(MESSAGES_API_URL),
        type: 'POST',
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "update",
    value: function update(id, params) {
      var ajaxParams = {
        type: 'PUT',
        dataType: 'text',
        url: Utils.getUrl(MESSAGES_API_URL, id),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "delete",
    value: function _delete(id, params) {
      var ajaxParams = {
        url: Utils.getUrl(MESSAGES_API_URL, id),
        type: 'DELETE',
        dataType: 'text'
      };

      if (params) {
        ajaxParams.data = params;
      }

      return this.proxy.ajax(ajaxParams);
    }
  }, {
    key: "unreadCount",
    value: function unreadCount(params) {
      if (params && params.chat_dialog_ids && Utils.isArray(params.chat_dialog_ids)) {
        params.chat_dialog_ids = params.chat_dialog_ids.join(', ');
      }

      var ajaxParams = {
        url: Utils.getUrl(MESSAGES_API_URL + '/unread'),
        data: params
      };
      return this.proxy.ajax(ajaxParams);
    }
  }]);
  return ChatMessagesService;
}();

module.exports = ChatMessagesService;

/***/ }),

/***/ "./lib/messaging/cubeMultiUserChat.js":
/*!********************************************!*\
  !*** ./lib/messaging/cubeMultiUserChat.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var ChatUtils = __webpack_require__(/*! ./cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js");

var GroupChatService =
/*#__PURE__*/
function () {
  function GroupChatService(options) {
    (0, _classCallCheck2["default"])(this, GroupChatService);
    this.helpers = options.helpers;
    this.xmppClient = options.xmppClient;
    this.stanzasCallbacks = options.stanzasCallbacks; //

    this.joinedRooms = {};
    this.xmlns = "http://jabber.org/protocol/muc";
  }

  (0, _createClass2["default"])(GroupChatService, [{
    key: "join",
    value: function join(dialogIdOrJid) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var id = ChatUtils.getUniqueId('join'),
            dialogJid = _this.helpers.getDialogJid(dialogIdOrJid),
            presenceParams = {
          id: id,
          from: _this.helpers.getUserCurrentJid(),
          to: _this.helpers.getRoomJid(dialogJid)
        };

        var presenceStanza = ChatUtils.createPresenceStanza(presenceParams);
        presenceStanza.c('x', {
          xmlns: _this.xmlns
        }).c('history', {
          maxstanzas: 0
        });

        _this.stanzasCallbacks[id] = function (stanza) {
          var from = ChatUtils.getAttr(stanza, 'from'),
              dialogId = _this.helpers.getDialogIdFromJID(from),
              x = ChatUtils.getElement(stanza, 'x'),
              xXMLNS = ChatUtils.getAttr(x, 'xmlns'),
              status = ChatUtils.getElement(x, 'status'),
              statusCode = ChatUtils.getAttr(status, 'code');

          if (status && statusCode == '110') {
            _this.joinedRooms[dialogJid] = true;
            resolve();
          } else {
            var type = ChatUtils.getAttr(stanza, 'type');

            if (type && type === 'error' && xXMLNS === _this.xmlns && id.endsWith(':join')) {
              var errorEl = ChatUtils.getElement(stanza, 'error'),
                  code = ChatUtils.getAttr(errorEl, 'code'),
                  errorMessage = ChatUtils.getElementText(errorEl, 'text');
              var errorResponse = {
                code: code || 500,
                message: errorMessage || 'Unknown issue'
              };
              reject(errorResponse);
            }
          }
        };

        _this.xmppClient.send(presenceStanza);
      });
    }
  }, {
    key: "leave",
    value: function leave(dialogIdOrJid) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var dialogJid = _this2.helpers.getDialogJid(dialogIdOrJid);

        var presenceParams = {
          type: 'unavailable',
          from: _this2.helpers.getUserCurrentJid(),
          to: _this2.helpers.getRoomJid(dialogJid)
        };
        var presenceStanza = ChatUtils.createPresenceStanza(presenceParams);
        delete _this2.joinedRooms[dialogJid];

        _this2.stanzasCallbacks['muc:leave'] = function (stanza) {
          resolve();
        };

        _this2.xmppClient.send(presenceStanza);
      });
    }
  }, {
    key: "listOnlineUsers",
    value: function listOnlineUsers(dialogIdOrJid) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var dialogJid = _this3.helpers.getDialogJid(dialogIdOrJid);

        var iqParams = {
          type: 'get',
          to: dialogJid,
          from: _this3.helpers.getUserCurrentJid(),
          id: ChatUtils.getUniqueId('muc_disco_items')
        };
        var iqStanza = ChatUtils.createIqStanza(iqParams);
        iqStanza.c('query', {
          xmlns: 'http://jabber.org/protocol/disco#items'
        });

        _this3.stanzasCallbacks[iqParams.id] = function (stanza) {
          var stanzaId = stanza.attrs.id;

          if (_this3.stanzasCallbacks[stanzaId]) {
            var items = stanza.getChild('query').getChildElements('item');
            var users = [];

            for (var i = 0, len = items.length; i < len; i++) {
              var userId = _this3.helpers.getUserIdFromRoomJid(items[i].attrs.jid);

              users.push(parseInt(userId));
            }

            resolve(users);
          }
        };

        _this3.xmppClient.send(iqStanza);
      });
    }
  }]);
  return GroupChatService;
}();

module.exports = GroupChatService;

/***/ }),

/***/ "./lib/messaging/cubePrivacyList.js":
/*!******************************************!*\
  !*** ./lib/messaging/cubePrivacyList.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var ChatUtils = __webpack_require__(/*! ./cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js"),
    Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var PrivacyListService =
/*#__PURE__*/
function () {
  function PrivacyListService(options) {
    (0, _classCallCheck2["default"])(this, PrivacyListService);
    this.helpers = options.helpers;
    this.xmppClient = options.xmppClient;
    this.stanzasCallbacks = options.stanzasCallbacks;
    this.xmlns = "jabber:iq:privacy";
  }

  (0, _createClass2["default"])(PrivacyListService, [{
    key: "create",
    value: function create(list) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var userId,
            userJid,
            userMuc,
            userAction,
            mutualBlock,
            listPrivacy = {},
            listUserId = [];

        for (var i = list.items.length - 1; i >= 0; i--) {
          var user = list.items[i];
          listPrivacy[user.user_id] = {
            action: user.action,
            mutualBlock: user.mutualBlock === true ? true : false
          };
        }

        listUserId = Object.keys(listPrivacy);
        var iqParams = {
          type: 'set',
          from: _this.helpers.getUserCurrentJid(),
          id: ChatUtils.getUniqueId('edit')
        };
        var iq = ChatUtils.createIqStanza(iqParams);
        iq.c('query', {
          xmlns: _this.xmlns
        }).c('list', {
          name: list.name
        });

        function createPrivacyItem(iq, params) {
          var list = iq.getChild('query').getChild('list');
          list.c('item', {
            type: 'jid',
            value: params.jidOrMuc,
            action: params.userAction,
            order: params.order
          }).c('message', {}).up().c('presence-in', {}).up().c('presence-out', {}).up().c('iq', {}).up().up();
          return iq;
        }

        function createPrivacyItemMutal(iq, params) {
          var list = iq.getChild('query').getChild('list');
          list.c('item', {
            type: 'jid',
            value: params.jidOrMuc,
            action: params.userAction,
            order: params.order
          }).up();
          return iq;
        }

        for (var index = 0, j = 0, len = listUserId.length; index < len; index++, j = j + 2) {
          userId = listUserId[index];
          mutualBlock = listPrivacy[userId].mutualBlock;
          userAction = listPrivacy[userId].action;
          userJid = _this.helpers.jidOrUserId(parseInt(userId, 10));
          userMuc = _this.helpers.getUserNickWithMucDomain(userId);

          if (mutualBlock && userAction === 'deny') {
            iq = createPrivacyItemMutal(iq, {
              order: j + 1,
              jidOrMuc: userJid,
              userAction: userAction
            });
            iq = createPrivacyItemMutal(iq, {
              order: j + 2,
              jidOrMuc: userMuc,
              userAction: userAction
            }).up().up();
          } else {
            iq = createPrivacyItem(iq, {
              order: j + 1,
              jidOrMuc: userJid,
              userAction: userAction
            });
            iq = createPrivacyItem(iq, {
              order: j + 2,
              jidOrMuc: userMuc,
              userAction: userAction
            });
          }
        }

        _this.stanzasCallbacks[iqParams.id] = function (stanza) {
          ChatUtils.isErrorStanza(stanza) ? reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza)) : resolve();
        };

        _this.xmppClient.send(iq);
      });
    }
  }, {
    key: "getList",
    value: function getList(name) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var items,
            userJid,
            userId,
            usersList = [],
            list = {};
        var iqParams = {
          type: 'get',
          from: _this2.helpers.getUserCurrentJid(),
          id: ChatUtils.getUniqueId('getlist')
        };
        var iq = ChatUtils.createIqStanza(iqParams);
        iq.c('query', {
          xmlns: _this2.xmlns
        }).c('list', {
          name: name
        });

        _this2.stanzasCallbacks[iqParams.id] = function (stanza) {
          var stanzaQuery = stanza.getChild('query');
          list = stanzaQuery ? stanzaQuery.getChild('list') : null;
          items = list ? list.getChildElements('item') : null;

          for (var i = 0, len = items.length; i < len; i = i + 2) {
            userJid = items[i].attrs.value;
            userId = _this2.helpers.getUserIdFromJID(userJid);
            usersList.push({
              user_id: userId,
              action: items[i].attrs.action
            });
          }

          list = {
            name: list.attrs.name,
            items: usersList
          };
          resolve(list);
          delete _this2.stanzasCallbacks[iqParams.id];
        };

        _this2.xmppClient.send(iq);
      });
    }
  }, {
    key: "update",
    value: function update(listWithUpdates) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.getList(listWithUpdates.name).then(function (existentList) {
          var updatedList = {
            items: Utils.mergeArrays(existentList.items, listWithUpdates.items),
            name: listWithUpdates.name
          };

          _this3.create(updatedList).then(function () {
            resolve();
          })["catch"](function (error) {
            reject(error);
          });
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "getNames",
    value: function getNames() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var iqParams = {
          'type': 'get',
          'from': _this4.helpers.getUserCurrentJid(),
          'id': ChatUtils.getUniqueId('getNames')
        };
        var iq = ChatUtils.createIqStanza(iqParams);
        iq.c('query', {
          xmlns: _this4.xmlns
        });

        _this4.stanzasCallbacks[iq.attrs.id] = function (stanza) {
          if (!ChatUtils.isErrorStanza(stanza)) {
            var query = stanza.getChild('query'),
                defaultList = query.getChild('default'),
                activeList = query.getChild('active'),
                allLists = query.getChildElements('list');
            var defaultName = defaultList ? defaultList.attrs.name : null,
                activeName = activeList ? activeList.attrs.name : null;
            var allNames = [];

            for (var i = 0, len = allLists.length; i < len; i++) {
              allNames.push(allLists[i].attrs.name);
            }

            var namesList = {
              "default": defaultName,
              active: activeName,
              names: allNames
            };
            resolve(namesList);
          } else {
            reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza));
          }
        };

        _this4.xmppClient.send(iq);
      });
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var iqParams = {
          from: _this5.xmppClient.jid || _this5.xmppClient.jid.user,
          type: 'set',
          id: ChatUtils.getUniqueId('remove')
        };
        var iq = ChatUtils.createIqStanza(iqParams);
        iq.c('query', {
          xmlns: _this5.xmlns
        }).c('list', {
          name: name ? name : ''
        });

        _this5.stanzasCallbacks[iq.attrs.id] = function (stanza) {
          ChatUtils.isErrorStanza(stanza) ? reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza)) : resolve();
        };

        _this5.xmppClient.send(iq);
      });
    }
  }, {
    key: "setAsDefault",
    value: function setAsDefault(name) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var iqParams = {
          from: _this6.xmppClient.jid || _this6.xmppClient.jid.user,
          type: 'set',
          id: ChatUtils.getUniqueId('default')
        };
        var iq = ChatUtils.createIqStanza(iqParams);
        iq.c('query', {
          xmlns: _this6.xmlns
        }).c('default', name && name.length > 0 ? {
          name: name
        } : {});

        _this6.stanzasCallbacks[iq.attrs.id] = function (stanza) {
          ChatUtils.isErrorStanza(stanza) ? reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza)) : resolve();
        };

        _this6.xmppClient.send(iq);
      });
    }
  }]);
  return PrivacyListService;
}();

module.exports = PrivacyListService;

/***/ }),

/***/ "./lib/messaging/cubeStreamManagement.js":
/*!***********************************************!*\
  !*** ./lib/messaging/cubeStreamManagement.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js"),
    ChatUtils = __webpack_require__(/*! ./cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js");

var StreamManagementService =
/*#__PURE__*/
function () {
  function StreamManagementService() {
    (0, _classCallCheck2["default"])(this, StreamManagementService);
    this._NS = 'urn:xmpp:sm:3';
    this._isStreamManagementEnabled = false; // Counter of the incoming stanzas

    this._clientProcessedStanzasCounter = 0; // The client send stanza counter.

    this._clientSentStanzasCounter = 0;
    this.sentMessageCallback = null;
    this._lastAck = 0; // connection

    this._xmppClient = null; // Original connection.send method

    this._originalSend = null; // In progress stanzas queue

    this._unackedQueue = [];
  }

  (0, _createClass2["default"])(StreamManagementService, [{
    key: "enable",
    value: function enable(connection) {
      var enableParams = {
        xmlns: this._NS
      };

      if (!this._isStreamManagementEnabled) {
        this._xmppClient = connection;
        this._originalSend = this._xmppClient.send;
        this._xmppClient.send = this.send.bind(this);
      }

      this._clientProcessedStanzasCounter = 0;
      this._clientSentStanzasCounter = 0;
      this._lastAck = 0;

      this._addEnableHandlers();

      var stanza = ChatUtils.createNonza('enable', enableParams);

      this._xmppClient.send(stanza);
    }
  }, {
    key: "_addEnableHandlers",
    value: function _addEnableHandlers() {
      this._xmppClient.on('element', _incomingStanzaHandler.bind(this));

      function _incomingStanzaHandler(stanza) {
        var tagName = stanza.name || stanza.tagName || stanza.nodeTree.tagName;

        if (tagName === 'enabled') {
          this._isStreamManagementEnabled = true;
          return;
        }

        if (ChatUtils.getAttr(stanza, 'xmlns') !== this._NS) {
          this._increaseReceivedStanzasCounter();
        }

        if (tagName === 'r') {
          var params = {
            xmlns: this._NS,
            h: this._clientProcessedStanzasCounter
          },
              answerStanza = ChatUtils.createNonza('a', params);

          this._originalSend.call(this._xmppClient, answerStanza);

          return;
        }

        if (tagName === 'a') {
          var h = parseInt(ChatUtils.getAttr(stanza, 'h'));

          this._checkCounterOnIncomeStanza(h);
        }
      }
    }
  }, {
    key: "send",
    value: function send(stanza, message) {
      var tagName = stanza.name || stanza.tagName || stanza.nodeTree.tagName,
          type = ChatUtils.getAttr(stanza, 'type'),
          bodyContent = ChatUtils.getElementText(stanza, 'body') || '',
          attachments = ChatUtils.getAllElements(stanza, 'attachment') || '';

      this._originalSend.call(this._xmppClient, stanza);

      if (tagName === 'message' && (type === 'chat' || type === 'groupchat') && (bodyContent || attachments.length)) {
        this._sendStanzasRequest({
          message: message,
          expect: this._clientSentStanzasCounter
        });
      }

      ++this._clientSentStanzasCounter;
    }
  }, {
    key: "_sendStanzasRequest",
    value: function _sendStanzasRequest(data) {
      if (this._isStreamManagementEnabled) {
        this._unackedQueue.push(data);

        var stanza = ChatUtils.createNonza('r', {
          xmlns: this._NS
        });

        this._originalSend.call(this._xmppClient, stanza);
      }
    }
  }, {
    key: "getClientSentStanzasCounter",
    value: function getClientSentStanzasCounter() {
      return this._clientSentStanzasCounter;
    }
  }, {
    key: "_checkCounterOnIncomeStanza",
    value: function _checkCounterOnIncomeStanza(h) {
      var numAcked = h - this._lastAck;
      Utils.DLog('[Chat][SM][_checkCounterOnIncomeStanza]', numAcked, h, this._lastAck);

      for (var i = 0; i < numAcked && this._unackedQueue.length > 0; i++) {
        this.sentMessageCallback(null, this._unackedQueue.shift().message);
      }

      this._lastAck = h;
    }
  }, {
    key: "_increaseReceivedStanzasCounter",
    value: function _increaseReceivedStanzasCounter() {
      ++this._clientProcessedStanzasCounter;
    }
  }]);
  return StreamManagementService;
}();

module.exports = StreamManagementService;

/***/ }),

/***/ "./lib/videocalling/cubeRTCPeerConnection.js":
/*!***************************************************!*\
  !*** ./lib/videocalling/cubeRTCPeerConnection.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var Helpers = __webpack_require__(/*! ./cubeWebRTCHelpers */ "./lib/videocalling/cubeWebRTCHelpers.js");

var SessionConnectionState = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").SessionConnectionState;

var RTCPeerConnection = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").RTCPeerConnection;

var RTCSessionDescription = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").RTCSessionDescription;

var RTCIceCandidate = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").RTCIceCandidate;

var MediaStream = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").MediaStream;

var PeerConnectionState = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").PeerConnectionState;

RTCPeerConnection.prototype._init = function (delegate, userID, sessionID, type) {
  Helpers.trace('RTCPeerConnection init. userID: ' + userID + ', sessionID: ' + sessionID + ', type: ' + type);
  this.delegate = delegate;
  this.sessionID = sessionID;
  this.userID = userID;
  this.type = type;
  this.remoteSDP = null;
  this.state = PeerConnectionState.NEW;
  this.onicecandidate = this.onIceCandidateCallback.bind(this);
  this.onsignalingstatechange = this.onSignalingStateCallback.bind(this);
  this.oniceconnectionstatechange = this.onIceConnectionStateCallback.bind(this);

  if (Helpers.getVersionSafari() >= 11) {
    this.remoteStream = new MediaStream();
    this.ontrack = this.onAddRemoteMediaCallback.bind(this);
    this.onStatusClosedChecker = undefined;
  } else {
    this.remoteStream = null;
    this.onaddstream = this.onAddRemoteMediaCallback.bind(this);
  }
  /** We use this timer interval to dial a user - produce the call requests each N seconds. */


  this.dialingTimer = null;
  this.answerTimeInterval = 0;
  this.statsReportTimer = null;
  this.iceCandidates = [];
  this.released = false;
};

RTCPeerConnection.prototype.release = function () {
  this._clearDialingTimer();

  this._clearStatsReportTimer();

  this.close(); // TODO: 'closed' state doesn't fires on Safari 11 (do it manually)

  if (Helpers.getVersionSafari() >= 11) {
    this.onIceConnectionStateCallback();
  }

  this.released = true;
};

RTCPeerConnection.prototype.updateRemoteSDP = function (newSDP) {
  if (!newSDP) {
    throw new Error("sdp string can't be empty.");
  } else {
    this.remoteSDP = newSDP;
  }
};

RTCPeerConnection.prototype.getRemoteSDP = function () {
  return this.remoteSDP;
};

RTCPeerConnection.prototype.setRemoteSessionDescription = function (type, remoteSessionDescription) {
  var desc = new RTCSessionDescription({
    sdp: remoteSessionDescription,
    type: type
  });
  desc.sdp = setMediaBitrate(desc.sdp, 'video', this.delegate.bandwidth);
  return this.setRemoteDescription(desc);
};

RTCPeerConnection.prototype.addLocalStream = function (localStream) {
  if (localStream) {
    this.addStream(localStream);
  } else {
    throw new Error("'RTCPeerConnection.addStream' error: stream is 'null'.");
  }
};

RTCPeerConnection.prototype.getAndSetLocalSessionDescription = function (callType) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    _this.state = PeerConnectionState.CONNECTING;

    if (_this.type === 'offer') {
      _this.createOffer().then(function (offer) {
        offer.sdp = setMediaBitrate(offer.sdp, 'video', _this.delegate.bandwidth);

        _this.setLocalDescription(offer).then(resolve)["catch"](reject);
      })["catch"](reject);
    } else {
      _this.createAnswer().then(function (answer) {
        answer.sdp = setMediaBitrate(answer.sdp, 'video', _this.delegate.bandwidth);

        _this.setLocalDescription(answer).then(resolve)["catch"](reject);
      })["catch"](reject);
    }
  });
};

RTCPeerConnection.prototype.addCandidates = function (iceCandidates) {
  for (var i = 0, len = iceCandidates.length; i < len; i++) {
    var candidate = {
      sdpMLineIndex: iceCandidates[i].sdpMLineIndex,
      sdpMid: iceCandidates[i].sdpMid,
      candidate: iceCandidates[i].candidate
    };
    this.addIceCandidate(new RTCIceCandidate(candidate), function () {}, function (error) {
      Helpers.traceError("Error on 'addIceCandidate': " + error);
    });
  }
};

RTCPeerConnection.prototype.toString = function () {
  return 'sessionID: ' + this.sessionID + ', userID:  ' + this.userID + ', type: ' + this.type + ', state: ' + this.state;
}; /// CALLBACKS


RTCPeerConnection.prototype.onSignalingStateCallback = function () {
  Helpers.trace("onSignalingStateCallback: " + this.signalingState);

  if (this.signalingState === 'stable' && this.iceCandidates.length > 0) {
    this.delegate._processIceCandidates(this, this.iceCandidates);

    this.iceCandidates.length = 0;
  }
};

RTCPeerConnection.prototype.onIceCandidateCallback = function (event) {
  var candidate = event.candidate;

  if (candidate) {
    var iceCandidateData = {
      sdpMLineIndex: candidate.sdpMLineIndex,
      sdpMid: candidate.sdpMid,
      candidate: candidate.candidate
    };

    if (this.signalingState === 'stable') {
      this.delegate._processIceCandidates(this, [iceCandidateData]);
    } else {
      this.iceCandidates.push(iceCandidateData);
    }
  }
};
/** handler of remote media stream */


RTCPeerConnection.prototype.onAddRemoteMediaCallback = function (event) {
  if (typeof this.delegate._onRemoteStreamListener === 'function') {
    if (event.type === 'addstream') {
      this.remoteStream = event.stream;
    } else {
      this.remoteStream.addTrack(event.track);
    }

    if (this.delegate.callType == 1 && this.remoteStream.getVideoTracks().length || this.delegate.callType == 2 && this.remoteStream.getAudioTracks().length) {
      this.delegate._onRemoteStreamListener(this.userID, this.remoteStream);
    }

    this._getStatsWrap();
  }
};

RTCPeerConnection.prototype.onIceConnectionStateCallback = function () {
  var _this2 = this;

  Helpers.trace("onIceConnectionStateCallback: " + this.iceConnectionState);

  if (typeof this.delegate._onSessionConnectionStateChangedListener === 'function') {
    var conState = null;

    if (Helpers.getVersionSafari() >= 11) {
      clearTimeout(this.onStatusClosedChecker);
    }

    switch (this.iceConnectionState) {
      case 'checking':
        this.state = PeerConnectionState.CHECKING;
        conState = SessionConnectionState.CONNECTING;
        break;

      case 'connected':
        this._clearWaitingReconnectTimer();

        this.state = PeerConnectionState.CONNECTED;
        conState = SessionConnectionState.CONNECTED;
        break;

      case 'completed':
        this._clearWaitingReconnectTimer();

        this.state = PeerConnectionState.COMPLETED;
        conState = SessionConnectionState.COMPLETED;
        break;

      case 'failed':
        this.state = PeerConnectionState.FAILED;
        conState = SessionConnectionState.FAILED;
        break;

      case 'disconnected':
        this._startWaitingReconnectTimer();

        this.state = PeerConnectionState.DISCONNECTED;
        conState = SessionConnectionState.DISCONNECTED; // repeat to call onIceConnectionStateCallback to get status "closed"

        if (Helpers.getVersionSafari() >= 11) {
          this.onStatusClosedChecker = setTimeout(function () {
            _this2.onIceConnectionStateCallback();
          }, 500);
        }

        break;
      // TODO: this state doesn't fires on Safari 11

      case 'closed':
        this._clearWaitingReconnectTimer();

        this.state = PeerConnectionState.CLOSED;
        conState = SessionConnectionState.CLOSED;
        break;

      default:
        break;
    }

    if (conState) {
      this.delegate._onSessionConnectionStateChangedListener(this.userID, conState);
    }
  }
}; /// PRIVATE


RTCPeerConnection.prototype._clearStatsReportTimer = function () {
  if (this.statsReportTimer) {
    clearInterval(this.statsReportTimer);
    this.statsReportTimer = null;
  }
};

RTCPeerConnection.prototype._getStatsWrap = function () {
  var _this3 = this;

  var statsReportInterval;
  var lastResult;

  if (config.videochat && config.videochat.statsReportTimeInterval) {
    if (isNaN(+config.videochat.statsReportTimeInterval)) {
      Helpers.traceError('statsReportTimeInterval (' + config.videochat.statsReportTimeInterval + ') must be integer.');
      return;
    }

    statsReportInterval = config.videochat.statsReportTimeInterval * 1000;

    var _statsReportCallback = function _statsReportCallback() {
      _getStats(_this3, lastResult, function (results, lastResults) {
        lastResult = lastResults;

        _this3.delegate._onCallStatsReport(_this3.userID, results, null);
      }, function (err) {
        Helpers.traceError('_getStats error. ' + err.name + ': ' + err.message);

        _this3.delegate._onCallStatsReport(_this3.userID, null, err);
      });
    };

    Helpers.trace('Stats tracker has been started.');
    this.statsReportTimer = setInterval(_statsReportCallback, statsReportInterval);
  }
};

RTCPeerConnection.prototype._clearWaitingReconnectTimer = function () {
  if (this.waitingReconnectTimeoutCallback) {
    Helpers.trace('_clearWaitingReconnectTimer');
    clearTimeout(this.waitingReconnectTimeoutCallback);
    this.waitingReconnectTimeoutCallback = null;
  }
};

RTCPeerConnection.prototype._startWaitingReconnectTimer = function () {
  var _this4 = this;

  var timeout = config.videochat.disconnectTimeInterval * 1000;

  var waitingReconnectTimeoutCallback = function waitingReconnectTimeoutCallback() {
    Helpers.trace('waitingReconnectTimeoutCallback');
    clearTimeout(_this4.waitingReconnectTimeoutCallback);

    _this4.release();

    _this4.delegate._closeSessionIfAllConnectionsClosed();
  };

  Helpers.trace('_startWaitingReconnectTimer, timeout: ' + timeout);
  this.waitingReconnectTimeoutCallback = setTimeout(waitingReconnectTimeoutCallback, timeout);
};

RTCPeerConnection.prototype._clearDialingTimer = function () {
  if (this.dialingTimer) {
    Helpers.trace('_clearDialingTimer');
    clearInterval(this.dialingTimer);
    this.dialingTimer = null;
    this.answerTimeInterval = 0;
  }
};

RTCPeerConnection.prototype._startDialingTimer = function (extension, withOnNotAnswerCallback) {
  var _this5 = this;

  var dialingTimeInterval = config.videochat.dialingTimeInterval * 1000;
  Helpers.trace('_startDialingTimer, dialingTimeInterval: ' + dialingTimeInterval);

  var _dialingCallback = function _dialingCallback(extension, withOnNotAnswerCallback, skipIncrement) {
    if (!skipIncrement) {
      _this5.answerTimeInterval += config.videochat.dialingTimeInterval * 1000;
    }

    Helpers.trace('_dialingCallback, answerTimeInterval: ' + _this5.answerTimeInterval);

    if (_this5.answerTimeInterval >= config.videochat.answerTimeInterval * 1000) {
      _this5._clearDialingTimer();

      if (withOnNotAnswerCallback) {
        _this5.delegate._processOnNotAnswer(_this5);
      }
    } else {
      _this5.delegate._processCall(_this5, extension);
    }
  };

  this.dialingTimer = setInterval(_dialingCallback, dialingTimeInterval, extension, withOnNotAnswerCallback, false); // call for the 1st time

  _dialingCallback(extension, withOnNotAnswerCallback, true);
};
/**
 * PRIVATE
 */


function _getStats(peer, lastResults, successCallback, errorCallback) {
  var statistic = {
    'local': {
      'audio': {},
      'video': {},
      'candidate': {}
    },
    'remote': {
      'audio': {},
      'video': {},
      'candidate': {}
    }
  };

  if (Helpers.getVersionFirefox()) {
    var localStream = peer.getLocalStreams().length ? peer.getLocalStreams()[0] : peer.delegate.localStream,
        localVideoSettings = localStream.getVideoTracks().length ? localStream.getVideoTracks()[0].getSettings() : null;
    statistic.local.video.frameHeight = localVideoSettings && localVideoSettings.height;
    statistic.local.video.frameWidth = localVideoSettings && localVideoSettings.width;
  }

  peer.getStats(null).then(function (results) {
    results.forEach(function (result) {
      var item;

      if (result.bytesReceived && result.type === 'inbound-rtp') {
        item = statistic.remote[result.mediaType];
        item.bitrate = _getBitratePerSecond(result, lastResults, false);
        item.bytesReceived = result.bytesReceived;
        item.packetsReceived = result.packetsReceived;
        item.timestamp = result.timestamp;

        if (result.mediaType === 'video' && result.framerateMean) {
          item.framesPerSecond = Math.round(result.framerateMean * 10) / 10;
        }
      } else if (result.bytesSent && result.type === 'outbound-rtp') {
        item = statistic.local[result.mediaType];
        item.bitrate = _getBitratePerSecond(result, lastResults, true);
        item.bytesSent = result.bytesSent;
        item.packetsSent = result.packetsSent;
        item.timestamp = result.timestamp;

        if (result.mediaType === 'video' && result.framerateMean) {
          item.framesPerSecond = Math.round(result.framerateMean * 10) / 10;
        }
      } else if (result.type === 'local-candidate') {
        item = statistic.local.candidate;

        if (result.candidateType === 'host' && result.mozLocalTransport === 'udp' && result.transport === 'udp') {
          item.protocol = result.transport;
          item.ip = result.ipAddress;
          item.port = result.portNumber;
        } else if (!Helpers.getVersionFirefox()) {
          item.protocol = result.protocol;
          item.ip = result.ip;
          item.port = result.port;
        }
      } else if (result.type === 'remote-candidate') {
        item = statistic.remote.candidate;
        item.protocol = result.protocol || result.transport;
        item.ip = result.ip || result.ipAddress;
        item.port = result.port || result.portNumber;
      } else if (result.type === 'track' && result.kind === 'video' && !Helpers.getVersionFirefox()) {
        if (result.remoteSource) {
          item = statistic.remote.video;
          item.frameHeight = result.frameHeight;
          item.frameWidth = result.frameWidth;
          item.framesPerSecond = _getFramesPerSecond(result, lastResults, false);
        } else {
          item = statistic.local.video;
          item.frameHeight = result.frameHeight;
          item.frameWidth = result.frameWidth;
          item.framesPerSecond = _getFramesPerSecond(result, lastResults, true);
        }
      }
    });
    successCallback(statistic, results);
  }, errorCallback);

  var _getBitratePerSecond = function _getBitratePerSecond(result, lastResults, isLocal) {
    var lastResult = lastResults && lastResults.get(result.id),
        seconds = lastResult ? (result.timestamp - lastResult.timestamp) / 1000 : 5,
        kilo = 1024,
        bit = 8,
        bitrate;

    if (!lastResult) {
      bitrate = 0;
    } else if (isLocal) {
      bitrate = bit * (result.bytesSent - lastResult.bytesSent) / (kilo * seconds);
    } else {
      bitrate = bit * (result.bytesReceived - lastResult.bytesReceived) / (kilo * seconds);
    }

    return Math.round(bitrate);
  };

  var _getFramesPerSecond = function _getFramesPerSecond(result, lastResults, isLocal) {
    var lastResult = lastResults && lastResults.get(result.id),
        seconds = lastResult ? (result.timestamp - lastResult.timestamp) / 1000 : 5,
        framesPerSecond;

    if (!lastResult) {
      framesPerSecond = 0;
    } else if (isLocal) {
      framesPerSecond = (result.framesSent - lastResult.framesSent) / seconds;
    } else {
      framesPerSecond = (result.framesReceived - lastResult.framesReceived) / seconds;
    }

    return Math.round(framesPerSecond * 10) / 10;
  };
}

function setMediaBitrate(sdp, media, bitrate) {
  if (!bitrate) {
    return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '');
  }

  var lines = sdp.split('\n'),
      line = -1,
      modifier = Helpers.getVersionFirefox() ? 'TIAS' : 'AS',
      amount = Helpers.getVersionFirefox() ? bitrate * 1024 : bitrate;

  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("m=" + media) === 0) {
      line = i;
      break;
    }
  }

  if (line === -1) {
    return sdp;
  }

  line++;

  while (lines[line].indexOf('i=') === 0 || lines[line].indexOf('c=') === 0) {
    line++;
  }

  if (lines[line].indexOf('b') === 0) {
    lines[line] = 'b=' + modifier + ':' + amount;
    return lines.join('\n');
  }

  var newLines = lines.slice(0, line);
  newLines.push('b=' + modifier + ':' + amount);
  newLines = newLines.concat(lines.slice(line, lines.length));
  return newLines.join('\n');
}

module.exports = RTCPeerConnection;

/***/ }),

/***/ "./lib/videocalling/cubeWebRTCClient.js":
/*!**********************************************!*\
  !*** ./lib/videocalling/cubeWebRTCClient.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var WebRTCSession = __webpack_require__(/*! ./cubeWebRTCSession */ "./lib/videocalling/cubeWebRTCSession.js");

var WebRTCSignalingProcessor = __webpack_require__(/*! ./cubeWebRTCSignalingProcessor */ "./lib/videocalling/cubeWebRTCSignalingProcessor.js");

var WebRTCSignalingProvider = __webpack_require__(/*! ./cubeWebRTCSignalingProvider */ "./lib/videocalling/cubeWebRTCSignalingProvider.js");

var Helpers = __webpack_require__(/*! ./cubeWebRTCHelpers */ "./lib/videocalling/cubeWebRTCHelpers.js");

var RTCPeerConnection = __webpack_require__(/*! ./cubeRTCPeerConnection */ "./lib/videocalling/cubeRTCPeerConnection.js");

var cubeWebRTCConstants = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js");

var SignalingConstants = cubeWebRTCConstants.SignalingConstants;

var SessionState = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").SessionState;

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var mediaDevices = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").mediaDevices;

var WebRTCClient =
/*#__PURE__*/
function () {
  function WebRTCClient(connection) {
    (0, _classCallCheck2["default"])(this, WebRTCClient);
    this.connection = connection;
    this.signalingProcessor = new WebRTCSignalingProcessor(this);
    this.signalingProvider = new WebRTCSignalingProvider(connection);
    this.SessionConnectionState = cubeWebRTCConstants.SessionConnectionState;
    this.PeerConnectionState = cubeWebRTCConstants.PeerConnectionState;
    this.CallType = cubeWebRTCConstants.CallType;
    this.sessions = {};

    if (mediaDevices) {
      mediaDevices.ondevicechange = this._onDevicesChangeListener.bind(this);
    }
  }

  (0, _createClass2["default"])(WebRTCClient, [{
    key: "getMediaDevices",
    value: function getMediaDevices(spec) {
      var specDevices = [];
      return new Promise(function (resolve, reject) {
        if (!mediaDevices || !mediaDevices.enumerateDevices) {
          reject("No 'enumerateDevices' API supported");
        } else {
          mediaDevices.enumerateDevices().then(function (devices) {
            if (spec) {
              devices.forEach(function (device, i) {
                if (device.kind === spec) {
                  specDevices.push(device);
                }
              });
              resolve(specDevices);
            } else {
              resolve(devices);
            }
          });
        }
      });
    }
  }, {
    key: "createNewSession",
    value: function createNewSession(opponentsIDs, callType, opts) {
      var callerID = Helpers.getUserIdFromJID(Helpers.userCurrentJid(this.connection));
      var bandwidth = opts && opts.bandwidth && !isNaN(opts.bandwidth) ? +opts.bandwidth : 0;

      if (!opponentsIDs) {
        throw new Error('Can\'t create a session without opponentsIDs.');
      }

      return this._createAndStoreSession(null, callerID, opponentsIDs, callType, bandwidth);
    }
  }, {
    key: "_createAndStoreSession",
    value: function _createAndStoreSession(sessionID, initiatorID, opIDs, callType, bandwidth) {
      var newSession = new WebRTCSession({
        sessionID: sessionID,
        initiatorID: initiatorID,
        opIDs: opIDs,
        callType: callType,
        signalingProvider: this.signalingProvider,
        currentUserID: Helpers.getUserIdFromJID(Helpers.userCurrentJid(this.connection)),
        bandwidth: bandwidth
      });
      newSession.onUserNotAnswerListener = this.onUserNotAnswerListener;
      newSession.onRemoteStreamListener = this.onRemoteStreamListener;
      newSession.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener;
      newSession.onSessionCloseListener = this.onSessionCloseListener;
      newSession.onCallStatsReport = this.onCallStatsReport;
      this.sessions[newSession.ID] = newSession;
      return newSession;
    }
  }, {
    key: "clearSession",
    value: function clearSession(sessionId) {
      delete this.sessions[sessionId];
    } /// DELEGATE (signaling)

  }, {
    key: "_onCallListener",
    value: function _onCallListener(userID, sessionID, extension) {
      var userInfo = extension.userInfo || {};
      Helpers.trace("onCall. UserID:" + userID + ". SessionID: " + sessionID + ". extension: ", userInfo);
      var session = this.sessions[sessionID];
      var bandwidth = +userInfo.bandwidth || 0;

      if (!session) {
        session = this._createAndStoreSession(sessionID, extension.callerID, extension.opponentsIDs, extension.callType, bandwidth);

        session._processOnCall(userID, extension);

        Utils.safeCallbackCall(this.onCallListener, session, userInfo);
      } else {
        session._processOnCall(userID, extension);
      }
    }
  }, {
    key: "_onAcceptListener",
    value: function _onAcceptListener(userID, sessionID, extension) {
      var session = this.sessions[sessionID];
      var userInfo = extension.userInfo || {};
      Helpers.trace("onAccept. UserID:" + userID + ". SessionID: " + sessionID);

      if (session && (session.state === SessionState.ACTIVE || session.state === SessionState.NEW)) {
        Utils.safeCallbackCall(this.onAcceptCallListener, session, userID, userInfo);

        session._processOnAccept(userID, extension);
      } else {
        Helpers.traceWarning("Ignore 'onAccept', there is no information about session " + sessionID);
      }
    }
  }, {
    key: "_onRejectListener",
    value: function _onRejectListener(userID, sessionID, extension) {
      var session = this.sessions[sessionID];
      Helpers.trace("onReject. UserID:" + userID + ". SessionID: " + sessionID);

      if (session) {
        var userInfo = extension.userInfo || {};
        Utils.safeCallbackCall(this.onRejectCallListener, session, userID, userInfo);

        session._processOnReject(userID, extension);
      } else {
        Helpers.traceWarning("Ignore 'onReject', there is no information about session " + sessionID);
      }
    }
  }, {
    key: "_onStopListener",
    value: function _onStopListener(userID, sessionID, extension) {
      Helpers.trace("onStop. UserID:" + userID + ". SessionID: " + sessionID);
      var session = this.sessions[sessionID];
      var userInfo = extension.userInfo || {};

      if (session && (session.state === SessionState.ACTIVE || session.state === SessionState.NEW)) {
        session._processOnStop(userID, extension);

        Utils.safeCallbackCall(this.onStopCallListener, session, userID, userInfo);
      } else {
        Utils.safeCallbackCall(this.onInvalidEventsListener, 'onStop', session, userID, userInfo);
        Helpers.traceWarning("Ignore 'onStop', there is no information about session " + sessionID + " by some reason.");
      }
    }
  }, {
    key: "_onIceCandidatesListener",
    value: function _onIceCandidatesListener(userID, sessionID, extension) {
      var session = this.sessions[sessionID];
      Helpers.trace("onIceCandidates. UserID:" + userID + ". SessionID: " + sessionID + ". ICE candidates count: " + extension.iceCandidates.length);

      if (session) {
        if (session.state === SessionState.ACTIVE) {
          session._processOnIceCandidates(userID, extension);
        } else {
          Helpers.traceWarning('Ignore \'OnIceCandidates\', the session ( ' + sessionID + ' ) has invalid state.');
        }
      } else {
        Helpers.traceWarning("Ignore 'OnIceCandidates', there is no information about session " + sessionID);
      }
    }
  }, {
    key: "_onDevicesChangeListener",
    value: function _onDevicesChangeListener() {
      Utils.safeCallbackCall(this.onDevicesChangeListener);
    }
  }]);
  return WebRTCClient;
}();

module.exports = WebRTCClient;

/***/ }),

/***/ "./lib/videocalling/cubeWebRTCConstants.js":
/*!*************************************************!*\
  !*** ./lib/videocalling/cubeWebRTCConstants.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  SignalingConstants: {
    MODULE_ID: "WebRTCVideoChat",
    SignalingType: {
      CALL: 'call',
      ACCEPT: 'accept',
      REJECT: 'reject',
      STOP: 'hangUp',
      CANDIDATE: 'iceCandidates'
    }
  },
  SessionConnectionState: {
    UNDEFINED: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    FAILED: 3,
    DISCONNECTED: 4,
    CLOSED: 5,
    COMPLETED: 6
  },
  SessionState: {
    NEW: 1,
    ACTIVE: 2,
    HUNGUP: 3,
    REJECTED: 4,
    CLOSED: 5
  },
  PeerConnectionState: {
    NEW: 1,
    CONNECTING: 2,
    CHECKING: 3,
    CONNECTED: 4,
    DISCONNECTED: 5,
    FAILED: 6,
    CLOSED: 7,
    COMPLETED: 8
  },
  CallType: {
    VIDEO: 1,
    AUDIO: 2
  }
};

/***/ }),

/***/ "./lib/videocalling/cubeWebRTCHelpers.js":
/*!***********************************************!*\
  !*** ./lib/videocalling/cubeWebRTCHelpers.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var WebRTCHelpers =
/*#__PURE__*/
function () {
  function WebRTCHelpers() {
    (0, _classCallCheck2["default"])(this, WebRTCHelpers);
  }

  (0, _createClass2["default"])(WebRTCHelpers, null, [{
    key: "getUserJid",
    value: function getUserJid(id, appId) {
      return id + '-' + appId + '@' + config.endpoints.chat;
    }
  }, {
    key: "getUserIdFromJID",
    value: function getUserIdFromJID(jid) {
      if (jid.indexOf('@') < 0) return null;
      return parseInt(jid.split('@')[0].split('-')[0]);
    }
  }, {
    key: "userCurrentJid",
    value: function userCurrentJid(client) {
      return client.jid._local + '@' + client.jid._domain + '/' + client.jid._resource;
    }
  }, {
    key: "trace",
    value: function trace(text) {
      if (config.debug) {
        console.log('[VideoChat]:', text);
      }
    }
  }, {
    key: "traceWarning",
    value: function traceWarning(text) {
      if (config.debug) {
        console.warn('[VideoChat]:', text);
      }
    }
  }, {
    key: "traceError",
    value: function traceError(text) {
      if (config.debug) {
        console.error('[VideoChat]:', text);
      }
    }
  }, {
    key: "getVersionFirefox",
    value: function getVersionFirefox() {
      var ua = navigator ? navigator.userAgent : false;
      var version;

      if (ua) {
        var ffInfo = ua.match(/(?:firefox)[ \/](\d+)/i) || [];
        version = ffInfo[1] ? +ffInfo[1] : null;
      }

      return version;
    }
  }, {
    key: "getVersionSafari",
    value: function getVersionSafari() {
      var ua = navigator ? navigator.userAgent : false;
      var version;

      if (ua) {
        var sInfo = ua.match(/(?:safari)[ \/](\d+)/i) || [];

        if (sInfo.length) {
          var sVer = ua.match(/(?:version)[ \/](\d+)/i) || [];

          if (sVer) {
            version = sVer[1] ? +sVer[1] : null;
          } else {
            version = null;
          }
        } else {
          version = null;
        }
      }

      return version;
    }
  }]);
  return WebRTCHelpers;
}();

;
module.exports = WebRTCHelpers;

/***/ }),

/***/ "./lib/videocalling/cubeWebRTCSession.js":
/*!***********************************************!*\
  !*** ./lib/videocalling/cubeWebRTCSession.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var RTCPeerConnection = __webpack_require__(/*! ./cubeRTCPeerConnection */ "./lib/videocalling/cubeRTCPeerConnection.js");

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var Helpers = __webpack_require__(/*! ./cubeWebRTCHelpers */ "./lib/videocalling/cubeWebRTCHelpers.js");

var SignalingConstants = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").SignalingConstants;

var SessionState = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").SessionState;

var PeerConnectionState = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").PeerConnectionState;

var MediaDevicesImpl = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").mediaDevices;

var WebRTCSession =
/*#__PURE__*/
function () {
  function WebRTCSession(params) {
    (0, _classCallCheck2["default"])(this, WebRTCSession);
    this.ID = params.sessionID ? params.sessionID : generateUUID();
    this.state = SessionState.NEW;
    this.initiatorID = parseInt(params.initiatorID);
    this.opponentsIDs = params.opIDs;
    this.callType = parseInt(params.callType);
    this.peerConnections = {};
    this.localStream = null;
    this.mediaParams = null;
    this.signalingProvider = params.signalingProvider;
    this.currentUserID = params.currentUserID;
    this.bandwidth = params.bandwidth;
    this.answerTimer = null;
    this.startCallTime = 0;
    this.acceptCallTime = 0;
  }

  (0, _createClass2["default"])(WebRTCSession, [{
    key: "getDisplayMedia",
    value: function getDisplayMedia(params) {
      var _this = this;

      var isUpdateCurrentStream = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!MediaDevicesImpl.getDisplayMedia) {
        throw new Error("Your browser/environment does not support 'getDisplayMedia' API");
      }

      if (isUpdateCurrentStream) {
        this.stopLocalStreamTracks(true);
      }

      return new Promise(function (resolve, reject) {
        MediaDevicesImpl.getDisplayMedia(params).then(function (stream) {
          _this.updateStream(stream, params, isUpdateCurrentStream);

          resolve(stream);
        })["catch"](reject);
      });
    }
  }, {
    key: "getUserMedia",
    value: function getUserMedia(params) {
      var _this2 = this;

      var isUpdateCurrentStream = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (isUpdateCurrentStream) {
        this.stopLocalStreamTracks();
      }

      return new Promise(function (resolve, reject) {
        MediaDevicesImpl.getUserMedia(params).then(function (stream) {
          _this2.updateStream(stream, params, isUpdateCurrentStream);

          resolve(stream);
        })["catch"](reject);
      });
    }
  }, {
    key: "updateStream",
    value: function updateStream(stream, params, isUpdateCurrentStream) {
      var _this3 = this;

      this.mediaParams = params;
      var newStreamTracks = stream.getTracks();

      if (isUpdateCurrentStream) {
        newStreamTracks.forEach(function (track) {
          _this3.localStream.addTrack(track);
        });

        this._replaceTracks(stream);
      } else {
        this.localStream = stream;
      }

      if (params.elementId) {
        this.attachMediaStream(params.elementId, stream, params.options);
      }
    }
  }, {
    key: "_replaceTracks",
    value: function _replaceTracks(stream) {
      var peers = this.peerConnections;
      var elementId = this.mediaParams.elementId;
      var ops = this.mediaParams.options;
      var newStreamTracks = stream.getTracks();

      if (!Utils.getEnv().reactnative) {
        this.detachMediaStream(elementId);
      }

      if (!Utils.getEnv().reactnative) {
        this.attachMediaStream(elementId, stream, ops);
      }

      if (!Utils.getEnv().reactnative) {
        for (var userId in peers) {
          var peer = peers[userId];
          peer.getSenders().map(function (sender) {
            var track = newStreamTracks.find(function (track) {
              return track.kind === sender.track.kind;
            });

            if (!track) {
              return;
            }

            sender.replaceTrack(track);
          });
        }
      }
    }
  }, {
    key: "stopLocalStreamTracks",
    value: function stopLocalStreamTracks() {
      var isIgnoreAudioTrack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.localStream.getTracks().forEach(function (track) {
        if (isIgnoreAudioTrack && track.kind === 'audio') {
          return;
        } else {
          track.stop();
        }
      });
    }
  }, {
    key: "connectionStateForUser",
    value: function connectionStateForUser(userID) {
      var peerConnection = this.peerConnections[userID];

      if (peerConnection) {
        return peerConnection.state;
      }

      return null;
    }
  }, {
    key: "attachMediaStream",
    value: function attachMediaStream(id, stream, options) {
      var elem = document.getElementById(id);

      if (elem) {
        if ((0, _typeof2["default"])(elem.srcObject) === 'object') {
          elem.srcObject = stream;
        } else {
          elem.src = window.URL.createObjectURL(stream);
        }

        if (options && options.muted) {
          elem.muted = true;
        }

        if (options && options.mirror) {
          elem.style.webkitTransform = 'scaleX(-1)';
          elem.style.transform = 'scaleX(-1)';
        }

        elem.onloadedmetadata = function (e) {
          elem.play();
        };
      } else {
        throw new Error('Unable to attach media stream, element ' + id + ' is undefined');
      }
    }
  }, {
    key: "detachMediaStream",
    value: function detachMediaStream(id) {
      var elem = document.getElementById(id);

      if (elem) {
        elem.pause();

        if ((0, _typeof2["default"])(elem.srcObject) === 'object') {
          elem.srcObject = null;
        } else {
          elem.src = '';
        }
      }
    }
  }, {
    key: "switchMediaTracks",
    value: function switchMediaTracks(deviceIds) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (deviceIds && deviceIds.audio) {
          if (typeof _this4.mediaParams.audio === "boolean") {
            _this4.mediaParams.audio = {};
          }

          _this4.mediaParams.audio.deviceId = deviceIds.audio;
        }

        if (deviceIds && deviceIds.video) {
          if (typeof _this4.mediaParams.video === "boolean") {
            _this4.mediaParams.video = {};
          }

          _this4.mediaParams.video.deviceId = deviceIds.video;
        }

        _this4.localStream.getTracks().forEach(function (track) {
          track.stop();
        });

        MediaDevicesImpl.getUserMedia({
          audio: _this4.mediaParams.audio || false,
          video: _this4.mediaParams.video || false
        }).then(function (stream) {
          _this4._replaceTracks(stream);

          resolve(stream);
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "call",
    value: function call(extension) {
      var _this5 = this;

      var ext = _prepareExtension(extension);

      Helpers.trace('Call, extension: ' + JSON.stringify(ext.userInfo));
      this.state = SessionState.ACTIVE;
      this.opponentsIDs.forEach(function (userID, i, arr) {
        _this5._callInternal(userID, ext, true);
      });
    }
  }, {
    key: "_callInternal",
    value: function _callInternal(userID, extension, withOnNotAnswerCallback) {
      var _this6 = this;

      var peer = this._createPeer(userID, 'offer'); // TODO: use 'addTrack' for all modern browsers


      var safariVersion = Helpers.getVersionSafari();

      if (safariVersion && safariVersion >= 11) {
        this.localStream.getTracks().forEach(function (track) {
          peer.addTrack(track, _this6.localStream);
        });
      } else {
        peer.addLocalStream(this.localStream);
      }

      this.peerConnections[userID] = peer;
      peer.getAndSetLocalSessionDescription(this.callType).then(function () {
        Helpers.trace("getAndSessionDescription success");
        /** let's send call requests to user */

        peer._startDialingTimer(extension, withOnNotAnswerCallback);
      })["catch"](function (err) {
        Helpers.trace("getAndSessionDescription error: " + err);
      });
    }
  }, {
    key: "accept",
    value: function accept(extension) {
      var _this7 = this;

      var ext = _prepareExtension(extension);

      Helpers.trace('Accept, extension: ' + JSON.stringify(ext.userInfo));

      if (this.state === SessionState.ACTIVE) {
        Helpers.traceError("Can't accept, the session is already active, return.");
        return;
      }

      if (this.state === SessionState.CLOSED) {
        Helpers.traceError("Can't accept, the session is already closed, return.");
        this.stop({});
        return;
      }

      this.state = SessionState.ACTIVE;
      this.acceptCallTime = new Date();

      this._clearAnswerTimer();

      this._acceptInternal(this.initiatorID, ext); // group call


      var oppIDs = this._uniqueOpponentsIDsWithoutInitiator();

      if (oppIDs.length > 0) {
        var offerTime = (this.acceptCallTime - this.startCallTime) / 1000;

        this._startWaitingOfferOrAnswerTimer(offerTime);

        oppIDs.forEach(function (opID) {
          if (_this7.currentUserID > opID) {
            _this7._callInternal(opID, {}, true);
          }
        });
      }
    }
  }, {
    key: "_acceptInternal",
    value: function _acceptInternal(userID, extension) {
      var _this8 = this;

      var peerConnection = this.peerConnections[userID];

      if (peerConnection) {
        // TODO: use 'addTrack' for all modern browsers
        var safariVersion = Helpers.getVersionSafari();

        if (safariVersion && safariVersion >= 11) {
          this.localStream.getTracks().forEach(function (track) {
            peerConnection.addTrack(track, _this8.localStream);
          });
        } else {
          peerConnection.addLocalStream(this.localStream);
        }

        peerConnection.setRemoteSessionDescription('offer', peerConnection.getRemoteSDP()).then(function () {
          Helpers.trace("'setRemoteSessionDescription' success");
          peerConnection.getAndSetLocalSessionDescription(_this8.callType).then(function () {
            extension.sessionID = _this8.ID;
            extension.callType = _this8.callType;
            extension.callerID = _this8.initiatorID;
            extension.opponentsIDs = _this8.opponentsIDs;
            extension.sdp = peerConnection.localDescription.sdp;

            _this8.signalingProvider.sendMessage(userID, extension, SignalingConstants.SignalingType.ACCEPT);
          })["catch"](function (err) {
            Helpers.trace("getAndSetLocalSessionDescription error: " + err);
          });
        })["catch"](function (error) {
          Helpers.traceError("'setRemoteSessionDescription' error: " + error);
        });
      } else {
        Helpers.traceError("Can't accept the call, there is no information about peer connection by some reason.");
      }
    }
  }, {
    key: "reject",
    value: function reject(extension) {
      var _this9 = this;

      var ext = _prepareExtension(extension);

      Helpers.trace('Reject, extension: ' + JSON.stringify(ext.userInfo));
      this.state = SessionState.REJECTED;

      this._clearAnswerTimer();

      ext.sessionID = this.ID;
      ext.callType = this.callType;
      ext.callerID = this.initiatorID;
      ext.opponentsIDs = this.opponentsIDs;
      Object.keys(this.peerConnections).forEach(function (key) {
        var peerConnection = _this9.peerConnections[key];

        _this9.signalingProvider.sendMessage(peerConnection.userID, ext, SignalingConstants.SignalingType.REJECT);
      });

      this._close();
    }
  }, {
    key: "stop",
    value: function stop(extension) {
      var _this10 = this;

      var ext = _prepareExtension(extension);

      Helpers.trace('Stop, extension: ' + JSON.stringify(ext.userInfo));
      this.state = SessionState.HUNGUP;

      if (this.answerTimer) {
        this._clearAnswerTimer();
      }

      ext.sessionID = this.ID;
      ext.callType = this.callType;
      ext.callerID = this.initiatorID;
      ext.opponentsIDs = this.opponentsIDs;
      Object.keys(this.peerConnections).forEach(function (key) {
        var peerConnection = _this10.peerConnections[key];

        _this10.signalingProvider.sendMessage(peerConnection.userID, ext, SignalingConstants.SignalingType.STOP);
      });

      this._close();
    }
  }, {
    key: "mute",
    value: function mute(type) {
      this._muteStream(0, type);
    }
  }, {
    key: "unmute",
    value: function unmute(type) {
      this._muteStream(1, type);
    }
  }, {
    key: "_processOnCall",
    value: function _processOnCall(callerID, extension) {
      var _this11 = this;

      var oppIDs = this._uniqueOpponentsIDs();

      oppIDs.forEach(function (opID) {
        var pConn = _this11.peerConnections[opID];

        if (pConn) {
          if (opID == callerID) {
            pConn.updateRemoteSDP(extension.sdp);
            /** The group call logic starts here */

            if (callerID != _this11.initiatorID && _this11.state === SessionState.ACTIVE) {
              _this11._acceptInternal(callerID, {});
            }
          }
        } else {
          /** create peer connections for each opponent */
          var peerConnection;

          if (opID != callerID && _this11.currentUserID > opID) {
            peerConnection = _this11._createPeer(opID, 'offer');
          } else {
            peerConnection = _this11._createPeer(opID, 'answer');
          }

          _this11.peerConnections[opID] = peerConnection;

          if (opID == callerID) {
            peerConnection.updateRemoteSDP(extension.sdp);

            _this11._startAnswerTimer();
          }
        }
      });
    }
  }, {
    key: "_processOnAccept",
    value: function _processOnAccept(userID, extension) {
      var peerConnection = this.peerConnections[userID];

      if (peerConnection) {
        peerConnection._clearDialingTimer();

        peerConnection.setRemoteSessionDescription('answer', extension.sdp).then(function () {
          Helpers.trace("'setRemoteSessionDescription' success");
        })["catch"](function (error) {
          Helpers.traceError("'setRemoteSessionDescription' error: " + error);
        });
      } else {
        Helpers.traceWarning("Ignore 'OnAccept', there is no information about peer connection by some reason.");
      }
    }
  }, {
    key: "_processOnReject",
    value: function _processOnReject(userID, extension) {
      var peerConnection = this.peerConnections[userID];

      this._clearWaitingOfferOrAnswerTimer();

      if (peerConnection) {
        peerConnection.release();
      } else {
        Helpers.traceWarning("Ignore 'OnReject', there is no information about peer connection by some reason.");
      }

      this._closeSessionIfAllConnectionsClosed();
    }
  }, {
    key: "_processOnStop",
    value: function _processOnStop(userID, extension) {
      var _this12 = this;

      this._clearAnswerTimer();
      /** drop the call if the initiator did it */


      if (userID === this.initiatorID) {
        var pcKeys = Object.keys(this.peerConnections);

        if (pcKeys.length > 0) {
          pcKeys.forEach(function (key) {
            _this12.peerConnections[key].release();
          });
        } else {
          Helpers.traceWarning("Ignore 'OnStop', there is no information about peer connections by some reason.");
        }
      } else {
        var pc = this.peerConnections[userID];

        if (pc) {
          pc.release();
        } else {
          Helpers.traceWarning("Ignore 'OnStop', there is no information about peer connection by some reason.");
        }
      }

      this._closeSessionIfAllConnectionsClosed();
    }
  }, {
    key: "_processOnIceCandidates",
    value: function _processOnIceCandidates(userID, extension) {
      var peerConnection = this.peerConnections[userID];

      if (peerConnection) {
        peerConnection.addCandidates(extension.iceCandidates);
      } else {
        Helpers.traceWarning("Ignore 'OnIceCandidates', there is no information about peer connection by some reason.");
      }
    }
  }, {
    key: "_processCall",
    value: function _processCall(peerConnection, ext) {
      var extension = ext || {};
      extension.sessionID = this.ID;
      extension.callType = this.callType;
      extension.callerID = this.initiatorID;
      extension.opponentsIDs = this.opponentsIDs;
      extension.sdp = peerConnection.localDescription.sdp; //TODO: set bandwidth to the userInfo object

      extension.userInfo = ext.userInfo || {};
      extension.userInfo.bandwidth = this.bandwidth;
      this.signalingProvider.sendMessage(peerConnection.userID, extension, SignalingConstants.SignalingType.CALL);
    }
  }, {
    key: "_processIceCandidates",
    value: function _processIceCandidates(peerConnection, iceCandidates) {
      var extension = {};
      extension.sessionID = this.ID;
      extension.callType = this.callType;
      extension.callerID = this.initiatorID;
      extension.opponentsIDs = this.opponentsIDs;
      this.signalingProvider.sendCandidate(peerConnection.userID, iceCandidates, extension);
    }
  }, {
    key: "_processOnNotAnswer",
    value: function _processOnNotAnswer(peerConnection) {
      Helpers.trace("Answer timeout callback for session " + this.ID + " for user " + peerConnection.userID);

      this._clearWaitingOfferOrAnswerTimer();

      peerConnection.release();
      Utils.safeCallbackCall(this.onUserNotAnswerListener, this, peerConnection.userID);

      this._closeSessionIfAllConnectionsClosed();
    }
  }, {
    key: "_onRemoteStreamListener",
    value: function _onRemoteStreamListener(userID, stream) {
      Utils.safeCallbackCall(this.onRemoteStreamListener, this, userID, stream);
    }
  }, {
    key: "_onCallStatsReport",
    value: function _onCallStatsReport(userId, stats, error) {
      Utils.safeCallbackCall(this.onCallStatsReport, this, userId, stats, error);
    }
  }, {
    key: "_onSessionConnectionStateChangedListener",
    value: function _onSessionConnectionStateChangedListener(userID, connectionState) {
      Utils.safeCallbackCall(this.onSessionConnectionStateChangedListener, this, userID, connectionState);
    }
  }, {
    key: "_createPeer",
    value: function _createPeer(userID, peerConnectionType) {
      this.startCallTime = new Date();
      var pcConfig = {
        iceServers: _prepareIceServers(config.videochat.iceServers)
      };
      Helpers.trace("_createPeer, iceServers: " + JSON.stringify(pcConfig));
      var peer = new RTCPeerConnection(pcConfig);

      peer._init(this, userID, this.ID, peerConnectionType);

      return peer;
    }
  }, {
    key: "_close",
    value: function _close() {
      var _this13 = this;

      Helpers.trace('_close');
      Object.keys(this.peerConnections).forEach(function (key) {
        var peer = _this13.peerConnections[key];

        try {
          peer.release();
        } catch (e) {
          console.warn('Peer close error:', e);
        }
      });

      this._closeLocalMediaStream();

      this.state = SessionState.CLOSED;
      Utils.safeCallbackCall(this.onSessionCloseListener, this);
    }
  }, {
    key: "_closeSessionIfAllConnectionsClosed",
    value: function _closeSessionIfAllConnectionsClosed() {
      var _this14 = this;

      var isAllConnectionsClosed = true;
      Object.keys(this.peerConnections).forEach(function (key) {
        var peerCon = _this14.peerConnections[key];
        var peerState;

        try {
          /*
          TODO:
          Uses RTCPeerConnection.signalingState instead RTCPeerConnection.iceConnectionState,
          because state 'closed' comes after few time from Safari, but signaling state comes instantly
          */
          peerState = peerCon.iceConnectionState === 'closed' ? 'closed' : peerCon.signalingState === 'closed' ? 'closed' : peerCon.released ? 'closed' : null;
        } catch (err) {
          Helpers.traceError(err); // need to set peerState to 'closed' on error. FF will crashed without this part.

          peerState = 'closed';
        }

        if (peerState !== 'closed') {
          isAllConnectionsClosed = false;
        }
      });
      Helpers.trace("All peer connections closed: " + isAllConnectionsClosed);

      if (isAllConnectionsClosed) {
        this._closeLocalMediaStream();

        Utils.safeCallbackCall(this.onSessionCloseListener, this);
        this.state = SessionState.CLOSED;
      }
    }
  }, {
    key: "_closeLocalMediaStream",
    value: function _closeLocalMediaStream() {
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach(function (audioTrack) {
          audioTrack.stop();
        });
        this.localStream.getVideoTracks().forEach(function (videoTrack) {
          videoTrack.stop();
        });
        this.localStream = null;
      }
    }
  }, {
    key: "_muteStream",
    value: function _muteStream(enabled, type) {
      if (type === 'audio' && this.localStream.getAudioTracks().length > 0) {
        this.localStream.getAudioTracks().forEach(function (track) {
          track.enabled = !!enabled;
        });
        return;
      }

      if (type === 'video' && this.localStream.getVideoTracks().length > 0) {
        this.localStream.getVideoTracks().forEach(function (track) {
          track.enabled = !!enabled;
        });
        return;
      }
    }
  }, {
    key: "_clearAnswerTimer",
    value: function _clearAnswerTimer() {
      if (this.answerTimer) {
        Helpers.trace("_clearAnswerTimer");
        clearTimeout(this.answerTimer);
        this.answerTimer = null;
      }
    }
  }, {
    key: "_startAnswerTimer",
    value: function _startAnswerTimer() {
      var _this15 = this;

      Helpers.trace("_startAnswerTimer");

      var answerTimeoutCallback = function answerTimeoutCallback() {
        Helpers.trace("_answerTimeoutCallback");

        if (typeof _this15.onSessionCloseListener === 'function') {
          _this15._close();
        }

        _this15.answerTimer = null;
      };

      var answerTimeInterval = config.videochat.answerTimeInterval * 1000;
      this.answerTimer = setTimeout(answerTimeoutCallback, answerTimeInterval);
    }
  }, {
    key: "_clearWaitingOfferOrAnswerTimer",
    value: function _clearWaitingOfferOrAnswerTimer() {
      if (this.waitingOfferOrAnswerTimer) {
        Helpers.trace("_clearWaitingOfferOrAnswerTimer");
        clearTimeout(this.waitingOfferOrAnswerTimer);
        this.waitingOfferOrAnswerTimer = null;
      }
    }
  }, {
    key: "_startWaitingOfferOrAnswerTimer",
    value: function _startWaitingOfferOrAnswerTimer(time) {
      var _this16 = this;

      console.warn('_startWaitingOfferOrAnswerTimer`');
      var timeout = config.videochat.answerTimeInterval - time < 0 ? 1 : config.videochat.answerTimeInterval - time;

      var waitingOfferOrAnswerTimeoutCallback = function waitingOfferOrAnswerTimeoutCallback() {
        Helpers.trace("waitingOfferOrAnswerTimeoutCallback");
        Object.keys(_this16.peerConnections).forEach(function (key) {
          var peerConnection = _this16.peerConnections[key];

          if (peerConnection.state === PeerConnectionState.CONNECTING || peerConnection.state === PeerConnectionState.NEW) {
            _this16._processOnNotAnswer(peerConnection);
          }
        });
        _this16.waitingOfferOrAnswerTimer = null;
      };

      Helpers.trace("_startWaitingOfferOrAnswerTimer, timeout: " + timeout);
      this.waitingOfferOrAnswerTimer = setTimeout(waitingOfferOrAnswerTimeoutCallback, timeout * 1000);
    }
  }, {
    key: "_uniqueOpponentsIDs",
    value: function _uniqueOpponentsIDs() {
      var _this17 = this;

      var opponents = [];

      if (this.initiatorID !== this.currentUserID) {
        opponents.push(this.initiatorID);
      }

      this.opponentsIDs.forEach(function (userID) {
        if (userID != _this17.currentUserID) {
          opponents.push(parseInt(userID));
        }
      });
      return opponents;
    }
  }, {
    key: "_uniqueOpponentsIDsWithoutInitiator",
    value: function _uniqueOpponentsIDsWithoutInitiator() {
      var _this18 = this;

      var opponents = [];
      this.opponentsIDs.forEach(function (userID) {
        if (userID != _this18.currentUserID) {
          opponents.push(parseInt(userID));
        }
      });
      return opponents;
    }
  }, {
    key: "toString",
    value: function toString() {
      return 'ID: ' + this.ID + ', initiatorID:  ' + this.initiatorID + ', opponentsIDs: ' + this.opponentsIDs + ', state: ' + this.state + ', callType: ' + this.callType;
    }
  }]);
  return WebRTCSession;
}();

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}

function _prepareExtension(extension) {
  var ext = {};

  try {
    if ({}.toString.call(extension) === '[object Object]') {
      ext.userInfo = extension;
      ext = JSON.parse(JSON.stringify(ext).replace(/null/g, "\"\""));
    } else {
      throw new Error('Invalid type of "extension" object.');
    }
  } catch (err) {
    Helpers.traceWarning(err.message);
  }

  return ext;
}

function _prepareIceServers(iceServers) {
  var iceServersCopy = JSON.parse(JSON.stringify(iceServers));
  Object.keys(iceServersCopy).forEach(function (c, i, a) {
    if (iceServersCopy[i].hasOwnProperty('url')) {
      iceServersCopy[i].urls = iceServersCopy[i].url;
    } else {
      iceServersCopy[i].url = iceServersCopy[i].urls;
    }
  });
  return iceServersCopy;
}

module.exports = WebRTCSession;

/***/ }),

/***/ "./lib/videocalling/cubeWebRTCSignalingProcessor.js":
/*!**********************************************************!*\
  !*** ./lib/videocalling/cubeWebRTCSignalingProcessor.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var SignalingConstants = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").SignalingConstants;

var ChatHelpers = __webpack_require__(/*! ../messaging/cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js");

var WebRTCSignalingProcessor =
/*#__PURE__*/
function () {
  function WebRTCSignalingProcessor(delegate) {
    (0, _classCallCheck2["default"])(this, WebRTCSignalingProcessor);
    this.delegate = delegate;
  }

  (0, _createClass2["default"])(WebRTCSignalingProcessor, [{
    key: "_onMessage",
    value: function _onMessage(userId, extraParams) {
      var extension = this._getExtension(extraParams);

      var sessionId = extension.sessionID;
      var signalType = extension.signalType;
      /** cleanup */

      delete extension.moduleIdentifier;
      delete extension.sessionID;
      delete extension.signalType;

      switch (signalType) {
        case SignalingConstants.SignalingType.CALL:
          this.delegate._onCallListener(userId, sessionId, extension);

          break;

        case SignalingConstants.SignalingType.ACCEPT:
          this.delegate._onAcceptListener(userId, sessionId, extension);

          break;

        case SignalingConstants.SignalingType.REJECT:
          this.delegate._onRejectListener(userId, sessionId, extension);

          break;

        case SignalingConstants.SignalingType.STOP:
          this.delegate._onStopListener(userId, sessionId, extension);

          break;

        case SignalingConstants.SignalingType.CANDIDATE:
          this.delegate._onIceCandidatesListener(userId, sessionId, extension);

          break;
      }
    } // TODO: refactor it

  }, {
    key: "_getExtension",
    value: function _getExtension(extraParams) {
      if (!extraParams) {
        return null;
      }

      var extension = {},
          iceCandidates = [],
          opponents = [],
          candidate,
          opponent,
          childrenNodes;
      var extraParamsChildNodes = extraParams.childNodes || extraParams.children;

      for (var i = 0, len = extraParamsChildNodes.length; i < len; i++) {
        var items = extraParamsChildNodes[i].childNodes || extraParamsChildNodes[i].children;
        var itemTagName = extraParamsChildNodes[i].tagName || extraParamsChildNodes[i].name;

        if (itemTagName === 'iceCandidates') {
          for (var j = 0, len2 = items.length; j < len2; j++) {
            candidate = {};
            childrenNodes = items[j].childNodes || items[j].children;

            for (var k = 0, len3 = childrenNodes.length; k < len3; k++) {
              var childName = childrenNodes[k].tagName || childrenNodes[k].name;
              var childValue = childrenNodes[k].textContent || childrenNodes[k].children[0];
              candidate[childName] = childName === 'sdpMLineIndex' ? parseInt(childValue) : childValue;
            }

            iceCandidates.push(candidate);
          }
        } else if (itemTagName === 'opponentsIDs') {
          for (var v = 0, len2v = items.length; v < len2v; v++) {
            opponent = items[v].textContent || items[v].children[0];
            opponents.push(parseInt(opponent));
          }
        } else {
          if (items.length > 1) {
            var nodeTextContentSize = (extraParamsChildNodes[i].textContent || extraParamsChildNodes[i].children[0]).length;

            if (nodeTextContentSize > 4096) {
              var wholeNodeContent = "";

              for (var t = 0; t < items.length; ++t) {
                wholeNodeContent += items.textContent || items.children[0];
              }

              extension[itemTagName] = wholeNodeContent;
            } else {
              extension = ChatHelpers._XMLtoJS(extension, itemTagName, extraParamsChildNodes[i]);
            }
          } else {
            if (itemTagName === 'userInfo') {
              extension = ChatHelpers._XMLtoJS(extension, itemTagName, extraParamsChildNodes[i]);
            } else {
              extension[itemTagName] = extraParamsChildNodes[i].textContent || extraParamsChildNodes[i].children[0];
            }
          }
        }
      }

      if (iceCandidates.length > 0) {
        extension.iceCandidates = iceCandidates;
      }

      if (opponents.length > 0) {
        extension.opponentsIDs = opponents;
      }

      return extension;
    }
  }]);
  return WebRTCSignalingProcessor;
}();

module.exports = WebRTCSignalingProcessor;

/***/ }),

/***/ "./lib/videocalling/cubeWebRTCSignalingProvider.js":
/*!*********************************************************!*\
  !*** ./lib/videocalling/cubeWebRTCSignalingProvider.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var Helpers = __webpack_require__(/*! ./cubeWebRTCHelpers */ "./lib/videocalling/cubeWebRTCHelpers.js");

var SignalingConstants = __webpack_require__(/*! ./cubeWebRTCConstants */ "./lib/videocalling/cubeWebRTCConstants.js").SignalingConstants;

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var config = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var ChatHelpers = __webpack_require__(/*! ../messaging/cubeChatInternalUtils */ "./lib/messaging/cubeChatInternalUtils.js");

var WebRTCSignalingProvider =
/*#__PURE__*/
function () {
  function WebRTCSignalingProvider(signalingConnection) {
    (0, _classCallCheck2["default"])(this, WebRTCSignalingProvider);
    this.signalingConnection = signalingConnection;
  }

  (0, _createClass2["default"])(WebRTCSignalingProvider, [{
    key: "sendCandidate",
    value: function sendCandidate(userId, iceCandidates, ext) {
      var extension = ext || {};
      extension.iceCandidates = iceCandidates;
      this.sendMessage(userId, extension, SignalingConstants.SignalingType.CANDIDATE);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(userId, ext, signalingType) {
      var extension = ext || {};
      /** basic parameters */

      extension.moduleIdentifier = SignalingConstants.MODULE_ID;
      extension.signalType = signalingType;
      /** extension.sessionID */

      /** extension.callType */

      extension.platform = 'web';
      /** extension.callerID */

      /** extension.opponentsIDs */

      /** extension.sdp */

      if (extension.userInfo && !Object.keys(extension.userInfo).length) {
        delete extension.userInfo;
      }

      var params = {
        to: Helpers.getUserJid(userId, config.creds.appId),
        type: 'headline',
        id: Utils.getBsonObjectId()
      };
      var msg = ChatHelpers.createMessageStanza(params).c('extraParams', {
        xmlns: 'jabber:client'
      });
      Object.keys(extension).forEach(function (field) {
        if (field === 'iceCandidates') {
          msg = msg.c('iceCandidates');
          extension[field].forEach(function (candidate) {
            msg = msg.c('iceCandidate');
            Object.keys(candidate).forEach(function (key) {
              msg = msg.c(key).t(candidate[key]).up();
            });
            msg = msg.up();
          });
          msg = msg.up();
        } else if (field === 'opponentsIDs') {
          msg = msg.c('opponentsIDs');
          extension[field].forEach(function (opponentId) {
            msg = msg.c('opponentID').t(opponentId).up();
          });
          msg = msg.up();
        } else if ((0, _typeof2["default"])(extension[field]) === 'object') {
          ChatHelpers._JStoXML(field, extension[field], msg);
        } else {
          msg = msg.c(field).t(extension[field]).up();
        }
      });
      msg = msg.up();
      this.signalingConnection.send(msg);
    }
  }]);
  return WebRTCSignalingProvider;
}();

module.exports = WebRTCSignalingProvider;

/***/ }),

/***/ "./lib/videocalling_conference/cubeConferenceClient.js":
/*!*************************************************************!*\
  !*** ./lib/videocalling_conference/cubeConferenceClient.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));

var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));

var coreConfig = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var ConferenceSession = __webpack_require__(/*! ./cubeConferenceSession */ "./lib/videocalling_conference/cubeConferenceSession.js");

var _require = __webpack_require__(/*! ./cubeConferenceConstansts */ "./lib/videocalling_conference/cubeConferenceConstansts.js"),
    DEVICE_INPUT_TYPES = _require.DEVICE_INPUT_TYPES,
    CALL_TYPES = _require.CALL_TYPES;

var _require2 = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js"),
    mediaDevices = _require2.mediaDevices;

var ConferenceClient =
/*#__PURE__*/
function () {
  function ConferenceClient(proxy) {
    (0, _classCallCheck2["default"])(this, ConferenceClient);
    (0, _defineProperty2["default"])(this, "DEVICE_INPUT_TYPES", DEVICE_INPUT_TYPES);
    (0, _defineProperty2["default"])(this, "CALL_TYPES", CALL_TYPES);
    (0, _defineProperty2["default"])(this, "sessionsStore", {});
    (0, _defineProperty2["default"])(this, "onParticipantJoinedListener", void 0);
    (0, _defineProperty2["default"])(this, "onParticipantLeftListener", void 0);
    (0, _defineProperty2["default"])(this, "onSlowLinkListener", void 0);
    (0, _defineProperty2["default"])(this, "onRemoteStreamListener", void 0);
    (0, _defineProperty2["default"])(this, "onRemoteConnectionStateChangedListener", void 0);
    (0, _defineProperty2["default"])(this, "onSessionConnectionStateChangedListener", void 0);
    this.proxy = proxy;
  }

  (0, _createClass2["default"])(ConferenceClient, [{
    key: "createNewSession",
    value: function createNewSession() {
      var session = new ConferenceSession(Object.assign(coreConfig.conference, {
        token: this.getCurrentSessionToken()
      }));
      session.onParticipantJoinedListener = this.onParticipantJoinedListener;
      session.onParticipantLeftListener = this.onParticipantLeftListener;
      session.onSlowLinkListener = this.onSlowLinkListener;
      session.onRemoteStreamListener = this.onRemoteStreamListener;
      session.onRemoteConnectionStateChangedListener = this.onRemoteConnectionStateChangedListener;
      session.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener;
      this.sessionsStore[session.id] = session;
      return session;
    }
  }, {
    key: "getMediaDevices",
    value: function () {
      var _getMediaDevices = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(deviceInputType) {
        var mediaDevices;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._listDevices();

              case 2:
                mediaDevices = _context.sent;

                if (!(deviceInputType === DEVICE_INPUT_TYPES.VIDEO)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", mediaDevices.filter(function (_ref) {
                  var kind = _ref.kind;
                  return kind === DEVICE_INPUT_TYPES.VIDEO;
                }));

              case 7:
                if (!(deviceInputType === DEVICE_INPUT_TYPES.AUDIO)) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return", mediaDevices.filter(function (_ref2) {
                  var kind = _ref2.kind;
                  return kind === DEVICE_INPUT_TYPES.AUDIO;
                }));

              case 9:
                return _context.abrupt("return", mediaDevices);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getMediaDevices(_x) {
        return _getMediaDevices.apply(this, arguments);
      }

      return getMediaDevices;
    }()
  }, {
    key: "_listDevices",
    value: function _listDevices() {
      return mediaDevices.enumerateDevices();
    }
  }, {
    key: "clearSession",
    value: function clearSession(session_id) {
      delete this.sessionsStore[session_id];
    }
  }, {
    key: "getCurrentSessionToken",
    value: function getCurrentSessionToken() {
      var currentSession = this.proxy.getSession();

      if (!currentSession) {
        throw new Error('Session does not exist');
      }

      return this.proxy.getSession().token;
    }
  }]);
  return ConferenceClient;
}();

module.exports = ConferenceClient;

/***/ }),

/***/ "./lib/videocalling_conference/cubeConferenceConstansts.js":
/*!*****************************************************************!*\
  !*** ./lib/videocalling_conference/cubeConferenceConstansts.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CALL_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio'
};
var DEVICE_INPUT_TYPES = {
  VIDEO: 'videoinput',
  AUDIO: 'audioinput'
};
module.exports = {
  CALL_TYPES: CALL_TYPES,
  DEVICE_INPUT_TYPES: DEVICE_INPUT_TYPES
};

/***/ }),

/***/ "./lib/videocalling_conference/cubeConferenceSession.js":
/*!**************************************************************!*\
  !*** ./lib/videocalling_conference/cubeConferenceSession.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));

var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js"));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var _require = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js"),
    mediaDevices = _require.mediaDevices;

var _require2 = __webpack_require__(/*! ./cubeVideoCallingConference */ "./lib/videocalling_conference/cubeVideoCallingConference.js"),
    ClientJanusConf = _require2.Client;

var _require3 = __webpack_require__(/*! ./cubeConferenceConstansts */ "./lib/videocalling_conference/cubeConferenceConstansts.js"),
    CALL_TYPES = _require3.CALL_TYPES;

var ConferenceSession =
/*#__PURE__*/
function () {
  function ConferenceSession(janusConfig) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, ConferenceSession);
    (0, _defineProperty2["default"])(this, "id", void 0);
    (0, _defineProperty2["default"])(this, "currentUserDisplayName", void 0);
    (0, _defineProperty2["default"])(this, "localStream", void 0);
    (0, _defineProperty2["default"])(this, "onParticipantJoinedListener", void 0);
    (0, _defineProperty2["default"])(this, "onParticipantLeftListener", void 0);
    (0, _defineProperty2["default"])(this, "onSlowLinkListener", void 0);
    (0, _defineProperty2["default"])(this, "onRemoteStreamListener", void 0);
    (0, _defineProperty2["default"])(this, "onRemoteConnectionStateChangedListener", void 0);
    (0, _defineProperty2["default"])(this, "onSessionConnectionStateChangedListener", void 0);
    (0, _defineProperty2["default"])(this, "activeVideoDeviceId", void 0);
    (0, _defineProperty2["default"])(this, "activeAudioDeviceId", void 0);
    (0, _defineProperty2["default"])(this, "_onParticipantJoined", function (user_id, userDisplayName) {
      _this._createListener(user_id);

      Utils.safeCallbackCall(_this.onParticipantJoinedListener, _this, user_id, userDisplayName);
    });
    (0, _defineProperty2["default"])(this, "_onParticipantLeft", function (user_id, userDisplayName) {
      Utils.safeCallbackCall(_this.onParticipantLeftListener, _this, user_id, userDisplayName);
    });
    (0, _defineProperty2["default"])(this, "_onLocalIceStateChanged", function (iceState) {
      Utils.safeCallbackCall(_this.onSessionConnectionStateChangedListener, _this, iceState);
    });
    (0, _defineProperty2["default"])(this, "_onRemoteIceStateChanged", function (user_id, iceState) {
      Utils.safeCallbackCall(_this.onRemoteConnectionStateChangedListener, _this, user_id, iceState);
    });
    (0, _defineProperty2["default"])(this, "_onRemoteStream", function (stream, user_id) {
      Utils.safeCallbackCall(_this.onRemoteStreamListener, _this, user_id, stream);
    });
    (0, _defineProperty2["default"])(this, "_onSlowLink", function (user_id, uplink, nacks) {
      Utils.safeCallbackCall(_this.onSlowLinkListener, _this, user_id, uplink, nacks);
    });
    this.id = "".concat(Math.random());
    this._clientConf = new ClientJanusConf(janusConfig);

    this._setOnParticipantJoinListener();

    this._setOnParticipantLeftListener();

    this._setOnRemoveStreamListener();
  }

  (0, _createClass2["default"])(ConferenceSession, [{
    key: "_createSession",
    value: function _createSession() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2._clientConf.createSession({
          success: resolve,
          error: reject
        });
      });
    } // async joinAsPublisher(roomId, user_id) {
    //   await this._createSession()
    //   this.currentRoomId = roomId
    //   await this._createPublisher(user_id)
    // }
    // async joinAsListener(roomId, user_id) {
    //   await this._createSession()
    //   this.currentRoomId = roomId
    //   await this._createListener(user_id)
    // }

  }, {
    key: "join",
    value: function () {
      var _join2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(roomId, user_id, userDisplayName) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.currentUserDisplayName = userDisplayName;
                _context.next = 3;
                return this._createSession();

              case 3:
                this.currentRoomId = roomId;
                _context.next = 6;
                return this._createPublisher(user_id);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function join(_x, _x2, _x3) {
        return _join2.apply(this, arguments);
      }

      return join;
    }()
  }, {
    key: "_createPublisher",
    value: function () {
      var _createPublisher2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(user_id) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._createHandler(false, user_id);

              case 2:
                _context2.next = 4;
                return this._join(this.currentRoomId, user_id);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _createPublisher(_x4) {
        return _createPublisher2.apply(this, arguments);
      }

      return _createPublisher;
    }()
  }, {
    key: "_createListener",
    value: function () {
      var _createListener2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(user_id) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._createHandler(true, user_id);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _createListener(_x5) {
        return _createListener2.apply(this, arguments);
      }

      return _createListener;
    }()
  }, {
    key: "_createHandler",
    value: function _createHandler(isRemote, user_id) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3._clientConf.attachVideoConferencingPlugin(isRemote, user_id, {
          success: resolve,
          error: reject,
          iceState: isRemote ? _this3._onRemoteIceStateChanged.bind(_this3, user_id) : _this3._onLocalIceStateChanged,
          slowLink: isRemote ? _this3._onSlowLink.bind(_this3, user_id) : _this3._onSlowLink.bind(_this3, void 0),
          localStream: _this3.localStream,
          displayName: _this3.currentUserDisplayName
        });
      });
    }
  }, {
    key: "_join",
    value: function _join(roomId, user_id) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._clientConf.join(roomId, user_id, false, {
          success: resolve,
          error: reject,
          displayName: _this4.currentUserDisplayName
        });
      });
    }
  }, {
    key: "_setOnParticipantJoinListener",
    value: function _setOnParticipantJoinListener() {
      this._clientConf.on('participantjoined', this._onParticipantJoined);
    }
  }, {
    key: "_setOnParticipantLeftListener",
    value: function _setOnParticipantLeftListener() {
      this._clientConf.on('participantleft', this._onParticipantLeft);
    }
  }, {
    key: "_setOnRemoveStreamListener",
    value: function _setOnRemoveStreamListener() {
      this._clientConf.on('remotestream', this._onRemoteStream);
    }
  }, {
    key: "listOfOnlineParticipants",
    value: function listOfOnlineParticipants() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5._clientConf.listOnlineParticipants(_this5.currentRoomId, {
          success: resolve,
          error: reject
        });
      });
    }
  }, {
    key: "leave",
    value: function () {
      var _leave = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._leaveGroup();

              case 2:
                this.currentRoomId = void 0;
                this.currentUserDisplayName = void 0;
                _context4.next = 6;
                return this._destroy();

              case 6:
                this.localStream.getTracks().forEach(function (track) {
                  return track.stop();
                });
                this.localStream = void 0;

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function leave() {
        return _leave.apply(this, arguments);
      }

      return leave;
    }()
  }, {
    key: "_leaveGroup",
    value: function _leaveGroup() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6._clientConf.leave({
          success: resolve,
          error: reject
        });
      });
    }
  }, {
    key: "_destroy",
    value: function _destroy() {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _this7._clientConf.destroySession({
          success: resolve,
          error: reject
        });
      });
    }
  }, {
    key: "stopLocalStreamTracks",
    value: function stopLocalStreamTracks() {
      var isIgnoreAudioTrack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.localStream.getTracks().forEach(function (track) {
        if (isIgnoreAudioTrack && track.kind === CALL_TYPES.AUDIO) {
          return;
        } else {
          track.stop();
        }
      });
    }
  }, {
    key: "getDisplayMedia",
    value: function getDisplayMedia(mediaParams, isUpdateCurrentStream) {
      var _this8 = this;

      if (!mediaDevices.getDisplayMedia) {
        throw new Error("Your browser/environment does not support 'getDisplayMedia' API");
      }

      var elementId = mediaParams.elementId;
      delete mediaParams.elementId;
      var attachStreamOptions = mediaParams.options;
      delete mediaParams.options;
      var prevAudioMuteState, prevVideoMuteState;

      if (isUpdateCurrentStream) {
        prevAudioMuteState = this.isAudioMuted();
        prevVideoMuteState = this.isVideoMuted();
        this.stopLocalStreamTracks(true);
      }

      return mediaDevices.getDisplayMedia(mediaParams).then(function (stream) {
        return _this8.updateStream(stream, mediaParams, isUpdateCurrentStream, elementId, attachStreamOptions, prevAudioMuteState, prevVideoMuteState, true);
      })["catch"](function (error) {
        throw new Error(error);
      });
    }
  }, {
    key: "getUserMedia",
    value: function getUserMedia(mediaParams, isUpdateCurrentStream) {
      var _this9 = this;

      var elementId = mediaParams.elementId;
      delete mediaParams.elementId;
      var attachStreamOptions = mediaParams.options;
      delete mediaParams.options;
      var prevAudioMuteState, prevVideoMuteState;

      if (isUpdateCurrentStream) {
        prevAudioMuteState = this.isAudioMuted();
        prevVideoMuteState = this.isVideoMuted();
        this.stopLocalStreamTracks();
      }

      return mediaDevices.getUserMedia(mediaParams).then(function (stream) {
        return _this9.updateStream(stream, mediaParams, isUpdateCurrentStream, elementId, attachStreamOptions, prevAudioMuteState, prevVideoMuteState);
      });
    }
  }, {
    key: "updateStream",
    value: function updateStream(stream, mediaParams, updateCurrentStream, elementId, attachStreamOptions, prevAudioMuteState, prevVideoMuteState) {
      var _this10 = this;

      var isNotUpdateAudioTrack = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
      var newStreamTracks = stream.getTracks();

      if (!updateCurrentStream) {
        this.localStream = stream;
      } else {
        this.localStream.getTracks().forEach(function (track) {
          if (track.kind === CALL_TYPES.AUDIO && isNotUpdateAudioTrack) {
            return;
          } else {
            _this10.localStream.removeTrack(track);
          }
        });
      }

      this.activeAudioDeviceId = this.activeVideoDeviceId = void 0;
      newStreamTracks.forEach(function (track) {
        var trackSetting = !track.getSettings || Utils.getEnv().reactnative ? null : track.getSettings();

        if (track.kind === CALL_TYPES.AUDIO && !isNotUpdateAudioTrack) {
          _this10.activeAudioDeviceId = trackSetting && trackSetting.deviceId;

          if (updateCurrentStream) {
            track.enabled = !prevAudioMuteState;
          }
        } else {
          _this10.activeVideoDeviceId = trackSetting && trackSetting.deviceId;

          if (updateCurrentStream) {
            track.enabled = !prevVideoMuteState;
          }
        }

        if (updateCurrentStream) {
          var pcSenders = _this10.currentPublisherPC.getSenders();

          var sender = pcSenders.find(function (sender) {
            return track.kind === sender.track.kind;
          }); //update remote stream

          sender.replaceTrack(track); //update local stream

          _this10.localStream.addTrack(track);
        }
      });

      if (elementId) {
        this.attachMediaStream(mediaParams.elementId, this.localStream, attachStreamOptions);
      }

      return this.localStream;
    }
  }, {
    key: "switchMediaTracks",
    value: function switchMediaTracks(constraints) {
      if (constraints[CALL_TYPES.VIDEO]) {
        return this._switchVideo(constraints[CALL_TYPES.VIDEO]);
      } else if (constraints[CALL_TYPES.AUDIO]) {
        return this._switchAudio(constraints[CALL_TYPES.AUDIO]);
      }

      return Promise.reject();
    }
  }, {
    key: "_switchVideo",
    value: function _switchVideo(mediaDeviceId) {
      return this._switchMediaTracks({
        audio: true,
        video: {
          deviceId: mediaDeviceId
        }
      });
    }
  }, {
    key: "_switchAudio",
    value: function _switchAudio(mediaDeviceId) {
      return this._switchMediaTracks({
        audio: {
          deviceId: mediaDeviceId
        },
        video: true
      });
    }
  }, {
    key: "_switchMediaTracks",
    value: function _switchMediaTracks(mediaParams) {
      var _this11 = this;

      return this.getUserMedia(mediaParams, true).then(function (newLocalStream) {
        var newStreamTracks = newLocalStream.getTracks();

        var pcSenders = _this11.currentPublisherPC.getSenders();

        newStreamTracks.forEach(function (track) {
          var sender = pcSenders.find(function (sender) {
            return track.kind === sender.track.kind;
          });
          sender.replaceTrack(track);
        });
        return _this11.localStream;
      });
    }
  }, {
    key: "muteVideo",
    value: function muteVideo() {
      if (!this.isVideoMuted()) {
        this._clientConf.toggleVideoMute();
      }
    }
  }, {
    key: "unmuteVideo",
    value: function unmuteVideo() {
      if (this.isVideoMuted()) {
        this._clientConf.toggleVideoMute();
      }
    }
  }, {
    key: "muteAudio",
    value: function muteAudio() {
      if (!this.isAudioMuted()) {
        this._clientConf.toggleAudioMute();
      }
    }
  }, {
    key: "unmuteAudio",
    value: function unmuteAudio() {
      if (this.isAudioMuted()) {
        this._clientConf.toggleAudioMute();
      }
    }
  }, {
    key: "isVideoMuted",
    value: function isVideoMuted() {
      return this._clientConf.isVideoMuted();
    }
  }, {
    key: "isAudioMuted",
    value: function isAudioMuted() {
      return this._clientConf.isAudioMuted();
    }
  }, {
    key: "getRemoteUserBitrate",
    value: function getRemoteUserBitrate(userId) {
      return this._clientConf.getUserBitrate(userId);
    }
  }, {
    key: "getRemoteUserVolume",
    value: function getRemoteUserVolume(userId) {
      return this._clientConf.getUserVolume(userId);
    }
  }, {
    key: "attachMediaStream",
    value: function attachMediaStream(id, stream, options) {
      var elem = document.getElementById(id);

      if (elem) {
        if ((0, _typeof2["default"])(elem.srcObject) === 'object') {
          elem.srcObject = stream;
        } else {
          elem.src = window.URL.createObjectURL(stream);
        }

        if (options && options.muted) {
          elem.muted = true;
        }

        if (options && options.mirror) {
          elem.style.webkitTransform = 'scaleX(-1)';
          elem.style.transform = 'scaleX(-1)';
        }

        elem.onloadedmetadata = function (e) {
          elem.play();
        };
      } else {
        throw new Error('Unable to attach media stream, element ' + id + ' is undefined');
      }
    }
  }, {
    key: "currentRoomId",
    get: function get() {
      return this._clientConf.currentDialogId;
    },
    set: function set(roomId) {
      return this._clientConf.currentDialogId = roomId;
    }
  }, {
    key: "currentPublisherPC",
    get: function get() {
      return this._clientConf.videoRoomPlugin.webrtcStuff.pc;
    }
  }]);
  return ConferenceSession;
}();

module.exports = ConferenceSession;

/***/ }),

/***/ "./lib/videocalling_conference/cubeVideoCallingConference.js":
/*!*******************************************************************!*\
  !*** ./lib/videocalling_conference/cubeVideoCallingConference.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Janus = __webpack_require__(/*! ./janus.umd */ "./lib/videocalling_conference/janus.umd.js");

var Utils = __webpack_require__(/*! ../cubeInternalUtils */ "./lib/cubeInternalUtils.js");

var coreConfig = __webpack_require__(/*! ../cubeConfig */ "./lib/cubeConfig.js");

var EventEmitter = __webpack_require__(/*! fbemitter */ "./node_modules/fbemitter/index.js").EventEmitter;

var mediaDevices = __webpack_require__(/*! ../cubeDependencies */ "./lib/cubeDependencies.js").mediaDevices;

var EVENT_PARTICIPANT_JOINED = "participantjoined";
var EVENT_PARTICIPANT_LEFT = "participantleft";
var EVENT_LOCAL_STREAM = "localstream";
var EVENT_REMOTE_STREAM = "remotestream";
/**
 * @class
 * @param {Object} configParams - a set of configuration parameters. The
 *  following parameters are applied:<br>
 * @param {String} configParams.server - (<b>required</b>) the address of the
 *  gateway as a specific address (e.g., http://yourserver:8088 to use
 *  the plain HTTP API or ws://yourserver:8188 for WebSockets).
 * @param {Boolean} configParams.debug - (<i>optional</i>) whether debug should
 *  be enabled on the JavaScript console (true/false). Default is true.
 * @throws "'server' parameter is mandatory" error if 'server' parameter is null
 *  or undefined.
 * @throws "missing adapter.js" error if the 'adapter.js' is not connected.
 */

function VideoConferencingClient(configParams) {
  if (!Utils.getEnv().reactnative && !adapter) {
    throw "Error: in order to use this library please connect adapter.js. More info https://github.com/webrtc/adapter";
  }

  this.token = configParams.token;
  delete configParams.token;
  this.configs = configParams;

  if (!this.configs.server) {
    throw "'server' parameter is mandatory.";
  } else {
    if (this.configs.server.includes("http")) {
      this.configs.server = this.configs.server + "/janus";
    }
  }

  if (!this.configs.debug) {
    this.configs.debug = "all";
  }

  this.engine = null;
  this.videoRoomPlugin = null;
  this.isOnlyAudio = false; //

  this.currentDialogId = null;
  this.remoteFeeds = [];
  this.remoteJseps = [];
  this.remoteFeedsAttachingInProgress = []; //

  this.currentMidiaDeviceId = null; //

  this.bitrateTimers = []; //

  this.emitter = new EventEmitter();
}
/**
 * Attach media stream to HTML 'video' element
 *
 * @static
 * @param {Object} element - HTML 'video' element
 * @param {Object} stream - WebRTC media stream
 */


VideoConferencingClient.attachMediaStream = function (element, stream) {
  Janus.attachMediaStream(element, stream);
};
/**
 *  Get plugged devices
 *
 * @static
 * @param {function} callback - a callback to be notified about result
 *  (with single argument - array of all devices).
 */


VideoConferencingClient.listDevices = function (callback) {
  mediaDevices.enumerateDevices().then(function (devices) {
    console.debug(devices);
    callback(devices);
  })["catch"](function (err) {
    console.log('[VideoConferencingClient.listDevices][error]', err);
    callback([]);
  });
  ;
};
/**
 *  Get plugged video input devices only
 *
 * @static
 * @param {function} callback - a callback to be notified about result
 *  (with single argument - array of video input devices).
 */


VideoConferencingClient.listVideoinputDevices = function (callback) {
  VideoConferencingClient.listDevices(function (devices) {
    var videoSelect = []; // code sample
    // https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js#L27

    for (var i = 0; i !== devices.length; ++i) {
      var deviceInfo = devices[i];

      if (deviceInfo.kind === 'videoinput') {
        var videoinputDescription = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
        var videoinputId = deviceInfo.deviceId;
        videoSelect.push({
          "label": videoinputDescription,
          "deviceId": videoinputId
        });
      }
    }

    callback(videoSelect);
  });
};

VideoConferencingClient.prototype = {
  /**
   * Create video session
   *
   * @param {Object} callbacks - a set of callbacks to be notified about result,
   *  namely:<br>
   * @param {function} callbacks.success - the session was successfully created
   *  and is ready to be used.
   * @param {function} callbacks.error - the session was NOT successfully
   *  created. This callback passes single argument - text description of error.
   * @param {function} callbacks.destroyed - the session was destroyed and
   *  can't be used any more.
   */
  createSession: function createSession(callbacks) {
    var self = this;
    Janus.init({
      debug: this.configs.debug,
      callback: function callback() {
        if (!Janus.isWebrtcSupported()) {
          if (typeof callbacks.error === 'function') {
            callbacks.error("Your browser does not support WebRTC, so you can't use this functionality.");
          }

          return;
        }

        self.engine = new Janus({
          server: self.configs.server,
          iceServers: coreConfig.videochat.iceServers,
          token: self.token,
          success: function success() {
            if (typeof callbacks.success === 'function') {
              Utils.safeCallbackCall(callbacks.success);
            }
          },
          error: function error(_error) {
            if (typeof callbacks.error === 'function') {
              Utils.safeCallbackCall(callbacks.error, _error);
            }
          },
          destroyed: function destroyed() {
            if (typeof callbacks.destroyed === 'function') {
              Utils.safeCallbackCall(callbacks.destroyed);
            }
          },
          timeoutSessionCallback: function timeoutSessionCallback() {
            if (typeof callbacks.timeoutSessionCallback === 'function') {
              Utils.safeCallbackCall(callbacks.timeoutSessionCallback);
            }
          }
        });
      }
    });
  },

  /**
   * Returns the unique session identifier
   *
   * @returns {String} unique session identifier or null.
   */
  getSessionId: function getSessionId() {
    if (this.engine) {
      return this.engine.getSessionId();
    }

    return null;
  },

  /**
   * Destroy video session
   *
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - the session was successfully
   *  destroyed and no longer available.
   * @param {function} callbacks.error - the session was NOT successfully
   *  destroyed. This callback passes single argument - text description
   *  of error.
   */
  destroySession: function destroySession(callbacks) {
    var self = this;
    this.engine.destroy({});

    if (typeof callbacks.success === 'function') {
      Utils.safeCallbackCall(callbacks.success);
    }
  },

  /**
   * Сreate a video conferencing plugin handle.
   *
   * @param  {Boolean} isRemote  To pass 'false' when you attach plugin to
   *  current user and pass 'true' when attach to remote user.
   * @param  {Number}  userId  To pass 'null' when you attach plugin to
   *  current user and pass remote user id when attach to remote user.
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - the handle was successfully
   *  created and is ready to be used.
   * @param {function} callbacks.error - the handle was NOT successfully
   *  created or some error has occured. The format of error is the following:
   *  {"error_code": "some integer code", "error": "some text description"}.
   *  Possible values of 'error_code': <br>
   * <ul>
   * <li>428: No such feed - can happen when a user joins room and quickly
   * leaves it so other user tries to subscribe to none existend feed.
   * Usually, this error can be ignored.</li>
   * <li>433: Unauthorized - do not have proper rights to join this room.</li>
   * <li>436: User ID already exists in this room.</li>
   * <li>400: Some not usual error occured, for example - no connection to
   *  server. </li>
   * </ul>
   *
   * @param {function} callbacks.consentDialog - this callback is triggered
   *  just before <b>getUserMedia</b> is called (parameter=<b>true</b>) and
   *  after it is completed (parameter=<b>false</b>); this means it can be
   *  used to modify the UI accordingly, e.g., to prompt the user about the
   *  need to accept the device access consent requests.
   * @param {function} callbacks.mediaState - this callback is triggered
   *  when server starts or stops receiving your media: for instance,
   *  a <b>mediaState</b> with type=audio and on=true means server started
   *  receiving your audio stream (or started getting them again after
   *  a pause of more than a second); a mediaState with type=video
   *  and on=false means server hasn't received any video from you in the
   *  last second, after a start was detected before; useful to figure out
   *  when server actually started handling your media, or to detect problems
   *  on the media path (e.g., media never started, or stopped at some time).
   * @param {function} callbacks.webrtcState - this callback is triggered
   *  with a <b>true</b> value when the PeerConnection associated to a handle
   *  becomes active (so ICE, DTLS and everything else succeeded) from
   *  the library perspective, while <b>false</b> is triggered when
   *  the PeerConnection goes down instead; useful to figure out when WebRTC
   *  is actually up and running between you and server (e.g., to notify
   *  a user they're actually now active in a conference).
   * @param {function} callbacks.slowLink - this callback is triggered when
   *  server reports trouble either sending or receiving media on the
   *  specified PeerConnection, typically as a consequence of too many NACKs
   *  received from/sent to the user in the last second: for instance,
   *  a slowLink with uplink=true means you notified several missing packets
   *  from server, while uplink=false means server is not receiving all your
   *  packets; useful to figure out when there are problems on the media
   *  path (e.g., excessive loss), in order to possibly react accordingly
   *  (e.g., decrease the bitrate if most of our packets are getting lost).
   * @param {function} callbacks.oncleanup - the WebRTC PeerConnection with
   *  the plugin was closed.
   */
  attachVideoConferencingPlugin: function attachVideoConferencingPlugin(isRemote, userId, callbacks) {
    var self = this;
    var remoteFeed = null;
    var localStream = callbacks.localStream;
    delete callbacks.localStream;
    var displayName = callbacks.displayName;
    delete callbacks.displayName;
    this.engine.attach({
      plugin: "janus.plugin.videoroom",
      success: function success(pluginHandle) {
        if (isRemote) {
          remoteFeed = pluginHandle;
          remoteFeed.userId = userId;
          self.remoteFeedsAttachingInProgress[userId] = remoteFeed; // join remote's feed (listen)

          var listen = {
            "request": "join",
            "room": self.currentDialogId,
            "ptype": "listener",
            "feed": userId,
            "display": displayName
          }; // If the publisher is VP8 and this is Safari, let's avoid video
          // if (!Utils.getEnv().reactnative && adapter.browserDetails.browser === "safari") {
          //   listen["offer_video"] = true;
          // }

          remoteFeed.send({
            "message": listen
          });
        } else {
          self.videoRoomPlugin = pluginHandle;
        }

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success);
        }
      },
      error: function error(_error2) {
        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error2);
        }
      },
      consentDialog: function consentDialog(on) {
        if (typeof callbacks.consentDialog === 'function') {
          Utils.safeCallbackCall(callbacks.consentDialog, on);
        }
      },
      mediaState: function mediaState(medium, on) {
        if (typeof callbacks.mediaState === 'function') {
          Utils.safeCallbackCall(callbacks.mediaState, medium, on);
        }
      },
      webrtcState: function webrtcState(on) {
        if (typeof callbacks.webrtcState === 'function') {
          Utils.safeCallbackCall(callbacks.webrtcState, on);
        }
      },
      slowLink: function slowLink(uplink, nacks) {
        if (typeof callbacks.slowLink === 'function') {
          Utils.safeCallbackCall(callbacks.slowLink, uplink, nacks);
        }
      },
      iceState: function iceState(iceConnectionState) {
        if (typeof callbacks.iceState === 'function') {
          Utils.safeCallbackCall(callbacks.iceState, iceConnectionState);
        }
      },
      onmessage: function onmessage(msg, jsep) {
        var event = msg["videoroom"]; // remote feed

        if (isRemote) {
          if (event) {
            // Remote feed attached
            if (event === "attached") {
              var feedId = msg["id"];
              self.remoteFeeds[feedId] = self.remoteFeedsAttachingInProgress[feedId];
              self.remoteFeedsAttachingInProgress[feedId] = null;
            } else if (msg["error"]) {
              // #define VIDEOROOM_ERROR_NO_SUCH_FEED		428
              //
              if (typeof callbacks.error === 'function') {
                Utils.safeCallbackCall(callbacks.error, msg["error"]);
              }
            }
          }

          if (jsep) {
            var feedId = msg["id"]; // ICE restart case

            if (!feedId) {}

            self.remoteJseps[feedId] = jsep;
            self.createAnswer({
              remoteFeed: self.remoteFeeds[feedId],
              jsep: jsep,
              stream: localStream
            }, {
              success: function success() {},
              error: function error(_error3) {
                if (typeof callbacks.error === 'function') {
                  Utils.safeCallbackCall(callbacks.error, _error3);
                }
              }
            });
          } // local feed

        } else {
          if (event) {
            // We JOINED
            if (event === "joined") {
              self.createOffer({
                useAudio: true,
                stream: localStream,
                useVideo: !self.isOnlyAudio
              }, {
                success: function success() {
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var publishers = msg["publishers"];

                    for (var f in publishers) {
                      var userId = publishers[f]["id"];
                      var userDisplayName = publishers[f]["display"];
                      self.emitter.emit(EVENT_PARTICIPANT_JOINED, userId, userDisplayName);
                    }
                  }
                },
                error: function error(_error4) {
                  if (typeof callbacks.error === 'function') {
                    Utils.safeCallbackCall(callbacks.error, _error4);
                  }
                }
              }); // We JOINED and now receiving who is online
            } else if (event === "event") {
              // Any new feed to attach to?
              if (msg["publishers"]) {
                var publishers = msg["publishers"];

                for (var f in publishers) {
                  var userId = publishers[f]["id"];
                  var userDisplayName = publishers[f]["display"];
                  self.emitter.emit(EVENT_PARTICIPANT_JOINED, userId, userDisplayName);
                } // Someone is LEAVING

              } else if (msg["leaving"]) {
                // One of the publishers has gone away?
                var feedId = msg["leaving"];
                var success = self.detachRemoteFeed(feedId);

                if (success) {
                  self.emitter.emit(EVENT_PARTICIPANT_LEFT, feedId, null);
                }
              } else if (msg["unpublished"]) {
                // One of the publishers has gone away?
                var feedId = msg["unpublished"];

                if (feedId != 'ok') {
                  var success = self.detachRemoteFeed(feedId);

                  if (success) {
                    self.emitter.emit(EVENT_PARTICIPANT_LEFT, feedId, null);
                  }
                }
              } else if (msg["error"]) {
                // #define VIDEOROOM_ERROR_ID_EXISTS			436
                // #define VIDEOROOM_ERROR_UNAUTHORIZED		433
                //
                if (typeof callbacks.error === 'function') {
                  Utils.safeCallbackCall(callbacks.error, msg["error"]);
                }
              }
            }
          }

          if (jsep) {
            self.videoRoomPlugin.handleRemoteJsep({
              jsep: jsep
            }); // TODO:
            // handle wrong or unsupported codecs here...
            // var video = msg["video_codec"];
            // if(mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
            // 		"Our video stream has been rejected, viewers won't see us";
            // }
          }
        }
      },
      onlocalstream: function onlocalstream(stream) {
        self.emitter.emit(EVENT_LOCAL_STREAM, stream);
      },
      onremotestream: function onremotestream(stream) {
        remoteFeed.stream = stream;
        self.emitter.emit(EVENT_REMOTE_STREAM, stream, remoteFeed.userId);
      },
      oncleanup: function oncleanup() {
        console.info("ON CLEANUP");

        if (typeof callbacks.oncleanup === 'function') {
          Utils.safeCallbackCall(callbacks.oncleanup);
        }
      },
      detached: function detached() {}
    });
  },

  /**
   * Returns the unique plugin identifier
   *
   * @returns {String} unique plugin identifier or null.
   */
  getPluginId: function getPluginId() {
    if (this.videoRoomPlugin) {
      return this.videoRoomPlugin.getId();
    }

    return null;
  },

  /**
   * Detach a video conferencing plugin handle.
   *
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - the handle was successfully
   *  destroyed.
   * @param {function} callbacks.error - the handle was NOT successfully
   *  destroyed. This callback passes single argument - text description
   *  of error.
   */
  detachVideoConferencingPlugin: function detachVideoConferencingPlugin(callbacks) {
    var self = this;

    var clean = function clean() {
      self.videoRoomPlugin = null; // detach all remote feeds

      Object.keys(self.remoteFeeds).forEach(function (userId) {
        self.detachRemoteFeed(userId);
      });
      self.remoteFeeds = [];
      self.remoteJseps = [];
      self.currentMidiaDeviceId = null;
    };

    this.videoRoomPlugin.detach({
      success: function success() {
        clean();

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success);
        }
      },
      error: function error(_error5) {
        clean();

        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error5);
        }
      }
    });
  },

  /**
   * Join video conference room
   *
   * @param {String} chatDialogId - a chat dialog ID to join
   * @param {Number} userId - an id of current user.
   * @param {Boolean} isOnlyAudio - to join current room as audio-only.
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - the chat dialog was successfully
   *  joined.
   * @param {function} callbacks.error - the chat dialog was NOT successfully
   *  joined. This callback passes single argument - text description
   *  of error.
   */
  join: function join(chatDialogId, userId, isOnlyAudio, callbacks) {
    var self = this;
    var displayName = callbacks.displayName;
    delete callbacks.displayName;

    if (typeof isOnlyAudio !== "boolean") {
      throw "'isOnlyAudio' parameter can be of type 'boolean' only.";
    }

    self.isOnlyAudio = isOnlyAudio; // if (!Utils.getEnv().reactnative && adapter.browserDetails.browser === "safari") {
    //   self.isOnlyAudio = false;
    // }

    console.info("isOnlyAudio: " + self.isOnlyAudio);
    var joinEvent = {
      "request": "join",
      "room": chatDialogId,
      "ptype": "publisher",
      "id": userId,
      "display": displayName
    }; //"display": null

    this.videoRoomPlugin.send({
      "message": joinEvent,
      success: function success(resp) {
        self.currentDialogId = chatDialogId;
        self.currentUserId = userId;

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success);
        }
      },
      error: function error(_error6) {
        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error6);
        }
      }
    });
  },

  /**
   * Leave video conference room
   *
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - the chat dialog was successfully
   *  left.
   * @param {function} callbacks.error - the chat dialog was NOT successfully
   *  left. This callback passes single argument - text description of error.
   */
  leave: function leave(callbacks) {
    var self = this;
    console.warn("leave");

    if (!self.engine.isConnected()) {
      if (typeof callbacks.success === 'function') {
        Utils.safeCallbackCall(callbacks.success);
      }

      return;
    }

    var leaveEvent = {
      "request": "leave",
      "room": this.currentDialogId,
      "id": this.currentUserId
    };

    if (this.videoRoomPlugin) {
      this.videoRoomPlugin.send({
        "message": leaveEvent
      });
    }

    this.currentDialogId = null;
    this.currentUserId = null;
    console.warn("resp");

    if (typeof callbacks.success === 'function') {
      Utils.safeCallbackCall(callbacks.success);
    }
  },

  /**
   * List online participants
   *
   * @param {String} chatDialogId - a chat dialog ID to list online
   *  participants in.
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - when everything is ok and you will
   *  receive one argument - array of online participants.
   * @param {function} callbacks.error - when an error occured. This callback
   *  passes single argument - text description of error.
   */
  listOnlineParticipants: function listOnlineParticipants(chatDialogId, callbacks) {
    var listRequest = {
      "request": "listparticipants",
      "room": chatDialogId
    }; //

    this.videoRoomPlugin.send({
      "message": listRequest,
      success: function success(data) {
        var participants = [];

        if (data) {
          participants = data.participants;
        }

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success, participants);
        }
      },
      error: function error(_error7) {
        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error7);
        }
      }
    });
  },

  /**
   * Toggle audio mute.
   *
   * @returns {Boolean} true if audio is muted, otherwise - false.
   */
  toggleAudioMute: function toggleAudioMute() {
    var muted = this.videoRoomPlugin.isAudioMuted();

    if (muted) {
      this.videoRoomPlugin.unmuteAudio();
    } else {
      this.videoRoomPlugin.muteAudio();
    }

    return this.videoRoomPlugin.isAudioMuted();
  },

  /**
   * Is audio muted.
   *
   * @returns {Boolean} true if audio is muted, otherwise - false.
   */
  isAudioMuted: function isAudioMuted() {
    return this.videoRoomPlugin.isAudioMuted();
  },

  /**
   * Toggle remote user audio mute.
   *
   * @param {Number} userId - an id of user to mute audio.
   *
   * @returns {Boolean} true if audio is muted, otherwise - false.
   */
  toggleRemoteAudioMute: function toggleRemoteAudioMute(userId) {
    var remoteFeed = this.remoteFeeds[userId];

    if (!remoteFeed) {
      return false;
    }

    var audioTracks = remoteFeed.stream.getAudioTracks();

    if (audioTracks && audioTracks.length > 0) {
      for (var i = 0; i < audioTracks.length; ++i) {
        audioTracks[i].enabled = !audioTracks[i].enabled;
      }

      return !audioTracks[0].enabled;
    }

    return false;
  },

  /**
   * Is remote audio muted.
   *
   * @param {Number} userId - an id of user to check audio mute
   *  state.
   *
   * @returns {Boolean} true if audio is muted, otherwise - false.
   */
  isRemoteAudioMuted: function isRemoteAudioMuted(userId) {
    var remoteFeed = this.remoteFeeds[userId];

    if (!remoteFeed) {
      return false;
    }

    var audioTracks = remoteFeed.stream.getAudioTracks();

    if (audioTracks && audioTracks.length > 0) {
      return !audioTracks[0].enabled;
    }

    return false;
  },

  /**
   * Toggle video mute.
   *
   * @returns {Boolean} true if video is muted, otherwise - false.
   */
  toggleVideoMute: function toggleVideoMute() {
    var muted = this.videoRoomPlugin.isVideoMuted();

    if (muted) {
      this.videoRoomPlugin.unmuteVideo();
    } else {
      this.videoRoomPlugin.muteVideo();
    }

    return this.videoRoomPlugin.isVideoMuted();
  },

  /**
   * Is video muted.
   *
   * @returns {Boolean} true if video is muted, otherwise - false.
   */
  isVideoMuted: function isVideoMuted() {
    return this.videoRoomPlugin.isVideoMuted();
  },

  /**
   * Toggle remote user video mute.
   *
   * @param {Number} userId - an id of user to mute video.
   *
   * @returns {Boolean} true if video is muted, otherwise - false.
   */
  toggleRemoteVideoMute: function toggleRemoteVideoMute(userId) {
    var remoteFeed = this.remoteFeeds[userId];

    if (!remoteFeed) {
      return false;
    }

    var videoTracks = remoteFeed.stream.getVideoTracks();

    if (videoTracks && videoTracks.length > 0) {
      for (var i = 0; i < videoTracks.length; ++i) {
        videoTracks[i].enabled = !videoTracks[i].enabled;
      }

      return !videoTracks[0].enabled;
    }

    return false;
  },

  /**
   * Is remote video muted.
   *
   * @param {Number} userId - an id of user to check video mute
   *  state.
   *
   * @returns {Boolean} true if video is muted, otherwise - false.
   */
  isRemoteVideoMuted: function isRemoteVideoMuted(userId) {
    var remoteFeed = this.remoteFeeds[userId];

    if (!remoteFeed) {
      return false;
    }

    var videoTracks = remoteFeed.stream.getVideoTracks();

    if (videoTracks && videoTracks.length > 0) {
      return !videoTracks[0].enabled;
    }

    return false;
  },

  /**
   * Switch video input source.
   *
   * @param {String} mediaDeviceId - an id of media device (camera) to switch to.
   *  Can be obtained via 'VideoConferencingClient.listVideoinputDevices'.
   * @param {Object} callbacks - a set of callbacks to be notified about
   *  result, namely:<br>
   * @param {function} callbacks.success - when everything is ok.
   * @param {function} callbacks.error - when an error occured. This callback
   *  passes single argument - text description of error.
   */
  switchVideoinput: function switchVideoinput(mediaDeviceId, callbacks) {
    if (!this.videoRoomPlugin) {
      if (typeof callbacks.error === 'function') {
        Utils.safeCallbackCall(callbacks.error, "No active stream");
      }

      return;
    }

    if (this.isOnlyAudio) {
      throw "Can't switch video input in audio only call.";
    }

    this.currentMidiaDeviceId = null;
    var self = this;
    this.createOffer({
      video: {
        deviceId: mediaDeviceId
      },
      replaceVideo: true
    }, {
      success: function success() {
        console.info("switchVideoinput: success");
        self.currentMidiaDeviceId = mediaDeviceId;

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success);
        }
      },
      error: function error(_error8) {
        console.info("switchVideoinput: error", _error8);

        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error8);
        }
      }
    });
  },
  switchAudioinput: function switchAudioinput(mediaDeviceId, callbacks) {
    if (!this.videoRoomPlugin) {
      if (typeof callbacks.error === 'function') {
        Utils.safeCallbackCall(callbacks.error, "No active stream");
      }

      return;
    }

    this.createOffer({
      audio: {
        deviceId: mediaDeviceId
      },
      replaceAudio: true
    }, {
      success: function success() {
        console.info("switchVideoinput: success");

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success);
        }
      },
      error: function error(_error9) {
        console.info("switchVideoinput: error", _error9);

        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error9);
        }
      }
    });
  },

  /**
   * Initiate ICE restart for remote peer.
   * These are typically needed whenever something in your network changes
   * (e.g., you move from WiFi to mobile or a different WiFi) but want to
   * keep the conversation going: in this case, an ICE restart needs to take
   * place, as the peers need to exchange the new candidates they can be
   * reached on.
   *
   * @param {Number} userIdOrCallbacks - an id of user to initiate ICE restart with or callbacks if it's a local peer.
   * @param {function} callbacks.success - when everything is ok.
   * @param {function} callbacks.error - when an error occured. This callback
   *  passes single argument - text description of error.
   */
  iceRestart: function iceRestart(userIdOrCallbacks, callbacks) {
    // remote ICE restart
    if (callbacks) {
      console.info("Performing remote ICE restart for user: ", userIdOrCallbacks);
      var remoteFeed = this.remoteFeeds[userIdOrCallbacks];

      if (!remoteFeed) {
        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, "No such user feed");
        }

        return;
      }

      var req = {
        "request": "configure",
        "restart": true
      };
      remoteFeed.send({
        "message": req
      });

      if (typeof callbacks.success === 'function') {
        Utils.safeCallbackCall(callbacks.success);
      } // local ICE restart

    } else {
      console.info("Performing local ICE restart");
      this.createOffer({
        iceRestart: true
      }, {
        success: function success() {
          if (typeof userIdOrCallbacks.success === 'function') {
            Utils.safeCallbackCall(userIdOrCallbacks.success);
          }
        },
        error: function error(_error10) {
          if (typeof userIdOrCallbacks.error === 'function') {
            Utils.safeCallbackCall(userIdOrCallbacks.error, _error10);
          }
        }
      });
    }
  },

  /**
   * @private
   */
  createOffer: function createOffer(inputParams, callbacks) {
    console.log("createOffer, inputParams: ", inputParams);
    var self = this;
    var useAudio = inputParams.useAudio;
    var useVideo = inputParams.useVideo;
    var stream = inputParams.stream;
    delete inputParams.stream;
    var replaceVideo = inputParams.replaceVideo;
    var iceRestart = inputParams.iceRestart;
    var videoQuality = self.configs.video ? self.configs.video.quality : null;
    var videoFrameRate = self.configs.video ? self.configs.video.frameRate : null;
    var params;

    if (stream) {
      params = {
        stream: stream
      };
    } else if (replaceVideo) {
      params = {
        media: inputParams
      };

      if (videoQuality) {
        params["media"]["video"] = videoQuality;
      }

      if (videoFrameRate) {
        params["media"]["videoFrameRate"] = {
          min: videoFrameRate,
          max: videoFrameRate
        };
      }
    } else if (iceRestart) {
      params = inputParams;
    } else {
      params = {
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: useAudio,
          videoSend: useVideo
        }
      }; // Publishers are sendonly

      if (videoQuality) {
        params["media"]["video"] = videoQuality;
      }

      if (videoFrameRate) {
        params["media"]["videoFrameRate"] = {
          min: videoFrameRate,
          ideal: videoFrameRate
        };
      }
    }

    console.info("createOffer params: ", params);

    params.success = function (jsep) {
      var publish = {
        "request": "configure"
      };

      if (replaceVideo || iceRestart) {// publish["update"] = true;
      } else {
        publish["audio"] = useAudio;
        publish["video"] = useVideo;
      }

      console.info("createOffer publish: ", publish);
      self.videoRoomPlugin.send({
        "message": publish,
        "jsep": jsep
      });

      if (typeof callbacks.success === 'function') {
        callbacks.success();
      }
    };

    params.error = function (error) {
      console.log("[createOffer] Error in createOffer: ", error);

      if (useAudio) {
        self.createOffer({
          useAudio: false,
          useVideo: false
        }, callbacks);
      } else {
        if (typeof callbacks.error === 'function') {
          callbacks.error(error);
        }
      }
    };

    this.videoRoomPlugin.createOffer(params);
  },

  /**
   * @private
   */
  createAnswer: function createAnswer(_ref, callbacks) {
    var remoteFeed = _ref.remoteFeed,
        jsep = _ref.jsep,
        stream = _ref.stream;
    var self = this;
    remoteFeed.createAnswer({
      jsep: jsep,
      stream: stream,
      media: {
        audioSend: false,
        videoSend: false
      },
      // We want recvonly audio/video
      success: function success(jsep) {
        var body = {
          "request": "start",
          "room": self.currentDialogId
        };
        remoteFeed.send({
          "message": body,
          "jsep": jsep
        });

        if (typeof callbacks.success === 'function') {
          Utils.safeCallbackCall(callbacks.success);
        }
      },
      error: function error(_error11) {
        console.log("[createAnswer] error: ", _error11);

        if (typeof callbacks.error === 'function') {
          Utils.safeCallbackCall(callbacks.error, _error11);
        }
      }
    });
  },

  /**
   * @private
   */
  detachRemoteFeed: function detachRemoteFeed(userId) {
    var remoteFeed = this.remoteFeeds[userId];

    if (remoteFeed) {
      remoteFeed.detach();
      this.remoteFeeds[userId] = null;
      this.remoteJseps[userId] = null;
      return true;
    }

    return false;
  },

  /**
   * Start show a verbose description of the user's stream bitrate.
   * Refresh it every 1 second.
   *
   * @param {Number} userId - an id of user to gets stream bitrate.
   * @param {Object} element - DOM element to display bitrate on.
   */
  getUserBitrate: function getUserBitrate(userId) {
    var remoteFeed = this.remoteFeeds[userId];
    return remoteFeed.getBitrate();
  },
  getUserVolume: function getUserVolume(userId) {
    var remoteFeed = this.remoteFeeds[userId];
    return remoteFeed.getVolume();
  },
  showBitrate: function showBitrate(userId, element) {
    var remoteFeed = this.remoteFeeds[userId];

    if (!Utils.getEnv().reactnative && (adapter.browserDetails.browser === "chrome" || adapter.browserDetails.browser === "firefox")) {
      this.bitrateTimers[userId] = setInterval(function () {
        var bitrate = remoteFeed.getBitrate();
        element.text(bitrate);
      }, 1000);
    }
  },

  /**
   * Stop show a verbose description of the user's stream bitrate.
   *
   * @param {Number} userId - an id of user to stop show stream
   * bitrate.
   * @param {Object} element - DOM element to stop display bitrate on.
   */
  hideBitrate: function hideBitrate(userId, element) {
    if (this.bitrateTimers[userId]) {
      clearInterval(this.bitrateTimers[userId]);
    }

    this.bitrateTimers[userId] = null;
    element.text = null;
  },

  /**
   * Adds a listener to be invoked when events of the specified type are
   * emitted. The data arguments emitted will be passed to the listener
   * function. <br>
   * Possible events:
   * <ul>
   * <li>'participantjoined': (userId, userDisplayName)</li>
   * <li>'participantleft': (userId, userDisplayName)</li>
   * <li>'localstream': (stream)</li>
   * <li>'remotestream': (stream, userId)</li>
   * </ul>
   *
   * @param {String} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke when the specified
   *  event is emitted
   */
  on: function on(eventType, listener) {
    var token = this.emitter.addListener(eventType, listener);
  },

  /**
   * Removes all of the registered listeners.
   *
   * @param {?String} eventType - Optional name of the event whose registered
   *   listeners to remove.
   */
  removeAllListeners: function removeAllListeners(eventType) {
    if (eventType) {
      this.emitter.removeAllListeners(eventType);
    } else {
      this.emitter.removeAllListeners();
    }
  }
};
module.exports = {
  Client: VideoConferencingClient
};

/***/ }),

/***/ "./lib/videocalling_conference/janus.umd.js":
/*!**************************************************!*\
  !*** ./lib/videocalling_conference/janus.umd.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js"));

(function (global, factory) {
  ( false ? undefined : (0, _typeof2["default"])(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
})(void 0, function () {
  /* eslint-disable */

  /*
   * Module shim for rollup.js to work with.
   * Simply re-export Janus from janus.js, the real 'magic' is in the rollup config.
   *
   * Since this counts as 'autogenerated' code, ESLint is instructed to ignore the contents of this file when linting your project.
   */

  /*
  	The MIT License (MIT)
  
  	Copyright (c) 2016 Meetecho
  
  	Permission is hereby granted, free of charge, to any person obtaining
  	a copy of this software and associated documentation files (the "Software"),
  	to deal in the Software without restriction, including without limitation
  	the rights to use, copy, modify, merge, publish, distribute, sublicense,
  	and/or sell copies of the Software, and to permit persons to whom the
  	Software is furnished to do so, subject to the following conditions:
  
  	The above copyright notice and this permission notice shall be included
  	in all copies or substantial portions of the Software.
  
  	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
  	THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
  	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
  	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  	OTHER DEALINGS IN THE SOFTWARE.
   */
  // List of sessions
  Janus.sessions = {}; // Screensharing Chrome Extension ID

  Janus.extensionId = "hapfgfdkleiggjjpfpenajgdnfckjpaj";

  Janus.isExtensionEnabled = function () {
    if (window.navigator.userAgent.match('Chrome')) {
      var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
      var maxver = 33;
      if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux

      if (chromever >= 26 && chromever <= maxver) {
        // Older versions of Chrome don't support this extension-based approach, so lie
        return true;
      }

      return Janus.checkJanusExtension();
    } else {
      // Firefox of others, no need for the extension (but this doesn't mean it will work)
      return true;
    }
  };

  Janus.useDefaultDependencies = function (deps) {
    var f = deps && deps.fetch || fetch;
    var p = deps && deps.Promise || Promise;
    var socketCls = deps && deps.WebSocket || WebSocket;
    return {
      newWebSocket: function newWebSocket(server, proto) {
        return new socketCls(server, proto);
      },
      isArray: function isArray(arr) {
        return Array.isArray(arr);
      },
      checkJanusExtension: function checkJanusExtension() {
        return document.querySelector('#janus-extension-installed') !== null;
      },
      webRTCAdapter: deps && deps.adapter || adapter,
      httpAPICall: function httpAPICall(url, options) {
        var fetchOptions = {
          method: options.verb,
          cache: 'no-cache'
        };

        if (options.withCredentials !== undefined) {
          fetchOptions.credentials = options.withCredentials === true ? 'include' : options.withCredentials ? options.withCredentials : 'omit';
        }

        if (options.body !== undefined) {
          fetchOptions.body = JSON.stringify(options.body);
        }

        var fetching = f(url, fetchOptions)["catch"](function (error) {
          return p.reject({
            message: 'Probably a network error, is the gateway down?',
            error: error
          });
        });
        /*
         * fetch() does not natively support timeouts.
         * Work around this by starting a timeout manually, and racing it agains the fetch() to see which thing resolves first.
         */

        if (options.timeout !== undefined) {
          var timeout = new p(function (resolve, reject) {
            var timerId = setTimeout(function () {
              clearTimeout(timerId);
              return reject({
                message: 'Request timed out',
                timeout: options.timeout
              });
            }, options.timeout);
          });
          fetching = p.race([fetching, timeout]);
        }

        fetching.then(function (response) {
          if (response.ok) {
            if ((0, _typeof2["default"])(options.success) === (0, _typeof2["default"])(Janus.noop)) {
              return response.json().then(function (parsed) {
                options.success(parsed);
              })["catch"](function (error) {
                return p.reject({
                  message: 'Failed to parse response body',
                  error: error,
                  response: response
                });
              });
            }
          } else {
            return p.reject({
              message: 'API call failed',
              response: response
            });
          }
        })["catch"](function (error) {
          if ((0, _typeof2["default"])(options.error) === (0, _typeof2["default"])(Janus.noop)) {
            options.error(error.message || '<< internal error >>', error);
          }
        });
        return fetching;
      }
    };
  };

  Janus.useOldDependencies = function (deps) {
    var jq = deps && deps.jQuery || jQuery;
    var socketCls = deps && deps.WebSocket || WebSocket;
    return {
      newWebSocket: function newWebSocket(server, proto) {
        return new socketCls(server, proto);
      },
      isArray: function isArray(arr) {
        return jq.isArray(arr);
      },
      checkJanusExtension: function checkJanusExtension() {
        return jq('#janus-extension-installed').length > 0;
      },
      webRTCAdapter: deps && deps.adapter || adapter,
      httpAPICall: function httpAPICall(url, options) {
        var payload = options.body !== undefined ? {
          contentType: 'application/json',
          data: JSON.stringify(options.body)
        } : {};
        var credentials = options.withCredentials !== undefined ? {
          xhrFields: {
            withCredentials: options.withCredentials
          }
        } : {};
        return jq.ajax(jq.extend(payload, credentials, {
          url: url,
          type: options.verb,
          cache: false,
          dataType: 'json',
          async: options.async,
          timeout: options.timeout,
          success: function success(result) {
            if ((0, _typeof2["default"])(options.success) === (0, _typeof2["default"])(Janus.noop)) {
              options.success(result);
            }
          },
          error: function error(xhr, status, err) {
            if ((0, _typeof2["default"])(options.error) === (0, _typeof2["default"])(Janus.noop)) {
              options.error(status, err);
            }
          }
        }));
      }
    };
  };

  Janus.noop = function () {}; // Initialization


  Janus.init = function (options) {
    options = options || {};
    options.callback = typeof options.callback == "function" ? options.callback : Janus.noop;

    if (Janus.initDone === true) {
      // Already initialized
      options.callback();
    } else {
      if (typeof console == "undefined" || typeof console.log == "undefined") console = {
        log: function log() {}
      }; // Console logging (all debugging disabled by default)

      Janus.trace = Janus.noop;
      Janus.debug = Janus.noop;
      Janus.vdebug = Janus.noop;
      Janus.log = Janus.noop;
      Janus.warn = Janus.noop;
      Janus.error = Janus.noop;

      if (options.debug === true || options.debug === "all") {
        // Enable all debugging levels
        Janus.trace = console.trace.bind(console);
        Janus.debug = console.debug.bind(console);
        Janus.vdebug = console.debug.bind(console);
        Janus.log = console.log.bind(console);
        Janus.warn = console.warn.bind(console);
        Janus.error = console.error.bind(console);
      } else if (Array.isArray(options.debug)) {
        for (var i in options.debug) {
          var d = options.debug[i];

          switch (d) {
            case "trace":
              Janus.trace = console.trace.bind(console);
              break;

            case "debug":
              Janus.debug = console.debug.bind(console);
              break;

            case "vdebug":
              Janus.vdebug = console.debug.bind(console);
              break;

            case "log":
              Janus.log = console.log.bind(console);
              break;

            case "warn":
              Janus.warn = console.warn.bind(console);
              break;

            case "error":
              Janus.error = console.error.bind(console);
              break;

            default:
              console.error("Unknown debugging option '" + d + "' (supported: 'trace', 'debug', 'vdebug', 'log', warn', 'error')");
              break;
          }
        }
      }

      Janus.log("Initializing library");
      var usedDependencies = options.dependencies || Janus.useDefaultDependencies();
      Janus.isArray = usedDependencies.isArray;
      Janus.webRTCAdapter = usedDependencies.webRTCAdapter;
      Janus.httpAPICall = usedDependencies.httpAPICall;
      Janus.checkJanusExtension = usedDependencies.checkJanusExtension;
      Janus.newWebSocket = usedDependencies.newWebSocket; // Helper method to enumerate devices

      Janus.listDevices = function (callback, config) {
        callback = typeof callback == "function" ? callback : Janus.noop;
        if (config == null) config = {
          audio: true,
          video: true
        };

        if (navigator.mediaDevices) {
          navigator.mediaDevices.getUserMedia(config).then(function (stream) {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
              Janus.debug(devices);
              callback(devices); // Get rid of the now useless stream

              try {
                var tracks = stream.getTracks();

                for (var i in tracks) {
                  var mst = tracks[i];
                  if (mst !== null && mst !== undefined) mst.stop();
                }
              } catch (e) {}
            });
          })["catch"](function (err) {
            Janus.error(err);
            callback([]);
          });
        } else {
          Janus.warn("navigator.mediaDevices unavailable");
          callback([]);
        }
      }; // Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)


      Janus.attachMediaStream = function (element, stream) {
        if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
          var chromever = Janus.webRTCAdapter.browserDetails.version;

          if (chromever >= 43) {
            element.srcObject = stream;
          } else if (typeof element.src !== 'undefined') {
            element.src = URL.createObjectURL(stream);
          } else {
            Janus.error("Error attaching stream to element");
          }
        } else {
          element.srcObject = stream;
        }
      };

      Janus.reattachMediaStream = function (to, from) {
        if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
          var chromever = Janus.webRTCAdapter.browserDetails.version;

          if (chromever >= 43) {
            to.srcObject = from.srcObject;
          } else if (typeof to.src !== 'undefined') {
            to.src = from.src;
          } else {
            Janus.error("Error reattaching stream to element");
          }
        } else {
          to.srcObject = from.srcObject;
        }
      }; // Detect tab close: make sure we don't loose existing onbeforeunload handlers


      var oldOBF = window.onbeforeunload;

      window.onbeforeunload = function () {
        Janus.log("Closing window");

        for (var s in Janus.sessions) {
          if (Janus.sessions[s] !== null && Janus.sessions[s] !== undefined && Janus.sessions[s].destroyOnUnload) {
            Janus.log("Destroying session " + s);
            Janus.sessions[s].destroy({
              asyncRequest: false
            });
          }
        }

        if (oldOBF && typeof oldOBF == "function") oldOBF();
      };

      Janus.initDone = true;
      options.callback();
    }
  }; // Helper method to check whether WebRTC is supported by this browser


  Janus.isWebrtcSupported = function () {
    return window.RTCPeerConnection !== undefined && window.RTCPeerConnection !== null && navigator.getUserMedia !== undefined && navigator.getUserMedia !== null;
  }; // Helper method to create random identifiers (e.g., transaction)


  Janus.randomString = function (len) {
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';

    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }

    return randomString;
  };

  function Janus(gatewayCallbacks) {
    if (Janus.initDone === undefined) {
      gatewayCallbacks.error("Library not initialized");
      return {};
    }

    if (!Janus.isWebrtcSupported()) {
      gatewayCallbacks.error("WebRTC not supported by this browser");
      return {};
    }

    Janus.log("Library initialized: " + Janus.initDone);
    gatewayCallbacks = gatewayCallbacks || {};
    gatewayCallbacks.success = typeof gatewayCallbacks.success == "function" ? gatewayCallbacks.success : Janus.noop;
    gatewayCallbacks.error = typeof gatewayCallbacks.error == "function" ? gatewayCallbacks.error : Janus.noop;
    gatewayCallbacks.destroyed = typeof gatewayCallbacks.destroyed == "function" ? gatewayCallbacks.destroyed : Janus.noop;

    if (gatewayCallbacks.server === null || gatewayCallbacks.server === undefined) {
      gatewayCallbacks.error("Invalid gateway url");
      return {};
    }

    var websockets = false;
    var ws = null;
    var wsHandlers = {};
    var wsKeepaliveTimeoutId = null;
    var servers = null,
        serversIndex = 0;
    var server = gatewayCallbacks.server;

    if (Janus.isArray(server)) {
      Janus.log("Multiple servers provided (" + server.length + "), will use the first that works");
      server = null;
      servers = gatewayCallbacks.server;
      Janus.debug(servers);
    } else {
      if (server.indexOf("ws") === 0) {
        websockets = true;
        Janus.log("Using WebSockets to contact Janus: " + server);
      } else {
        websockets = false;
        Janus.log("Using REST API to contact Janus: " + server);
      }
    }

    var iceServers = gatewayCallbacks.iceServers;
    if (iceServers === undefined || iceServers === null) iceServers = [{
      urls: "stun:stun.l.google.com:19302"
    }];
    var iceTransportPolicy = gatewayCallbacks.iceTransportPolicy;
    var bundlePolicy = gatewayCallbacks.bundlePolicy; // Whether IPv6 candidates should be gathered

    var ipv6Support = gatewayCallbacks.ipv6;
    if (ipv6Support === undefined || ipv6Support === null) ipv6Support = false; // Whether we should enable the withCredentials flag for XHR requests

    var withCredentials = false;
    if (gatewayCallbacks.withCredentials !== undefined && gatewayCallbacks.withCredentials !== null) withCredentials = gatewayCallbacks.withCredentials === true; // Optional max events

    var maxev = null;
    if (gatewayCallbacks.max_poll_events !== undefined && gatewayCallbacks.max_poll_events !== null) maxev = gatewayCallbacks.max_poll_events;
    if (maxev < 1) maxev = 1; // Token to use (only if the token based authentication mechanism is enabled)

    var token = null;
    if (gatewayCallbacks.token !== undefined && gatewayCallbacks.token !== null) token = gatewayCallbacks.token; // API secret to use (only if the shared API secret is enabled)

    var apisecret = null;
    if (gatewayCallbacks.apisecret !== undefined && gatewayCallbacks.apisecret !== null) apisecret = gatewayCallbacks.apisecret; // Whether we should destroy this session when onbeforeunload is called

    this.destroyOnUnload = true;
    if (gatewayCallbacks.destroyOnUnload !== undefined && gatewayCallbacks.destroyOnUnload !== null) this.destroyOnUnload = gatewayCallbacks.destroyOnUnload === true;
    var connected = false; // var reconnected = false;
    // var reconnecting = false;

    var sessionId = null;
    var pluginHandles = {};
    var that = this;
    var retries = 0;
    var transactions = {};
    createSession(gatewayCallbacks); // Public methods

    this.getServer = function () {
      return server;
    };

    this.isConnected = function () {
      return connected;
    };

    this.getSessionId = function () {
      return sessionId;
    };

    this.destroy = function (callbacks) {
      destroySession(callbacks);
    };

    this.attach = function (callbacks) {
      createHandle(callbacks);
    };

    this.timeoutSessionCallback = typeof gatewayCallbacks.timeoutSessionCallback == "function" ? gatewayCallbacks.timeoutSessionCallback : Janus.noop;

    function eventHandler() {
      if (sessionId == null) return;
      Janus.debug('Long poll...');

      if (!connected) {
        Janus.warn("Is the gateway down? (connected=false)");
        return;
      }

      var longpoll = server + "/" + sessionId + "?rid=" + new Date().getTime();
      if (maxev !== undefined && maxev !== null) longpoll = longpoll + "&maxev=" + maxev;
      if (token !== null && token !== undefined) longpoll = longpoll + "&token=" + token;
      if (apisecret !== null && apisecret !== undefined) longpoll = longpoll + "&apisecret=" + apisecret;
      Janus.httpAPICall(longpoll, {
        verb: 'GET',
        withCredentials: withCredentials,
        success: handleEvent,
        timeout: 60000,
        // FIXME
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown);
          retries++;

          if (retries > 3) {
            // Did we just lose the gateway? :-(
            connected = false;
            gatewayCallbacks.error("Lost connection to the gateway (is it down?)");
            return;
          }

          eventHandler();
        }
      });
    } // Private event handler: this will trigger plugin callbacks, if set


    function handleEvent(json, skipTimeout) {
      retries = 0;
      if (!websockets && sessionId !== undefined && sessionId !== null && skipTimeout !== true) setTimeout(eventHandler, 200);

      if (!websockets && Janus.isArray(json)) {
        // We got an array: it means we passed a maxev > 1, iterate on all objects
        for (var i = 0; i < json.length; i++) {
          handleEvent(json[i], true);
        }

        return;
      }

      if (json["janus"] === "keepalive") {
        // Nothing happened
        Janus.vdebug("Got a keepalive on session " + sessionId);
        return;
      } else if (json["janus"] === "ack") {
        // Just an ack, we can probably ignore
        Janus.debug("Got an ack on session " + sessionId);
        Janus.debug(json);
        var transaction = json["transaction"];

        if (transaction !== null && transaction !== undefined) {
          var reportSuccess = transactions[transaction];

          if (reportSuccess !== null && reportSuccess !== undefined) {
            reportSuccess(json);
          }

          delete transactions[transaction];
        }

        return;
      } else if (json["janus"] === "success") {
        // Success!
        Janus.debug("Got a success on session " + sessionId);
        Janus.debug(json);
        var transaction = json["transaction"];

        if (transaction !== null && transaction !== undefined) {
          var reportSuccess = transactions[transaction];

          if (reportSuccess !== null && reportSuccess !== undefined) {
            reportSuccess(json);
          }

          delete transactions[transaction];
        }

        return;
      } else if (json["janus"] === "webrtcup") {
        // The PeerConnection with the gateway is up! Notify this
        Janus.debug("Got a webrtcup event on session " + sessionId);
        Janus.debug(json);
        var sender = json["sender"];

        if (sender === undefined || sender === null) {
          Janus.warn("Missing sender...");
          return;
        }

        var pluginHandle = pluginHandles[sender];

        if (pluginHandle === undefined || pluginHandle === null) {
          Janus.debug("This handle is not attached to this session");
          return;
        }

        pluginHandle.webrtcState(true);
        return;
      } else if (json["janus"] === "hangup") {
        // A plugin asked the core to hangup a PeerConnection on one of our handles
        Janus.debug("Got a hangup event on session " + sessionId);
        Janus.debug(json);
        var sender = json["sender"];

        if (sender === undefined || sender === null) {
          Janus.warn("Missing sender...");
          return;
        }

        var pluginHandle = pluginHandles[sender];

        if (pluginHandle === undefined || pluginHandle === null) {
          Janus.debug("This handle is not attached to this session");
          return;
        }

        pluginHandle.webrtcState(false, json["reason"]);
        pluginHandle.hangup();
      } else if (json["janus"] === "detached") {
        // A plugin asked the core to detach one of our handles
        Janus.debug("Got a detached event on session " + sessionId);
        Janus.debug(json);
        var sender = json["sender"];

        if (sender === undefined || sender === null) {
          Janus.warn("Missing sender...");
          return;
        }

        var pluginHandle = pluginHandles[sender];

        if (pluginHandle === undefined || pluginHandle === null) {
          // Don't warn here because destroyHandle causes this situation.
          return;
        }

        pluginHandle.detached = true;
        pluginHandle.ondetached();
        pluginHandle.detach();
      } else if (json["janus"] === "media") {
        // Media started/stopped flowing
        Janus.debug("Got a media event on session " + sessionId);
        Janus.debug(json);
        var sender = json["sender"];

        if (sender === undefined || sender === null) {
          Janus.warn("Missing sender...");
          return;
        }

        var pluginHandle = pluginHandles[sender];

        if (pluginHandle === undefined || pluginHandle === null) {
          Janus.debug("This handle is not attached to this session");
          return;
        }

        pluginHandle.mediaState(json["type"], json["receiving"]);
      } else if (json["janus"] === "slowlink") {
        Janus.debug("Got a slowlink event on session " + sessionId);
        Janus.debug(json); // Trouble uplink or downlink

        var sender = json["sender"];

        if (sender === undefined || sender === null) {
          Janus.warn("Missing sender...");
          return;
        }

        var pluginHandle = pluginHandles[sender];

        if (pluginHandle === undefined || pluginHandle === null) {
          Janus.debug("This handle is not attached to this session");
          return;
        }

        pluginHandle.slowLink(json["uplink"], json["nacks"]);
      } else if (json["janus"] === "error") {
        // Oops, something wrong happened
        Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

        Janus.debug(json);
        var transaction = json["transaction"];

        if (transaction !== null && transaction !== undefined) {
          var reportSuccess = transactions[transaction];

          if (reportSuccess !== null && reportSuccess !== undefined) {
            reportSuccess(json);
          }

          delete transactions[transaction];
        }

        return;
      } else if (json["janus"] === "event") {
        Janus.debug("Got a plugin event on session " + sessionId);
        Janus.debug(json);
        var sender = json["sender"];

        if (sender === undefined || sender === null) {
          Janus.warn("Missing sender...");
          return;
        }

        var plugindata = json["plugindata"];

        if (plugindata === undefined || plugindata === null) {
          Janus.warn("Missing plugindata...");
          return;
        }

        Janus.debug("  -- Event is coming from " + sender + " (" + plugindata["plugin"] + ")");
        var data = plugindata["data"];
        Janus.debug(data);
        var pluginHandle = pluginHandles[sender];

        if (pluginHandle === undefined || pluginHandle === null) {
          Janus.warn("This handle is not attached to this session");
          return;
        }

        var jsep = json["jsep"];

        if (jsep !== undefined && jsep !== null) {
          Janus.debug("Handling SDP as well...");
          Janus.debug(jsep);
        }

        var callback = pluginHandle.onmessage;

        if (callback !== null && callback !== undefined) {
          Janus.debug("Notifying application..."); // Send to callback specified when attaching plugin handle

          callback(data, jsep);
        } else {
          // Send to generic callback (?)
          Janus.debug("No provided notification callback");
        }
      } else if (json["janus"] === "timeout") {
        var sessionId = json["session_id"];
        var session = Janus.sessions[sessionId];

        if (session) {
          session.timeoutSessionCallback();
        }
      } else {
        Janus.warn("Unkown message/event  '" + json["janus"] + "' on session " + sessionId);
        Janus.debug(json);
      }
    } // Private helper to send keep-alive messages on WebSockets


    function keepAlive() {
      if (server === null || !websockets || !connected) return;
      wsKeepaliveTimeoutId = setTimeout(keepAlive, 30000);
      var request = {
        "janus": "keepalive",
        "session_id": sessionId,
        "transaction": Janus.randomString(12)
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
      ws.send(JSON.stringify(request));
    } // Private method to create a session


    function createSession(callbacks) {
      var transaction = Janus.randomString(12);
      var request = {
        "janus": "create",
        "transaction": transaction
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;

      if (server === null && Janus.isArray(servers)) {
        // We still need to find a working server from the list we were given
        server = servers[serversIndex];

        if (server.indexOf("ws") === 0) {
          websockets = true;
          Janus.log("Server #" + (serversIndex + 1) + ": trying WebSockets to contact Janus (" + server + ")");
        } else {
          websockets = false;
          Janus.log("Server #" + (serversIndex + 1) + ": trying REST API to contact Janus (" + server + ")");
        }
      }

      if (websockets) {
        ws = Janus.newWebSocket(server, 'janus-protocol');
        wsHandlers = {
          'error': function error() {
            console.warn("WS error");
            Janus.error("Error connecting to the Janus WebSockets server... " + server);

            if (Janus.isArray(servers)) {
              serversIndex++;

              if (serversIndex == servers.length) {
                // We tried all the servers the user gave us and they all failed
                callbacks.error("Error connecting to any of the provided Janus servers: Is the gateway down?");
                return;
              } // Let's try the next server


              server = null;
              setTimeout(function () {
                createSession(callbacks);
              }, 200);
              return;
            }

            callbacks.error("Error connecting to the Janus WebSockets server: Is the gateway down?");
          },
          'open': function open() {
            console.warn("WS connected"); // if(reconnecting){
            // 	reconnecting = false;
            // 	reconnected = true;
            // 	console.warn("WS reconnected");
            // }
            // if(!reconnected){
            // We need to be notified about the success

            transactions[transaction] = function (json) {
              Janus.debug(json);

              if (json["janus"] !== "success") {
                Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

                callbacks.error(json["error"].reason);
                return;
              }

              wsKeepaliveTimeoutId = setTimeout(keepAlive, 30000);
              connected = true;
              sessionId = json.data["id"];
              Janus.log("Created session: " + sessionId);
              Janus.sessions[sessionId] = that;
              callbacks.success();
            };

            ws.send(JSON.stringify(request)); // }else{
            // 	connected = true;
            // }
          },
          'message': function message(event) {
            handleEvent(JSON.parse(event.data));
          },
          'close': function close() {
            if (server === null || !connected) {
              return;
            } // if(connected){
            // 	reconnecting = false;
            // }


            connected = false; // reconnected = false;

            console.warn("WS close"); // // reconnection
            // //
            // // Try to reconnect in 5 seconds
            // setTimeout(function(){
            // 	reconnecting = true;
            // 	console.warn("WS reconnection");
            // 	createSession(callbacks);
            // }, 2000);
            // FIXME What if this is called when the page is closed?

            gatewayCallbacks.error("Lost connection to the gateway (is it down?)");
          }
        };

        for (var eventName in wsHandlers) {
          ws.addEventListener(eventName, wsHandlers[eventName]);
        }

        return;
      }

      Janus.httpAPICall(server, {
        verb: 'POST',
        withCredentials: withCredentials,
        body: request,
        success: function success(json) {
          Janus.debug(json);

          if (json["janus"] !== "success") {
            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

            callbacks.error(json["error"].reason);
            return;
          }

          connected = true;
          sessionId = json.data["id"];
          Janus.log("Created session: " + sessionId);
          Janus.sessions[sessionId] = that;
          eventHandler();
          callbacks.success();
        },
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown); // FIXME

          if (Janus.isArray(servers)) {
            serversIndex++;

            if (serversIndex == servers.length) {
              // We tried all the servers the user gave us and they all failed
              callbacks.error("Error connecting to any of the provided Janus servers: Is the gateway down?");
              return;
            } // Let's try the next server


            server = null;
            setTimeout(function () {
              createSession(callbacks);
            }, 200);
            return;
          }

          if (errorThrown === "") callbacks.error(textStatus + ": Is the gateway down?");else callbacks.error(textStatus + ": " + errorThrown);
        }
      });
    } // Private method to destroy a session


    function destroySession(callbacks) {
      callbacks = callbacks || {}; // FIXME This method triggers a success even when we fail

      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      var asyncRequest = true;
      if (callbacks.asyncRequest !== undefined && callbacks.asyncRequest !== null) asyncRequest = callbacks.asyncRequest === true;
      Janus.log("Destroying session " + sessionId + " (async=" + asyncRequest + ")");

      if (!connected) {
        Janus.warn("Is the gateway down? (connected=false)");
        callbacks.success();
        return;
      }

      if (sessionId === undefined || sessionId === null) {
        Janus.warn("No session to destroy");
        callbacks.success();
        gatewayCallbacks.destroyed();
        return;
      }

      delete Janus.sessions[sessionId]; // No need to destroy all handles first, Janus will do that itself

      var request = {
        "janus": "destroy",
        "transaction": Janus.randomString(12)
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;

      if (websockets) {
        request["session_id"] = sessionId;

        var unbindWebSocket = function unbindWebSocket() {
          for (var eventName in wsHandlers) {
            ws.removeEventListener(eventName, wsHandlers[eventName]);
          }

          ws.removeEventListener('message', onUnbindMessage);
          ws.removeEventListener('error', onUnbindError);

          if (wsKeepaliveTimeoutId) {
            clearTimeout(wsKeepaliveTimeoutId);
          }

          ws.close();
        };

        var onUnbindMessage = function onUnbindMessage(event) {
          var data = JSON.parse(event.data);

          if (data.session_id == request.session_id && data.transaction == request.transaction) {
            unbindWebSocket();
            callbacks.success();
            gatewayCallbacks.destroyed();
          }
        };

        var onUnbindError = function onUnbindError(event) {
          unbindWebSocket();
          callbacks.error("Failed to destroy the gateway: Is the gateway down?");
          gatewayCallbacks.destroyed();
        };

        ws.addEventListener('message', onUnbindMessage);
        ws.addEventListener('error', onUnbindError);
        ws.send(JSON.stringify(request));
        return;
      }

      Janus.httpAPICall(server + "/" + sessionId, {
        verb: 'POST',
        async: asyncRequest,
        // Sometimes we need false here, or destroying in onbeforeunload won't work
        withCredentials: withCredentials,
        body: request,
        success: function success(json) {
          Janus.log("Destroyed session:");
          Janus.debug(json);
          sessionId = null;
          connected = false;

          if (json["janus"] !== "success") {
            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
          }

          callbacks.success();
          gatewayCallbacks.destroyed();
        },
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown); // FIXME
          // Reset everything anyway

          sessionId = null;
          connected = false;
          callbacks.success();
          gatewayCallbacks.destroyed();
        }
      });
    } // Private method to create a plugin handle


    function createHandle(callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      callbacks.consentDialog = typeof callbacks.consentDialog == "function" ? callbacks.consentDialog : Janus.noop;
      callbacks.iceState = typeof callbacks.iceState == "function" ? callbacks.iceState : Janus.noop;
      callbacks.mediaState = typeof callbacks.mediaState == "function" ? callbacks.mediaState : Janus.noop;
      callbacks.webrtcState = typeof callbacks.webrtcState == "function" ? callbacks.webrtcState : Janus.noop;
      callbacks.slowLink = typeof callbacks.slowLink == "function" ? callbacks.slowLink : Janus.noop;
      callbacks.onmessage = typeof callbacks.onmessage == "function" ? callbacks.onmessage : Janus.noop;
      callbacks.onlocalstream = typeof callbacks.onlocalstream == "function" ? callbacks.onlocalstream : Janus.noop;
      callbacks.onremotestream = typeof callbacks.onremotestream == "function" ? callbacks.onremotestream : Janus.noop;
      callbacks.ondata = typeof callbacks.ondata == "function" ? callbacks.ondata : Janus.noop;
      callbacks.ondataopen = typeof callbacks.ondataopen == "function" ? callbacks.ondataopen : Janus.noop;
      callbacks.oncleanup = typeof callbacks.oncleanup == "function" ? callbacks.oncleanup : Janus.noop;
      callbacks.ondetached = typeof callbacks.ondetached == "function" ? callbacks.ondetached : Janus.noop;

      if (!connected) {
        Janus.warn("Is the gateway down? (connected=false)");
        callbacks.error("Is the gateway down? (connected=false)");
        return;
      }

      var plugin = callbacks.plugin;

      if (plugin === undefined || plugin === null) {
        Janus.error("Invalid plugin");
        callbacks.error("Invalid plugin");
        return;
      }

      var opaqueId = callbacks.opaqueId;
      var transaction = Janus.randomString(12);
      var request = {
        "janus": "attach",
        "plugin": plugin,
        "opaque_id": opaqueId,
        "transaction": transaction
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret; // If we know the browser supports BUNDLE and/or rtcp-mux, let's advertise those right away

      if (Janus.webRTCAdapter.browserDetails.browser == "chrome" || Janus.webRTCAdapter.browserDetails.browser == "firefox" || Janus.webRTCAdapter.browserDetails.browser == "safari") {
        request["force-bundle"] = true;
        request["force-rtcp-mux"] = true;
      }

      if (websockets) {
        transactions[transaction] = function (json) {
          Janus.debug(json);

          if (json["janus"] !== "success") {
            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

            callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
            return;
          }

          var handleId = json.data["id"];
          Janus.log("Created handle: " + handleId);
          var pluginHandle = {
            session: that,
            plugin: plugin,
            id: handleId,
            detached: false,
            webrtcStuff: {
              started: false,
              myStream: null,
              streamExternal: false,
              remoteStream: null,
              mySdp: null,
              mediaConstraints: null,
              pc: null,
              dataChannel: null,
              dtmfSender: null,
              trickle: true,
              iceDone: false,
              volume: {
                value: null,
                timer: null
              },
              bitrate: {
                value: null,
                bsnow: null,
                bsbefore: null,
                tsnow: null,
                tsbefore: null,
                timer: null
              }
            },
            getId: function getId() {
              return handleId;
            },
            getPlugin: function getPlugin() {
              return plugin;
            },
            getVolume: function getVolume() {
              return _getVolume(handleId);
            },
            isAudioMuted: function isAudioMuted() {
              return isMuted(handleId, false);
            },
            muteAudio: function muteAudio() {
              return mute(handleId, false, true);
            },
            unmuteAudio: function unmuteAudio() {
              return mute(handleId, false, false);
            },
            isVideoMuted: function isVideoMuted() {
              return isMuted(handleId, true);
            },
            muteVideo: function muteVideo() {
              return mute(handleId, true, true);
            },
            unmuteVideo: function unmuteVideo() {
              return mute(handleId, true, false);
            },
            getBitrate: function getBitrate() {
              return _getBitrate(handleId);
            },
            send: function send(callbacks) {
              sendMessage(handleId, callbacks);
            },
            data: function data(callbacks) {
              sendData(handleId, callbacks);
            },
            dtmf: function dtmf(callbacks) {
              sendDtmf(handleId, callbacks);
            },
            consentDialog: callbacks.consentDialog,
            iceState: callbacks.iceState,
            mediaState: callbacks.mediaState,
            webrtcState: callbacks.webrtcState,
            slowLink: callbacks.slowLink,
            onmessage: callbacks.onmessage,
            createOffer: function createOffer(callbacks) {
              prepareWebrtc(handleId, callbacks);
            },
            createAnswer: function createAnswer(callbacks) {
              prepareWebrtc(handleId, callbacks);
            },
            handleRemoteJsep: function handleRemoteJsep(callbacks) {
              prepareWebrtcPeer(handleId, callbacks);
            },
            onlocalstream: callbacks.onlocalstream,
            onremotestream: callbacks.onremotestream,
            ondata: callbacks.ondata,
            ondataopen: callbacks.ondataopen,
            oncleanup: callbacks.oncleanup,
            ondetached: callbacks.ondetached,
            hangup: function hangup(sendRequest) {
              cleanupWebrtc(handleId, sendRequest === true);
            },
            detach: function detach(callbacks) {
              destroyHandle(handleId, callbacks);
            }
          };
          pluginHandles[handleId] = pluginHandle;
          callbacks.success(pluginHandle);
        };

        request["session_id"] = sessionId;
        ws.send(JSON.stringify(request));
        return;
      }

      Janus.httpAPICall(server + "/" + sessionId, {
        verb: 'POST',
        withCredentials: withCredentials,
        body: request,
        success: function success(json) {
          Janus.debug(json);

          if (json["janus"] !== "success") {
            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

            callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
            return;
          }

          var handleId = json.data["id"];
          Janus.log("Created handle: " + handleId);
          var pluginHandle = {
            session: that,
            plugin: plugin,
            id: handleId,
            detached: false,
            webrtcStuff: {
              started: false,
              myStream: null,
              streamExternal: false,
              remoteStream: null,
              mySdp: null,
              mediaConstraints: null,
              pc: null,
              dataChannel: null,
              dtmfSender: null,
              trickle: true,
              iceDone: false,
              volume: {
                value: null,
                timer: null
              },
              bitrate: {
                value: null,
                bsnow: null,
                bsbefore: null,
                tsnow: null,
                tsbefore: null,
                timer: null
              }
            },
            getId: function getId() {
              return handleId;
            },
            getPlugin: function getPlugin() {
              return plugin;
            },
            getVolume: function getVolume() {
              return _getVolume(handleId);
            },
            isAudioMuted: function isAudioMuted() {
              return isMuted(handleId, false);
            },
            muteAudio: function muteAudio() {
              return mute(handleId, false, true);
            },
            unmuteAudio: function unmuteAudio() {
              return mute(handleId, false, false);
            },
            isVideoMuted: function isVideoMuted() {
              return isMuted(handleId, true);
            },
            muteVideo: function muteVideo() {
              return mute(handleId, true, true);
            },
            unmuteVideo: function unmuteVideo() {
              return mute(handleId, true, false);
            },
            getBitrate: function getBitrate() {
              return _getBitrate(handleId);
            },
            send: function send(callbacks) {
              sendMessage(handleId, callbacks);
            },
            data: function data(callbacks) {
              sendData(handleId, callbacks);
            },
            dtmf: function dtmf(callbacks) {
              sendDtmf(handleId, callbacks);
            },
            consentDialog: callbacks.consentDialog,
            iceState: callbacks.iceState,
            mediaState: callbacks.mediaState,
            webrtcState: callbacks.webrtcState,
            slowLink: callbacks.slowLink,
            onmessage: callbacks.onmessage,
            createOffer: function createOffer(callbacks) {
              prepareWebrtc(handleId, callbacks);
            },
            createAnswer: function createAnswer(callbacks) {
              prepareWebrtc(handleId, callbacks);
            },
            handleRemoteJsep: function handleRemoteJsep(callbacks) {
              prepareWebrtcPeer(handleId, callbacks);
            },
            onlocalstream: callbacks.onlocalstream,
            onremotestream: callbacks.onremotestream,
            ondata: callbacks.ondata,
            ondataopen: callbacks.ondataopen,
            oncleanup: callbacks.oncleanup,
            ondetached: callbacks.ondetached,
            hangup: function hangup(sendRequest) {
              cleanupWebrtc(handleId, sendRequest === true);
            },
            detach: function detach(callbacks) {
              destroyHandle(handleId, callbacks);
            }
          };
          pluginHandles[handleId] = pluginHandle;
          callbacks.success(pluginHandle);
        },
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown); // FIXME
        }
      });
    } // Private method to send a message


    function sendMessage(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;

      if (!connected) {
        Janus.warn("Is the gateway down? (connected=false)");
        callbacks.error("Is the gateway down? (connected=false)");
        return;
      }

      var message = callbacks.message;
      var jsep = callbacks.jsep;
      var transaction = Janus.randomString(12);
      var request = {
        "janus": "message",
        "body": message,
        "transaction": transaction
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
      if (jsep !== null && jsep !== undefined) request.jsep = jsep;
      Janus.debug("Sending message to plugin (handle=" + handleId + "):");
      Janus.debug(request);

      if (websockets) {
        request["session_id"] = sessionId;
        request["handle_id"] = handleId;

        transactions[transaction] = function (json) {
          Janus.debug("Message sent!");
          Janus.debug(json);

          if (json["janus"] === "success") {
            // We got a success, must have been a synchronous transaction
            var plugindata = json["plugindata"];

            if (plugindata === undefined || plugindata === null) {
              Janus.warn("Request succeeded, but missing plugindata...");
              callbacks.success();
              return;
            }

            Janus.log("Synchronous transaction successful (" + plugindata["plugin"] + ")");
            var data = plugindata["data"];
            Janus.debug(data);
            callbacks.success(data);
            return;
          } else if (json["janus"] !== "ack") {
            // Not a success and not an ack, must be an error
            if (json["error"] !== undefined && json["error"] !== null) {
              Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

              callbacks.error(json["error"].code + " " + json["error"].reason);
            } else {
              Janus.error("Unknown error"); // FIXME

              callbacks.error("Unknown error");
            }

            return;
          } // If we got here, the plugin decided to handle the request asynchronously


          callbacks.success();
        };

        ws.send(JSON.stringify(request));
        return;
      }

      Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
        verb: 'POST',
        withCredentials: withCredentials,
        body: request,
        success: function success(json) {
          Janus.debug("Message sent!");
          Janus.debug(json);

          if (json["janus"] === "success") {
            // We got a success, must have been a synchronous transaction
            var plugindata = json["plugindata"];

            if (plugindata === undefined || plugindata === null) {
              Janus.warn("Request succeeded, but missing plugindata...");
              callbacks.success();
              return;
            }

            Janus.log("Synchronous transaction successful (" + plugindata["plugin"] + ")");
            var data = plugindata["data"];
            Janus.debug(data);
            callbacks.success(data);
            return;
          } else if (json["janus"] !== "ack") {
            // Not a success and not an ack, must be an error
            if (json["error"] !== undefined && json["error"] !== null) {
              Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

              callbacks.error(json["error"].code + " " + json["error"].reason);
            } else {
              Janus.error("Unknown error"); // FIXME

              callbacks.error("Unknown error");
            }

            return;
          } // If we got here, the plugin decided to handle the request asynchronously


          callbacks.success();
        },
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown); // FIXME

          callbacks.error(textStatus + ": " + errorThrown);
        }
      });
    } // Private method to send a trickle candidate


    function sendTrickleCandidate(handleId, candidate) {
      if (!connected) {
        Janus.warn("Is the gateway down? (connected=false)");
        return;
      }

      var request = {
        "janus": "trickle",
        "candidate": candidate,
        "transaction": Janus.randomString(12)
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
      Janus.vdebug("Sending trickle candidate (handle=" + handleId + "):");
      Janus.vdebug(request);

      if (websockets) {
        request["session_id"] = sessionId;
        request["handle_id"] = handleId;
        ws.send(JSON.stringify(request));
        return;
      }

      Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
        verb: 'POST',
        withCredentials: withCredentials,
        body: request,
        success: function success(json) {
          Janus.vdebug("Candidate sent!");
          Janus.vdebug(json);

          if (json["janus"] !== "ack") {
            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME

            return;
          }
        },
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown); // FIXME
        }
      });
    } // Private method to send a data channel message


    function sendData(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff;
      var text = callbacks.text;

      if (text === null || text === undefined) {
        Janus.warn("Invalid text");
        callbacks.error("Invalid text");
        return;
      }

      Janus.log("Sending string on data channel: " + text);
      config.dataChannel.send(text);
      callbacks.success();
    } // Private method to send a DTMF tone


    function sendDtmf(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff;

      if (config.dtmfSender === null || config.dtmfSender === undefined) {
        // Create the DTMF sender, if possible
        if (config.myStream !== undefined && config.myStream !== null) {
          var tracks = config.myStream.getAudioTracks();

          if (tracks !== null && tracks !== undefined && tracks.length > 0) {
            var local_audio_track = tracks[0];
            config.dtmfSender = config.pc.createDTMFSender(local_audio_track);
            Janus.log("Created DTMF Sender");

            config.dtmfSender.ontonechange = function (tone) {
              Janus.debug("Sent DTMF tone: " + tone.tone);
            };
          }
        }

        if (config.dtmfSender === null || config.dtmfSender === undefined) {
          Janus.warn("Invalid DTMF configuration");
          callbacks.error("Invalid DTMF configuration");
          return;
        }
      }

      var dtmf = callbacks.dtmf;

      if (dtmf === null || dtmf === undefined) {
        Janus.warn("Invalid DTMF parameters");
        callbacks.error("Invalid DTMF parameters");
        return;
      }

      var tones = dtmf.tones;

      if (tones === null || tones === undefined) {
        Janus.warn("Invalid DTMF string");
        callbacks.error("Invalid DTMF string");
        return;
      }

      var duration = dtmf.duration;
      if (duration === null || duration === undefined) duration = 500; // We choose 500ms as the default duration for a tone

      var gap = dtmf.gap;
      if (gap === null || gap === undefined) gap = 50; // We choose 50ms as the default gap between tones

      Janus.debug("Sending DTMF string " + tones + " (duration " + duration + "ms, gap " + gap + "ms)");
      config.dtmfSender.insertDTMF(tones, duration, gap);
    } // Private method to destroy a plugin handle


    function destroyHandle(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      var asyncRequest = true;
      if (callbacks.asyncRequest !== undefined && callbacks.asyncRequest !== null) asyncRequest = callbacks.asyncRequest === true;
      Janus.log("Destroying handle " + handleId + " (async=" + asyncRequest + ")");
      cleanupWebrtc(handleId);

      if (pluginHandles[handleId].detached) {
        // Plugin was already detached by Janus, calling detach again will return a handle not found error, so just exit here
        delete pluginHandles[handleId];
        callbacks.success();
        return;
      }

      if (!connected) {
        Janus.warn("Is the gateway down? (connected=false)");
        callbacks.error("Is the gateway down? (connected=false)");
        return;
      }

      var request = {
        "janus": "detach",
        "transaction": Janus.randomString(12)
      };
      if (token !== null && token !== undefined) request["token"] = token;
      if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;

      if (websockets) {
        request["session_id"] = sessionId;
        request["handle_id"] = handleId;
        ws.send(JSON.stringify(request));
        delete pluginHandles[handleId];
        callbacks.success();
        return;
      }

      Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
        verb: 'POST',
        async: asyncRequest,
        // Sometimes we need false here, or destroying in onbeforeunload won't work
        withCredentials: withCredentials,
        body: request,
        success: function success(json) {
          Janus.log("Destroyed handle:");
          Janus.debug(json);

          if (json["janus"] !== "success") {
            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
          }

          delete pluginHandles[handleId];
          callbacks.success();
        },
        error: function error(textStatus, errorThrown) {
          Janus.error(textStatus + ": " + errorThrown); // FIXME
          // We cleanup anyway

          delete pluginHandles[handleId];
          callbacks.success();
        }
      });
    } // WebRTC stuff


    function streamsDone(handleId, jsep, media, callbacks, stream) {
      console.warn("streamsDone", media);
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff;
      Janus.debug("streamsDone:", stream);

      if (stream) {
        Janus.debug("  -- Audio tracks:", stream.getAudioTracks());
        Janus.debug("  -- Video tracks:", stream.getVideoTracks());
      } // If we're updating, check if we need to remove/replace one of the tracks


      if (media.update && !config.streamExternal) {
        if (media.removeAudio || media.replaceAudio) {
          if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
            Janus.log("Removing audio track:", config.myStream.getAudioTracks()[0]);
            config.myStream.removeTrack(config.myStream.getAudioTracks()[0]);
          }

          if (config.pc.getSenders() && config.pc.getSenders().length) {
            for (var index in config.pc.getSenders()) {
              var s = config.pc.getSenders()[index];

              if (s && s.track && s.track.kind === "audio") {
                Janus.log("Removing audio sender:", s);
                config.pc.removeTrack(s);
              }
            }
          }
        }

        if (media.removeVideo || media.replaceVideo) {
          if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
            Janus.log("Removing video track:", config.myStream.getVideoTracks()[0]);
            config.myStream.removeTrack(config.myStream.getVideoTracks()[0]);
          }

          if (config.pc.getSenders() && config.pc.getSenders().length) {
            for (var index in config.pc.getSenders()) {
              var s = config.pc.getSenders()[index];

              if (s && s.track && s.track.kind === "video") {
                Janus.log("Removing video sender:", s);
                config.pc.removeTrack(s);
              }
            }
          }
        }
      } // We're now capturing the new stream: check if we're updating or if it's a new thing


      var addTracks = false;

      if (!config.myStream || !media.update || config.streamExternal) {
        config.myStream = stream;
        addTracks = true;
      } else {
        // We only need to update the existing stream
        if ((!media.update && isAudioSendEnabled(media) || media.update && (media.addAudio || media.replaceAudio)) && stream.getAudioTracks() && stream.getAudioTracks().length) {
          Janus.log("Adding audio track:", stream.getAudioTracks()[0]);
          config.myStream.addTrack(stream.getAudioTracks()[0]);
          config.pc.addTrack(stream.getAudioTracks()[0], stream);
        }

        if ((!media.update && isVideoSendEnabled(media) || media.update && (media.addVideo || media.replaceVideo)) && stream.getVideoTracks() && stream.getVideoTracks().length) {
          Janus.log("Adding video track:", stream.getVideoTracks()[0]);
          config.myStream.addTrack(stream.getVideoTracks()[0]);
          config.pc.addTrack(stream.getVideoTracks()[0], stream);
        }
      } // If we still need to create a PeerConnection, let's do that


      if (!config.pc) {
        var pc_config = {
          "iceServers": iceServers,
          "iceTransportPolicy": iceTransportPolicy,
          "bundlePolicy": bundlePolicy
        }; //~ var pc_constraints = {'mandatory': {'MozDontOfferDataChannel':true}};

        var pc_constraints = {
          "optional": [{
            "DtlsSrtpKeyAgreement": true
          }]
        };

        if (ipv6Support === true) {
          // FIXME This is only supported in Chrome right now
          // For support in Firefox track this: https://bugzilla.mozilla.org/show_bug.cgi?id=797262
          pc_constraints.optional.push({
            "googIPv6": true
          });
        } // Any custom constraint to add?


        if (callbacks.rtcConstraints && (0, _typeof2["default"])(callbacks.rtcConstraints) === 'object') {
          Janus.debug("Adding custom PeerConnection constraints:", callbacks.rtcConstraints);

          for (var i in callbacks.rtcConstraints) {
            pc_constraints.optional.push(callbacks.rtcConstraints[i]);
          }
        }

        if (Janus.webRTCAdapter.browserDetails.browser === "edge") {
          // This is Edge, enable BUNDLE explicitly
          pc_config.bundlePolicy = "max-bundle";
        }

        Janus.log("Creating PeerConnection");
        Janus.debug(pc_constraints);
        config.pc = new RTCPeerConnection(pc_config, pc_constraints);
        Janus.debug(config.pc);

        if (config.pc.getStats) {
          // FIXME
          config.volume.value = 0;
          config.bitrate.value = "0 kbits/sec";
        }

        Janus.log("Preparing local SDP and gathering candidates (trickle=" + config.trickle + ")");

        config.pc.oniceconnectionstatechange = function (e) {
          if (config.pc) pluginHandle.iceState(config.pc.iceConnectionState);
        };

        config.pc.onicecandidate = function (event) {
          if (event.candidate == null || Janus.webRTCAdapter.browserDetails.browser === 'edge' && event.candidate.candidate.indexOf('endOfCandidates') > 0) {
            Janus.log("End of candidates.");
            config.iceDone = true;

            if (config.trickle === true) {
              // Notify end of candidates
              sendTrickleCandidate(handleId, {
                "completed": true
              });
            } else {
              // No trickle, time to send the complete SDP (including all candidates)
              sendSDP(handleId, callbacks);
            }
          } else {
            // JSON.stringify doesn't work on some WebRTC objects anymore
            // See https://code.google.com/p/chromium/issues/detail?id=467366
            var candidate = {
              "candidate": event.candidate.candidate,
              "sdpMid": event.candidate.sdpMid,
              "sdpMLineIndex": event.candidate.sdpMLineIndex
            };

            if (config.trickle === true) {
              // Send candidate
              sendTrickleCandidate(handleId, candidate);
            }
          }
        };

        config.pc.ontrack = function (event) {
          Janus.log("Handling Remote Track");
          Janus.debug(event);
          if (!event.streams) return;

          if (!config.remoteStream) {
            config.remoteStream = event.streams[0];
            pluginHandle.onremotestream(config.remoteStream);
          }

          if (event.track && !event.track.onended) {
            Janus.log("Adding onended callback to track:", event.track);
            config.remoteStream.addTrack(event.track);

            event.track.onended = function (ev) {
              Janus.log("Remote track removed:", ev);

              if (config.remoteStream) {
                config.remoteStream.removeTrack(ev.target);
                pluginHandle.onremotestream(config.remoteStream);
              }
            };
          }
        };
      }

      if (addTracks && stream !== null && stream !== undefined) {
        Janus.log('Adding local stream');
        stream.getTracks().forEach(function (track) {
          config.pc.addTrack(track, stream);
        });
      } // Any data channel to create?


      if (isDataEnabled(media) && !config.dataChannel) {
        Janus.log("Creating data channel");

        var onDataChannelMessage = function onDataChannelMessage(event) {
          Janus.log('Received message on data channel: ' + event.data);
          pluginHandle.ondata(event.data); // FIXME
        };

        var onDataChannelStateChange = function onDataChannelStateChange() {
          var dcState = config.dataChannel !== null ? config.dataChannel.readyState : "null";
          Janus.log('State change on data channel: ' + dcState);

          if (dcState === 'open') {
            pluginHandle.ondataopen(); // FIXME
          }
        };

        var onDataChannelError = function onDataChannelError(error) {
          Janus.error('Got error on data channel:', error); // TODO
        }; // Until we implement the proxying of open requests within the Janus core, we open a channel ourselves whatever the case


        config.dataChannel = config.pc.createDataChannel("JanusDataChannel", {
          ordered: false
        }); // FIXME Add options (ordered, maxRetransmits, etc.)

        config.dataChannel.onmessage = onDataChannelMessage;
        config.dataChannel.onopen = onDataChannelStateChange;
        config.dataChannel.onclose = onDataChannelStateChange;
        config.dataChannel.onerror = onDataChannelError;
      } // If there's a new local stream, let's notify the application


      if (config.myStream) pluginHandle.onlocalstream(config.myStream); // Create offer/answer now

      if (jsep === null || jsep === undefined) {
        createOffer(handleId, media, callbacks);
      } else {
        config.pc.setRemoteDescription(new RTCSessionDescription(jsep), function () {
          Janus.log("Remote description accepted!");
          createAnswer(handleId, media, callbacks);
        }, callbacks.error);
      }
    }

    function prepareWebrtc(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : webrtcError;
      var jsep = callbacks.jsep;
      callbacks.media = callbacks.media || {
        audio: true,
        video: true
      };
      var media = callbacks.media;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff; // Are we updating a session?

      if (config.pc === undefined || config.pc === null) {
        // Nope, new PeerConnection
        media.update = false;
      } else if (config.pc !== undefined && config.pc !== null) {
        Janus.log("Updating existing media session");
        media.update = true; // Check if there's anything do add/remove/replace, or if we
        // can go directly to preparing the new SDP offer or answer

        if (callbacks.stream !== null && callbacks.stream !== undefined) {
          // External stream: is this the same as the one we were using before?
          if (callbacks.stream !== config.myStream) {
            Janus.log("Renegotiation involves a new external stream");
          }
        } else {
          // Check if there are changes on audio
          if (media.addAudio) {
            media.replaceAudio = false;
            media.removeAudio = false;
            media.audioSend = true;

            if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
              Janus.error("Can't add audio stream, there already is one");
              callbacks.error("Can't add audio stream, there already is one");
              return;
            }
          } else if (media.removeAudio) {
            media.replaceAudio = false;
            media.addAudio = false;
            media.audioSend = false;
          } else if (media.replaceAudio) {
            media.addAudio = false;
            media.removeAudio = false;
            media.audioSend = true;
          }

          if (config.myStream === null || config.myStream === undefined) {
            // No media stream: if we were asked to replace, it's actually an "add"
            if (media.replaceAudio) {
              media.replaceAudio = false;
              media.addAudio = true;
              media.audioSend = true;
            }

            if (isAudioSendEnabled(media)) media.addAudio = true;
          } else {
            if (config.myStream.getAudioTracks() === null || config.myStream.getAudioTracks() === undefined || config.myStream.getAudioTracks().length === 0) {
              // No audio track: if we were asked to replace, it's actually an "add"
              if (media.replaceAudio) {
                media.replaceAudio = false;
                media.addAudio = true;
                media.audioSend = true;
              }

              if (isAudioSendEnabled(media)) media.addAudio = true;
            }
          } // Check if there are changes on video


          if (media.addVideo) {
            media.replaceVideo = false;
            media.removeVideo = false;
            media.videoSend = true;

            if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
              Janus.error("Can't add video stream, there already is one");
              callbacks.error("Can't add video stream, there already is one");
              return;
            }
          } else if (media.removeVideo) {
            media.replaceVideo = false;
            media.addVideo = false;
            media.videoSend = false;
          } else if (media.replaceVideo) {
            media.addVideo = false;
            media.removeVideo = false;
            media.videoSend = true;
          }

          if (config.myStream === null || config.myStream === undefined) {
            // No media stream: if we were asked to replace, it's actually an "add"
            if (media.replaceVideo) {
              media.replaceVideo = false;
              media.addVideo = true;
              media.videoSend = true;
            }

            if (isVideoSendEnabled(media)) media.addVideo = true;
          } else {
            if (config.myStream.getVideoTracks() === null || config.myStream.getVideoTracks() === undefined || config.myStream.getVideoTracks().length === 0) {
              // No video track: if we were asked to replace, it's actually an "add"
              if (media.replaceVideo) {
                media.replaceVideo = false;
                media.addVideo = true;
                media.videoSend = true;
              }

              if (isVideoSendEnabled(media)) media.addVideo = true;
            }
          } // Data channels can only be added


          if (media.addData) media.data = true;
        }
      }

      config.trickle = isTrickleEnabled(callbacks.trickle); // Was a MediaStream object passed, or do we need to take care of that?

      if (callbacks.stream !== null && callbacks.stream !== undefined) {
        var stream = callbacks.stream;
        Janus.log("MediaStream provided by the application");
        Janus.debug(stream); // If this is an update, let's check if we need to release the previous stream

        if (media.update) {
          if (config.myStream && config.myStream !== callbacks.stream && !config.streamExternal) {
            // We're replacing a stream we captured ourselves with an external one
            try {
              // Try a MediaStreamTrack.stop() for each track
              var tracks = config.myStream.getTracks();

              for (var i in tracks) {
                var mst = tracks[i];
                Janus.log(mst);
                if (mst !== null && mst !== undefined) mst.stop();
              }
            } catch (e) {// Do nothing if this fails
            }

            config.myStream = null;
          }
        } // Skip the getUserMedia part


        config.streamExternal = true;
        streamsDone(handleId, jsep, media, callbacks, stream);
        return;
      }

      if (isAudioSendEnabled(media) || isVideoSendEnabled(media)) {
        var constraints = {
          mandatory: {},
          optional: []
        };
        pluginHandle.consentDialog(true);
        var audioSupport = isAudioSendEnabled(media);

        if (audioSupport === true && media != undefined && media != null) {
          if ((0, _typeof2["default"])(media.audio) === 'object') {
            audioSupport = media.audio;
          }
        }

        var videoSupport = isVideoSendEnabled(media);

        if (videoSupport === true && media != undefined && media != null) {
          var simulcast = callbacks.simulcast === true ? true : false;
          if (simulcast && !jsep && (media.video === undefined || media.video === false)) media.video = "hires";

          if (media.video && media.video != 'screen' && media.video != 'window') {
            if ((0, _typeof2["default"])(media.video) === 'object') {
              videoSupport = media.video;
            } else {
              var width = 0;
              var height = 0,
                  maxHeight = 0;

              if (media.video === 'lowres') {
                // Small resolution, 4:3
                height = 240;
                maxHeight = 240;
                width = 320;
              } else if (media.video === 'lowres-16:9') {
                // Small resolution, 16:9
                height = 180;
                maxHeight = 180;
                width = 320;
              } else if (media.video === 'hires' || media.video === 'hires-16:9' || media.video === 'hdres') {
                // High(HD) resolution is only 16:9
                height = 720;
                maxHeight = 720;
                width = 1280;
              } else if (media.video === 'fhdres') {
                // Full HD resolution is only 16:9
                height = 1080;
                maxHeight = 1080;
                width = 1920;
              } else if (media.video === '4kres') {
                // 4K resolution is only 16:9
                height = 2160;
                maxHeight = 2160;
                width = 3840;
              } else if (media.video === 'stdres') {
                // Normal resolution, 4:3
                height = 480;
                maxHeight = 480;
                width = 640;
              } else if (media.video === 'stdres-16:9') {
                // Normal resolution, 16:9
                height = 360;
                maxHeight = 360;
                width = 640;
              } else {
                Janus.log("Default video setting is stdres 4:3");
                height = 480;
                maxHeight = 480;
                width = 640;
              }

              Janus.log("Adding media constraint:", media.video);
              videoSupport = {
                'height': {
                  'ideal': height
                },
                'width': {
                  'ideal': width
                }
              };

              if (media.videoFrameRate) {
                videoSupport["frameRate"] = media.videoFrameRate;
              }

              Janus.debug("Adding video constraint:", videoSupport);
            }
          } else if (media.video === 'screen' || media.video === 'window') {
            var callbackUserMedia = function callbackUserMedia(error, stream) {
              pluginHandle.consentDialog(false);

              if (error) {
                callbacks.error({
                  code: error.code,
                  name: error.name,
                  message: error.message
                });
              } else {
                streamsDone(handleId, jsep, media, callbacks, stream);
              }
            };

            var getScreenMedia = function getScreenMedia(constraints, gsmCallback, useAudio) {
              Janus.log("Adding media constraint (screen capture)");
              Janus.debug(constraints);
              navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                if (useAudio) {
                  navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                  }).then(function (audioStream) {
                    stream.addTrack(audioStream.getAudioTracks()[0]);
                    gsmCallback(null, stream);
                  });
                } else {
                  gsmCallback(null, stream);
                }
              })["catch"](function (error) {
                pluginHandle.consentDialog(false);
                gsmCallback(error);
              });
            };

            if (!media.screenshareFrameRate) {
              media.screenshareFrameRate = 3;
            } // Not a webcam, but screen capture


            if (window.location.protocol !== 'https:') {
              // Screen sharing mandates HTTPS
              Janus.warn("Screen sharing only works on HTTPS, try the https:// version of this page");
              pluginHandle.consentDialog(false);
              callbacks.error("Screen sharing only works on HTTPS, try the https:// version of this page");
              return;
            } // We're going to try and use the extension for Chrome 34+, the old approach
            // for older versions of Chrome, or the experimental support in Firefox 33+


            var cache = {};

            if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
              var chromever = Janus.webRTCAdapter.browserDetails.version;
              var maxver = 33;
              if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux

              if (chromever >= 26 && chromever <= maxver) {
                // Chrome 26->33 requires some awkward chrome://flags manipulation
                constraints = {
                  video: {
                    mandatory: {
                      googLeakyBucket: true,
                      maxWidth: window.screen.width,
                      maxHeight: window.screen.height,
                      minFrameRate: media.screenshareFrameRate,
                      maxFrameRate: media.screenshareFrameRate,
                      chromeMediaSource: 'screen'
                    }
                  },
                  audio: isAudioSendEnabled(media)
                };
                getScreenMedia(constraints, callbackUserMedia);
              } else {
                // Chrome 34+ requires an extension
                var pending = window.setTimeout(function () {
                  error = new Error('NavigatorUserMediaError');
                  error.name = 'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)';
                  pluginHandle.consentDialog(false);
                  return callbacks.error(error);
                }, 1000);
                cache[pending] = [callbackUserMedia, null];
                window.postMessage({
                  type: 'janusGetScreen',
                  id: pending
                }, '*');
              }
            } else if (window.navigator.userAgent.match('Firefox')) {
              var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);

              if (ffver >= 33) {
                // Firefox 33+ has experimental support for screen sharing
                constraints = {
                  video: {
                    mozMediaSource: media.video,
                    mediaSource: media.video
                  },
                  audio: isAudioSendEnabled(media)
                };
                getScreenMedia(constraints, function (err, stream) {
                  callbackUserMedia(err, stream); // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810

                  if (!err) {
                    var lastTime = stream.currentTime;
                    var polly = window.setInterval(function () {
                      if (!stream) window.clearInterval(polly);

                      if (stream.currentTime == lastTime) {
                        window.clearInterval(polly);

                        if (stream.onended) {
                          stream.onended();
                        }
                      }

                      lastTime = stream.currentTime;
                    }, 500);
                  }
                });
              } else {
                var error = new Error('NavigatorUserMediaError');
                error.name = 'Your version of Firefox does not support screen sharing, please install Firefox 33 (or more recent versions)';
                pluginHandle.consentDialog(false);
                callbacks.error(error);
                return;
              }
            } // Wait for events from the Chrome Extension


            window.addEventListener('message', function (event) {
              if (event.origin != window.location.origin) return;

              if (event.data.type == 'janusGotScreen' && cache[event.data.id]) {
                var data = cache[event.data.id];
                var callback = data[0];
                delete cache[event.data.id];

                if (event.data.sourceId === '') {
                  // user canceled
                  var error = new Error('NavigatorUserMediaError');
                  error.name = 'You cancelled the request for permission, giving up...';
                  pluginHandle.consentDialog(false);
                  callbacks.error(error);
                } else {
                  constraints = {
                    audio: false,
                    video: {
                      mandatory: {
                        chromeMediaSource: 'desktop',
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height,
                        minFrameRate: media.screenshareFrameRate,
                        maxFrameRate: media.screenshareFrameRate
                      },
                      optional: [{
                        googLeakyBucket: true
                      }, {
                        googTemporalLayeredScreencast: true
                      }]
                    }
                  };
                  constraints.video.mandatory.chromeMediaSourceId = event.data.sourceId;
                  getScreenMedia(constraints, callback, isAudioSendEnabled(media));
                }
              } else if (event.data.type == 'janusGetScreenPending') {
                window.clearTimeout(event.data.id);
              }
            });
            return;
          }
        } // If we got here, we're not screensharing


        if (media === null || media === undefined || media.video !== 'screen') {
          // Check whether all media sources are actually available or not
          navigator.mediaDevices.enumerateDevices().then(function (devices) {
            var audioExist = devices.some(function (device) {
              return device.kind === 'audioinput';
            }),
                videoExist = devices.some(function (device) {
              return device.kind === 'videoinput';
            }); // Check whether a missing device is really a problem

            var audioSend = isAudioSendEnabled(media);
            var videoSend = isVideoSendEnabled(media);
            var needAudioDevice = isAudioSendRequired(media);
            var needVideoDevice = isVideoSendRequired(media);

            if (audioSend || videoSend || needAudioDevice || needVideoDevice) {
              // We need to send either audio or video
              var haveAudioDevice = audioSend ? audioExist : false;
              var haveVideoDevice = videoSend ? videoExist : false;

              if (!haveAudioDevice && !haveVideoDevice) {
                // FIXME Should we really give up, or just assume recvonly for both?
                pluginHandle.consentDialog(false);
                callbacks.error('No capture device found');
                return false;
              } else if (!haveAudioDevice && needAudioDevice) {
                pluginHandle.consentDialog(false);
                callbacks.error('Audio capture is required, but no capture device found');
                return false;
              } else if (!haveVideoDevice && needVideoDevice) {
                pluginHandle.consentDialog(false);
                callbacks.error('Video capture is required, but no capture device found');
                return false;
              }
            }

            navigator.mediaDevices.getUserMedia({
              audio: audioExist ? audioSupport : false,
              video: videoExist ? videoSupport : false
            }).then(function (stream) {
              pluginHandle.consentDialog(false);
              streamsDone(handleId, jsep, media, callbacks, stream);
            })["catch"](function (error) {
              pluginHandle.consentDialog(false);
              callbacks.error({
                code: error.code,
                name: error.name,
                message: error.message
              });
            });
          })["catch"](function (error) {
            pluginHandle.consentDialog(false);
            callbacks.error('enumerateDevices error', error);
          });
        }
      } else {
        // No need to do a getUserMedia, create offer/answer right away
        streamsDone(handleId, jsep, media, callbacks);
      }
    }

    function prepareWebrtcPeer(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : webrtcError;
      var jsep = callbacks.jsep;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff;

      if (jsep !== undefined && jsep !== null) {
        if (config.pc === null) {
          Janus.warn("Wait, no PeerConnection?? if this is an answer, use createAnswer and not handleRemoteJsep");
          callbacks.error("No PeerConnection: if this is an answer, use createAnswer and not handleRemoteJsep");
          return;
        }

        config.pc.setRemoteDescription(new RTCSessionDescription(jsep), function () {
          Janus.log("Remote description accepted!");
          callbacks.success();
        }, callbacks.error);
      } else {
        callbacks.error("Invalid JSEP");
      }
    }

    function createOffer(handleId, media, callbacks) {
      console.warn("createOffer:", media);
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff;
      var simulcast = callbacks.simulcast === true ? true : false;

      if (!simulcast) {
        Janus.log("Creating offer (iceDone=" + config.iceDone + ")");
      } else {
        Janus.log("Creating offer (iceDone=" + config.iceDone + ", simulcast=" + simulcast + ")");
      } // https://code.google.com/p/webrtc/issues/detail?id=3508


      var mediaConstraints = {
        'offerToReceiveAudio': isAudioRecvEnabled(media),
        'offerToReceiveVideo': isVideoRecvEnabled(media)
      };
      var iceRestart = callbacks.iceRestart === true ? true : false;

      if (iceRestart) {
        mediaConstraints["iceRestart"] = true;
      }

      Janus.debug(mediaConstraints); // Check if this is Firefox and we've been asked to do simulcasting

      var sendVideo = isVideoSendEnabled(media);

      if (sendVideo && simulcast && Janus.webRTCAdapter.browserDetails.browser === "firefox") {
        // FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
        Janus.log("Enabling Simulcasting for Firefox (RID)");
        var sender = config.pc.getSenders()[1];
        Janus.log(sender);
        var parameters = sender.getParameters();
        Janus.log(parameters);
        sender.setParameters({
          encodings: [{
            rid: "high",
            active: true,
            priority: "high",
            maxBitrate: 1000000
          }, {
            rid: "medium",
            active: true,
            priority: "medium",
            maxBitrate: 300000
          }, {
            rid: "low",
            active: true,
            priority: "low",
            maxBitrate: 100000
          }]
        });
      }

      config.pc.createOffer(function (offer) {
        Janus.debug(offer);
        Janus.log("Setting local description");

        if (sendVideo && simulcast) {
          // This SDP munging only works with Chrome
          if (Janus.webRTCAdapter.browserDetails.browser === "chrome") {
            Janus.log("Enabling Simulcasting for Chrome (SDP munging)");
            offer.sdp = mungeSdpForSimulcasting(offer.sdp);
          } else if (Janus.webRTCAdapter.browserDetails.browser !== "firefox") {
            Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring");
          }
        }

        config.mySdp = offer.sdp;
        config.pc.setLocalDescription(offer);
        config.mediaConstraints = mediaConstraints;

        if (!config.iceDone && !config.trickle) {
          // Don't do anything until we have all candidates
          Janus.log("Waiting for all candidates...");
          return;
        }

        Janus.log("Offer ready");
        Janus.debug(callbacks); // JSON.stringify doesn't work on some WebRTC objects anymore
        // See https://code.google.com/p/chromium/issues/detail?id=467366

        var jsep = {
          "type": offer.type,
          "sdp": offer.sdp
        };
        callbacks.success(jsep);
      }, callbacks.error, mediaConstraints);
    }

    function createAnswer(handleId, media, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        callbacks.error("Invalid handle");
        return;
      }

      var config = pluginHandle.webrtcStuff;
      var simulcast = callbacks.simulcast === true ? true : false;

      if (!simulcast) {
        Janus.log("Creating answer (iceDone=" + config.iceDone + ")");
      } else {
        Janus.log("Creating answer (iceDone=" + config.iceDone + ", simulcast=" + simulcast + ")");
      }

      var mediaConstraints = null;

      if (Janus.webRTCAdapter.browserDetails.browser == "firefox" || Janus.webRTCAdapter.browserDetails.browser == "edge") {
        mediaConstraints = {
          'offerToReceiveAudio': isAudioRecvEnabled(media),
          'offerToReceiveVideo': isVideoRecvEnabled(media)
        };
      } else {
        mediaConstraints = {
          'mandatory': {
            'OfferToReceiveAudio': isAudioRecvEnabled(media),
            'OfferToReceiveVideo': isVideoRecvEnabled(media)
          }
        };
      }

      Janus.debug(mediaConstraints); // Check if this is Firefox and we've been asked to do simulcasting

      var sendVideo = isVideoSendEnabled(media);

      if (sendVideo && simulcast && Janus.webRTCAdapter.browserDetails.browser === "firefox") {
        // FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
        Janus.log("Enabling Simulcasting for Firefox (RID)");
        var sender = config.pc.getSenders()[1];
        Janus.log(sender);
        var parameters = sender.getParameters();
        Janus.log(parameters);
        sender.setParameters({
          encodings: [{
            rid: "high",
            active: true,
            priority: "high",
            maxBitrate: 1000000
          }, {
            rid: "medium",
            active: true,
            priority: "medium",
            maxBitrate: 300000
          }, {
            rid: "low",
            active: true,
            priority: "low",
            maxBitrate: 100000
          }]
        });
      }

      config.pc.createAnswer(function (answer) {
        Janus.debug(answer);
        Janus.log("Setting local description");

        if (sendVideo && simulcast) {
          // This SDP munging only works with Chrome
          if (Janus.webRTCAdapter.browserDetails.browser === "chrome") {
            // FIXME Apparently trying to simulcast when answering breaks video in Chrome...
            //~ Janus.log("Enabling Simulcasting for Chrome (SDP munging)");
            //~ answer.sdp = mungeSdpForSimulcasting(answer.sdp);
            Janus.warn("simulcast=true, but this is an answer, and video breaks in Chrome if we enable it");
          } else if (Janus.webRTCAdapter.browserDetails.browser !== "firefox") {
            Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring");
          }
        }

        config.mySdp = answer.sdp;
        config.pc.setLocalDescription(answer);
        config.mediaConstraints = mediaConstraints;

        if (!config.iceDone && !config.trickle) {
          // Don't do anything until we have all candidates
          Janus.log("Waiting for all candidates...");
          return;
        } // JSON.stringify doesn't work on some WebRTC objects anymore
        // See https://code.google.com/p/chromium/issues/detail?id=467366


        var jsep = {
          "type": answer.type,
          "sdp": answer.sdp
        };
        callbacks.success(jsep);
      }, callbacks.error, mediaConstraints);
    }

    function sendSDP(handleId, callbacks) {
      callbacks = callbacks || {};
      callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
      callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle, not sending anything");
        return;
      }

      var config = pluginHandle.webrtcStuff;
      Janus.log("Sending offer/answer SDP...");

      if (config.mySdp === null || config.mySdp === undefined) {
        Janus.warn("Local SDP instance is invalid, not sending anything...");
        return;
      }

      config.mySdp = {
        "type": config.pc.localDescription.type,
        "sdp": config.pc.localDescription.sdp
      };
      if (config.trickle === false) config.mySdp["trickle"] = false;
      Janus.debug(callbacks);
      config.sdpSent = true;
      callbacks.success(config.mySdp);
    }

    function _getVolume(handleId) {
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        return 0;
      }

      var config = pluginHandle.webrtcStuff; // Start getting the volume, if getStats is supported

      if (config.pc.getStats && Janus.webRTCAdapter.browserDetails.browser == "chrome") {
        // FIXME
        if (config.remoteStream === null || config.remoteStream === undefined) {
          Janus.warn("Remote stream unavailable");
          return 0;
        } // http://webrtc.googlecode.com/svn/trunk/samples/js/demos/html/constraints-and-stats.html


        if (config.volume.timer === null || config.volume.timer === undefined) {
          Janus.log("Starting volume monitor");
          config.volume.timer = setInterval(function () {
            config.pc.getStats(function (stats) {
              var results = stats.result();

              for (var i = 0; i < results.length; i++) {
                var res = results[i];

                if (res.type == 'ssrc' && res.stat('audioOutputLevel')) {
                  config.volume.value = res.stat('audioOutputLevel');
                }
              }
            });
          }, 200);
          return 0; // We don't have a volume to return yet
        }

        return config.volume.value;
      } else {
        Janus.log("Getting the remote volume unsupported by browser");
        return 0;
      }
    }

    function isMuted(handleId, video) {
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        return true;
      }

      var config = pluginHandle.webrtcStuff;

      if (config.pc === null || config.pc === undefined) {
        Janus.warn("Invalid PeerConnection");
        return true;
      }

      if (config.myStream === undefined || config.myStream === null) {
        Janus.warn("Invalid local MediaStream");
        return true;
      }

      if (video) {
        // Check video track
        if (config.myStream.getVideoTracks() === null || config.myStream.getVideoTracks() === undefined || config.myStream.getVideoTracks().length === 0) {
          Janus.warn("No video track");
          return true;
        }

        return !config.myStream.getVideoTracks()[0].enabled;
      } else {
        // Check audio track
        if (config.myStream.getAudioTracks() === null || config.myStream.getAudioTracks() === undefined || config.myStream.getAudioTracks().length === 0) {
          Janus.warn("No audio track");
          return true;
        }

        return !config.myStream.getAudioTracks()[0].enabled;
      }
    }

    function mute(handleId, video, mute) {
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        return false;
      }

      var config = pluginHandle.webrtcStuff;

      if (config.pc === null || config.pc === undefined) {
        Janus.warn("Invalid PeerConnection");
        return false;
      }

      if (config.myStream === undefined || config.myStream === null) {
        Janus.warn("Invalid local MediaStream");
        return false;
      }

      if (video) {
        // Mute/unmute video track
        if (config.myStream.getVideoTracks() === null || config.myStream.getVideoTracks() === undefined || config.myStream.getVideoTracks().length === 0) {
          Janus.warn("No video track");
          return false;
        }

        config.myStream.getVideoTracks()[0].enabled = mute ? false : true;
        return true;
      } else {
        // Mute/unmute audio track
        if (config.myStream.getAudioTracks() === null || config.myStream.getAudioTracks() === undefined || config.myStream.getAudioTracks().length === 0) {
          Janus.warn("No audio track");
          return false;
        }

        config.myStream.getAudioTracks()[0].enabled = mute ? false : true;
        return true;
      }
    }

    function _getBitrate(handleId) {
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
        Janus.warn("Invalid handle");
        return "Invalid handle";
      }

      var config = pluginHandle.webrtcStuff;
      if (config.pc === null || config.pc === undefined) return "Invalid PeerConnection"; // Start getting the bitrate, if getStats is supported

      if (config.pc.getStats) {
        if (config.bitrate.timer === null || config.bitrate.timer === undefined) {
          Janus.log("Starting bitrate timer (via getStats)");
          config.bitrate.timer = setInterval(function () {
            config.pc.getStats().then(function (stats) {
              stats.forEach(function (res) {
                if (!res) return;
                var inStats = false; // Check if these are statistics on incoming media

                if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) && res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
                  // New stats
                  inStats = true;
                } else if (res.type == 'ssrc' && res.bytesReceived && (res.googCodecName === "VP8" || res.googCodecName === "")) {
                  // Older Chromer versions
                  inStats = true;
                } // Parse stats now


                if (inStats) {
                  config.bitrate.bsnow = res.bytesReceived;
                  config.bitrate.tsnow = res.timestamp;

                  if (config.bitrate.bsbefore === null || config.bitrate.tsbefore === null) {
                    // Skip this round
                    config.bitrate.bsbefore = config.bitrate.bsnow;
                    config.bitrate.tsbefore = config.bitrate.tsnow;
                  } else {
                    // Calculate bitrate
                    var timePassed = config.bitrate.tsnow - config.bitrate.tsbefore;
                    if (Janus.webRTCAdapter.browserDetails.browser == "safari") timePassed = timePassed / 1000; // Apparently the timestamp is in microseconds, in Safari

                    var bitRate = Math.round((config.bitrate.bsnow - config.bitrate.bsbefore) * 8 / timePassed);
                    config.bitrate.value = bitRate + ' kbits/sec'; //~ Janus.log("Estimated bitrate is " + config.bitrate.value);

                    config.bitrate.bsbefore = config.bitrate.bsnow;
                    config.bitrate.tsbefore = config.bitrate.tsnow;
                  }
                }
              });
            });
          }, 1000);
          return "0 kbits/sec"; // We don't have a bitrate value yet
        }

        return config.bitrate.value;
      } else {
        Janus.warn("Getting the video bitrate unsupported by browser");
        return "Feature unsupported by browser";
      }
    }

    function webrtcError(error) {
      Janus.error("WebRTC error:", error);
    }

    function cleanupWebrtc(handleId, hangupRequest) {
      Janus.log("Cleaning WebRTC stuff");
      var pluginHandle = pluginHandles[handleId];

      if (pluginHandle === null || pluginHandle === undefined) {
        // Nothing to clean
        return;
      }

      var config = pluginHandle.webrtcStuff;

      if (config !== null && config !== undefined) {
        if (hangupRequest === true) {
          // Send a hangup request (we don't really care about the response)
          var request = {
            "janus": "hangup",
            "transaction": Janus.randomString(12)
          };
          if (token !== null && token !== undefined) request["token"] = token;
          if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
          Janus.debug("Sending hangup request (handle=" + handleId + "):");
          Janus.debug(request);

          if (websockets) {
            request["session_id"] = sessionId;
            request["handle_id"] = handleId;
            ws.send(JSON.stringify(request));
          } else {
            Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
              verb: 'POST',
              withCredentials: withCredentials,
              data: request
            });
          }
        } // Cleanup stack


        config.remoteStream = null;
        if (config.volume.timer) clearInterval(config.volume.timer);
        config.volume.value = null;
        if (config.bitrate.timer) clearInterval(config.bitrate.timer);
        config.bitrate.timer = null;
        config.bitrate.bsnow = null;
        config.bitrate.bsbefore = null;
        config.bitrate.tsnow = null;
        config.bitrate.tsbefore = null;
        config.bitrate.value = null;

        try {
          // Try a MediaStreamTrack.stop() for each track
          if (!config.streamExternal && config.myStream !== null && config.myStream !== undefined) {
            Janus.log("Stopping local stream tracks");
            var tracks = config.myStream.getTracks();

            for (var i in tracks) {
              var mst = tracks[i];
              Janus.log(mst);
              if (mst !== null && mst !== undefined) mst.stop();
            }
          }
        } catch (e) {// Do nothing if this fails
        }

        config.streamExternal = false;
        config.myStream = null; // Close PeerConnection

        try {
          config.pc.close();
        } catch (e) {// Do nothing
        }

        config.pc = null;
        config.mySdp = null;
        config.iceDone = false;
        config.dataChannel = null;
        config.dtmfSender = null;
      }

      pluginHandle.oncleanup();
    } // Helper method to munge an SDP to enable simulcasting (Chrome only)


    function mungeSdpForSimulcasting(sdp) {
      // Let's munge the SDP to add the attributes for enabling simulcasting
      // (based on https://gist.github.com/ggarber/a19b4c33510028b9c657)
      var lines = sdp.split("\r\n");
      var video = false;
      var ssrc = [-1],
          ssrc_fid = -1;
      var cname = null,
          msid = null,
          mslabel = null,
          label = null;
      var insertAt = -1;

      for (var i = 0; i < lines.length; i++) {
        var mline = lines[i].match(/m=(\w+) */);

        if (mline) {
          var medium = mline[1];

          if (medium === "video") {
            // New video m-line: make sure it's the first one
            if (ssrc[0] < 0) {
              video = true;
            } else {
              // We're done, let's add the new attributes here
              insertAt = i;
              break;
            }
          } else {
            // New non-video m-line: do we have what we were looking for?
            if (ssrc[0] > -1) {
              // We're done, let's add the new attributes here
              insertAt = i;
              break;
            }
          }

          continue;
        }

        if (!video) continue;
        var fid = lines[i].match(/a=ssrc-group:FID (\d+) (\d+)/);

        if (fid) {
          ssrc[0] = fid[1];
          ssrc_fid = fid[2];
          lines.splice(i, 1);
          i--;
          continue;
        }

        if (ssrc[0]) {
          var match = lines[i].match('a=ssrc:' + ssrc[0] + ' cname:(.+)');

          if (match) {
            cname = match[1];
          }

          match = lines[i].match('a=ssrc:' + ssrc[0] + ' msid:(.+)');

          if (match) {
            msid = match[1];
          }

          match = lines[i].match('a=ssrc:' + ssrc[0] + ' mslabel:(.+)');

          if (match) {
            mslabel = match[1];
          }

          match = lines[i].match('a=ssrc:' + ssrc + ' label:(.+)');

          if (match) {
            label = match[1];
          }

          if (lines[i].indexOf('a=ssrc:' + ssrc_fid) === 0) {
            lines.splice(i, 1);
            i--;
            continue;
          }

          if (lines[i].indexOf('a=ssrc:' + ssrc[0]) === 0) {
            lines.splice(i, 1);
            i--;
            continue;
          }
        }

        if (lines[i].length == 0) {
          lines.splice(i, 1);
          i--;
          continue;
        }
      }

      if (ssrc[0] < 0) {
        // Couldn't find a FID attribute, let's just take the first video SSRC we find
        insertAt = -1;
        video = false;

        for (var i = 0; i < lines.length; i++) {
          var mline = lines[i].match(/m=(\w+) */);

          if (mline) {
            var medium = mline[1];

            if (medium === "video") {
              // New video m-line: make sure it's the first one
              if (ssrc[0] < 0) {
                video = true;
              } else {
                // We're done, let's add the new attributes here
                insertAt = i;
                break;
              }
            } else {
              // New non-video m-line: do we have what we were looking for?
              if (ssrc[0] > -1) {
                // We're done, let's add the new attributes here
                insertAt = i;
                break;
              }
            }

            continue;
          }

          if (!video) continue;

          if (ssrc[0] < 0) {
            var value = lines[i].match(/a=ssrc:(\d+)/);

            if (value) {
              ssrc[0] = value[1];
              lines.splice(i, 1);
              i--;
              continue;
            }
          } else {
            var match = lines[i].match('a=ssrc:' + ssrc[0] + ' cname:(.+)');

            if (match) {
              cname = match[1];
            }

            match = lines[i].match('a=ssrc:' + ssrc[0] + ' msid:(.+)');

            if (match) {
              msid = match[1];
            }

            match = lines[i].match('a=ssrc:' + ssrc[0] + ' mslabel:(.+)');

            if (match) {
              mslabel = match[1];
            }

            match = lines[i].match('a=ssrc:' + ssrc + ' label:(.+)');

            if (match) {
              label = match[1];
            }

            if (lines[i].indexOf('a=ssrc:' + ssrc_fid) === 0) {
              lines.splice(i, 1);
              i--;
              continue;
            }

            if (lines[i].indexOf('a=ssrc:' + ssrc[0]) === 0) {
              lines.splice(i, 1);
              i--;
              continue;
            }
          }

          if (lines[i].length == 0) {
            lines.splice(i, 1);
            i--;
            continue;
          }
        }
      }

      if (ssrc[0] < 0) {
        // Still nothing, let's just return the SDP we were asked to munge
        Janus.warn("Couldn't find the video SSRC, simulcasting NOT enabled");
        return sdp;
      }

      if (insertAt < 0) {
        // Append at the end
        insertAt = lines.length;
      } // Generate a couple of SSRCs


      ssrc[1] = Math.floor(Math.random() * 0xFFFFFFFF);
      ssrc[2] = Math.floor(Math.random() * 0xFFFFFFFF); // Add attributes to the SDP

      for (var i = 0; i < ssrc.length; i++) {
        if (cname) {
          lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' cname:' + cname);
          insertAt++;
        }

        if (msid) {
          lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' msid:' + msid);
          insertAt++;
        }

        if (mslabel) {
          lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' mslabel:' + msid);
          insertAt++;
        }

        if (label) {
          lines.splice(insertAt, 0, 'a=ssrc:' + ssrc[i] + ' label:' + msid);
          insertAt++;
        }
      }

      lines.splice(insertAt, 0, 'a=ssrc-group:SIM ' + ssrc[0] + ' ' + ssrc[1] + ' ' + ssrc[2]);
      sdp = lines.join("\r\n");
      if (!sdp.endsWith("\r\n")) sdp += "\r\n";
      return sdp;
    } // Helper methods to parse a media object


    function isAudioSendEnabled(media) {
      Janus.debug("isAudioSendEnabled:", media);
      if (media === undefined || media === null) return true; // Default

      if (media.audio === false) return false; // Generic audio has precedence

      if (media.audioSend === undefined || media.audioSend === null) return true; // Default

      return media.audioSend === true;
    }

    function isAudioSendRequired(media) {
      Janus.debug("isAudioSendRequired:", media);
      if (media === undefined || media === null) return false; // Default

      if (media.audio === false || media.audioSend === false) return false; // If we're not asking to capture audio, it's not required

      if (media.failIfNoAudio === undefined || media.failIfNoAudio === null) return false; // Default

      return media.failIfNoAudio === true;
    }

    function isAudioRecvEnabled(media) {
      Janus.debug("isAudioRecvEnabled:", media);
      if (media === undefined || media === null) return true; // Default

      if (media.audio === false) return false; // Generic audio has precedence

      if (media.audioRecv === undefined || media.audioRecv === null) return true; // Default

      return media.audioRecv === true;
    }

    function isVideoSendEnabled(media) {
      Janus.debug("isVideoSendEnabled:", media);
      if (media === undefined || media === null) return true; // Default

      if (media.video === false) return false; // Generic video has precedence

      if (media.videoSend === undefined || media.videoSend === null) return true; // Default

      return media.videoSend === true;
    }

    function isVideoSendRequired(media) {
      Janus.debug("isVideoSendRequired:", media);
      if (media === undefined || media === null) return false; // Default

      if (media.video === false || media.videoSend === false) return false; // If we're not asking to capture video, it's not required

      if (media.failIfNoVideo === undefined || media.failIfNoVideo === null) return false; // Default

      return media.failIfNoVideo === true;
    }

    function isVideoRecvEnabled(media) {
      Janus.debug("isVideoRecvEnabled:", media);
      if (media === undefined || media === null) return true; // Default

      if (media.video === false) return false; // Generic video has precedence

      if (media.videoRecv === undefined || media.videoRecv === null) return true; // Default

      return media.videoRecv === true;
    }

    function isDataEnabled(media) {
      Janus.debug("isDataEnabled:", media);

      if (Janus.webRTCAdapter.browserDetails.browser == "edge") {
        Janus.warn("Edge doesn't support data channels yet");
        return false;
      }

      if (media === undefined || media === null) return false; // Default

      return media.data === true;
    }

    function isTrickleEnabled(trickle) {
      Janus.debug("isTrickleEnabled:", trickle);
      if (trickle === undefined || trickle === null) return true; // Default is true

      return trickle === true;
    }
  }

  return Janus;
});

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/@xmpp/base64/browser.js":
/*!**********************************************!*\
  !*** ./node_modules/@xmpp/base64/browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports.encode = function encode(string) {
  return global.btoa(string)
}

module.exports.decode = function decode(string) {
  return global.atob(string)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@xmpp/client-core/index.js":
/*!*************************************************!*\
  !*** ./node_modules/@xmpp/client-core/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Client = __webpack_require__(/*! ./lib/Client */ "./node_modules/@xmpp/client-core/lib/Client.js")
const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")
const jid = __webpack_require__(/*! @xmpp/jid */ "./node_modules/@xmpp/jid/index.js")

module.exports.Client = Client
module.exports.xml = xml
module.exports.jid = jid


/***/ }),

/***/ "./node_modules/@xmpp/client-core/lib/Client.js":
/*!******************************************************!*\
  !*** ./node_modules/@xmpp/client-core/lib/Client.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Connection = __webpack_require__(/*! @xmpp/connection */ "./node_modules/@xmpp/connection/index.js")

class Client extends Connection {
  constructor(options) {
    super(options)
    this.transports = []
  }

  send(element, ...args) {
    return this.Transport.prototype.send.call(this, element, ...args)
  }

  _findTransport(service) {
    return this.transports.find(Transport => {
      try {
        return Transport.prototype.socketParameters(service) !== undefined
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        return false
      }
    })
  }

  connect(service) {
    const Transport = this._findTransport(service)

    if (!Transport) {
      throw new Error('No compatible connection method found.')
    }

    this.Transport = Transport
    this.Socket = Transport.prototype.Socket
    this.Parser = Transport.prototype.Parser

    return super.connect(service)
  }

  socketParameters(...args) {
    return this.Transport.prototype.socketParameters(...args)
  }

  header(...args) {
    return this.Transport.prototype.header(...args)
  }

  headerElement(...args) {
    return this.Transport.prototype.headerElement(...args)
  }

  footer(...args) {
    return this.Transport.prototype.footer(...args)
  }

  footerElement(...args) {
    return this.Transport.prototype.footerElement(...args)
  }
}

Client.prototype.NS = 'jabber:client'

module.exports = Client


/***/ }),

/***/ "./node_modules/@xmpp/client/lib/getDomain.js":
/*!****************************************************!*\
  !*** ./node_modules/@xmpp/client/lib/getDomain.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function getDomain(service) {
  const domain = service.split('://')[1] || service
  return domain.split(':')[0].split('/')[0]
}


/***/ }),

/***/ "./node_modules/@xmpp/client/react-native.js":
/*!***************************************************!*\
  !*** ./node_modules/@xmpp/client/react-native.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {xml, jid, Client} = __webpack_require__(/*! @xmpp/client-core */ "./node_modules/@xmpp/client-core/index.js")
const getDomain = __webpack_require__(/*! ./lib/getDomain */ "./node_modules/@xmpp/client/lib/getDomain.js")

const _reconnect = __webpack_require__(/*! @xmpp/reconnect */ "./node_modules/@xmpp/reconnect/index.js")
const _websocket = __webpack_require__(/*! @xmpp/websocket */ "./node_modules/@xmpp/websocket/index.js")
const _middleware = __webpack_require__(/*! @xmpp/middleware */ "./node_modules/@xmpp/middleware/index.js")
const _streamFeatures = __webpack_require__(/*! @xmpp/stream-features */ "./node_modules/@xmpp/stream-features/index.js")
const _iqCaller = __webpack_require__(/*! @xmpp/iq/caller */ "./node_modules/@xmpp/iq/caller.js")
const _iqCallee = __webpack_require__(/*! @xmpp/iq/callee */ "./node_modules/@xmpp/iq/callee.js")
const _resolve = __webpack_require__(/*! @xmpp/resolve */ "./node_modules/@xmpp/resolve/index.js")

// Stream features - order matters and define priority
const _sasl = __webpack_require__(/*! @xmpp/sasl */ "./node_modules/@xmpp/sasl/index.js")
const _resourceBinding = __webpack_require__(/*! @xmpp/resource-binding */ "./node_modules/@xmpp/resource-binding/index.js")
const _sessionEstablishment = __webpack_require__(/*! @xmpp/session-establishment */ "./node_modules/@xmpp/session-establishment/index.js")

// SASL mechanisms - order matters and define priority
const anonymous = __webpack_require__(/*! @xmpp/sasl-anonymous */ "./node_modules/@xmpp/sasl-anonymous/index.js")
const plain = __webpack_require__(/*! @xmpp/sasl-plain */ "./node_modules/@xmpp/sasl-plain/index.js")

function client(options = {}) {
  const {resource, credentials, username, password, ...params} = options

  const {domain, service} = params
  if (!domain && service) {
    params.domain = getDomain(service)
  }

  const entity = new Client(params)

  const reconnect = _reconnect({entity})
  const websocket = _websocket({entity})

  const middleware = _middleware({entity})
  const streamFeatures = _streamFeatures({middleware})
  const iqCaller = _iqCaller({middleware, entity})
  const iqCallee = _iqCallee({middleware, entity})
  const resolve = _resolve({entity})
  // Stream features - order matters and define priority
  const sasl = _sasl({streamFeatures}, credentials || {username, password})
  const resourceBinding = _resourceBinding({iqCaller, streamFeatures}, resource)
  const sessionEstablishment = _sessionEstablishment({iqCaller, streamFeatures})
  // SASL mechanisms - order matters and define priority
  const mechanisms = Object.entries({plain, anonymous}).map(([k, v]) => ({
    [k]: v(sasl),
  }))

  return Object.assign(entity, {
    entity,
    reconnect,
    websocket,
    middleware,
    streamFeatures,
    iqCaller,
    iqCallee,
    resolve,
    sasl,
    resourceBinding,
    sessionEstablishment,
    mechanisms,
  })
}

module.exports.xml = xml
module.exports.jid = jid
module.exports.client = client


/***/ }),

/***/ "./node_modules/@xmpp/connection/index.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/connection/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {EventEmitter, promise} = __webpack_require__(/*! @xmpp/events */ "./node_modules/@xmpp/events/index.js")
const jid = __webpack_require__(/*! @xmpp/jid */ "./node_modules/@xmpp/jid/index.js")
const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")
const StreamError = __webpack_require__(/*! ./lib/StreamError */ "./node_modules/@xmpp/connection/lib/StreamError.js")
const {parseHost, parseService} = __webpack_require__(/*! ./lib/util */ "./node_modules/@xmpp/connection/lib/util.js")

const NS_STREAM = 'urn:ietf:params:xml:ns:xmpp-streams'

class Connection extends EventEmitter {
  constructor(options = {}) {
    super()
    this.jid = null
    this.timeout = 2000
    this.options = options
    this.socketListeners = Object.create(null)
    this.parserListeners = Object.create(null)
    this.status = 'offline'
    this.socket = null
    this.parser = null
    this.root = null
  }

  _reset() {
    this.jid = null
    this.status = 'offline'
    this._detachSocket()
    this._detachParser()
  }

  async _streamError(condition, children) {
    try {
      await this.send(
        // prettier-ignore
        xml('stream:error', {}, [
          xml(condition, {xmlns: NS_STREAM}, children),
        ])
      )
      // eslint-disable-next-line no-unused-vars
    } catch (err) {}

    return this._end()
  }

  _onData(data) {
    const str = data.toString('utf8')
    this.emit('input', str)
    this.parser.write(str)
  }

  _onParserError(error) {
    // https://xmpp.org/rfcs/rfc6120.html#streams-error-conditions-bad-format
    // "This error can be used instead of the more specific XML-related errors,
    // such as <bad-namespace-prefix/>, <invalid-xml/>, <not-well-formed/>, <restricted-xml/>,
    // and <unsupported-encoding/>. However, the more specific errors are RECOMMENDED."
    this._streamError('bad-format')
    this._detachParser()
    this.emit('error', error)
  }

  _attachSocket(socket) {
    const sock = (this.socket = socket)
    const listeners = this.socketListeners

    listeners.data = this._onData.bind(this)

    listeners.close = (dirty, event) => {
      this._reset()
      this._status('disconnect', {clean: !dirty, event})
    }

    listeners.connect = () => {
      this._status('connect')
    }

    listeners.error = error => {
      this.emit('error', error)
    }

    sock.on('close', listeners.close)
    sock.on('data', listeners.data)
    sock.on('error', listeners.error)
    sock.on('connect', listeners.connect)
  }

  _detachSocket() {
    const {socketListeners, socket} = this
    Object.getOwnPropertyNames(socketListeners).forEach(k => {
      socket.removeListener(k, socketListeners[k])
      delete socketListeners[k]
    })
    this.socket = null
    return socket
  }

  _onElement(element) {
    this.emit('element', element)
    this.emit(this.isStanza(element) ? 'stanza' : 'nonza', element)

    if (element.name === 'stream:error') {
      this._onStreamError(element)
    }
  }

  // https://xmpp.org/rfcs/rfc6120.html#streams-error
  _onStreamError(element) {
    const error = StreamError.fromElement(element)

    if (error.condition === 'see-other-host') {
      this._onSeeOtherHost(error)
    } else {
      this.emit('error', error)
    }

    // "Stream Errors Are Unrecoverable"
    // "The entity that receives the stream error then SHALL close the stream"
    this._end()
  }

  // https://xmpp.org/rfcs/rfc6120.html#streams-error-conditions-see-other-host
  async _onSeeOtherHost(error) {
    const {protocol} = parseService(this.options.service)

    const host = error.element.getChildText('see-other-host')
    const {port} = parseHost(host)

    let service
    if (port) {
      service = `${protocol || 'xmpp:'}//${host}`
    } else {
      service = (protocol ? `${protocol}//` : '') + host
    }

    try {
      await promise(this, 'disconnect')
      const {domain, lang} = this.options
      await this.connect(service)
      await this.open({domain, lang})
    } catch (err) {
      this.emit('error', err)
    }
  }

  _attachParser(p) {
    const parser = (this.parser = p)
    const listeners = this.parserListeners

    listeners.element = this._onElement.bind(this)
    listeners.error = this._onParserError.bind(this)

    listeners.end = element => {
      this._detachParser()
      this._status('close', element)
    }

    listeners.start = element => {
      this._status('open', element)
    }

    parser.on('error', listeners.error)
    parser.on('element', listeners.element)
    parser.on('end', listeners.end)
    parser.on('start', listeners.start)
  }

  _detachParser() {
    const listeners = this.parserListeners
    Object.getOwnPropertyNames(listeners).forEach(k => {
      this.parser.removeListener(k, listeners[k])
      delete listeners[k]
    })
    this.parser = null
  }

  _jid(id) {
    this.jid = jid(id)
    return this.jid
  }

  _status(status, ...args) {
    this.status = status
    this.emit('status', status, ...args)
    this.emit(status, ...args)
  }

  async _end() {
    let el
    try {
      el = await this.close()
      // eslint-disable-next-line no-unused-vars
    } catch (err) {}

    try {
      await this.disconnect()
      // eslint-disable-next-line no-unused-vars
    } catch (err) {}

    return el
  }

  /**
   * Opens the socket then opens the stream
   */
  async start() {
    if (this.status !== 'offline') {
      throw new Error('Connection is not offline')
    }

    const {service, domain, lang} = this.options

    await this.connect(service)

    const promiseOnline = promise(this, 'online')

    await this.open({domain, lang})

    return promiseOnline
  }

  /**
   * Connects the socket
   */
  async connect(service) {
    this._status('connecting', service)
    const socket = new this.Socket()
    this._attachSocket(socket)
    // The 'connect' status is set by the socket 'connect' listener
    socket.connect(this.socketParameters(service))
    return promise(socket, 'connect')
  }

  /**
   * Disconnects the socket
   * https://xmpp.org/rfcs/rfc6120.html#streams-close
   * https://tools.ietf.org/html/rfc7395#section-3.6
   */
  async disconnect(timeout = this.timeout) {
    if (this.socket) this._status('disconnecting')

    this.socket.end()

    // The 'disconnect' status is set by the socket 'close' listener
    await promise(this.socket, 'close', 'error', timeout)
  }

  /**
   * Opens the stream
   */
  async open(options) {
    this._status('opening')

    if (typeof options === 'string') {
      options = {domain: options}
    }

    const {domain, lang, timeout = this.timeout} = options

    const headerElement = this.headerElement()
    headerElement.attrs.to = domain
    headerElement.attrs['xml:lang'] = lang
    this.root = headerElement

    this._attachParser(new this.Parser())

    await this.write(this.header(headerElement))
    return promise(this, 'open', 'error', timeout)
  }

  /**
   * Closes the stream then closes the socket
   * https://xmpp.org/rfcs/rfc6120.html#streams-close
   * https://tools.ietf.org/html/rfc7395#section-3.6
   */
  async stop() {
    const el = await this._end()
    if (this.status !== 'offline') this._status('offline', el)
    return el
  }

  /**
   * Closes the stream and wait for the server to close it
   * https://xmpp.org/rfcs/rfc6120.html#streams-close
   * https://tools.ietf.org/html/rfc7395#section-3.6
   */
  async close(timeout = this.timeout) {
    const p = Promise.all([
      promise(this.parser, 'end', 'error', timeout),
      this.write(this.footer(this.footerElement())),
    ])

    if (this.parser && this.socket) this._status('closing')
    const [el] = await p
    this.root = null
    return el
    // The 'close' status is set by the parser 'end' listener
  }

  /**
   * Restart the stream
   * https://xmpp.org/rfcs/rfc6120.html#streams-negotiation-restart
   */
  async restart() {
    this._detachParser()
    const {domain, lang} = this.options
    return this.open({domain, lang})
  }

  async send(element) {
    element.parent = this.root
    this.emit('outgoing', element)
    await this.write(element)
    this.emit('send', element)
  }

  sendReceive(element, timeout = this.timeout) {
    return Promise.all([
      this.send(element),
      promise(this, 'element', 'error', timeout),
    ]).then(([, el]) => el)
  }

  write(data) {
    return new Promise((resolve, reject) => {
      // https://xmpp.org/rfcs/rfc6120.html#streams-close
      // "Refrain from sending any further data over its outbound stream to the other entity"
      if (this.status === 'closing') {
        reject(new Error('Connection is closing'))
        return
      }

      const str = data.toString('utf8')
      this.socket.write(str, err => {
        if (err) {
          return reject(err)
        }

        this.emit('output', str)
        resolve()
      })
    })
  }

  isStanza(element) {
    const {name} = element
    return name === 'iq' || name === 'message' || name === 'presence'
  }

  isNonza(element) {
    return !this.isStanza(element)
  }

  // Override
  header(el) {
    return el.toString()
  }

  // Override
  headerElement() {
    return new xml.Element('', {
      version: '1.0',
      xmlns: this.NS,
    })
  }

  // Override
  footer(el) {
    return el.toString()
  }

  // Override
  footerElement() {}

  // Override
  socketParameters() {}
}

// Overrirde
Connection.prototype.NS = ''
Connection.prototype.Socket = null
Connection.prototype.Parser = null

module.exports = Connection


/***/ }),

/***/ "./node_modules/@xmpp/connection/lib/StreamError.js":
/*!**********************************************************!*\
  !*** ./node_modules/@xmpp/connection/lib/StreamError.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const XMPPError = __webpack_require__(/*! @xmpp/error */ "./node_modules/@xmpp/error/index.js")

// https://xmpp.org/rfcs/rfc6120.html#streams-error

class StreamError extends XMPPError {
  constructor(...args) {
    super(...args)
    this.name = 'StreamError'
  }
}

module.exports = StreamError


/***/ }),

/***/ "./node_modules/@xmpp/connection/lib/util.js":
/*!***************************************************!*\
  !*** ./node_modules/@xmpp/connection/lib/util.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function parseURI(URI) {
  let {port, hostname, protocol} = new URL(URI)
  // https://github.com/nodejs/node/issues/12410#issuecomment-294138912
  if (hostname === '[::1]') {
    hostname = '::1'
  }

  return {port, hostname, protocol}
}

function parseHost(host) {
  const {port, hostname} = parseURI(`http://${host}`)
  return {port, hostname}
}

function parseService(service) {
  return service.includes('://') ? parseURI(service) : parseHost(service)
}

Object.assign(module.exports, {parseURI, parseHost, parseService})


/***/ }),

/***/ "./node_modules/@xmpp/error/index.js":
/*!*******************************************!*\
  !*** ./node_modules/@xmpp/error/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class XMPPError extends Error {
  constructor(condition, text, application) {
    super(condition + (text ? ` - ${text}` : ''))
    this.name = 'XMPPError'
    this.condition = condition
    this.text = text
    this.application = application
  }

  static fromElement(element) {
    const [condition, second, third] = element.children
    let text
    let application

    if (second) {
      if (second.is('text')) {
        text = second
      } else if (second) {
        application = second
      }

      if (third) application = third
    }

    const error = new this(condition.name, text ? text.text() : '', application)
    error.element = element
    return error
  }
}

module.exports = XMPPError


/***/ }),

/***/ "./node_modules/@xmpp/events/index.js":
/*!********************************************!*\
  !*** ./node_modules/@xmpp/events/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const timeout = __webpack_require__(/*! ./lib/timeout */ "./node_modules/@xmpp/events/lib/timeout.js")
const delay = __webpack_require__(/*! ./lib/delay */ "./node_modules/@xmpp/events/lib/delay.js")
const TimeoutError = __webpack_require__(/*! ./lib/TimeoutError */ "./node_modules/@xmpp/events/lib/TimeoutError.js")
const promise = __webpack_require__(/*! ./lib/promise */ "./node_modules/@xmpp/events/lib/promise.js")
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js")
const Deferred = __webpack_require__(/*! ./lib/Deferred */ "./node_modules/@xmpp/events/lib/Deferred.js")

exports.EventEmitter = EventEmitter
exports.timeout = timeout
exports.delay = delay
exports.TimeoutError = TimeoutError
exports.promise = promise
exports.Deferred = Deferred


/***/ }),

/***/ "./node_modules/@xmpp/events/lib/Deferred.js":
/*!***************************************************!*\
  !*** ./node_modules/@xmpp/events/lib/Deferred.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function Deferred() {
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })
}


/***/ }),

/***/ "./node_modules/@xmpp/events/lib/TimeoutError.js":
/*!*******************************************************!*\
  !*** ./node_modules/@xmpp/events/lib/TimeoutError.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = class TimeoutError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TimeoutError'
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/events/lib/delay.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/events/lib/delay.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function delay(ms) {
  let timeout
  const promise = new Promise(resolve => {
    timeout = setTimeout(resolve, ms)
  })
  promise.timeout = timeout
  return promise
}


/***/ }),

/***/ "./node_modules/@xmpp/events/lib/promise.js":
/*!**************************************************!*\
  !*** ./node_modules/@xmpp/events/lib/promise.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const TimeoutError = __webpack_require__(/*! ./TimeoutError */ "./node_modules/@xmpp/events/lib/TimeoutError.js")

// eslint-disable-next-line default-param-last
module.exports = function promise(EE, event, rejectEvent = 'error', timeout) {
  return new Promise((resolve, reject) => {
    let timeoutId

    const cleanup = () => {
      clearTimeout(timeoutId)
      EE.removeListener(event, onEvent)
      EE.removeListener(rejectEvent, onError)
    }

    function onError(reason) {
      reject(reason)
      cleanup()
    }

    function onEvent(value) {
      resolve(value)
      cleanup()
    }

    EE.once(event, onEvent)
    if (rejectEvent) {
      EE.once(rejectEvent, onError)
    }

    if (timeout) {
      timeoutId = setTimeout(() => {
        cleanup()
        reject(new TimeoutError())
      }, timeout)
    }
  })
}


/***/ }),

/***/ "./node_modules/@xmpp/events/lib/timeout.js":
/*!**************************************************!*\
  !*** ./node_modules/@xmpp/events/lib/timeout.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const TimeoutError = __webpack_require__(/*! ./TimeoutError */ "./node_modules/@xmpp/events/lib/TimeoutError.js")
const delay = __webpack_require__(/*! ./delay */ "./node_modules/@xmpp/events/lib/delay.js")

module.exports = function timeout(promise, ms) {
  const promiseDelay = delay(ms)

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function cancelDelay() {
    clearTimeout(promiseDelay.timeout)
  }

  return Promise.race([
    promise.finally(cancelDelay),
    promiseDelay.then(() => {
      throw new TimeoutError()
    }),
  ])
}


/***/ }),

/***/ "./node_modules/@xmpp/id/index.js":
/*!****************************************!*\
  !*** ./node_modules/@xmpp/id/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function id() {
  let i
  while (!i) {
    i = Math.random()
      .toString(36)
      .slice(2, 12)
  }

  return i
}


/***/ }),

/***/ "./node_modules/@xmpp/iq/callee.js":
/*!*****************************************!*\
  !*** ./node_modules/@xmpp/iq/callee.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * References
 * https://xmpp.org/rfcs/rfc6120.html#stanzas-semantics-iq
 * https://xmpp.org/rfcs/rfc6120.html#stanzas-error
 */

const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")

const NS_STANZA = 'urn:ietf:params:xml:ns:xmpp-stanzas'

function isQuery({name, type}) {
  if (name !== 'iq') return false
  if (type === 'error' || type === 'result') return false
  return true
}

function isValidQuery({type}, children, child) {
  if (type !== 'get' && type !== 'set') return false
  if (children.length !== 1) return false
  if (!child) return false
  return true
}

function buildReply({stanza}) {
  return xml('iq', {
    to: stanza.attrs.from,
    from: stanza.attrs.to,
    id: stanza.attrs.id,
  })
}

function buildReplyResult(ctx, child) {
  const reply = buildReply(ctx)
  reply.attrs.type = 'result'
  if (child) {
    reply.append(child)
  }

  return reply
}

function buildReplyError(ctx, error, child) {
  const reply = buildReply(ctx)
  reply.attrs.type = 'error'
  if (child) {
    reply.append(child)
  }

  reply.append(error)
  return reply
}

function buildError(type, condition) {
  return xml('error', {type}, xml(condition, NS_STANZA))
}

function iqHandler(entity) {
  return async function iqHandler(ctx, next) {
    if (!isQuery(ctx)) return next()

    const {stanza} = ctx
    const children = stanza.getChildElements()
    const [child] = children

    if (!isValidQuery(ctx, children, child)) {
      return buildReplyError(ctx, buildError('modify', 'bad-request'), child)
    }

    ctx.element = child

    let reply
    try {
      reply = await next()
    } catch (err) {
      entity.emit('error', err)
      reply = buildError('cancel', 'internal-server-error')
    }

    if (!reply) {
      reply = buildError('cancel', 'service-unavailable')
    }

    if (reply instanceof xml.Element && reply.is('error')) {
      return buildReplyError(ctx, reply, child)
    }

    return buildReplyResult(
      ctx,
      reply instanceof xml.Element ? reply : undefined
    )
  }
}

function route(type, ns, name, handler) {
  return function(ctx, next) {
    if ((ctx.type !== type) | !ctx.element || !ctx.element.is(name, ns))
      return next()
    return handler(ctx, next)
  }
}

module.exports = function({middleware, entity}) {
  middleware.use(iqHandler(entity))

  return {
    get(ns, name, handler) {
      middleware.use(route('get', ns, name, handler))
    },
    set(ns, name, handler) {
      middleware.use(route('set', ns, name, handler))
    },
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/iq/caller.js":
/*!*****************************************!*\
  !*** ./node_modules/@xmpp/iq/caller.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const xid = __webpack_require__(/*! @xmpp/id */ "./node_modules/@xmpp/id/index.js")
const StanzaError = __webpack_require__(/*! @xmpp/middleware/lib/StanzaError */ "./node_modules/@xmpp/middleware/lib/StanzaError.js")
const {Deferred} = __webpack_require__(/*! @xmpp/events */ "./node_modules/@xmpp/events/index.js")
const timeoutPromise = __webpack_require__(/*! @xmpp/events */ "./node_modules/@xmpp/events/index.js").timeout
const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")

function isReply({name, type}) {
  if (name !== 'iq') return false
  if (type !== 'error' && type !== 'result') return false
  return true
}

class IQCaller {
  constructor({entity, middleware}) {
    this.handlers = new Map()
    this.entity = entity
    this.middleware = middleware
  }

  start() {
    this.middleware.use(this._route.bind(this))
  }

  _route({type, name, id, stanza}, next) {
    if (!isReply({name, type})) return next()

    const deferred = this.handlers.get(id)

    if (!deferred) {
      return next()
    }

    if (type === 'error') {
      deferred.reject(StanzaError.fromElement(stanza.getChild('error')))
    } else {
      deferred.resolve(stanza)
    }

    this.handlers.delete(id)
  }

  async request(stanza, timeout = 30 * 1000) {
    if (!stanza.attrs.id) {
      stanza.attrs.id = xid()
    }

    const deferred = new Deferred()
    this.handlers.set(stanza.attrs.id, deferred)

    try {
      await this.entity.send(stanza)
      await timeoutPromise(deferred.promise, timeout)
    } catch (err) {
      this.handlers.delete(stanza.attrs.id)
      throw err
    }

    return deferred.promise
  }

  _childRequest(type, element, to, ...args) {
    const {name} = element
    const {xmlns} = element.attrs
    return this.request(xml('iq', {type, to}, element), ...args).then(stanza =>
      stanza.getChild(name, xmlns)
    )
  }

  async get(...args) {
    return this._childRequest('get', ...args)
  }

  async set(...args) {
    return this._childRequest('set', ...args)
  }
}

module.exports = function iqCaller(...args) {
  const iqCaller = new IQCaller(...args)
  iqCaller.start()
  return iqCaller
}


/***/ }),

/***/ "./node_modules/@xmpp/jid/index.js":
/*!*****************************************!*\
  !*** ./node_modules/@xmpp/jid/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const JID = __webpack_require__(/*! ./lib/JID */ "./node_modules/@xmpp/jid/lib/JID.js")
const escaping = __webpack_require__(/*! ./lib/escaping */ "./node_modules/@xmpp/jid/lib/escaping.js")
const parse = __webpack_require__(/*! ./lib/parse */ "./node_modules/@xmpp/jid/lib/parse.js")

function jid(...args) {
  if (!args[1] && !args[2]) {
    return parse(...args)
  }

  return new JID(...args)
}

exports = module.exports = jid.bind()
exports.jid = jid
exports.JID = JID
exports.equal = function(a, b) {
  return a.equals(b)
}

exports.detectEscape = escaping.detect
exports.escapeLocal = escaping.escape
exports.unescapeLocal = escaping.unescape
exports.parse = parse


/***/ }),

/***/ "./node_modules/@xmpp/jid/lib/JID.js":
/*!*******************************************!*\
  !*** ./node_modules/@xmpp/jid/lib/JID.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const escaping = __webpack_require__(/*! ./escaping */ "./node_modules/@xmpp/jid/lib/escaping.js")

/**
 * JID implements
 * - XMPP addresses according to RFC6122
 * - XEP-0106: JID Escaping
 *
 * @see http://tools.ietf.org/html/rfc6122#section-2
 * @see http://xmpp.org/extensions/xep-0106.html
 */
class JID {
  constructor(local, domain, resource) {
    if (typeof domain !== 'string' || !domain) {
      throw new TypeError(`Invalid domain.`)
    }

    this.setDomain(domain)
    this.setLocal(typeof local === 'string' ? local : '')
    this.setResource(typeof resource === 'string' ? resource : '')
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return NaN
    }

    return this.toString()
  }

  toString(unescape) {
    let s = this._domain
    if (this._local) {
      s = this.getLocal(unescape) + '@' + s
    }

    if (this._resource) {
      s = s + '/' + this._resource
    }

    return s
  }

  /**
   * Convenience method to distinguish users
   * */
  bare() {
    if (this._resource) {
      return new JID(this._local, this._domain, null)
    }

    return this
  }

  /**
   * Comparison function
   * */
  equals(other) {
    return (
      this._local === other._local &&
      this._domain === other._domain &&
      this._resource === other._resource
    )
  }

  /**
   * http://xmpp.org/rfcs/rfc6122.html#addressing-localpart
   * */
  setLocal(local, escape) {
    escape = escape || escaping.detect(local)

    if (escape) {
      local = escaping.escape(local)
    }

    this._local = local && local.toLowerCase()
    return this
  }

  getLocal(unescape) {
    unescape = unescape || false
    let local = null

    if (unescape) {
      local = escaping.unescape(this._local)
    } else {
      local = this._local
    }

    return local
  }

  /**
   * http://xmpp.org/rfcs/rfc6122.html#addressing-domain
   */
  setDomain(domain) {
    this._domain = domain.toLowerCase()
    return this
  }

  getDomain() {
    return this._domain
  }

  /**
   * http://xmpp.org/rfcs/rfc6122.html#addressing-resourcepart
   */
  setResource(resource) {
    this._resource = resource
    return this
  }

  getResource() {
    return this._resource
  }
}

Object.defineProperty(JID.prototype, 'local', {
  get: JID.prototype.getLocal,
  set: JID.prototype.setLocal,
})

Object.defineProperty(JID.prototype, 'domain', {
  get: JID.prototype.getDomain,
  set: JID.prototype.setDomain,
})

Object.defineProperty(JID.prototype, 'resource', {
  get: JID.prototype.getResource,
  set: JID.prototype.setResource,
})

module.exports = JID


/***/ }),

/***/ "./node_modules/@xmpp/jid/lib/escaping.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/jid/lib/escaping.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.detect = function(local) {
  if (!local) {
    return false
  }

  // Remove all escaped sequences
  const tmp = local
    .replace(/\\20/g, '')
    .replace(/\\22/g, '')
    .replace(/\\26/g, '')
    .replace(/\\27/g, '')
    .replace(/\\2f/g, '')
    .replace(/\\3a/g, '')
    .replace(/\\3c/g, '')
    .replace(/\\3e/g, '')
    .replace(/\\40/g, '')
    .replace(/\\5c/g, '')

  // Detect if we have unescaped sequences
  // eslint-disable-next-line unicorn/regex-shorthand
  const search = tmp.search(/\\| |"|&|'|\/|:|<|>|@/g)
  if (search === -1) {
    return false
  }

  return true
}

/**
 * Escape the local part of a JID.
 *
 * @see http://xmpp.org/extensions/xep-0106.html
 * @param String local local part of a jid
 * @return An escaped local part
 */
module.exports.escape = function(local) {
  if (local === null) {
    return null
  }

  return local
    .replace(/^\s+|\s+$/g, '')
    .replace(/\\/g, '\\5c')
    .replace(/ /g, '\\20')
    .replace(/"/g, '\\22')
    .replace(/&/g, '\\26')
    .replace(/'/g, '\\27')
    .replace(/\//g, '\\2f')
    .replace(/:/g, '\\3a')
    .replace(/</g, '\\3c')
    .replace(/>/g, '\\3e')
    .replace(/@/g, '\\40')
    .replace(/\3a/g, '\u0005c3a')
}

/**
 * Unescape a local part of a JID.
 *
 * @see http://xmpp.org/extensions/xep-0106.html
 * @param String local local part of a jid
 * @return unescaped local part
 */
module.exports.unescape = function(local) {
  if (local === null) {
    return null
  }

  return local
    .replace(/\\20/g, ' ')
    .replace(/\\22/g, '"')
    .replace(/\\26/g, '&')
    .replace(/\\27/g, "'")
    .replace(/\\2f/g, '/')
    .replace(/\\3a/g, ':')
    .replace(/\\3c/g, '<')
    .replace(/\\3e/g, '>')
    .replace(/\\40/g, '@')
    .replace(/\\5c/g, '\\')
}


/***/ }),

/***/ "./node_modules/@xmpp/jid/lib/parse.js":
/*!*********************************************!*\
  !*** ./node_modules/@xmpp/jid/lib/parse.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const JID = __webpack_require__(/*! ../lib/JID */ "./node_modules/@xmpp/jid/lib/JID.js")

module.exports = function parse(s) {
  let local
  let resource

  const resourceStart = s.indexOf('/')
  if (resourceStart !== -1) {
    resource = s.slice(resourceStart + 1)
    s = s.slice(0, resourceStart)
  }

  const atStart = s.indexOf('@')
  if (atStart !== -1) {
    local = s.slice(0, atStart)
    s = s.slice(atStart + 1)
  }

  return new JID(local, s, resource)
}


/***/ }),

/***/ "./node_modules/@xmpp/middleware/index.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/middleware/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const compose = __webpack_require__(/*! koa-compose */ "./node_modules/koa-compose/index.js")

const IncomingContext = __webpack_require__(/*! ./lib/IncomingContext */ "./node_modules/@xmpp/middleware/lib/IncomingContext.js")
const OutgoingContext = __webpack_require__(/*! ./lib/OutgoingContext */ "./node_modules/@xmpp/middleware/lib/OutgoingContext.js")

function listener(entity, middleware, Context) {
  return function(stanza) {
    const ctx = new Context(entity, stanza)
    return compose(middleware)(ctx)
  }
}

function errorHandler(entity) {
  return function(ctx, next) {
    next()
      .then(reply => reply && entity.send(reply))
      .catch(err => entity.emit('error', err))
  }
}

module.exports = function({entity}) {
  const incoming = [errorHandler(entity)]
  const outgoing = []

  const incomingListener = listener(entity, incoming, IncomingContext)
  const outgoingListener = listener(entity, outgoing, OutgoingContext)

  entity.on('element', incomingListener)
  entity.hookOutgoing = outgoingListener

  return {
    use(fn) {
      incoming.push(fn)
      return fn
    },
    filter(fn) {
      outgoing.push(fn)
      return fn
    },
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/middleware/lib/Context.js":
/*!******************************************************!*\
  !*** ./node_modules/@xmpp/middleware/lib/Context.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = class Context {
  constructor(entity, stanza) {
    this.stanza = stanza
    this.entity = entity

    const {name, attrs} = stanza
    const {type, id} = attrs

    this.name = name
    this.id = id || ''

    if (name === 'message') {
      this.type = type || 'normal'
    } else if (name === 'presence') {
      this.type = type || 'available'
    } else {
      this.type = type || ''
    }

    this.from = null
    this.to = null
    this.local = ''
    this.domain = ''
    this.resource = ''
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/middleware/lib/IncomingContext.js":
/*!**************************************************************!*\
  !*** ./node_modules/@xmpp/middleware/lib/IncomingContext.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Context = __webpack_require__(/*! ./Context */ "./node_modules/@xmpp/middleware/lib/Context.js")
const JID = __webpack_require__(/*! @xmpp/jid */ "./node_modules/@xmpp/jid/index.js")

module.exports = class IncomingContext extends Context {
  constructor(entity, stanza) {
    super(entity, stanza)

    const {jid, domain} = entity

    const to = stanza.attrs.to || (jid && jid.toString())
    const from = stanza.attrs.from || domain

    if (to) this.to = new JID(to)

    if (from) {
      this.from = new JID(from)
      this.local = this.from.local
      this.domain = this.from.domain
      this.resource = this.from.resource
    }
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/middleware/lib/OutgoingContext.js":
/*!**************************************************************!*\
  !*** ./node_modules/@xmpp/middleware/lib/OutgoingContext.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Context = __webpack_require__(/*! ./Context */ "./node_modules/@xmpp/middleware/lib/Context.js")
const JID = __webpack_require__(/*! @xmpp/jid */ "./node_modules/@xmpp/jid/index.js")

module.exports = class OutgoingContext extends Context {
  constructor(entity, stanza) {
    super(entity, stanza)

    const {jid, domain} = entity

    const from = stanza.attrs.from || (jid && jid.toString())
    const to = stanza.attrs.to || domain

    if (from) this.from = new JID(from)

    if (to) {
      this.to = new JID(to)
      this.local = this.to.local
      this.domain = this.to.domain
      this.resource = this.to.resource
    }
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/middleware/lib/StanzaError.js":
/*!**********************************************************!*\
  !*** ./node_modules/@xmpp/middleware/lib/StanzaError.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* https://xmpp.org/rfcs/rfc6120.html#stanzas-error */

const XMPPError = __webpack_require__(/*! @xmpp/error */ "./node_modules/@xmpp/error/index.js")

class StanzaError extends XMPPError {
  constructor(condition, text, application, type) {
    super(condition, text, application)
    this.type = type
    this.name = 'StanzaError'
  }

  static fromElement(element) {
    const error = super.fromElement(element)
    error.type = element.attrs.type
    return error
  }
}

module.exports = StanzaError


/***/ }),

/***/ "./node_modules/@xmpp/reconnect/index.js":
/*!***********************************************!*\
  !*** ./node_modules/@xmpp/reconnect/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {EventEmitter} = __webpack_require__(/*! @xmpp/events */ "./node_modules/@xmpp/events/index.js")

class Reconnect extends EventEmitter {
  constructor(entity) {
    super()

    this.delay = 1000
    this.entity = entity
    this._timeout = null
  }

  scheduleReconnect() {
    const {entity, delay, _timeout} = this
    clearTimeout(_timeout)
    this._timeout = setTimeout(async () => {
      if (entity.status !== 'disconnect') {
        return
      }

      try {
        await this.reconnect()
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // Ignoring the rejection is safe because the error is emitted on entity by #start
      }
    }, delay)
  }

  async reconnect() {
    const {entity} = this
    this.emit('reconnecting')

    const {service, domain, lang} = entity.options
    await entity.connect(service)
    await entity.open({domain, lang})

    this.emit('reconnected')
  }

  start() {
    const {entity} = this
    const listeners = {}
    listeners.disconnect = () => {
      this.scheduleReconnect()
    }

    this.listeners = listeners
    entity.on('disconnect', listeners.disconnect)
  }

  stop() {
    const {entity, listeners, _timeout} = this
    entity.removeListener('disconnect', listeners.disconnect)
    clearTimeout(_timeout)
  }
}

module.exports = function reconnect({entity}) {
  const r = new Reconnect(entity)
  r.start()
  return r
}


/***/ }),

/***/ "./node_modules/@xmpp/resolve/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@xmpp/resolve/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const resolve = __webpack_require__(/*! ./resolve */ "./node_modules/@xmpp/resolve/resolve.js")
const {promise} = __webpack_require__(/*! @xmpp/events */ "./node_modules/@xmpp/events/index.js")

async function fetchURIs(domain) {
  return [
    // Remove duplicates
    ...new Set(
      (
        await resolve(domain, {
          srv: [
            {
              service: 'xmpps-client',
              protocol: 'tcp',
            },
            {
              service: 'xmpp-client',
              protocol: 'tcp',
            },
          ],
        })
      ).map(record => record.uri)
    ),
  ]
}

function filterSupportedURIs(entity, uris) {
  return uris.filter(uri => entity._findTransport(uri))
}

async function fallbackConnect(entity, uris) {
  if (uris.length === 0) {
    throw new Error("Couldn't connect")
  }

  const uri = uris.shift()
  const Transport = entity._findTransport(uri)

  if (!Transport) {
    return fallbackConnect(entity, uris)
  }

  entity._status('connecting', uri)
  const params = Transport.prototype.socketParameters(uri)
  const socket = new Transport.prototype.Socket()

  try {
    socket.connect(params)
    await promise(socket, 'connect')
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return fallbackConnect(entity, uris)
  }

  entity._attachSocket(socket)
  socket.emit('connect')
  entity.Transport = Transport
  entity.Socket = Transport.prototype.Socket
  entity.Parser = Transport.prototype.Parser
}

module.exports = function({entity}) {
  const _connect = entity.connect
  entity.connect = async function connect(service) {
    if (!service || service.match(/:\/\//)) {
      return _connect.call(this, service)
    }

    const uris = filterSupportedURIs(entity, await fetchURIs(service))

    if (uris.length === 0) {
      throw new Error('No compatible transport found.')
    }

    try {
      await fallbackConnect(entity, uris)
    } catch (err) {
      entity._reset()
      entity._status('disconnect')
      throw err
    }
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/resolve/lib/alt-connections.js":
/*!***********************************************************!*\
  !*** ./node_modules/@xmpp/resolve/lib/alt-connections.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isSecure(uri) {
  return uri.startsWith('https') || uri.startsWith('wss')
}

module.exports.compare = function compare(a, b) {
  let secure
  if (isSecure(a.uri) && !isSecure(b.uri)) {
    secure = -1
  } else if (!isSecure(a.uri) && isSecure(b.uri)) {
    secure = 1
  } else {
    secure = 0
  }

  if (secure !== 0) {
    return secure
  }

  let method
  if (a.method === b.method) {
    method = 0
  } else if (a.method === 'websocket') {
    method = -1
  } else if (b.method === 'websocket') {
    method = 1
  } else if (a.method === 'xbosh') {
    method = -1
  } else if (b.method === 'xbosh') {
    method = 1
  } else if (a.method === 'httppoll') {
    method = -1
  } else if (b.method === 'httppoll') {
    method = 1
  } else {
    method = 0
  }

  if (method !== 0) {
    return method
  }

  return 0
}


/***/ }),

/***/ "./node_modules/@xmpp/resolve/lib/http.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/resolve/lib/http.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

const fetch = global.fetch || __webpack_require__(/*! node-fetch */ "node-fetch")
const parse = __webpack_require__(/*! @xmpp/xml/lib/parse */ "./node_modules/@xmpp/xml/lib/parse.js")
const compareAltConnections = __webpack_require__(/*! ./alt-connections */ "./node_modules/@xmpp/resolve/lib/alt-connections.js").compare

function resolve(domain) {
  return fetch(`https://${domain}/.well-known/host-meta`)
    .then(res => res.text())
    .then(res => {
      return parse(res)
        .getChildren('Link')
        .filter(link =>
          [
            'urn:xmpp:alt-connections:websocket',
            'urn:xmpp:alt-connections:httppoll',
            'urn:xmpp:alt-connections:xbosh',
          ].includes(link.attrs.rel)
        )
        .map(({attrs}) => ({
          rel: attrs.rel,
          href: attrs.href,
          method: attrs.rel.split(':').pop(),
          uri: attrs.href,
        }))
        .sort(compareAltConnections)
    })
    .catch(() => {
      return []
    })
}

module.exports.resolve = resolve

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@xmpp/resolve/resolve.js":
/*!***********************************************!*\
  !*** ./node_modules/@xmpp/resolve/resolve.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const dns = __webpack_require__(/*! ./lib/dns */ 1)
const http = __webpack_require__(/*! ./lib/http */ "./node_modules/@xmpp/resolve/lib/http.js")

module.exports = function resolve(...args) {
  return Promise.all([
    dns.resolve ? dns.resolve(...args) : Promise.resolve([]),
    http.resolve(...args),
  ]).then(([records, endpoints]) => records.concat(endpoints))
}

if (dns.resolve) {
  module.exports.dns = dns
}

module.exports.http = http


/***/ }),

/***/ "./node_modules/@xmpp/resource-binding/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@xmpp/resource-binding/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")

/*
 * References
 * https://xmpp.org/rfcs/rfc6120.html#bind
 */

const NS = 'urn:ietf:params:xml:ns:xmpp-bind'

function makeBindElement(resource) {
  return xml('bind', {xmlns: NS}, resource && xml('resource', {}, resource))
}

async function bind(entity, iqCaller, resource) {
  const result = await iqCaller.set(makeBindElement(resource))
  const jid = result.getChildText('jid')
  entity._jid(jid)
  return jid
}

function route({iqCaller}, resource) {
  return async function({entity}, next) {
    if (typeof resource === 'function') {
      await resource(resource => bind(entity, iqCaller, resource))
    } else {
      await bind(entity, iqCaller, resource)
    }

    next()
  }
}

module.exports = function({streamFeatures, iqCaller}, resource) {
  streamFeatures.use('bind', NS, route({iqCaller}, resource))
}


/***/ }),

/***/ "./node_modules/@xmpp/sasl-anonymous/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@xmpp/sasl-anonymous/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * [XEP-0175: Best Practices for Use of SASL ANONYMOUS](https://xmpp.org/extensions/xep-0175.html)
 * [RFC-4504: Anonymous Simple Authentication and Security Layer (SASL) Mechanism](https://tools.ietf.org/html/rfc4505)
 */

const mech = __webpack_require__(/*! sasl-anonymous */ "./node_modules/sasl-anonymous/main.js")

module.exports = function saslAnonymous(sasl) {
  sasl.use(mech)
}


/***/ }),

/***/ "./node_modules/@xmpp/sasl-plain/index.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/sasl-plain/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const mech = __webpack_require__(/*! sasl-plain */ "./node_modules/sasl-plain/main.js")

module.exports = function saslPlain(sasl) {
  sasl.use(mech)
}


/***/ }),

/***/ "./node_modules/@xmpp/sasl/index.js":
/*!******************************************!*\
  !*** ./node_modules/@xmpp/sasl/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {encode, decode} = __webpack_require__(/*! @xmpp/base64 */ "./node_modules/@xmpp/base64/browser.js")
const SASLError = __webpack_require__(/*! ./lib/SASLError */ "./node_modules/@xmpp/sasl/lib/SASLError.js")
const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")
const SASLFactory = __webpack_require__(/*! saslmechanisms */ "./node_modules/saslmechanisms/main.js")

// https://xmpp.org/rfcs/rfc6120.html#sasl

const NS = 'urn:ietf:params:xml:ns:xmpp-sasl'

function getMechanismNames(features) {
  return features.getChild('mechanisms', NS).children.map(el => el.text())
}

async function authenticate(SASL, entity, mechname, credentials) {
  const mech = SASL.create([mechname])
  if (!mech) {
    throw new Error('No compatible mechanism')
  }

  const {domain} = entity.options
  const creds = {
    username: null,
    password: null,
    server: domain,
    host: domain,
    realm: domain,
    serviceType: 'xmpp',
    serviceName: domain,
    ...credentials,
  }

  return new Promise((resolve, reject) => {
    const handler = element => {
      if (element.attrs.xmlns !== NS) {
        return
      }

      if (element.name === 'challenge') {
        mech.challenge(decode(element.text()))
        const resp = mech.response(creds)
        entity.send(
          xml(
            'response',
            {xmlns: NS, mechanism: mech.name},
            typeof resp === 'string' ? encode(resp) : ''
          )
        )
        return
      }

      if (element.name === 'failure') {
        reject(SASLError.fromElement(element))
      } else if (element.name === 'success') {
        resolve()
      }

      entity.removeListener('nonza', handler)
    }

    entity.on('nonza', handler)

    if (mech.clientFirst) {
      entity.send(
        xml(
          'auth',
          {xmlns: NS, mechanism: mech.name},
          encode(mech.response(creds))
        )
      )
    }
  })
}

module.exports = function sasl({streamFeatures}, credentials) {
  const SASL = new SASLFactory()

  streamFeatures.use('mechanisms', NS, async ({stanza, entity}) => {
    const offered = getMechanismNames(stanza)
    const supported = SASL._mechs.map(({name}) => name)
    const intersection = supported.filter(mech => {
      return offered.includes(mech)
    })
    let mech = intersection[0]

    if (typeof credentials === 'function') {
      await credentials(
        creds => authenticate(SASL, entity, mech, creds, stanza),
        mech
      )
    } else {
      if (!credentials.username && !credentials.password) {
        mech = 'ANONYMOUS'
      }

      await authenticate(SASL, entity, mech, credentials, stanza)
    }

    await entity.restart()
  })

  return {
    use(...args) {
      return SASL.use(...args)
    },
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/sasl/lib/SASLError.js":
/*!**************************************************!*\
  !*** ./node_modules/@xmpp/sasl/lib/SASLError.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const XMPPError = __webpack_require__(/*! @xmpp/error */ "./node_modules/@xmpp/error/index.js")

// https://xmpp.org/rfcs/rfc6120.html#sasl-errors

class SASLError extends XMPPError {
  constructor(...args) {
    super(...args)
    this.name = 'SASLError'
  }
}

module.exports = SASLError


/***/ }),

/***/ "./node_modules/@xmpp/session-establishment/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@xmpp/session-establishment/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")

// https://tools.ietf.org/html/draft-cridland-xmpp-session-01

const NS = 'urn:ietf:params:xml:ns:xmpp-session'

module.exports = function({iqCaller, streamFeatures}) {
  streamFeatures.use('session', NS, async (context, next, feature) => {
    if (feature.getChild('optional')) return next()
    await iqCaller.set(xml('session', NS))
    return next()
  })
}


/***/ }),

/***/ "./node_modules/@xmpp/stream-features/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@xmpp/stream-features/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * References
 * https://xmpp.org/rfcs/rfc6120.html#streams-negotiation Stream Negotiation
 * https://xmpp.org/extensions/xep-0170.html XEP-0170: Recommended Order of Stream Feature Negotiation
 * https://xmpp.org/registrar/stream-features.html XML Stream Features
 */

const route = __webpack_require__(/*! ./route */ "./node_modules/@xmpp/stream-features/route.js")

module.exports = function({middleware}) {
  middleware.use(route())

  function use(name, xmlns, handler) {
    return middleware.use((ctx, next) => {
      const {stanza} = ctx
      if (!stanza.is('features', 'http://etherx.jabber.org/streams'))
        return next()
      const feature = stanza.getChild(name, xmlns)
      if (!feature) return next()
      return handler(ctx, next, feature)
    })
  }

  return {
    use,
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/stream-features/route.js":
/*!*****************************************************!*\
  !*** ./node_modules/@xmpp/stream-features/route.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function route() {
  return async function({stanza, entity}, next) {
    if (!stanza.is('features', 'http://etherx.jabber.org/streams'))
      return next()

    await next()
    if (entity.jid) entity._status('online', entity.jid)
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/websocket/index.js":
/*!***********************************************!*\
  !*** ./node_modules/@xmpp/websocket/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ConnectionWebSocket = __webpack_require__(/*! ./lib/Connection */ "./node_modules/@xmpp/websocket/lib/Connection.js")

module.exports = function websocket({entity}) {
  entity.transports.push(ConnectionWebSocket)
}


/***/ }),

/***/ "./node_modules/@xmpp/websocket/lib/Connection.js":
/*!********************************************************!*\
  !*** ./node_modules/@xmpp/websocket/lib/Connection.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Socket = __webpack_require__(/*! ./Socket */ "./node_modules/@xmpp/websocket/lib/Socket.js")
const Connection = __webpack_require__(/*! @xmpp/connection */ "./node_modules/@xmpp/connection/index.js")
const xml = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")
const FramedParser = __webpack_require__(/*! ./FramedParser */ "./node_modules/@xmpp/websocket/lib/FramedParser.js")

const NS_FRAMING = 'urn:ietf:params:xml:ns:xmpp-framing'

/* References
 * WebSocket protocol https://tools.ietf.org/html/rfc6455
 * WebSocket Web API https://html.spec.whatwg.org/multipage/comms.html#network
 * XMPP over WebSocket https://tools.ietf.org/html/rfc7395
 */

class ConnectionWebSocket extends Connection {
  send(element, ...args) {
    if (!element.attrs.xmlns && super.isStanza(element)) {
      element.attrs.xmlns = 'jabber:client'
    }

    return super.send(element, ...args)
  }

  // https://tools.ietf.org/html/rfc7395#section-3.6
  footerElement() {
    return new xml.Element('close', {
      xmlns: NS_FRAMING,
    })
  }

  // https://tools.ietf.org/html/rfc7395#section-3.4
  headerElement() {
    const el = super.headerElement()
    el.name = 'open'
    el.attrs.xmlns = NS_FRAMING
    return el
  }

  socketParameters(service) {
    return service.match(/^wss?:\/\//) ? service : undefined
  }
}

ConnectionWebSocket.prototype.Socket = Socket
ConnectionWebSocket.prototype.NS = 'jabber:client'
ConnectionWebSocket.prototype.Parser = FramedParser

module.exports = ConnectionWebSocket


/***/ }),

/***/ "./node_modules/@xmpp/websocket/lib/FramedParser.js":
/*!**********************************************************!*\
  !*** ./node_modules/@xmpp/websocket/lib/FramedParser.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {Parser, Element, XMLError} = __webpack_require__(/*! @xmpp/xml */ "./node_modules/@xmpp/xml/index.js")

module.exports = class FramedParser extends Parser {
  onStartElement(name, attrs) {
    const element = new Element(name, attrs)

    const {cursor} = this

    if (cursor) {
      cursor.append(element)
    }

    this.cursor = element
  }

  onEndElement(name) {
    const {cursor} = this
    if (name !== cursor.name) {
      // <foo></bar>
      this.emit('error', new XMLError(`${cursor.name} must be closed.`))
      return
    }

    if (cursor.parent) {
      this.cursor = cursor.parent
      return
    }

    if (cursor.is('open', 'urn:ietf:params:xml:ns:xmpp-framing')) {
      this.emit('start', cursor)
    } else if (cursor.is('close', 'urn:ietf:params:xml:ns:xmpp-framing')) {
      this.emit('end', cursor)
    } else {
      this.emit('element', cursor)
    }

    this.cursor = null
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/websocket/lib/Socket.js":
/*!****************************************************!*\
  !*** ./node_modules/@xmpp/websocket/lib/Socket.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

const WS = __webpack_require__(/*! ws */ 0)
const WebSocket = global.WebSocket || WS
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js")

const CODE = 'ECONNERROR'

class Socket extends EventEmitter {
  constructor() {
    super()
    this.listeners = Object.create(null)
  }

  connect(url) {
    this.url = url
    this._attachSocket(new WebSocket(url, ['xmpp']))
  }

  _attachSocket(socket) {
    const sock = (this.socket = socket)
    const {listeners} = this
    listeners.open = () => {
      this.emit('connect')
    }

    listeners.message = ({data}) => this.emit('data', data)
    listeners.error = event => {
      // WS
      let {error} = event
      // DOM
      if (!error) {
        error = new Error(`WebSocket ${CODE} ${this.url}`)
        error.errno = CODE
        error.code = CODE
      }

      error.event = event
      error.url = this.url
      this.emit('error', error)
    }

    listeners.close = event => {
      this._detachSocket()
      this.emit('close', !event.wasClean, event)
    }

    sock.addEventListener('open', listeners.open)
    sock.addEventListener('message', listeners.message)
    sock.addEventListener('error', listeners.error)
    sock.addEventListener('close', listeners.close)
  }

  _detachSocket() {
    delete this.url
    const {socket, listeners} = this
    Object.getOwnPropertyNames(listeners).forEach(k => {
      socket.removeEventListener(k, listeners[k])
      delete listeners[k]
    })
    delete this.socket
  }

  end() {
    this.socket.close()
  }

  write(data, fn) {
    if (WebSocket === WS) {
      this.socket.send(data, fn)
    } else {
      this.socket.send(data)
      fn()
    }
  }
}

module.exports = Socket

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@xmpp/xml/index.js":
/*!*****************************************!*\
  !*** ./node_modules/@xmpp/xml/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const x = __webpack_require__(/*! ./lib/x */ "./node_modules/@xmpp/xml/lib/x.js")
const Element = __webpack_require__(/*! ./lib/Element */ "./node_modules/@xmpp/xml/lib/Element.js")
const Parser = __webpack_require__(/*! ./lib/Parser */ "./node_modules/@xmpp/xml/lib/Parser.js")
const {
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
} = __webpack_require__(/*! ltx/lib/escape */ "./node_modules/ltx/lib/escape.js")
const XMLError = __webpack_require__(/*! ./lib/XMLError */ "./node_modules/@xmpp/xml/lib/XMLError.js")

function xml(...args) {
  return x(...args)
}

exports = module.exports = xml

Object.assign(exports, {
  x,
  Element,
  Parser,
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
  XMLError,
})


/***/ }),

/***/ "./node_modules/@xmpp/xml/lib/Element.js":
/*!***********************************************!*\
  !*** ./node_modules/@xmpp/xml/lib/Element.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Element = __webpack_require__(/*! ltx/lib/Element */ "./node_modules/ltx/lib/Element.js")

class Element extends _Element {
  setAttrs(attrs) {
    if (typeof attrs === 'string') {
      this.attrs.xmlns = attrs
    } else if (attrs) {
      Object.keys(attrs).forEach(function(key) {
        // https://github.com/facebook/react/pull/4596
        // https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source
        if (key === '__source' || key === '__self') return
        const val = attrs[key]
        if (val !== undefined && val !== null)
          this.attrs[key.toString()] = val.toString()
      }, this)
    }
  }

  append(nodes) {
    nodes = Array.isArray(nodes) ? nodes : [nodes]
    nodes.forEach(node => {
      this.children.push(node)
      if (typeof node === 'object') {
        node.parent = this
      }
    })
    return this
  }

  prepend(nodes) {
    nodes = Array.isArray(nodes) ? nodes : [nodes]
    nodes.forEach(node => {
      this.children.unshift(node)
      if (typeof node === 'object') {
        node.parent = this
      }
    })
    return this
  }
}

module.exports = Element


/***/ }),

/***/ "./node_modules/@xmpp/xml/lib/Parser.js":
/*!**********************************************!*\
  !*** ./node_modules/@xmpp/xml/lib/Parser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const LtxParser = __webpack_require__(/*! ltx/lib/parsers/ltx */ "./node_modules/ltx/lib/parsers/ltx.js")
const Element = __webpack_require__(/*! ./Element */ "./node_modules/@xmpp/xml/lib/Element.js")
const EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js")
const XMLError = __webpack_require__(/*! ./XMLError */ "./node_modules/@xmpp/xml/lib/XMLError.js")

class Parser extends EventEmitter {
  constructor() {
    super()
    const parser = new LtxParser()
    this.root = null
    this.cursor = null

    parser.on('startElement', this.onStartElement.bind(this))
    parser.on('endElement', this.onEndElement.bind(this))
    parser.on('text', this.onText.bind(this))

    this.parser = parser
  }

  onStartElement(name, attrs) {
    const element = new Element(name, attrs)

    const {root, cursor} = this

    if (!root) {
      this.root = element
      this.emit('start', element)
    } else if (cursor !== root) {
      cursor.append(element)
    }

    this.cursor = element
  }

  onEndElement(name) {
    const {root, cursor} = this
    if (name !== cursor.name) {
      // <foo></bar>
      this.emit('error', new XMLError(`${cursor.name} must be closed.`))
      return
    }

    if (cursor === root) {
      this.emit('end', root)
      return
    }

    if (!cursor.parent) {
      cursor.parent = root
      this.emit('element', cursor)
      this.cursor = root
      return
    }

    this.cursor = cursor.parent
  }

  onText(str) {
    const {cursor} = this
    if (!cursor) {
      this.emit('error', new XMLError(`${str} must be a child.`))
      return
    }

    cursor.t(str)
  }

  write(data) {
    this.parser.write(data)
  }

  end(data) {
    if (data) {
      this.parser.write(data)
    }
  }
}

Parser.XMLError = XMLError

module.exports = Parser


/***/ }),

/***/ "./node_modules/@xmpp/xml/lib/XMLError.js":
/*!************************************************!*\
  !*** ./node_modules/@xmpp/xml/lib/XMLError.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = class XMLError extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'XMLError'
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/xml/lib/parse.js":
/*!*********************************************!*\
  !*** ./node_modules/@xmpp/xml/lib/parse.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Parser = __webpack_require__(/*! ./Parser */ "./node_modules/@xmpp/xml/lib/Parser.js")

module.exports = function parse(data) {
  const p = new Parser()

  let result = null
  let error = null

  p.on('start', el => {
    result = el
  })
  p.on('element', el => {
    result.append(el)
  })
  p.on('error', err => {
    error = err
  })

  p.write(data)
  p.end()

  if (error) {
    throw error
  } else {
    return result
  }
}


/***/ }),

/***/ "./node_modules/@xmpp/xml/lib/x.js":
/*!*****************************************!*\
  !*** ./node_modules/@xmpp/xml/lib/x.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Element = __webpack_require__(/*! ./Element */ "./node_modules/@xmpp/xml/lib/Element.js")

function append(el, child) {
  if (child === false || child === null || child === undefined) return
  if (child instanceof Element) {
    el.append(child)
  } else if (Array.isArray(child)) {
    child.forEach(c => append(el, c))
  } else {
    el.append(String(child))
  }
}

function x(name, attrs, ...children) {
  const el = new Element(name, attrs)
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < children.length; i++) {
    append(el, children[i])
  }

  return el
}

module.exports = x


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/crypto-js/core.js":
/*!****************************************!*\
  !*** ./node_modules/crypto-js/core.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory();
	}
	else {}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));

/***/ }),

/***/ "./node_modules/crypto-js/hmac-sha1.js":
/*!*********************************************!*\
  !*** ./node_modules/crypto-js/hmac-sha1.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"), __webpack_require__(/*! ./sha1 */ "./node_modules/crypto-js/sha1.js"), __webpack_require__(/*! ./hmac */ "./node_modules/crypto-js/hmac.js"));
	}
	else {}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA1;

}));

/***/ }),

/***/ "./node_modules/crypto-js/hmac-sha256.js":
/*!***********************************************!*\
  !*** ./node_modules/crypto-js/hmac-sha256.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory, undef) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"), __webpack_require__(/*! ./sha256 */ "./node_modules/crypto-js/sha256.js"), __webpack_require__(/*! ./hmac */ "./node_modules/crypto-js/hmac.js"));
	}
	else {}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA256;

}));

/***/ }),

/***/ "./node_modules/crypto-js/hmac.js":
/*!****************************************!*\
  !*** ./node_modules/crypto-js/hmac.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));

/***/ }),

/***/ "./node_modules/crypto-js/sha1.js":
/*!****************************************!*\
  !*** ./node_modules/crypto-js/sha1.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"));
	}
	else {}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	return CryptoJS.SHA1;

}));

/***/ }),

/***/ "./node_modules/crypto-js/sha256.js":
/*!******************************************!*\
  !*** ./node_modules/crypto-js/sha256.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"));
	}
	else {}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),

/***/ "./node_modules/fbemitter/index.js":
/*!*****************************************!*\
  !*** ./node_modules/fbemitter/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var fbemitter = {
  EventEmitter: __webpack_require__(/*! ./lib/BaseEventEmitter */ "./node_modules/fbemitter/lib/BaseEventEmitter.js"),
  EmitterSubscription : __webpack_require__(/*! ./lib/EmitterSubscription */ "./node_modules/fbemitter/lib/EmitterSubscription.js")
};

module.exports = fbemitter;


/***/ }),

/***/ "./node_modules/fbemitter/lib/BaseEventEmitter.js":
/*!********************************************************!*\
  !*** ./node_modules/fbemitter/lib/BaseEventEmitter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BaseEventEmitter
 * @typechecks
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EmitterSubscription = __webpack_require__(/*! ./EmitterSubscription */ "./node_modules/fbemitter/lib/EmitterSubscription.js");
var EventSubscriptionVendor = __webpack_require__(/*! ./EventSubscriptionVendor */ "./node_modules/fbemitter/lib/EventSubscriptionVendor.js");

var emptyFunction = __webpack_require__(/*! fbjs/lib/emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");
var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

/**
 * @class BaseEventEmitter
 * @description
 * An EventEmitter is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. In addition to the
 * data for the given event it also sends a event control object which allows
 * the listeners/handlers to prevent the default behavior of the given event.
 *
 * The emitter is designed to be generic enough to support all the different
 * contexts in which one might want to emit events. It is a simple multicast
 * mechanism on top of which extra functionality can be composed. For example, a
 * more advanced emitter may use an EventHolder and EventFactory.
 */

var BaseEventEmitter = (function () {
  /**
   * @constructor
   */

  function BaseEventEmitter() {
    _classCallCheck(this, BaseEventEmitter);

    this._subscriber = new EventSubscriptionVendor();
    this._currentSubscription = null;
  }

  /**
   * Adds a listener to be invoked when events of the specified type are
   * emitted. An optional calling context may be provided. The data arguments
   * emitted will be passed to the listener function.
   *
   * TODO: Annotate the listener arg's type. This is tricky because listeners
   *       can be invoked with varargs.
   *
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */

  BaseEventEmitter.prototype.addListener = function addListener(eventType, listener, context) {
    return this._subscriber.addSubscription(eventType, new EmitterSubscription(this._subscriber, listener, context));
  };

  /**
   * Similar to addListener, except that the listener is removed after it is
   * invoked once.
   *
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke only once when the
   *   specified event is emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */

  BaseEventEmitter.prototype.once = function once(eventType, listener, context) {
    var emitter = this;
    return this.addListener(eventType, function () {
      emitter.removeCurrentListener();
      listener.apply(context, arguments);
    });
  };

  /**
   * Removes all of the registered listeners, including those registered as
   * listener maps.
   *
   * @param {?string} eventType - Optional name of the event whose registered
   *   listeners to remove
   */

  BaseEventEmitter.prototype.removeAllListeners = function removeAllListeners(eventType) {
    this._subscriber.removeAllSubscriptions(eventType);
  };

  /**
   * Provides an API that can be called during an eventing cycle to remove the
   * last listener that was invoked. This allows a developer to provide an event
   * object that can remove the listener (or listener map) during the
   * invocation.
   *
   * If it is called when not inside of an emitting cycle it will throw.
   *
   * @throws {Error} When called not during an eventing cycle
   *
   * @example
   *   var subscription = emitter.addListenerMap({
   *     someEvent: function(data, event) {
   *       console.log(data);
   *       emitter.removeCurrentListener();
   *     }
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   *   emitter.emit('someEvent', 'def'); // does not log anything
   */

  BaseEventEmitter.prototype.removeCurrentListener = function removeCurrentListener() {
    !!!this._currentSubscription ?  true ? invariant(false, 'Not in an emitting cycle; there is no current subscription') : undefined : undefined;
    this._subscriber.removeSubscription(this._currentSubscription);
  };

  /**
   * Returns an array of listeners that are currently registered for the given
   * event.
   *
   * @param {string} eventType - Name of the event to query
   * @return {array}
   */

  BaseEventEmitter.prototype.listeners = function listeners(eventType) /* TODO: Array<EventSubscription> */{
    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
    return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function (subscription) {
      return subscription.listener;
    }) : [];
  };

  /**
   * Emits an event of the given type with the given data. All handlers of that
   * particular type will be notified.
   *
   * @param {string} eventType - Name of the event to emit
   * @param {*} Arbitrary arguments to be passed to each registered listener
   *
   * @example
   *   emitter.addListener('someEvent', function(message) {
   *     console.log(message);
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   */

  BaseEventEmitter.prototype.emit = function emit(eventType) {
    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
    if (subscriptions) {
      var keys = Object.keys(subscriptions);
      for (var ii = 0; ii < keys.length; ii++) {
        var key = keys[ii];
        var subscription = subscriptions[key];
        // The subscription may have been removed during this event loop.
        if (subscription) {
          this._currentSubscription = subscription;
          this.__emitToSubscription.apply(this, [subscription].concat(Array.prototype.slice.call(arguments)));
        }
      }
      this._currentSubscription = null;
    }
  };

  /**
   * Provides a hook to override how the emitter emits an event to a specific
   * subscription. This allows you to set up logging and error boundaries
   * specific to your environment.
   *
   * @param {EmitterSubscription} subscription
   * @param {string} eventType
   * @param {*} Arbitrary arguments to be passed to each registered listener
   */

  BaseEventEmitter.prototype.__emitToSubscription = function __emitToSubscription(subscription, eventType) {
    var args = Array.prototype.slice.call(arguments, 2);
    subscription.listener.apply(subscription.context, args);
  };

  return BaseEventEmitter;
})();

module.exports = BaseEventEmitter;

/***/ }),

/***/ "./node_modules/fbemitter/lib/EmitterSubscription.js":
/*!***********************************************************!*\
  !*** ./node_modules/fbemitter/lib/EmitterSubscription.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * @providesModule EmitterSubscription
 * @typechecks
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventSubscription = __webpack_require__(/*! ./EventSubscription */ "./node_modules/fbemitter/lib/EventSubscription.js");

/**
 * EmitterSubscription represents a subscription with listener and context data.
 */

var EmitterSubscription = (function (_EventSubscription) {
  _inherits(EmitterSubscription, _EventSubscription);

  /**
   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
   *   this subscription
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */

  function EmitterSubscription(subscriber, listener, context) {
    _classCallCheck(this, EmitterSubscription);

    _EventSubscription.call(this, subscriber);
    this.listener = listener;
    this.context = context;
  }

  return EmitterSubscription;
})(EventSubscription);

module.exports = EmitterSubscription;

/***/ }),

/***/ "./node_modules/fbemitter/lib/EventSubscription.js":
/*!*********************************************************!*\
  !*** ./node_modules/fbemitter/lib/EventSubscription.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventSubscription
 * @typechecks
 */



/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EventSubscription = (function () {

  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */

  function EventSubscription(subscriber) {
    _classCallCheck(this, EventSubscription);

    this.subscriber = subscriber;
  }

  /**
   * Removes this subscription from the subscriber that controls it.
   */

  EventSubscription.prototype.remove = function remove() {
    if (this.subscriber) {
      this.subscriber.removeSubscription(this);
      this.subscriber = null;
    }
  };

  return EventSubscription;
})();

module.exports = EventSubscription;

/***/ }),

/***/ "./node_modules/fbemitter/lib/EventSubscriptionVendor.js":
/*!***************************************************************!*\
  !*** ./node_modules/fbemitter/lib/EventSubscriptionVendor.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * @providesModule EventSubscriptionVendor
 * @typechecks
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */

var EventSubscriptionVendor = (function () {
  function EventSubscriptionVendor() {
    _classCallCheck(this, EventSubscriptionVendor);

    this._subscriptionsForType = {};
    this._currentSubscription = null;
  }

  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */

  EventSubscriptionVendor.prototype.addSubscription = function addSubscription(eventType, subscription) {
    !(subscription.subscriber === this) ?  true ? invariant(false, 'The subscriber of the subscription is incorrectly set.') : undefined : undefined;
    if (!this._subscriptionsForType[eventType]) {
      this._subscriptionsForType[eventType] = [];
    }
    var key = this._subscriptionsForType[eventType].length;
    this._subscriptionsForType[eventType].push(subscription);
    subscription.eventType = eventType;
    subscription.key = key;
    return subscription;
  };

  /**
   * Removes a bulk set of the subscriptions.
   *
   * @param {?string} eventType - Optional name of the event type whose
   *   registered supscriptions to remove, if null remove all subscriptions.
   */

  EventSubscriptionVendor.prototype.removeAllSubscriptions = function removeAllSubscriptions(eventType) {
    if (eventType === undefined) {
      this._subscriptionsForType = {};
    } else {
      delete this._subscriptionsForType[eventType];
    }
  };

  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   *
   * @param {object} subscription
   */

  EventSubscriptionVendor.prototype.removeSubscription = function removeSubscription(subscription) {
    var eventType = subscription.eventType;
    var key = subscription.key;

    var subscriptionsForType = this._subscriptionsForType[eventType];
    if (subscriptionsForType) {
      delete subscriptionsForType[key];
    }
  };

  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   *
   * TODO: This returns a nullable array. wat?
   *
   * @param {string} eventType
   * @return {?array}
   */

  EventSubscriptionVendor.prototype.getSubscriptionsForType = function getSubscriptionsForType(eventType) {
    return this._subscriptionsForType[eventType];
  };

  return EventSubscriptionVendor;
})();

module.exports = EventSubscriptionVendor;

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyFunction.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/emptyFunction.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "./node_modules/fbjs/lib/invariant.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/invariant.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/koa-compose/index.js":
/*!*******************************************!*\
  !*** ./node_modules/koa-compose/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}


/***/ }),

/***/ "./node_modules/ltx/lib/Element.js":
/*!*****************************************!*\
  !*** ./node_modules/ltx/lib/Element.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var escape = __webpack_require__(/*! ./escape */ "./node_modules/ltx/lib/escape.js")
var escapeXML = escape.escapeXML
var escapeXMLText = escape.escapeXMLText

var equality = __webpack_require__(/*! ./equal */ "./node_modules/ltx/lib/equal.js")
var equal = equality.equal
var nameEqual = equality.name
var attrsEqual = equality.attrs
var childrenEqual = equality.children

var clone = __webpack_require__(/*! ./clone */ "./node_modules/ltx/lib/clone.js")

/**
 * Element
 *
 * Attributes are in the element.attrs object. Children is a list of
 * either other Elements or Strings for text content.
 **/
function Element (name, attrs) {
  this.name = name
  this.parent = null
  this.children = []
  this.attrs = {}
  this.setAttrs(attrs)
}

/* Accessors */

/**
 * if (element.is('message', 'jabber:client')) ...
 **/
Element.prototype.is = function (name, xmlns) {
  return (this.getName() === name) &&
  (!xmlns || (this.getNS() === xmlns))
}

/* without prefix */
Element.prototype.getName = function () {
  if (this.name.indexOf(':') >= 0) {
    return this.name.substr(this.name.indexOf(':') + 1)
  } else {
    return this.name
  }
}

/**
 * retrieves the namespace of the current element, upwards recursively
 **/
Element.prototype.getNS = function () {
  if (this.name.indexOf(':') >= 0) {
    var prefix = this.name.substr(0, this.name.indexOf(':'))
    return this.findNS(prefix)
  }
  return this.findNS()
}

/**
 * find the namespace to the given prefix, upwards recursively
 **/
Element.prototype.findNS = function (prefix) {
  if (!prefix) {
    /* default namespace */
    if (this.attrs.xmlns) {
      return this.attrs.xmlns
    } else if (this.parent) {
      return this.parent.findNS()
    }
  } else {
    /* prefixed namespace */
    var attr = 'xmlns:' + prefix
    if (this.attrs[attr]) {
      return this.attrs[attr]
    } else if (this.parent) {
      return this.parent.findNS(prefix)
    }
  }
}

/**
 * Recursiverly gets all xmlns defined, in the form of {url:prefix}
 **/
Element.prototype.getXmlns = function () {
  var namespaces = {}

  if (this.parent) {
    namespaces = this.parent.getXmlns()
  }

  for (var attr in this.attrs) {
    var m = attr.match('xmlns:?(.*)')
    // eslint-disable-next-line  no-prototype-builtins
    if (this.attrs.hasOwnProperty(attr) && m) {
      namespaces[this.attrs[attr]] = m[1]
    }
  }
  return namespaces
}

Element.prototype.setAttrs = function (attrs) {
  if (typeof attrs === 'string') {
    this.attrs.xmlns = attrs
  } else if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      this.attrs[key] = attrs[key]
    }, this)
  }
}

/**
 * xmlns can be null, returns the matching attribute.
 **/
Element.prototype.getAttr = function (name, xmlns) {
  if (!xmlns) {
    return this.attrs[name]
  }

  var namespaces = this.getXmlns()

  if (!namespaces[xmlns]) {
    return null
  }

  return this.attrs[[namespaces[xmlns], name].join(':')]
}

/**
 * xmlns can be null
 **/
Element.prototype.getChild = function (name, xmlns) {
  return this.getChildren(name, xmlns)[0]
}

/**
 * xmlns can be null
 **/
Element.prototype.getChildren = function (name, xmlns) {
  var result = []
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i]
    if (child.getName &&
      (child.getName() === name) &&
      (!xmlns || (child.getNS() === xmlns))) {
      result.push(child)
    }
  }
  return result
}

/**
 * xmlns and recursive can be null
 **/
Element.prototype.getChildByAttr = function (attr, val, xmlns, recursive) {
  return this.getChildrenByAttr(attr, val, xmlns, recursive)[0]
}

/**
 * xmlns and recursive can be null
 **/
Element.prototype.getChildrenByAttr = function (attr, val, xmlns, recursive) {
  var result = []
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i]
    if (child.attrs &&
      (child.attrs[attr] === val) &&
      (!xmlns || (child.getNS() === xmlns))) {
      result.push(child)
    }
    if (recursive && child.getChildrenByAttr) {
      result.push(child.getChildrenByAttr(attr, val, xmlns, true))
    }
  }
  if (recursive) {
    result = [].concat.apply([], result)
  }
  return result
}

Element.prototype.getChildrenByFilter = function (filter, recursive) {
  var result = []
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i]
    if (filter(child)) {
      result.push(child)
    }
    if (recursive && child.getChildrenByFilter) {
      result.push(child.getChildrenByFilter(filter, true))
    }
  }
  if (recursive) {
    result = [].concat.apply([], result)
  }
  return result
}

Element.prototype.getText = function () {
  var text = ''
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i]
    if ((typeof child === 'string') || (typeof child === 'number')) {
      text += child
    }
  }
  return text
}

Element.prototype.getChildText = function (name, xmlns) {
  var child = this.getChild(name, xmlns)
  return child ? child.getText() : null
}

/**
 * Return all direct descendents that are Elements.
 * This differs from `getChildren` in that it will exclude text nodes,
 * processing instructions, etc.
 */
Element.prototype.getChildElements = function () {
  return this.getChildrenByFilter(function (child) {
    return child instanceof Element
  })
}

/* Builder */

/** returns uppermost parent */
Element.prototype.root = function () {
  if (this.parent) {
    return this.parent.root()
  }
  return this
}
Element.prototype.tree = Element.prototype.root

/** just parent or itself */
Element.prototype.up = function () {
  if (this.parent) {
    return this.parent
  }
  return this
}

/** create child node and return it */
Element.prototype.c = function (name, attrs) {
  return this.cnode(new Element(name, attrs))
}

Element.prototype.cnode = function (child) {
  this.children.push(child)
  if (typeof child === 'object') {
    child.parent = this
  }
  return child
}

/** add text node and return element */
Element.prototype.t = function (text) {
  this.children.push(text)
  return this
}

/* Manipulation */

/**
 * Either:
 *   el.remove(childEl)
 *   el.remove('author', 'urn:...')
 */
Element.prototype.remove = function (el, xmlns) {
  var filter
  if (typeof el === 'string') {
    /* 1st parameter is tag name */
    filter = function (child) {
      return !(child.is &&
      child.is(el, xmlns))
    }
  } else {
    /* 1st parameter is element */
    filter = function (child) {
      return child !== el
    }
  }

  this.children = this.children.filter(filter)

  return this
}

Element.prototype.clone = function () {
  return clone(this)
}

Element.prototype.text = function (val) {
  if (val && this.children.length === 1) {
    this.children[0] = val
    return this
  }
  return this.getText()
}

Element.prototype.attr = function (attr, val) {
  if (typeof val !== 'undefined' || val === null) {
    if (!this.attrs) {
      this.attrs = {}
    }
    this.attrs[attr] = val
    return this
  }
  return this.attrs[attr]
}

/* Serialization */

Element.prototype.toString = function () {
  var s = ''
  this.write(function (c) {
    s += c
  })
  return s
}

Element.prototype.toJSON = function () {
  return {
    name: this.name,
    attrs: this.attrs,
    children: this.children.map(function (child) {
      return child && child.toJSON ? child.toJSON() : child
    })
  }
}

Element.prototype._addChildren = function (writer) {
  writer('>')
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i]
    /* Skip null/undefined */
    if (child || (child === 0)) {
      if (child.write) {
        child.write(writer)
      } else if (typeof child === 'string') {
        writer(escapeXMLText(child))
      } else if (child.toString) {
        writer(escapeXMLText(child.toString(10)))
      }
    }
  }
  writer('</')
  writer(this.name)
  writer('>')
}

Element.prototype.write = function (writer) {
  writer('<')
  writer(this.name)
  for (var k in this.attrs) {
    var v = this.attrs[k]
    if (v != null) { // === null || undefined
      writer(' ')
      writer(k)
      writer('="')
      if (typeof v !== 'string') {
        v = v.toString()
      }
      writer(escapeXML(v))
      writer('"')
    }
  }
  if (this.children.length === 0) {
    writer('/>')
  } else {
    this._addChildren(writer)
  }
}

Element.prototype.nameEquals = function (el) {
  return nameEqual(this, el)
}

Element.prototype.attrsEquals = function (el) {
  return attrsEqual(this, el)
}

Element.prototype.childrenEquals = function (el) {
  return childrenEqual(this, el)
}

Element.prototype.equals = function (el) {
  return equal(this, el)
}

module.exports = Element


/***/ }),

/***/ "./node_modules/ltx/lib/clone.js":
/*!***************************************!*\
  !*** ./node_modules/ltx/lib/clone.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function clone (el) {
  var clone = new el.constructor(el.name, el.attrs)
  for (var i = 0; i < el.children.length; i++) {
    var child = el.children[i]
    clone.cnode(child.clone ? child.clone() : child)
  }
  return clone
}


/***/ }),

/***/ "./node_modules/ltx/lib/equal.js":
/*!***************************************!*\
  !*** ./node_modules/ltx/lib/equal.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function nameEqual (a, b) {
  return a.name === b.name
}

function attrsEqual (a, b) {
  var attrs = a.attrs
  var keys = Object.keys(attrs)
  var length = keys.length
  if (length !== Object.keys(b.attrs).length) return false
  for (var i = 0, l = length; i < l; i++) {
    var key = keys[i]
    var value = attrs[key]
    if (value == null || b.attrs[key] == null) { // === null || undefined
      if (value !== b.attrs[key]) return false
    } else if (value.toString() !== b.attrs[key].toString()) {
      return false
    }
  }
  return true
}

function childrenEqual (a, b) {
  var children = a.children
  var length = children.length
  if (length !== b.children.length) return false
  for (var i = 0, l = length; i < l; i++) {
    var child = children[i]
    if (typeof child === 'string') {
      if (child !== b.children[i]) return false
    } else {
      if (!child.equals(b.children[i])) return false
    }
  }
  return true
}

function equal (a, b) {
  if (!nameEqual(a, b)) return false
  if (!attrsEqual(a, b)) return false
  if (!childrenEqual(a, b)) return false
  return true
}

module.exports.name = nameEqual
module.exports.attrs = attrsEqual
module.exports.children = childrenEqual
module.exports.equal = equal


/***/ }),

/***/ "./node_modules/ltx/lib/escape.js":
/*!****************************************!*\
  !*** ./node_modules/ltx/lib/escape.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var escapeXMLTable = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;'
}

function escapeXMLReplace (match) {
  return escapeXMLTable[match]
}

var unescapeXMLTable = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'"
}

function unescapeXMLReplace (match) {
  if (match[1] === '#') {
    var num
    if (match[2] === 'x') {
      num = parseInt(match.slice(3), 16)
    } else {
      num = parseInt(match.slice(2), 10)
    }
    // https://www.w3.org/TR/xml/#NT-Char defines legal XML characters:
    // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
    if (num === 0x9 || num === 0xA || num === 0xD ||
        (num >= 0x20 && num <= 0xD7FF) ||
        (num >= 0xE000 && num <= 0xFFFD) ||
        (num >= 0x10000 && num <= 0x10FFFF)) {
      return String.fromCodePoint(num)
    }
    throw new Error('Illegal XML character 0x' + num.toString(16))
  }
  if (unescapeXMLTable[match]) {
    return unescapeXMLTable[match] || match
  }
  throw new Error('Illegal XML entity ' + match)
}

exports.escapeXML = function escapeXML (s) {
  return s.replace(/&|<|>|"|'/g, escapeXMLReplace)
}

exports.unescapeXML = function unescapeXML (s) {
  var result = ''
  var start = -1
  var end = -1
  var previous = 0
  while ((start = s.indexOf('&', previous)) !== -1 && (end = s.indexOf(';', start + 1)) !== -1) {
    result = result +
      s.substring(previous, start) +
      unescapeXMLReplace(s.substring(start, end + 1))
    previous = end + 1
  }

  // shortcut if loop never entered:
  // return the original string without creating new objects
  if (previous === 0) return s

  // push the remaining characters
  result = result + s.substring(previous)

  return result
}

exports.escapeXMLText = function escapeXMLText (s) {
  return s.replace(/&|<|>/g, escapeXMLReplace)
}

exports.unescapeXMLText = function unescapeXMLText (s) {
  return s.replace(/&(amp|#38|lt|#60|gt|#62);/g, unescapeXMLReplace)
}


/***/ }),

/***/ "./node_modules/ltx/lib/parsers/ltx.js":
/*!*********************************************!*\
  !*** ./node_modules/ltx/lib/parsers/ltx.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js")
var EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter
var unescapeXML = __webpack_require__(/*! ../escape */ "./node_modules/ltx/lib/escape.js").unescapeXML

var STATE_TEXT = 0
var STATE_IGNORE_COMMENT = 1
var STATE_IGNORE_INSTRUCTION = 2
var STATE_TAG_NAME = 3
var STATE_TAG = 4
var STATE_ATTR_NAME = 5
var STATE_ATTR_EQ = 6
var STATE_ATTR_QUOT = 7
var STATE_ATTR_VALUE = 8
var STATE_CDATA = 9
var STATE_IGNORE_CDATA = 10

var SaxLtx = module.exports = function SaxLtx () {
  EventEmitter.call(this)

  var state = STATE_TEXT
  var remainder
  var tagName
  var attrs
  var endTag
  var selfClosing
  var attrQuote
  var attrQuoteChar
  var recordStart = 0
  var attrName

  this._handleTagOpening = function (endTag, tagName, attrs) {
    if (!endTag) {
      this.emit('startElement', tagName, attrs)
      if (selfClosing) {
        this.emit('endElement', tagName)
      }
    } else {
      this.emit('endElement', tagName)
    }
  }

  this.write = function (data) {
    if (typeof data !== 'string') {
      data = data.toString()
    }
    var pos = 0

    /* Anything from previous write()? */
    if (remainder) {
      data = remainder + data
      pos += remainder.length
      remainder = null
    }

    function endRecording () {
      if (typeof recordStart === 'number') {
        var recorded = data.substring(recordStart, pos)
        recordStart = undefined
        return recorded
      }
    }

    for (; pos < data.length; pos++) {
      if (state === STATE_TEXT) {
        // if we're looping through text, fast-forward using indexOf to
        // the next '<' character
        var lt = data.indexOf('<', pos)
        if (lt !== -1 && pos !== lt) {
          pos = lt
        }
      } else if (state === STATE_ATTR_VALUE) {
        // if we're looping through an attribute, fast-forward using
        // indexOf to the next end quote character
        var quot = data.indexOf(attrQuoteChar, pos)
        if (quot !== -1) {
          pos = quot
        }
      } else if (state === STATE_IGNORE_COMMENT) {
        // if we're looping through a comment, fast-forward using
        // indexOf to the first end-comment character
        var endcomment = data.indexOf('-->', pos)
        if (endcomment !== -1) {
          pos = endcomment + 2 // target the '>' character
        }
      } else if (state === STATE_IGNORE_CDATA) {
        // if we're looping through a CDATA, fast-forward using
        // indexOf to the first end-CDATA character ]]>
        var endCDATA = data.indexOf(']]>', pos)
        if (endCDATA !== -1) {
          pos = endCDATA + 2 // target the '>' character
        }
      }

      var c = data.charCodeAt(pos)
      switch (state) {
        case STATE_TEXT:
          if (c === 60 /* < */) {
            var text = endRecording()
            if (text) {
              this.emit('text', unescapeXML(text))
            }
            state = STATE_TAG_NAME
            recordStart = pos + 1
            attrs = {}
          }
          break
        case STATE_CDATA:
          if (c === 93 /* ] */ && data.substr(pos + 1, 2) === ']>') {
            var cData = endRecording()
            if (cData) {
              this.emit('text', cData)
            }
            state = STATE_TEXT
          }
          break
        case STATE_TAG_NAME:
          if (c === 47 /* / */ && recordStart === pos) {
            recordStart = pos + 1
            endTag = true
          } else if (c === 33 /* ! */) {
            if (data.substr(pos + 1, 7) === '[CDATA[') {
              recordStart = pos + 8
              state = STATE_CDATA
            } else {
              recordStart = undefined
              state = STATE_IGNORE_COMMENT
            }
          } else if (c === 63 /* ? */) {
            recordStart = undefined
            state = STATE_IGNORE_INSTRUCTION
          } else if (c <= 32 || c === 47 /* / */ || c === 62 /* > */) {
            tagName = endRecording()
            pos--
            state = STATE_TAG
          }
          break
        case STATE_IGNORE_COMMENT:
          if (c === 62 /* > */) {
            var prevFirst = data.charCodeAt(pos - 1)
            var prevSecond = data.charCodeAt(pos - 2)
            if ((prevFirst === 45 /* - */ && prevSecond === 45 /* - */) ||
                (prevFirst === 93 /* ] */ && prevSecond === 93 /* ] */)) {
              state = STATE_TEXT
            }
          }
          break
        case STATE_IGNORE_INSTRUCTION:
          if (c === 62 /* > */) {
            var prev = data.charCodeAt(pos - 1)
            if (prev === 63 /* ? */) {
              state = STATE_TEXT
            }
          }
          break
        case STATE_TAG:
          if (c === 62 /* > */) {
            this._handleTagOpening(endTag, tagName, attrs)
            tagName = undefined
            attrs = undefined
            endTag = undefined
            selfClosing = undefined
            state = STATE_TEXT
            recordStart = pos + 1
          } else if (c === 47 /* / */) {
            selfClosing = true
          } else if (c > 32) {
            recordStart = pos
            state = STATE_ATTR_NAME
          }
          break
        case STATE_ATTR_NAME:
          if (c <= 32 || c === 61 /* = */) {
            attrName = endRecording()
            pos--
            state = STATE_ATTR_EQ
          }
          break
        case STATE_ATTR_EQ:
          if (c === 61 /* = */) {
            state = STATE_ATTR_QUOT
          }
          break
        case STATE_ATTR_QUOT:
          if (c === 34 /* " */ || c === 39 /* ' */) {
            attrQuote = c
            attrQuoteChar = c === 34 ? '"' : "'"
            state = STATE_ATTR_VALUE
            recordStart = pos + 1
          }
          break
        case STATE_ATTR_VALUE:
          if (c === attrQuote) {
            var value = unescapeXML(endRecording())
            attrs[attrName] = value
            attrName = undefined
            state = STATE_TAG
          }
          break
      }
    }

    if (typeof recordStart === 'number' &&
      recordStart <= data.length) {
      remainder = data.slice(recordStart)
      recordStart = 0
    }
  }
}
inherits(SaxLtx, EventEmitter)

SaxLtx.prototype.end = function (data) {
  if (data) {
    this.write(data)
  }

  /* Uh, yeah */
  this.write = function () {}
}


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/sasl-anonymous/lib/mechanism.js":
/*!******************************************************!*\
  !*** ./node_modules/sasl-anonymous/lib/mechanism.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(root, factory) {
  if (true) {
    // CommonJS
    factory(exports, module);
  } else {}
}(this, function(exports, module) {

  /**
   * ANONYMOUS `Mechanism` constructor.
   *
   * This class implements the ANONYMOUS SASL mechanism.
   *
   * The ANONYMOUS SASL mechanism provides support for permitting anonymous
   * access to various services
   *
   * References:
   *  - [RFC 4505](http://tools.ietf.org/html/rfc4505)
   *
   * @api public
   */
  function Mechanism() {
  }
  
  Mechanism.prototype.name = 'ANONYMOUS';
  Mechanism.prototype.clientFirst = true;
  
  /**
   * Encode a response using optional trace information.
   *
   * Options:
   *  - `trace`  trace information (optional)
   *
   * @param {Object} cred
   * @api public
   */
  Mechanism.prototype.response = function(cred) {
    return cred.trace || '';
  };
  
  /**
   * Decode a challenge issued by the server.
   *
   * @param {String} chal
   * @api public
   */
  Mechanism.prototype.challenge = function(chal) {
  };

  exports = module.exports = Mechanism;
  
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/sasl-anonymous/main.js":
/*!*********************************************!*\
  !*** ./node_modules/sasl-anonymous/main.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(root, factory) {
  if (true) {
    // CommonJS
    factory(exports,
            module,
            __webpack_require__(/*! ./lib/mechanism */ "./node_modules/sasl-anonymous/lib/mechanism.js"));
  } else {}
}(this, function(exports, module, Mechanism) {

  exports = module.exports = Mechanism;
  exports.Mechanism = Mechanism;
  
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/sasl-plain/lib/mechanism.js":
/*!**************************************************!*\
  !*** ./node_modules/sasl-plain/lib/mechanism.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(root, factory) {
  if (true) {
    // CommonJS
    factory(exports, module);
  } else {}
}(this, function(exports, module) {

  /**
   * PLAIN `Mechanism` constructor.
   *
   * This class implements the PLAIN SASL mechanism.
   *
   * The PLAIN SASL mechanism provides support for exchanging a clear-text
   * username and password.  This mechanism should not be used without adequate
   * security provided by an underlying transport layer. 
   *
   * References:
   *  - [RFC 4616](http://tools.ietf.org/html/rfc4616)
   *
   * @api public
   */
  function Mechanism() {
  }
  
  Mechanism.prototype.name = 'PLAIN';
  Mechanism.prototype.clientFirst = true;
  
  /**
   * Encode a response using given credential.
   *
   * Options:
   *  - `username`
   *  - `password`
   *  - `authzid`   authorization identity (optional)
   *
   * @param {Object} cred
   * @api public
   */
  Mechanism.prototype.response = function(cred) {
    var str = '';
    str += cred.authzid || '';
    str += '\0';
    str += cred.username;
    str += '\0';
    str += cred.password;
    return str;
  };
  
  /**
   * Decode a challenge issued by the server.
   *
   * @param {String} chal
   * @return {Mechanism} for chaining
   * @api public
   */
  Mechanism.prototype.challenge = function(chal) {
    return this;
  };

  exports = module.exports = Mechanism;
  
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/sasl-plain/main.js":
/*!*****************************************!*\
  !*** ./node_modules/sasl-plain/main.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(root, factory) {
  if (true) {
    // CommonJS
    factory(exports,
            module,
            __webpack_require__(/*! ./lib/mechanism */ "./node_modules/sasl-plain/lib/mechanism.js"));
  } else {}
}(this, function(exports, module, Mechanism) {

  exports = module.exports = Mechanism;
  exports.Mechanism = Mechanism;
  
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/saslmechanisms/lib/factory.js":
/*!****************************************************!*\
  !*** ./node_modules/saslmechanisms/lib/factory.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(root, factory) {
  if (true) {
    // CommonJS
    factory(exports, module);
  } else {}
}(this, function(exports, module) {
  
  /**
   * `Factory` constructor.
   *
   * @api public
   */
  function Factory() {
    this._mechs = [];
  }
  
  /**
   * Utilize the given `mech` with optional `name`, overridding the mechanism's
   * default name.
   *
   * Examples:
   *
   *     factory.use(FooMechanism);
   *
   *     factory.use('XFOO', FooMechanism);
   *
   * @param {String|Mechanism} name
   * @param {Mechanism} mech
   * @return {Factory} for chaining
   * @api public
   */
  Factory.prototype.use = function(name, mech) {
    if (!mech) {
      mech = name;
      name = mech.prototype.name;
    }
    this._mechs.push({ name: name, mech: mech });
    return this;
  };
  
  /**
   * Create a new mechanism from supported list of `mechs`.
   *
   * If no mechanisms are supported, returns `null`.
   *
   * Examples:
   *
   *     var mech = factory.create(['FOO', 'BAR']);
   *
   * @param {Array} mechs
   * @return {Mechanism}
   * @api public
   */
  Factory.prototype.create = function(mechs) {
    for (var i = 0, len = this._mechs.length; i < len; i++) {
      for (var j = 0, jlen = mechs.length; j < jlen; j++) {
        var entry = this._mechs[i];
        if (entry.name == mechs[j]) {
          return new entry.mech();
        }
      }
    }
    return null;
  };

  exports = module.exports = Factory;
  
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/saslmechanisms/main.js":
/*!*********************************************!*\
  !*** ./node_modules/saslmechanisms/main.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(root, factory) {
  if (true) {
    // CommonJS
    factory(exports,
            module,
            __webpack_require__(/*! ./lib/factory */ "./node_modules/saslmechanisms/lib/factory.js"));
  } else {}
}(this, function(exports, module, Factory) {
  
  exports = module.exports = Factory;
  exports.Factory = Factory;
  
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, description, version, homepage, main, license, keywords, author, directories, files, repository, bugs, scripts, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"connectycube\",\"description\":\"ConnectyCube chat and video chat JavaScript SDK\",\"version\":\"3.4.0\",\"homepage\":\"https://developers.connectycube.com/reactnative\",\"main\":\"lib/cubeMain.js\",\"license\":\"Apache-2.0\",\"keywords\":[\"connectycube\",\"messaging\",\"videocalling\",\"javascript\",\"nativescript\",\"react-native\",\"nodejs\",\"sdk\",\"cloud\",\"api\",\"chat\",\"videochat\",\"communication\",\"webrtc\",\"storage\",\"users\",\"push notifications\",\"calling\"],\"author\":\"ConnectyCube team <support@connectycube.com>\",\"directories\":{\"lib\":\"lib\",\"test\":\"__tests__\"},\"files\":[\"lib\",\"dist/connectycube.min.js\",\"dist/connectycube.min.map\"],\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/ConnectyCube/connectycube-js-sdk-releases\"},\"bugs\":{\"url\":\"https://github.com/ConnectyCube/connectycube-js-sdk-releases/issues\"},\"scripts\":{\"build.release\":\"./node_modules/.bin/webpack --config webpack.config.js --env.production\",\"build.dev\":\"./node_modules/.bin/webpack --config webpack.config.js --env.development\",\"build.all\":\"npm run build.release && npm run build.dev\",\"docs\":\"rimraf docs && mkdir docs && jsdoc -c ./jsdoc.conf\",\"installDependencies\":\"npm install && npm install -g jasmine\",\"test\":\"jasmine --config=__tests__/support/jasmine.json\",\"watch\":\"./node_modules/.bin/webpack --watch --config webpack.config.js --env.development\"},\"dependencies\":{\"@xmpp/client\":\"0.9.2\",\"crypto-js\":\"3.1.9-1\",\"fbemitter\":\"^2.1.1\",\"form-data\":\"^2.3.2\",\"node-fetch\":\"^1.7.3\"},\"devDependencies\":{\"@babel/core\":\"^7.5.5\",\"@babel/plugin-proposal-class-properties\":\"7.8.3\",\"@babel/plugin-proposal-object-rest-spread\":\"^7.7.7\",\"@babel/plugin-transform-runtime\":\"7.9.0\",\"@babel/preset-env\":\"^7.5.5\",\"@babel/runtime\":\"7.9.2\",\"babel-loader\":\"^8.0.6\",\"clean-webpack-plugin\":\"^3.0.0\",\"ghooks\":\"^1.3.2\",\"jaguarjs-jsdoc\":\"^1.1.0\",\"jasmine\":\"3.5.0\",\"jasmine-core\":\"3.5.0\",\"jsdoc\":\"^3.6.3\",\"webpack\":\"^4.39.1\",\"webpack-cli\":\"^3.3.6\"}}");

/***/ }),

/***/ 0:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1:
/*!***************************!*\
  !*** ./lib/dns (ignored) ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "form-data":
/*!****************************!*\
  !*** external "form-data" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_form_data__;

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_node_fetch__;

/***/ })

/******/ });
});