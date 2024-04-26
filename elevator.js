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
var Building = /** @class */ (function () {
    function Building(numFloors, numElevators) {
        this.numFloors = numFloors;
        this.numElevators = numElevators;
        this.floors = Array.from({ length: numFloors }, function (_, i) { return new Floor(i); });
        this.elevators = Array.from({ length: numElevators }, function (_, i) {
            if (i % 3 === 0) {
                // Create a ninja elevator always waiting at the top floor
                return new UpperElevator(i, numFloors - 1);
            }
            else if (i % 3 === 2) {
                return new LowerElevator(i);
            }
            else {
                return new MiddleElevator(i, (numFloors - 1) / 2);
            }
        });
        this.elevatorImg = document.getElementById("elevator-img");
    }
    Building.prototype.displayBuilding = function () {
        var buildingElement = document.getElementById("building");
        var _loop_1 = function (floor) {
            var floorElement = document.createElement("div");
            floorElement.classList.add("floor");
            // Create button element
            var button = document.createElement("button");
            button.innerText = "Floor ".concat(floor.number);
            button.onclick = function () { return floor.callElevator(floor.number); }; // Call the elevator when button is clicked
            floorElement.appendChild(button); // Add button to floor element
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
            var totalFloors = Math.abs(elevator.currentFloor - floor);
            var totalTime = elevator.destinationFloors.length * 2;
            var distance = totalFloors + totalTime;
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
var Elevator = /** @class */ (function () {
    function Elevator(number) {
        this.number = number;
        this.currentFloor = 0;
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
                _this.destinationFloors.shift(); // Remove the arrived floor from the array
                _this.moveLock();
                // Move the elevator image to the corresponding floor
                var buildingHeight = building.floors.length * 100; // Assuming each floor has a height of 100px
                var floorHeight = buildingHeight / building.floors.length;
                var elevatorPosition = (building.numFloors - nextFloor_1 - 1) * floorHeight;
                building.elevatorImg.style.bottom = elevatorPosition + "px";
            }, floorsToMove * 1000);
        }
    };
    return Elevator;
}());
var LowerElevator = /** @class */ (function (_super) {
    __extends(LowerElevator, _super);
    function LowerElevator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LowerElevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    LowerElevator.prototype.getNextFloor = function () {
        return this.destinationFloors[0];
    };
    return LowerElevator;
}(Elevator));
var UpperElevator = /** @class */ (function (_super) {
    __extends(UpperElevator, _super);
    function UpperElevator(number, currentFloor) {
        var _this = _super.call(this, number) || this;
        _this.currentFloor = currentFloor;
        return _this;
    }
    UpperElevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    UpperElevator.prototype.getNextFloor = function () {
        // Ninja elevator always waits at the top floor
        return this.destinationFloors[0];
    };
    return UpperElevator;
}(Elevator));
var MiddleElevator = /** @class */ (function (_super) {
    __extends(MiddleElevator, _super);
    function MiddleElevator(number, currentFloor) {
        var _this = _super.call(this, number) || this;
        _this.currentFloor = currentFloor;
        return _this;
    }
    MiddleElevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    MiddleElevator.prototype.getNextFloor = function () {
        // Middle elevator moves to the requested floor
        return this.destinationFloors[0];
    };
    return MiddleElevator;
}(Elevator));
var CallButton = /** @class */ (function () {
    function CallButton() {
        this.color = "normal";
    }
    return CallButton;
}());
var building = new Building(15, 3);
building.displayBuilding();
