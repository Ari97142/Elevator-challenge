"use strict";
exports.__esModule = true;
exports.Floor = void 0;
var CallButton_1 = require("./CallButton");
var Timer_1 = require("./Timer");
var Floor = /** @class */ (function () {
    function Floor(number, building) {
        this.number = number;
        this.callButton = new CallButton_1.CallButton(this);
        this.timer = new Timer_1.Timer(this);
        this.building = building;
    }
    Floor.prototype.changeColor = function () {
        var button = this.callButton.button;
        if (button.style.color === 'green') {
            button.style.color = 'hsla(0, 0%, 15%, 0.8)';
        }
        else {
            button.style.color = 'green';
        }
    };
    Floor.prototype.playArrivalSound = function () {
        // const audio = new Audio('ding.mp3');
        // audio.play();
    };
    Floor.prototype.callElevator = function () {
        var elevator = this.building.findNearestElevator(this);
        if (this.anElevatorOnFloor() || this.anElevatorEnRoute()) {
            console.log("An elevator is already present or en route to floor ".concat(this.number, "."));
        }
        else {
            this.changeColor();
            elevator.call(this);
            console.log("Elevator ".concat(elevator.number, " called to floor ").concat(this.number));
        }
    };
    Floor.prototype.anElevatorOnFloor = function () {
        for (var _i = 0, _a = this.building.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            if (elevator.currentFloor === this.number) {
                return true;
            }
        }
        return false;
    };
    Floor.prototype.anElevatorEnRoute = function () {
        for (var _i = 0, _a = this.building.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            for (var _b = 0, _c = elevator.destinationFloors; _b < _c.length; _b++) {
                var floor = _c[_b];
                if (floor.number === this.number) {
                    return true;
                }
            }
        }
        return false;
    };
    return Floor;
}());
exports.Floor = Floor;
