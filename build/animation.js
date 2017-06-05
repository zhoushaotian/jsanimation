(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["animation"] = factory();
	else
		root["animation"] = factory();
})(this, function() {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * raf
 */
var requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
        }
})();
var cancelAnimationFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(id) {
            return window.clearTimeout(id)
        };
})();
var STATE_INIT = 0;
var STATE_START = 1;
var STATE_STOP = 2;
var DEFAULT_INTERVAL = 1000 / 60;
/**
 * 时间轴类
 */
function Timeline() {
    this.ainimationHandler = 0;
    this.state = STATE_INIT;
}
/**
 * 时间轴上每一次回调执行的函数
 * 
 */
Timeline.prototype.onenterFrame = function(time) {

};
/**
 * 动画开始函数
 * @param 每一次回调的间隔时间
 */
Timeline.prototype.start = function(interval) {
    if (this.state === STATE_START) {
        return;
    }
    this.state = STATE_START;
    this.interval = interval || DEFAULT_INTERVAL;
    //启动一个时间轴动画
    startTimeline(this, +new Date());
};
/**
 * 动画停止函数
 */
Timeline.prototype.stop = function() {
    if (this.state !== STATE_START) {
        return;
    }
    this.state = STATE_STOP;
    //如果动画开始过，那么记录动画开始到现在的时间
    if (this.startTime) {
        this.dur = +new Date() - this.startTime;
    }
    cancelAnimationFrame(this.ainimationHandler);
};
/**
 * 动画重新开始函数
 */
Timeline.prototype.restart = function() {
    if (this.state === STATE_START) {
        return;
    }
    if (!this.dur || !this.interval) {
        return;
    }
    this.state = STATE_START;
    //无缝连接动画
    startTimeline(this, +new Date() - this.dur);
};
/**
 * 时间轴动画启动函数
 * @param timeline时间轴实例
 * @param startTime 开始时间戳
 */
function startTimeline(timeline, startTime) {
    timeline.startTime = startTime;
    nextTick.interval = timeline.interval;
    //记录上一次回调的时间戳
    var lastTick = +new Date();
    nextTick();
    /**
     * 定义每一帧执行的函数
     */
    function nextTick() {
        var now = +new Date();
        timeline.ainimationHandler = requestAnimationFrame(nextTick);
        //如果当前时间与上一次回调的时间戳大于时间间隔，那么久执行回调函数
        if (now - lastTick >= timeline.interval) {
            timeline.onenterFrame(now - startTime);
            lastTick = now;
        }
    }
}
module.exports = Timeline;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var loadImage = __webpack_require__(0);
var Timeline = __webpack_require__(1);
//初始状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;
//任务类型
var TASK_SYNC = 0;
var TASK_ASYNC = 1;

function next(callback) {
    callback && calback();
}
/*
帧动画类
*/
function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.timeline = new Timeline();
    this.state = STATE_INITIAL;
}
/** 
 *     添加一个同步任务，预加载图片
 *     @param imgList 图片数组
 */

Animation.prototype.loadImage = function(imglist) {
    var taskFn = function(next) {
        loadImage(imglist.slice(), next);
    };
    var type = TASK_SYNC;
    return this._add(taskFn, type);
};
/**
 * 添加一个异步定时任务
 * ele:dom
 * position:背景位置数组
 * imageUrl:图片地址
 */
Animation.prototype.changePosition = function(ele, positions, imageUrl) {
    var len = positions.length;
    var taskFn;
    var type;
    var that = this;
    if (len) {
        taskFn = function(next, time) {
            if (imageUrl) {
                ele.style.backgroundImage = `url(${imageUrl})`
            }
            //获得当前图片位置
            var index = Math.min(time / that.interval | 0, len - 1);
            var position = positions[index].split(' ');
            //改变dom的背景图片位置
            ele.style.backgroundPosition = `${position[0]}px ${position[1]}px`;
            if (index === len - 1) {
                next();
            }
        };
        type = TASK_ASYNC;
    } else {
        taskFn = next;
        type = TASK_SYNC;
    }
    return this._add(taskFn, type);
};
/**
 * 添加一个异步定时任务，定时改变图片背景
 * ele:dom
 * imageList:图像数组
 */
Animation.prototype.changeSrc = function(ele, imageList) {
    var len = imageList.length;
    var taskFn;
    var type;
    if (len) {
        var that = this;
        taskFn = function(next, time) {
            var index = Math.min(time / that.interval | 0, len - 1);
            ele.src = imageList[index];
            if (index === len - 1) {
                next();
            }
        }
        type = TASK_ASYNC;
    } else {
        type = TASK_SYNC;
        taskFn = next;
    }
    this._add(taskFn, type);
};
/**
 * 添加一个异步定时执行的任务，定义每帧执行的函数
 * @param taskFn 任务 
 */
