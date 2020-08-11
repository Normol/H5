/* jshint elision: true */

/**
|--------------------------------------------------
| url相关函数
|--------------------------------------------------
*/
const Util = function() {};
/**
 * @description: 获取url中的特定参数
 * @param {string} name 参数名称
 * @return: 参数值
 */

Util.prototype.urlSearch = function(name) {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
        location.href
      ) || [, ""])[1].replace(/\+/g, "%20")
    ) || ""
  );
};

/**
|--------------------------------------------------
| 微信相关函数
|--------------------------------------------------
*/
Util.prototype.isWeiXin = function() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};

/**
|--------------------------------------------------
| 移动端手机系统的判断
|--------------------------------------------------
*/
Util.prototype.getSystem = function() {
  var sys;
  var sUserAgent = navigator.userAgent.toLowerCase();
  if (sUserAgent.match(/android/i) == "android") {
    sys = "android"; //android
  } else if (sUserAgent.match(/iphone/i) == "iphone") {
    sys = "iphone"; //iphone
  } else {
    sys = "other";
  }
  return sys;
};

window.Util = new Util();
