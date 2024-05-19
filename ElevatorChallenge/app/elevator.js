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
var SystemManager = /** @class */ (function () {
    function SystemManager() {
        this.buildingManager = new BuildingManager();
    }
    SystemManager.prototype.initialize = function () {
        var addBuildingBtn = document.getElementById('add-building-btn');
        addBuildingBtn === null || addBuildingBtn === void 0 ? void 0 : addBuildingBtn.addEventListener('click', this.buildingManager.promptForBuildingDetails.bind(this.buildingManager));
        this.buildingManager.addBuilding(15, 3);
    };
    return SystemManager;
}());
var BuildingManager = /** @class */ (function () {
    function BuildingManager() {
        this.buildings = [];
    }
    BuildingManager.prototype.promptForBuildingDetails = function () {
        var numFloors = parseInt(prompt('Enter number of floors:') || '0');
        var numElevators = parseInt(prompt('Enter number of elevators:') || '0');
        if (numFloors > 0 && numElevators > 0) {
            this.addBuilding(numFloors, numElevators);
        }
        else {
            alert('Invalid input. Please enter positive integers.');
        }
    };
    BuildingManager.prototype.addBuilding = function (numFloors, numElevators) {
        var building = new Building(numFloors, numElevators);
        this.buildings.push(building);
        var buildingContainer = document.getElementById('building-container');
        if (buildingContainer) {
            building.displayBuilding(buildingContainer);
        }
    };
    return BuildingManager;
}());
var Building = /** @class */ (function () {
    function Building(numFloors, numElevators) {
        var _this = this;
        this.numFloors = numFloors;
        this.numElevators = numElevators;
        this.floors = Array.from({ length: numFloors }, function (_, i) { return new Floor(i, _this); });
        this.elevators = Array.from({ length: numElevators }, function (_, i) { return elevatorFactory.createElevator(i, numFloors, _this); });
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
var Floor = /** @class */ (function () {
    function Floor(number, building) {
        this.number = number;
        this.callButton = new CallButton(this);
        this.timer = new Timer(this);
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
        var audio = new Audio('ding.mp3');
        audio.play();
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
        // const numFloors = this.building.numFloors; // Total number of floors
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
var systemManager = new SystemManager();
systemManager.initialize();