Animation.prototype.enterFrame = function(taskFn) {
    return this._add(taskFn, TASK_ASYNC);
};
/**
 * 添加一个同步任务，在上一个任务完成之后执行回调
 * @param callback 回调函数
 */
Animation.prototype.then = function(callback) {
    var taskFn = function(next) {
        callback();
        next();
    }
    var type = TASK_SYNC;
    return this._add(taskFn, type);
};
/**
 * 开始执行任务 异步定义任务执行的间隔
 * @param interval 
 */
Animation.prototype.start = function(interval) {
    if (this.state === STATE_START) {
        return this;
    }
    if (!this.taskQueue.length) { //任务链中没有任务
        return this;
    }
    this.state = STATE_START;
    this.interval = interval;
    this._runTask();
    return this;

};
/**
 * 添加一个同步任务，回退到上一个任务，实现重复任务的效果
 * @param  times 重复次数
 */
Animation.prototype.repeat = function(times) {
    var that = this;
    var taskFn = function() {
        if (typeof times === 'undefined') {
            that.index--;
            that._runTask();
            return;
        }
        if (times) {
            times--;
            that.index--;
            that._runTask();
        } else {
            var task = that.taskQueue[that.index];
            that._next(task);
        }
    };
    var type = TASK_SYNC;
    return this._add(taskFn, type);

};
/**
 * 无限循环上一次的任务
 */
Animation.prototype.repeatForever = function() {
    return this.repeat();
};
/**
 * 设置上一个任务结束到下一个任务开始的等待时间
 * @param time 等待时长
 */
Animation.prototype.wait = function(time) {
    if (this.taskQueue && this.taskQueue.length > 0) {
        this.taskQueue[this.taskQueue.length - 1].wait = time;
        return this;
    }
    return this;
};
/**
 * 暂停当前的异步定时任务
 */
Animation.prototype.pause = function() {
    if (this.state === STATE_START) {
        this.state = STATE_STOP;
        this.timeline.stop();
        return this;
    }
    return this;
};
/**
 * 重新执行上一次暂停的任务
 */
Animation.prototype.restart = function() {
    if (this.state === STATE_STOP) {
        this.state = STATE_START;
        this.timeline.restart();
        return this;
    }
    return this;
};
/**
 * 释放资源
 */
Animation.prototype.dispose = function() {
    if (this.state !== STATE_INITIAL) {
        this.state = STATE_INITIAL;
        this.taskQueue = null;
        this.timeline.stop();
        this.timeline = null;
        return this;
    }
    return this;
};
/**
 * 添加一个任务到任务队列
 * @param taskFn任务
 * @param type 任务类型
 */
Animation.prototype._add = function(taskFn, type) {
    this.taskQueue.push({
        taskFn: taskFn,
        type: type
    });
    return this;
};
/**
 * 执行任务
 */
Animation.prototype._runTask = function() {
    if (!this.taskQueue || this.state != STATE_START) {
        return this;
    }
    if (this.index === this.taskQueue.length) {
        this.dispose();
        return;
    }
    //获得当前任务
    var task = this.taskQueue[this.index];
    if (task.type === TASK_SYNC) {
        this._syncTask(task);
    } else {
        this._asyncTask(task);
    }
};
/**
 * 执行同步任务
 * @param task 同步任务
 */
Animation.prototype._syncTask = function(task) {
    var that = this;
    /**
     * 切换到下一个任务
     */
    var next = function() {
        that._next(task);
    }
    var taskFn = task.taskFn;
    taskFn(next);

};
/**
 * 切换到下一个任务,如果当前任务需要等待 则延迟执行
 * @param task 当前任务
 */
Animation.prototype._next = function(task) {
    var that = this;
    this.index++;
    task.wait ? setTimeout(function() {
        that._runTask();
    }, task.wait) : this._runTask();
};
/**
 * 执行异步任务
 * @param 异步任务
 */
Animation.prototype._asyncTask = function(task) {
    /**
     * 定义每一帧回调函数
     */
    var that = this;
    var enterFrame = function(time) {
        var taskFn = task.taskFn;
        var next = function() {
            //执行下一个任务
            that.timeline.stop();
            that._next(task);
        };
        taskFn(next, time);
    };
    this.timeline.onenterFrame = enterFrame;
    this.timeline.start(this.interval);

};
module.exports = function() {
    return new Animation();
}

/***/ })
/******/ ]);
});