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
/* The above TypeScript code defines classes for a building with multiple floors and elevators,
allowing users to call the nearest elevator from a floor. */
var Building = /** @class */ (function () {
    function Building(numFloors, numElevators) {
        this.numFloors = numFloors;
        this.numElevators = numElevators;
        this.floors = Array.from({ length: numFloors }, function (_, i) { return new Floor(i); });
        this.elevators = Array.from({ length: numElevators }, function (_, i) { return elevatorFactory.createElevator(i, numFloors); });
    }
    Building.prototype.displayBuilding = function () {
        var buildingElement = document.getElementById("building");
        var _loop_1 = function (floor) {
            var floorElement = document.createElement("div");
            floorElement.classList.add("floor");
            var button = document.createElement("button");
            button.innerText = "Floor ".concat(floor.number);
            button.onclick = function () { return floor.callElevator(floor.number); };
            floorElement.appendChild(button);
            buildingElement.appendChild(floorElement);
        };
        for (var _i = 0, _a = this.floors; _i < _a.length; _i++) {
            var floor = _a[_i];
            _loop_1(floor);
        }
    };
    Building.prototype.findNearestElevator = function (floor) {
        var minDistance = Infinity;
        var nearestElevator = this.elevators[0];
        for (var _i = 0, _a = this.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            var TotalBreaks = elevator.destinationFloors.length * 2;
            var distance = 0;
            for (var i = 0; i < elevator.destinationFloors.length - 1; i++) {
                var currentFloor = elevator.destinationFloors[i];
                var nextFloor = elevator.destinationFloors[i + 1];
                // calculate absolute distance between each pair of consecutive floors.
                distance += Math.abs(currentFloor - nextFloor);
                console.log("the distance between ".concat(currentFloor, " to  ").concat(nextFloor, " is ").concat(distance));
            }
            // console.log(`Elevator ${elevator.number} distance is  ${distance}`);
            // calculate absolute distance between last destination floor to the calling floor.
            distance += Math.abs(elevator.destinationFloors[elevator.destinationFloors.length - 1] - floor);
            distance += TotalBreaks;
            console.log("Elevator ".concat(elevator.number, " distance is  ").concat(distance));
            if (distance < minDistance) {
                minDistance = distance;
                nearestElevator = elevator;
            }
        }
        return nearestElevator;
    };
    return Building;
}());
var Floor = /** @class */ (function () {
    function Floor(number) {
        this.number = number;
        this.callButton = new CallButton();
    }
    Floor.prototype.callElevator = function (floor) {
        var elevator = building.findNearestElevator(floor);
        elevator.call(floor);
        console.log("Elevator ".concat(elevator.number, " called to floor ").concat(floor));
    };
    return Floor;
}());
var elevatorFactory = /** @class */ (function () {
    function elevatorFactory() {
    }
    elevatorFactory.createElevator = function (i, numFloors) {
        if (i % 3 === 0) {
            return new lowerElevator(i);
        }
        else if (i % 3 === 1) {
            return new middleElevator(i, numFloors);
        }
        else {
            return new upperElevator(i, numFloors);
        }
    };
    return elevatorFactory;
}());
var Elevator = /** @class */ (function () {
    function Elevator(number) {
        this.number = number;
        this.currentFloor = 0; // Initialize currentFloor to 0
        this.destinationFloors = [];
    }
    Elevator.prototype.moveLock = function () {
        var _this = this;
        if (this.destinationFloors.length > 0) {
            var nextFloor_1 = this.getNextFloor();
            if (nextFloor_1 === this.currentFloor) {
                console.log("Elevator is already at the destination floor.");
                return;
            }
            var floorsToMove = Math.abs(this.currentFloor - nextFloor_1);
            console.log(this.destinationFloors);
            setTimeout(function () {
                _this.currentFloor = nextFloor_1;
                console.log("Elevator ".concat(_this.number, " arrived at floor ").concat(_this.currentFloor));
                _this.destinationFloors.shift();
                _this.moveLock();
            }, floorsToMove * 1000);
        }
    };
    return Elevator;
}());
var lowerElevator = /** @class */ (function (_super) {
    __extends(lowerElevator, _super);
    function lowerElevator(number) {
        var _this = _super.call(this, number) || this;
        _this.defaultPosition = 0; // Set default position for lowerElevator
        _this.currentFloor = _this.defaultPosition; // Initialize currentFloor based on defaultPosition
        return _this;
    }
    lowerElevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    lowerElevator.prototype.getNextFloor = function () {
        return this.destinationFloors[0];
    };
    return lowerElevator;
}(Elevator));
var upperElevator = /** @class */ (function (_super) {
    __extends(upperElevator, _super);
    function upperElevator(number, numFloors) {
        var _this = _super.call(this, number) || this;
        _this.defaultPosition = numFloors - 1;
        _this.currentFloor = _this.defaultPosition; // Initialize currentFloor based on defaultPosition
        return _this;
    }
    upperElevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    upperElevator.prototype.getNextFloor = function () {
        return this.destinationFloors[0];
    };
    return upperElevator;
}(Elevator));
var middleElevator = /** @class */ (function (_super) {
    __extends(middleElevator, _super);
    function middleElevator(number, numFloors) {
        var _this = _super.call(this, number) || this;
        _this.defaultPosition = Math.floor((numFloors - 1) / 2);
        _this.currentFloor = _this.defaultPosition; // Initialize currentFloor based on defaultPosition
        return _this;
    }
    middleElevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    middleElevator.prototype.getNextFloor = function () {
        return this.destinationFloors[0];
    };
    return middleElevator;
}(Elevator));
var CallButton = /** @class */ (function () {
    function CallButton() {
        this.color = "normal";
    }
    return CallButton;
}());
var building = new Building(15, 3);
building.displayBuilding();
