class SystemManager {
    buildingManager: BuildingManager;

    constructor() {
        this.buildingManager = new BuildingManager();
    }

    initialize() {
        const addBuildingBtn = document.getElementById('add-building-btn');
        addBuildingBtn?.addEventListener('click', this.buildingManager.promptForBuildingDetails.bind(this.buildingManager));
    
        this.buildingManager.addBuilding(15, 3);
    }
}

class BuildingManager {
    buildings: Building[] = [];

    promptForBuildingDetails() {
        const numFloors = parseInt(prompt('Enter number of floors:') || '0');
        const numElevators = parseInt(prompt('Enter number of elevators:') || '0');

        if (numFloors > 0 && numElevators > 0) {
            this.addBuilding(numFloors, numElevators);
        } else {
            alert('Invalid input. Please enter positive integers.');
        }
    }

    addBuilding(numFloors: number, numElevators: number) {
        const building = new Building(numFloors, numElevators);
        this.buildings.push(building);
        const buildingContainer = document.getElementById('building-container');
        if (buildingContainer) {
            building.displayBuilding(buildingContainer);
        }
    }
}

class Building {
    numFloors: number;
    numElevators: number;
    floors: Floor[];
    elevators: Elevator[];

    constructor(numFloors: number, numElevators: number) {
        this.numFloors = numFloors;
        this.numElevators = numElevators;
        this.floors = Array.from({ length: numFloors }, (_, i) => new Floor(i, this));
        this.elevators = Array.from({ length: numElevators }, (_, i) => elevatorFactory.createElevator(i, numFloors, this));
    }

    displayBuilding(container: HTMLElement) {
        const buildingElement = document.createElement("div");
        buildingElement.classList.add("building");
        buildingElement.style.setProperty('--numElevators', `${this.numElevators}`);

        const elevatorsRowElement = document.createElement("div");
        elevatorsRowElement.classList.add("elevators-row");

        const floorsElement = document.createElement("div");
        floorsElement.classList.add("floors");

        for (const floor of this.floors) {
            const floorElement = document.createElement("div");
            floorElement.classList.add("floor");

            const { button } = floor.callButton;
            const { timerElement } = floor.timer;
            floorElement.appendChild(button);
            floorElement.appendChild(timerElement);

            floorsElement.appendChild(floorElement);
        }

        buildingElement.appendChild(elevatorsRowElement);
        buildingElement.appendChild(floorsElement);

        for (let i = 0; i < this.elevators.length; i++) {
            const elevatorElement = this.elevators[i].elevatorImg;
            elevatorElement.style.setProperty('--currentFloor', `${this.elevators[i].currentFloor}`);

            elevatorsRowElement.appendChild(elevatorElement);
        }

        container.appendChild(buildingElement);
    }

    findNearestElevator(callingFloor: Floor): Elevator {
        let minTime = Infinity;
        let nearestElevator: Elevator = this.elevators[0];

        for (const elevator of this.elevators) {
            let time = this.calculateTravelTime(elevator, callingFloor);

            if (time < minTime) {
                minTime = time;
                nearestElevator = elevator;
            }
        }

        const { timer } = callingFloor;
        timer.startTimer(minTime);

        return nearestElevator;
    }

    private calculateTravelTime(elevator: Elevator, callingFloor: Floor): number {
    let time = 0;

    if (elevator.destinationFloors.length > 0) {
        const lastDestinationFloor = elevator.destinationFloors[elevator.destinationFloors.length - 1];
        const remainingTimeOnTimer = lastDestinationFloor.timer.remainingTime ?? 0;
        time += remainingTimeOnTimer + 2;
        time += Math.abs(lastDestinationFloor.number - callingFloor.number) * 0.5;
        } else {
            time += Math.abs(elevator.currentFloor - callingFloor.number) * 0.5;
        }

    return time;
}

}

class Floor {
    number: number;
    callButton: CallButton;
    timer: Timer;
    building: Building;

    constructor(number: number, building: Building) {
        this.number = number;
        this.callButton = new CallButton(this);
        this.timer = new Timer(this);
        this.building = building;
    }

    changeColor() {
        const { button } = this.callButton;
        if (button.style.color === 'green') {
            button.style.color = 'hsla(0, 0%, 15%, 0.8)';
        } else {
            button.style.color = 'green'; 
        }
    }

    playArrivalSound() {
        const audio = new Audio('ding.mp3');
        audio.play();
    }

    callElevator() {
        const elevator = this.building.findNearestElevator(this);
        if (this.anElevatorOnFloor() || this.anElevatorEnRoute()) {
            console.log(`An elevator is already present or en route to floor ${this.number}.`);
        } else {
            this.changeColor();
            elevator.call(this);
            console.log(`Elevator ${elevator.number} called to floor ${this.number}`);
        }
    }

    private anElevatorOnFloor(): boolean {
        for (const elevator of this.building.elevators) {
            if (elevator.currentFloor === this.number) {
                return true;
            }
        }
        return false;
    }

