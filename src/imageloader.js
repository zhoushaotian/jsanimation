'use strict';
/**
 * 图片加载函数
 * @param images:图片数组
 * @param callback:加载完成之后执行的回调
 * @param timeout:超时时间
 */
function loadImage(images, callback, timeout) {
    var count = 0 //加载完成图片的计数器
    var success = true //全部图片加载完成的标志
    var timeoutId = 0; //超时timer的ID
    var isTimeOut = false; //加载超时的标志位
    //对图片数组遍历
    for (var key in images) {
        if (!images.hasOwnProperty(key)) {
            continue;
        }
        var item = images[key];

        //格式检测
        if (typeof item === 'string') {
            item = images[key] = {
                src: item
            };
        }
        //格式不满足
        if (!item || !item.src) {
            continue;
        }
        count++;
        item.id = `__image${key}${getId()}`;
        //设置图片元素的img
        item.img = window[item.id] = new Image();

        doLoad(item);
    }
    //遍历完成 则直接调用callback
    if (!count) {
        callback(success);
    } else if (timeout) {
        timeoutId = setTimeout(onTimeout, timeout);
    }

    function onTimeout() {
        isTimeOut = true;
        callback(false);
    }
    /**
     * 真正图片加载函数
     * @param item 图片元素对象
     */
    function doLoad(item) {
        item.status = 'loading';
        var img = item.img;
        //定义图片加载成功的回调函数
        img.onload = function() {
            success = success & true;
            item.status = 'loaded';
            done();
        };
        //定义图片加载失败的回调函数
        img.onerror = function() {
            success = false;
            item.status = 'error';
            done();
        };
        img.src = item.src;
        /**
         * 每张图片加载之后的回调函数
         */
        function done() {
            img.onload = img.onerror = null;
            try {
                delete window[item.id];
            } catch (e) {

            }
            if (!--count && !isTimeOut) { //当所有图片加载过，并且没有超时，清除超时计时器，并执行回调
                clearTimeout(timeoutId);
                callback(success);
            }
        }
    }
}
var __id = 0;

function getId() {
    return ++__id;
}
module.exports = loadImage;