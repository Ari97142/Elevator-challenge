"use strict";
exports.__esModule = true;
exports.CallButton = void 0;
var CallButton = /** @class */ (function () {
    function CallButton(floor) {
        this.number = floor.number;
        this.button = this.createButton(floor);
    }
    CallButton.prototype.createButton = function (floor) {
        var button = document.createElement("button");
        button.innerText = "".concat(this.number);
        button.onclick = function () {
            floor.callElevator();
        };
        button.classList.add("metal", "linear");
        return button;
    };
    return CallButton;
}());
exports.CallButton = CallButton;