    private anElevatorEnRoute(): boolean {
        for (const elevator of this.building.elevators) {
            for (const floor of elevator.destinationFloors) {
                if (floor.number === this.number) {
                    return true;
                }
            }
        }
        return false;
    }
}

class CallButton {
    number: number;
    button: HTMLButtonElement;

    constructor(floor: Floor) {
        this.number = floor.number;
        this.button = this.createButton(floor);
    }

    createButton(floor: Floor): HTMLButtonElement {
        const button = document.createElement("button");
        button.innerText = `${this.number}`;
        button.onclick = () => {
            floor.callElevator();
        };
        button.classList.add("metal", "linear");
        return button;
    }
}

class elevatorFactory {
    static createElevator(i: number, numFloors: number, building: Building) {
        if (i % 3 === 0) {
            return new lowerElevator(i, building);
        } else if (i % 3 === 1) {
            return new middleElevator(i, numFloors, building);
        } else {
            return new upperElevator(i, numFloors, building);
        }
    }
}

abstract class Elevator {
    number: number;
    currentFloor: number;
    destinationFloors: Floor[];
    elevatorImg: HTMLImageElement;
    building: Building;

    constructor(number: number, building: Building) {
        this.number = number;
        this.currentFloor = 7;
        this.destinationFloors = [];
        this.elevatorImg = this.createElevatorImg();
        this.building = building;
    }

    call(floor: Floor) {
        this.destinationFloors.push(floor);
        this.move();
    }

    private createElevatorImg() {
        const elevatorElement = document.createElement("img");
        elevatorElement.classList.add("elevator-img");
        elevatorElement.src = 'elv.png';
        elevatorElement.id = `elevator-${this.number}`;
        return elevatorElement;
    }

    protected move() {
        if (this.destinationFloors.length > 0) {
            const nextFloor = this.getNextFloor().number;

            if (this.currentFloor === nextFloor) {
                console.log(`Elevator ${this.number} arrived at floor ${this.currentFloor}`);
                return;
            }

            const floorsToMove = Math.abs(this.currentFloor - nextFloor);
            const transitionDuration = 0.5 * floorsToMove;

            const elevatorElement = this.elevatorImg;
            elevatorElement.style.transition = `top ${transitionDuration}s ease`;

            this.currentFloor = nextFloor;
            this.updateElevatorPosition();

            console.log(`Elevator ${this.number} moving to floor ${this.currentFloor}`);

            setTimeout(() => {
                this.handleArrival();
                setTimeout(() => {
                    this.destinationFloors.shift();
                    this.move();
                }, 2000)
            }, transitionDuration * 1000);
        }
    }

    protected updateElevatorPosition() {
        const elevatorElement = this.elevatorImg;
        const floorHeight = 47; // Height of each floor in pixels
        // const numFloors = this.building.numFloors; // Total number of floors
        const topPosition = floorHeight * (this.currentFloor); // Calculate the correct top position
        elevatorElement.style.top = `${topPosition}px`;
    }
    

    protected handleArrival() {
        const { currentFloor } = this;
        const floor = this.building.floors[currentFloor];
        if (floor) {
            floor.changeColor();
            floor.playArrivalSound();
        }
    }

    protected getNextFloor(): Floor {
        return this.destinationFloors[0];
    }
}

class lowerElevator extends Elevator {
    constructor(number: number, building: Building) {
        super(number, building);
        this.currentFloor = 0;
    }
}

class upperElevator extends Elevator {
    constructor(number: number, numFloors: number, building: Building) {
        super(number, building);
        this.currentFloor = numFloors - 1;
    }
}

class middleElevator extends Elevator {
    constructor(number: number, numFloors: number, building: Building) {
        super(number, building);
        this.currentFloor = Math.floor((numFloors - 1) / 2);
    }
}

class Timer {
    number: number;
    remainingTime: number | null;
    timerElement: HTMLElement;

    constructor(floor: Floor) {
        this.number = floor.number;
        this.remainingTime = null;
        this.timerElement = this.createTimer(floor);
    }

    createTimer(floor: Floor): HTMLElement {
        const timerElement = document.createElement('div');
        timerElement.id = `timer-${floor.number}`;
        timerElement.classList.add('timer');
        timerElement.style.display = 'none';
        return timerElement;
    }

    startTimer(remainingTime: number) {
        if (remainingTime > 0) {
            this.remainingTime = remainingTime;
            this.timerElement.style.display = 'block'; 
            this.timerElement.innerText = `${Math.floor(this.remainingTime)}`;

            const interval = setInterval(() => {
                if (this.remainingTime === null || this.remainingTime <= 0) {
                    clearInterval(interval);
                    this.timerElement.style.display = 'none'; 
                } else {
                    this.remainingTime -= 0.5;
                    this.timerElement.innerText = `${Math.floor(this.remainingTime)}`;
                }
            }, 500);
        }
    }
}

const systemManager = new SystemManager();
systemManager.initialize();
