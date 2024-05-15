class Building {
    numFloors: number;
    numElevators: number;
    floors: Floor[];
    elevators: Elevator[];

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
            const {timerElement} = floor.timer;   
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
    }

    findNearestElevator(callingFloor: Floor): Elevator {
        let minTime = Infinity;
        let nearestElevator: Elevator = this.elevators[2];
        for (const elevator of this.elevators) {
            let time: number = 0;
            // Calculate time to travel between all consecutive floors
            for (let i = 0; i < elevator.destinationFloors.length - 1; i++) {
                const currentFloor: number = elevator.destinationFloors[i].number;
                const nextFloor: number = elevator.destinationFloors[i + 1].number;
                time += Math.abs(currentFloor - nextFloor);
            }
            // Calculate time to travel from the last destination floor to the calling floor
            let lastFloor: number;
            if (elevator.destinationFloors.length > 0) {
                lastFloor = elevator.destinationFloors[elevator.destinationFloors.length - 1].number;
            } else {
                lastFloor = elevator.currentFloor; // If destinationFloors is empty, set lastFloor to currentFloor
            }
            time += Math.abs(lastFloor - callingFloor.number)
            // Calculate total all breaks time
            const totalBreaks = elevator.destinationFloors.length * 2;
            time += totalBreaks;
            if (time < minTime) {
                minTime = time;
                nearestElevator = elevator;
            }
        }
        // Create and start the timer
        const {timer} = callingFloor;
        timer.startTimer(minTime) ;

        return nearestElevator;
    }
}

class Floor {
    number: number;
    callButton: CallButton;
    timer: Timer;

    constructor(number: number) {
        this.number = number;
        this.callButton = new CallButton(this);
        this.timer = new Timer(this);
    }

    // Function to change the color of the button text when clicked
    changeColor() {
        const {button} = this.callButton;
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
        const elevator = building.findNearestElevator(this);
        if (this.anElevatorOnFloor()) {
            console.log(`An elevator is already present on floor ${this.number}.`);
        } else {
            this.changeColor();
            elevator.call(this);
            console.log(`Elevator ${elevator.number} called to floor ${this.number}`);
            
        }
    }

    private anElevatorOnFloor(): boolean {
        for (const elevator of building.elevators) {
            if (elevator.currentFloor === this.number) {
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
                floor.callElevator();
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
    destinationFloors: Floor[];
    elevatorImg: HTMLImageElement;

    constructor(number: number) {
        this.number = number;
         this.currentFloor = 7;
        this.destinationFloors = [];
        this.elevatorImg = this.createElevatorImg();
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
                // this.destinationFloors.shift();
                // this.handleArrival();
                // this.move();
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
                this.destinationFloors.shift();
                this.handleArrival();
                this.move();
            }, transitionDuration * 1000);
        }
    }
    
    protected updateElevatorPosition() {
        const elevatorElement = this.elevatorImg;
        const floorHeight = 47;
        const topPosition = floorHeight * this.currentFloor;
        elevatorElement.style.top = `${topPosition}px`;
    }
    

    protected handleArrival() {
        const { currentFloor } = this;
        const floor = building.floors[currentFloor];
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

    constructor(number: number) {
        super(number);
        this.currentFloor = 0;
    }
}

class upperElevator extends Elevator {
    defaultPosition: number;

    constructor(number: number, numFloors: number) {
        super(number);
        this.currentFloor = numFloors - 1;
    }
}

class middleElevator extends Elevator {
    defaultPosition: number;

    constructor(number: number, numFloors: number) {
        super(number);
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

            const interval = setInterval(() => {
                if (this.remainingTime === null || this.remainingTime <= 0) {
                    clearInterval(interval);
                    this.timerElement.style.display = 'none'; 
                } else {
                    this.timerElement.innerText = `${this.remainingTime}`;
                    this.remainingTime--;
                }
            }, 1000);
        }
    }
}



const building = new Building(15, 3);
building.displayBuilding();
