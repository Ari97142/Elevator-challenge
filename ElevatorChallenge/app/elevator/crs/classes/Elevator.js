"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Elevator = exports.elevatorFactory = void 0;
var elevatorFactory = /** @class */ (function () {
    function elevatorFactory() {
    }
    elevatorFactory.createElevator = function (i, numFloors, building) {
        if (i % 3 === 0) {
            return new lowerElevator(i, building);
        }
        else if (i % 3 === 1) {
            return new middleElevator(i, numFloors, building);
        }
        else {
            return new upperElevator(i, numFloors, building);
        }
    };
    return elevatorFactory;
}());
exports.elevatorFactory = elevatorFactory;
var Elevator = /** @class */ (function () {
    function Elevator(number, building) {
        this.number = number;
        this.currentFloor = 7;
        this.destinationFloors = [];
        this.elevatorImg = this.createElevatorImg();
        this.building = building;
    }
    Elevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.move();
    };
    Elevator.prototype.createElevatorImg = function () {
        var elevatorElement = document.createElement("img");
        elevatorElement.classList.add("elevator-img");
        elevatorElement.src = 'elv.png';
        elevatorElement.id = "elevator-".concat(this.number);
        return elevatorElement;
    };
    Elevator.prototype.move = function () {
        var _this = this;
        if (this.destinationFloors.length > 0) {
            var nextFloor = this.getNextFloor().number;
            if (this.currentFloor === nextFloor) {
                console.log("Elevator ".concat(this.number, " arrived at floor ").concat(this.currentFloor));
                return;
            }
            var floorsToMove = Math.abs(this.currentFloor - nextFloor);
            var transitionDuration = 0.5 * floorsToMove;
            var elevatorElement = this.elevatorImg;
            elevatorElement.style.transition = "top ".concat(transitionDuration, "s ease");
            this.currentFloor = nextFloor;
            this.updateElevatorPosition();
            console.log("Elevator ".concat(this.number, " moving to floor ").concat(this.currentFloor));
            setTimeout(function () {
                _this.handleArrival();
                setTimeout(function () {
                    _this.destinationFloors.shift();
                    _this.move();
                }, 2000);
            }, transitionDuration * 1000);
        }
    };
    Elevator.prototype.updateElevatorPosition = function () {
        var elevatorElement = this.elevatorImg;
        var floorHeight = 47; // Height of each floor in pixels
        var numFloors = this.building.numFloors; // Total number of floors
        var topPosition = floorHeight * (this.currentFloor); // Calculate the correct top position
        elevatorElement.style.top = "".concat(topPosition, "px");
    };
    Elevator.prototype.handleArrival = function () {
        var currentFloor = this.currentFloor;
        var floor = this.building.floors[currentFloor];
        if (floor) {
            floor.changeColor();
            floor.playArrivalSound();
        }
    };
    Elevator.prototype.getNextFloor = function () {
        return this.destinationFloors[0];
    };
    return Elevator;
}());
exports.Elevator = Elevator;
var lowerElevator = /** @class */ (function (_super) {
    __extends(lowerElevator, _super);
    function lowerElevator(number, building) {
        var _this = _super.call(this, number, building) || this;
        _this.currentFloor = 0;
        return _this;
    }
    return lowerElevator;
}(Elevator));
var upperElevator = /** @class */ (function (_super) {
    __extends(upperElevator, _super);
    function upperElevator(number, numFloors, building) {
        var _this = _super.call(this, number, building) || this;
        _this.currentFloor = numFloors - 1;
        return _this;
    }
    return upperElevator;
}(Elevator));
var middleElevator = /** @class */ (function (_super) {
    __extends(middleElevator, _super);
    function middleElevator(number, numFloors, building) {
        var _this = _super.call(this, number, building) || this;
        _this.currentFloor = Math.floor((numFloors - 1) / 2);
        return _this;
    }
    return middleElevator;
}(Elevator));
