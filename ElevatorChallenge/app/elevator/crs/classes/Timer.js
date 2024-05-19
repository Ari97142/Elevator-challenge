"use strict";
exports.__esModule = true;
exports.Timer = void 0;
var Timer = /** @class */ (function () {
    function Timer(floor) {
        this.number = floor.number;
        this.remainingTime = null;
        this.timerElement = this.createTimer(floor);
    }
    Timer.prototype.createTimer = function (floor) {
        var timerElement = document.createElement('div');
        timerElement.id = "timer-".concat(floor.number);
        timerElement.classList.add('timer');
        timerElement.style.display = 'none';
        return timerElement;
    };
    Timer.prototype.startTimer = function (remainingTime) {
        var _this = this;
        if (remainingTime > 0) {
            this.remainingTime = remainingTime;
            this.timerElement.style.display = 'block';
            this.timerElement.innerText = "".concat(Math.floor(this.remainingTime));
            var interval_1 = setInterval(function () {
                if (_this.remainingTime === null || _this.remainingTime <= 0) {
                    clearInterval(interval_1);
                    _this.timerElement.style.display = 'none';
                }
                else {
                    _this.remainingTime -= 0.5;
                    _this.timerElement.innerText = "".concat(Math.floor(_this.remainingTime));
                }
            }, 500);
        }
    };
    return Timer;
}());
exports.Timer = Timer;
