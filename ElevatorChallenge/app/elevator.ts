class Building {
    numFloors: number;
    numElevators: number;
    floors: Floor[];
    elevators: Elevator[];
    elevatorImg: HTMLImageElement;

    constructor(numFloors: number, numElevators: number) {
        this.numFloors = numFloors;
        this.numElevators = numElevators;
        this.floors = Array.from({ length: numFloors }, (_, i) => new Floor(i));
        this.elevators = Array.from({ length: numElevators }, (_, i) => elevatorFactory.createElevator(i, numFloors));
    }

    displayBuilding() {
        const buildingElement = document.getElementById("building")!;
        buildingElement.style.setProperty('--numElevators', `${this.numElevators}`);

        const elevatorsRowElement = document.createElement("div");
        elevatorsRowElement.classList.add("elevators-row");

        const floorsElement = document.createElement("div");
        floorsElement.classList.add("floors");

        for (const floor of this.floors) {
            const floorElement = document.createElement("div");
            floorElement.classList.add("floor");

            const {button} = floor.callButton;     
            floorElement.appendChild(button);

            floorsElement.appendChild(floorElement);
        }

        buildingElement.appendChild(elevatorsRowElement);
        buildingElement.appendChild(floorsElement);

        for (let i = 0; i < this.elevators.length; i++) {
            const elevatorElement = document.createElement("img");
            elevatorElement.classList.add("elevator-img");
            elevatorElement.src = 'elv.png';
            elevatorElement.id = `elevator-${i}`;
            elevatorElement.style.setProperty('--currentFloor', `${this.elevators[i].currentFloor}`);
            elevatorsRowElement.appendChild(elevatorElement);
        }
    }

    findNearestElevator(callingFloor: number): Elevator {
        let minTime = Infinity;
        let nearestElevator: Elevator = this.elevators[2];
        for (const elevator of this.elevators) {
            let time: number = 0;
            // Calculate time to travel between all consecutive floors
            for (let i = 0; i < elevator.destinationFloors.length - 1; i++) {
                const currentFloor: number = elevator.destinationFloors[i];
                const nextFloor: number = elevator.destinationFloors[i + 1];
                time += Math.abs(currentFloor - nextFloor);
            }
            // Calculate time to travel from the last destination floor to the calling floor
            let lastFloor: number;
            if (elevator.destinationFloors.length > 0) {
                lastFloor = elevator.destinationFloors[elevator.destinationFloors.length - 1];
            } else {
                lastFloor = elevator.currentFloor; // If destinationFloors is empty, set lastFloor to currentFloor
            }
            time += Math.abs(lastFloor - callingFloor)
            // Calculate total all breaks time
            const totalBreaks = elevator.destinationFloors.length * 2;
            time += totalBreaks;
            if (time < minTime) {
                minTime = time;
                nearestElevator = elevator;
            }
        }
         // Create and start the timer
         const timer = new Timer(callingFloor, minTime - 2); 
         timer.startTimer();

        return nearestElevator;
    }
}

class Floor {
    number: number;
    callButton: CallButton;

    constructor(number: number) {
        this.number = number;
        this.callButton = new CallButton(this);
    }

    // Function to change the color of the button text when clicked
    changeColor(button: HTMLButtonElement) {
        if (button.style.color === 'green') {
            button.style.color = 'hsla(0, 0%, 15%, 0.8)';
        } else {
            button.style.color = 'green'; // Change text color to green
        }
    }

    playArrivalSound() {
        const audio = new Audio('ding.mp3');
        audio.play();
    }

    callElevator(floor: number) {
    const elevator = building.findNearestElevator(floor);
    if (this.anElevatorOnFloor(floor)) {
        console.log(`An elevator is already present on floor ${floor}.`);
    } else {
        this.changeColor(this.callButton.button);
        elevator.call(floor);
        console.log(`Elevator ${elevator.number} called to floor ${floor}`);
        
    }
}


    private anElevatorOnFloor(floor: number): boolean {
        for (const elevator of building.elevators) {
            if (elevator.currentFloor === floor) {
                return true; 
            }
        }
        return false; 
    }
}

