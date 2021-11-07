'use strict';

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

// 浏览器是否支持全屏模式
function allowFullScreen() {
  return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
}

function exitFullScreen() {
  var exitFullScreenArr = ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'];
  return new Promise(function (resolve, reject) {
    var _iterator = _createForOfIteratorHelper(exitFullScreenArr),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;

        if (document[item]) {
          document[item]();
          resolve('退出全屏成功');
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    reject('退出全屏失败');
  });
}

function requestFullScreen(ref) {
  var requestFullScreenArr = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
  return new Promise(function (resolve, reject) {
    var _iterator2 = _createForOfIteratorHelper(requestFullScreenArr),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;

        if (ref[item]) {
          ref[item]();
          resolve('进入全屏成功');
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    reject('进入全屏失败');
  });
}

function setFullScreen(fullScreen) {
  var ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.documentElement;
  return new Promise(function (resolve, reject) {
    if (allowFullScreen()) {
      var fullScreenElement = document.fullscreenElement; // 当前的全屏元素

      if (fullScreen) {
        // 进入全屏
        if (ref === fullScreenElement) {
          // 全屏元素相同，则不处理
          resolve({
            lastFullScreenElement: fullScreenElement,
            element: ref,
            isFullScreen: true,
            message: '当前元素已经全屏'
          });
        } else {
          requestFullScreen(ref).then(function (res) {
            resolve({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: true,
              message: res
            });
          })["catch"](function (err) {
            reject({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: false,
              message: err
            });
          });
        }
      } else {
        // 退出全屏
        if (!fullScreenElement) {
          resolve({
            lastFullScreenElement: fullScreenElement,
            element: ref,
            isFullScreen: false,
            message: '当前不是全屏状态'
          });
        } else if (fullScreenElement === ref) {
          // 当前全屏元素和指定要退出的全屏元素相同，才给退出
          exitFullScreen().then(function (res) {
            resolve({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: false,
              message: res
            });
          })["catch"](function (err) {
            reject({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: true,
              message: err
            });
          });
        } else {
          console.error('退出元素不是当前全屏元素，不可退出');
          reject({
            lastFullScreenElement: fullScreenElement,
            element: ref,
            isFullScreen: true,
            message: '退出元素不是当前全屏元素，不可退出'
          });
        }
      }
    } else {
      console.error('浏览器不支持全屏');
      reject({
        lastFullScreenElement: null,
        element: ref,
        isFullScreen: false,
        message: '浏览器不支持全屏'
      });
    }
  });
}

module.exports = setFullScreen;
