"use strict";
exports.__esModule = true;
exports.Building = void 0;
var Floor_1 = require("./Floor");
var Elevator_1 = require("./Elevator");
var Building = /** @class */ (function () {
    function Building(numFloors, numElevators) {
        var _this = this;
        this.numFloors = numFloors;
        this.numElevators = numElevators;
        this.floors = Array.from({ length: numFloors }, function (_, i) { return new Floor_1.Floor(i, _this); });
        this.elevators = Array.from({ length: numElevators }, function (_, i) { return Elevator_1.elevatorFactory.createElevator(i, numFloors, _this); });
    }
    Building.prototype.displayBuilding = function (container) {
        var buildingElement = document.createElement("div");
        buildingElement.classList.add("building");
        buildingElement.style.setProperty('--numElevators', "".concat(this.numElevators));
        var elevatorsRowElement = document.createElement("div");
        elevatorsRowElement.classList.add("elevators-row");
        var floorsElement = document.createElement("div");
        floorsElement.classList.add("floors");
        for (var _i = 0, _a = this.floors; _i < _a.length; _i++) {
            var floor = _a[_i];
            var floorElement = document.createElement("div");
            floorElement.classList.add("floor");
            var button = floor.callButton.button;
            var timerElement = floor.timer.timerElement;
            floorElement.appendChild(button);
            floorElement.appendChild(timerElement);
            floorsElement.appendChild(floorElement);
        }
        buildingElement.appendChild(elevatorsRowElement);
        buildingElement.appendChild(floorsElement);
        for (var i = 0; i < this.elevators.length; i++) {
            var elevatorElement = this.elevators[i].elevatorImg;
            elevatorElement.style.setProperty('--currentFloor', "".concat(this.elevators[i].currentFloor));
            elevatorsRowElement.appendChild(elevatorElement);
        }
        container.appendChild(buildingElement);
    };
    Building.prototype.findNearestElevator = function (callingFloor) {
        var minTime = Infinity;
        var nearestElevator = this.elevators[0];
        for (var _i = 0, _a = this.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            var time = this.calculateTravelTime(elevator, callingFloor);
            if (time < minTime) {
                minTime = time;
                nearestElevator = elevator;
            }
        }
        var timer = callingFloor.timer;
        timer.startTimer(minTime);
        return nearestElevator;
    };
    Building.prototype.calculateTravelTime = function (elevator, callingFloor) {
        var _a;
        var time = 0;
        if (elevator.destinationFloors.length > 0) {
            var lastDestinationFloor = elevator.destinationFloors[elevator.destinationFloors.length - 1];
            var remainingTimeOnTimer = (_a = lastDestinationFloor.timer.remainingTime) !== null && _a !== void 0 ? _a : 0;
            time += remainingTimeOnTimer + 2;
            time += Math.abs(lastDestinationFloor.number - callingFloor.number) * 0.5;
        }
        else {
            time += Math.abs(elevator.currentFloor - callingFloor.number) * 0.5;
        }
        return time;
    };
    return Building;
}());
exports.Building = Building;
