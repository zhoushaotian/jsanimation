'use strict'
var loadImage = require('./imageloader');
var Timeline = require('./timeline');
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