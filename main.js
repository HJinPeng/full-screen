// 浏览器是否支持全屏模式
function allowFullScreen() {
  return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
};

// 退出全屏
function exitFullScreen() {
  const exitFullScreenArr = [
    'exitFullscreen',
    'webkitExitFullscreen',
    'mozCancelFullScreen',
    'msExitFullscreen',
  ];
  return new Promise((resolve, reject) => {
    for (let item of exitFullScreenArr) {
      if (document[item]) {
        document[item]();
        resolve('退出全屏成功');
        break;
      }
    }
    reject('退出全屏失败');
  });
};

// 打开全屏
function requestFullScreen(ref) {
  const requestFullScreenArr = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
  return new Promise((resolve, reject) => {
    for (let item of requestFullScreenArr) {
      if (ref[item]) {
        ref[item]();
        resolve('进入全屏成功');
      }
    }
    reject('进入全屏失败');
  });
};

// 设置是否全屏
export default function setFullScreen(fullScreen, ref = document.documentElement) {
  return new Promise((resolve, reject) => {
    if (allowFullScreen()) {
      const fullScreenElement = document.fullscreenElement; // 当前的全屏元素
      if (fullScreen) { // 进入全屏
        if (ref === fullScreenElement) { // 全屏元素相同，则不处理
          resolve({
            lastFullScreenElement: fullScreenElement,
            element: ref,
            isFullScreen: true,
            message: '当前元素已经全屏',
          });
        } else {
          requestFullScreen(ref).then(res => {
            resolve({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: true,
              message: res,
            });
          }).catch(err => {
            reject({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: false,
              message: err,
            });
          });
        }
      } else { // 退出全屏
        if (!fullScreenElement) {
          resolve({
            lastFullScreenElement: fullScreenElement,
            element: ref,
            isFullScreen: false,
            message: '当前不是全屏状态',
          });
        } else if (fullScreenElement === ref) { // 当前全屏元素和指定要退出的全屏元素相同，才给退出
          exitFullScreen().then(res => {
            resolve({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: false,
              message: res,
            });
          }).catch(err => {
            reject({
              lastFullScreenElement: fullScreenElement,
              element: ref,
              isFullScreen: true,
              message: err,
            });
          });
        } else {
          console.error('退出元素不是当前全屏元素，不可退出');
          reject({
            lastFullScreenElement: fullScreenElement,
            element: ref,
            isFullScreen: true,
            message: '退出元素不是当前全屏元素，不可退出',
          });
        }
      }
    } else {
      console.error('浏览器不支持全屏');
      reject({
        lastFullScreenElement: null,
        element: ref,
        isFullScreen: false,
        message: '浏览器不支持全屏',
      });
    }
  });
}