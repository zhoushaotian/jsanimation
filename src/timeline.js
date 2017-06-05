'use strict';
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