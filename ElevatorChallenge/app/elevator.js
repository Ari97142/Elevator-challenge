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
    };
    Building.prototype.findNearestElevator = function (callingFloor) {
        var minTime = Infinity;
        var nearestElevator = this.elevators[2];
        for (var _i = 0, _a = this.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            var time = 0;
            // Calculate time to travel between all consecutive floors
            for (var i = 0; i < elevator.destinationFloors.length - 1; i++) {
                var currentFloor = elevator.destinationFloors[i].number;
                var nextFloor = elevator.destinationFloors[i + 1].number;
                time += Math.abs(currentFloor - nextFloor);
            }
            // Calculate time to travel from the last destination floor to the calling floor
            var lastFloor = void 0;
            if (elevator.destinationFloors.length > 0) {
                lastFloor = elevator.destinationFloors[elevator.destinationFloors.length - 1].number;
            }
            else {
                lastFloor = elevator.currentFloor; // If destinationFloors is empty, set lastFloor to currentFloor
            }
            time += Math.abs(lastFloor - callingFloor.number);
            // Calculate total all breaks time
            var totalBreaks = elevator.destinationFloors.length * 2;
            time += totalBreaks;
            if (time < minTime) {
                minTime = time;
                nearestElevator = elevator;
            }
        }
        // Create and start the timer
        var timer = callingFloor.timer;
        timer.startTimer(minTime);
        return nearestElevator;
    };
    return Building;
}());
var Floor = /** @class */ (function () {
    function Floor(number) {
        this.number = number;
        this.callButton = new CallButton(this);
        this.timer = new Timer(this);
    }
    // Function to change the color of the button text when clicked
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
        var audio = new Audio('ding.mp3');
        audio.play();
    };
    Floor.prototype.callElevator = function () {
        var elevator = building.findNearestElevator(this);
        if (this.anElevatorOnFloor()) {
            console.log("An elevator is already present on floor ".concat(this.number, "."));
        }
        else {
            this.changeColor();
            elevator.call(this);
            console.log("Elevator ".concat(elevator.number, " called to floor ").concat(this.number));
        }
    };
    Floor.prototype.anElevatorOnFloor = function () {
        for (var _i = 0, _a = building.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            if (elevator.currentFloor === this.number) {
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
            floor.callElevator();
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
        this.currentFloor = 7;
        this.destinationFloors = [];
        this.elevatorImg = this.createElevatorImg();
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
                // this.destinationFloors.shift();
                // this.handleArrival();
                // this.move();
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
                _this.destinationFloors.shift();
                _this.handleArrival();
                _this.move();
            }, transitionDuration * 1000);
        }
    };
    Elevator.prototype.updateElevatorPosition = function () {
        var elevatorElement = this.elevatorImg;
        var floorHeight = 47;
        var topPosition = floorHeight * this.currentFloor;
        elevatorElement.style.top = "".concat(topPosition, "px");
    };
    Elevator.prototype.handleArrival = function () {
        var currentFloor = this.currentFloor;
        var floor = building.floors[currentFloor];
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
var lowerElevator = /** @class */ (function (_super) {
    __extends(lowerElevator, _super);
    function lowerElevator(number) {
        var _this = _super.call(this, number) || this;
        _this.currentFloor = 0;
        return _this;
    }
    return lowerElevator;
}(Elevator));
var upperElevator = /** @class */ (function (_super) {
    __extends(upperElevator, _super);
    function upperElevator(number, numFloors) {
        var _this = _super.call(this, number) || this;
        _this.currentFloor = numFloors - 1;
        return _this;
    }
    return upperElevator;
}(Elevator));
var middleElevator = /** @class */ (function (_super) {
    __extends(middleElevator, _super);
    function middleElevator(number, numFloors) {
        var _this = _super.call(this, number) || this;
        _this.currentFloor = Math.floor((numFloors - 1) / 2);
        return _this;
    }
    return middleElevator;
}(Elevator));
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
            var interval_1 = setInterval(function () {
                if (_this.remainingTime === null || _this.remainingTime <= 0) {
                    clearInterval(interval_1);
                    _this.timerElement.style.display = 'none';
                }
                else {
                    _this.timerElement.innerText = "".concat(_this.remainingTime);
                    _this.remainingTime--;
                }
            }, 1000);
        }
    };
    return Timer;
}());
var building = new Building(15, 3);
building.displayBuilding();
