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
        this.elevators = Array.from({ length: numElevators }, function (_, i) { return elevatorFactory.createElevator(i, numFloors); });
    }
    Building.prototype.displayBuilding = function () {
        var buildingElement = document.getElementById("building");
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
            floorElement.appendChild(button);
            floorsElement.appendChild(floorElement);
        }
        buildingElement.appendChild(elevatorsRowElement);
        buildingElement.appendChild(floorsElement);
        for (var i = 0; i < this.elevators.length; i++) {
            var elevatorElement = document.createElement("img");
            elevatorElement.classList.add("elevator-img");
            elevatorElement.src = 'elv.png';
            elevatorElement.id = "elevator-".concat(i);
            elevatorElement.style.setProperty('--currentFloor', "".concat(this.elevators[i].currentFloor));
            elevatorsRowElement.appendChild(elevatorElement);
        }
    };
    Building.prototype.findNearestElevator = function (callingFloor) {
        var minTime = Infinity;
        var nearestElevator = this.elevators[2];
        for (var _i = 0, _a = this.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            var time = 0;
            // Calculate time to travel between all consecutive floors
            for (var i = 0; i < elevator.destinationFloors.length - 1; i++) {
                var currentFloor = elevator.destinationFloors[i];
                var nextFloor = elevator.destinationFloors[i + 1];
                time += Math.abs(currentFloor - nextFloor);
            }
            // Calculate time to travel from the last destination floor to the calling floor
            var lastFloor = void 0;
            if (elevator.destinationFloors.length > 0) {
                lastFloor = elevator.destinationFloors[elevator.destinationFloors.length - 1];
            }
            else {
                lastFloor = elevator.currentFloor; // If destinationFloors is empty, set lastFloor to currentFloor
            }
            time += Math.abs(lastFloor - callingFloor);
            // Calculate total all breaks time
            var totalBreaks = elevator.destinationFloors.length * 2;
            time += totalBreaks;
            if (time < minTime) {
                minTime = time;
                nearestElevator = elevator;
            }
        }
        // Create and start the timer
        var timer = new Timer(callingFloor, minTime - 2);
        timer.startTimer();
        return nearestElevator;
    };
    return Building;
}());
var Floor = /** @class */ (function () {
    function Floor(number) {
        this.number = number;
        this.callButton = new CallButton(this);
    }
    // Function to change the color of the button text when clicked
    Floor.prototype.changeColor = function (button) {
        if (button.style.color === 'green') {
            button.style.color = 'hsla(0, 0%, 15%, 0.8)';
        }
        else {
            button.style.color = 'green'; // Change text color to green
        }
    };
    Floor.prototype.playArrivalSound = function () {
        var audio = new Audio('ding.mp3');
        audio.play();
    };
    Floor.prototype.callElevator = function (floor) {
        var elevator = building.findNearestElevator(floor);
        if (this.anElevatorOnFloor(floor)) {
            console.log("An elevator is already present on floor ".concat(floor, "."));
        }
        else {
            this.changeColor(this.callButton.button);
            elevator.call(floor);
            console.log("Elevator ".concat(elevator.number, " called to floor ").concat(floor));
        }
    };
    Floor.prototype.anElevatorOnFloor = function (floor) {
        for (var _i = 0, _a = building.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            if (elevator.currentFloor === floor) {
                return true;
            }
        }
        return false;
    };
    return Floor;
}());
var CallButton = /** @class */ (function () {
    function CallButton(floor) {
        this.number = floor.number;
        this.button = this.createButton(floor);
    }
    CallButton.prototype.createButton = function (floor) {
        var button = document.createElement("button");
        button.innerText = "".concat(this.number);
        button.onclick = function () {
            floor.callElevator(floor.number);
        };
        button.classList.add("metal", "linear");
        return button;
    };
    return CallButton;
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
        this.currentFloor = 0;
        this.destinationFloors = [];
    }
    Elevator.prototype.call = function (floor) {
        this.destinationFloors.push(floor);
        this.moveLock();
    };
    Elevator.prototype.updateElevatorPosition = function () {
        var elevatorElement = document.getElementById("elevator-".concat(this.number));
        if (elevatorElement) {
            var floorHeight = 47;
            var topPosition = floorHeight * this.currentFloor;
            elevatorElement.style.top = "".concat(topPosition, "px");
        }
    };
    Elevator.prototype.moveLock = function () {
        var _this = this;
        if (this.destinationFloors.length > 0) {
            var nextFloor = this.getNextFloor();
            if (nextFloor === this.currentFloor) {
                console.log("Elevator is already at the destination floor.");
                return;
            }
            var floorsToMove = Math.abs(this.currentFloor - nextFloor);
            var transitionDuration = 0.5;
            this.currentFloor = nextFloor;
            this.updateElevatorPosition();
            console.log("Elevator ".concat(this.number, " arrived at floor ").concat(this.currentFloor));
            var elevatorElement = document.getElementById("elevator-".concat(this.number));
            elevatorElement.style.transition = "top ".concat(floorsToMove * transitionDuration, "s ease");
            setTimeout(function () {
                _this.destinationFloors.shift();
                _this.moveLock();
            }, (floorsToMove * transitionDuration * 1000));
            setTimeout(function () {
                _this.handleArrival();
            }, 2000);
        }
    };
    Elevator.prototype.handleArrival = function () {
        var currentFloor = this.currentFloor;
        var floor = building.floors[currentFloor];
        if (floor) {
            floor.changeColor(floor.callButton.button);
            floor.playArrivalSound();
        }
    };
    Elevator.prototype.getNextFloor = function () {
        return this.destinationFloors[0];
    };
    return Elevator;
}());
var lowerElevator = /** @class */ (function (_super) {
    __extends(lowerElevator, _super);
    function lowerElevator(number) {
        var _this = _super.call(this, number) || this;
        _this.defaultPosition = 0;
        _this.currentFloor = _this.defaultPosition;
        return _this;
    }
    return lowerElevator;
}(Elevator));
var upperElevator = /** @class */ (function (_super) {
    __extends(upperElevator, _super);
    function upperElevator(number, numFloors) {
        var _this = _super.call(this, number) || this;
        _this.defaultPosition = numFloors - 1;
        _this.currentFloor = _this.defaultPosition;
        return _this;
    }
    return upperElevator;
}(Elevator));
var middleElevator = /** @class */ (function (_super) {
    __extends(middleElevator, _super);
    function middleElevator(number, numFloors) {
        var _this = _super.call(this, number) || this;
        _this.defaultPosition = Math.floor((numFloors - 1) / 2);
        _this.currentFloor = _this.defaultPosition;
        return _this;
    }
    return middleElevator;
}(Elevator));
var Timer = /** @class */ (function () {
    function Timer(floor, remainingTime) {
        this.floor = floor;
        this.remainingTime = remainingTime;
        this.timerElement = document.createElement('div');
        this.timerElement.id = "timer-".concat(floor);
        this.timerElement.classList.add('timer');
        document.body.appendChild(this.timerElement);
    }
    Timer.prototype.startTimer = function () {
        var _this = this;
        var interval = setInterval(function () {
            if (_this.remainingTime <= 0) {
                clearInterval(interval);
                _this.timerElement.innerText = 'Elevator arrived';
            }
            else {
                _this.timerElement.innerText = "Time remaining: ".concat(_this.remainingTime, " seconds");
                _this.remainingTime--;
            }
        }, 1000);
    };
    return Timer;
}());
var building = new Building(15, 3);
building.displayBuilding();