class CallButton {
    number: number
    button: HTMLButtonElement;

    constructor(floor: Floor) {
        this.number = floor.number;
        this.button = this.createButton(floor)
    }

    createButton(floor: Floor): HTMLButtonElement {
        const button = document.createElement("button");
        button.innerText = `${this.number}`;
        button.onclick = () => {
                floor.callElevator(floor.number);
            };
        button.classList.add("metal", "linear");
        return button;
    }
}


class elevatorFactory {
    static createElevator(i: number, numFloors: number) {
        if (i % 3 === 0) {
            return new lowerElevator(i);
        }
        else if (i % 3 === 1) {
            return new middleElevator(i, numFloors);
        }
        else {
            return new upperElevator(i, numFloors);
        }
    }
}

abstract class Elevator {
    number: number;
    currentFloor: number;
    destinationFloors: number[];

    constructor(number: number) {
        this.number = number;
        this.currentFloor = 0;
        this.destinationFloors = [];
    }

    call(floor: number) {
        this.destinationFloors.push(floor);
        this.moveLock();
    }

    protected updateElevatorPosition() {
        const elevatorElement = document.getElementById(`elevator-${this.number}`) as HTMLElement;
        if (elevatorElement) {
            const floorHeight = 47;
            const topPosition = floorHeight * this.currentFloor;
            elevatorElement.style.top = `${topPosition}px`;
        }
    }

    protected moveLock() {
        if (this.destinationFloors.length > 0) {
            const nextFloor = this.getNextFloor();
            if (nextFloor === this.currentFloor) {
                console.log("Elevator is already at the destination floor.");
                return;
            }

            const floorsToMove = Math.abs(this.currentFloor - nextFloor);
            const transitionDuration = 0.5;

            this.currentFloor = nextFloor;
            this.updateElevatorPosition();
            console.log(`Elevator ${this.number} arrived at floor ${this.currentFloor}`);

            const elevatorElement = document.getElementById(`elevator-${this.number}`) as HTMLElement;
            elevatorElement.style.transition = `top ${floorsToMove * transitionDuration}s ease`;

            setTimeout(() => {
                this.destinationFloors.shift();
                this.moveLock();
            }, (floorsToMove * transitionDuration * 1000));
            setTimeout(() => {
                this.handleArrival();
            }, 2000);

        }
    }


    private handleArrival() {
        const { currentFloor } = this;
        const floor = building.floors[currentFloor];
        if (floor) {
            floor.changeColor(floor.callButton.button);
            floor.playArrivalSound();
        }
    }

    protected getNextFloor(): number {
        return this.destinationFloors[0];
    }
}

class lowerElevator extends Elevator {
    defaultPosition: number = 0;

    constructor(number: number) {
        super(number);
       

        this.currentFloor = this.defaultPosition;
    }
}

class upperElevator extends Elevator {
    defaultPosition: number;

    constructor(number: number, numFloors: number) {
        super(number);
        this.defaultPosition = numFloors - 1;
        this.currentFloor = this.defaultPosition;
    }
}

class middleElevator extends Elevator {
    defaultPosition: number;

    constructor(number: number, numFloors: number) {
        super(number);
        this.defaultPosition = Math.floor((numFloors - 1) / 2);
        this.currentFloor = this.defaultPosition;
    }
}

class Timer {
    floor: number;
    remainingTime: number;
    timerElement: HTMLElement;

    constructor(floor: number, remainingTime: number) {
        this.floor = floor;
        this.remainingTime = remainingTime;
        this.timerElement = document.createElement('div');
        this.timerElement.id = `timer-${floor}`;
        this.timerElement.classList.add('timer');
        document.body.appendChild(this.timerElement);
    }

    startTimer() {
        const interval = setInterval(() => {
            if (this.remainingTime <= 0) {
                clearInterval(interval);
                this.timerElement.innerText = 'Elevator arrived';
            } else {
                this.timerElement.innerText = `Time remaining: ${this.remainingTime} seconds`;
                this.remainingTime--;
            }
        }, 1000);
    }
}


const building = new Building(15, 3);
building.displayBuilding();
