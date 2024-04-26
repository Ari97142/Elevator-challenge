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
        this.elevators = Array.from({ length: numElevators }, (_, i) => {
            if (i % 3 === 0) {
                // Create a separate elevators always waiting at the different floors. 
                return new upperElevator(i, numFloors - 1);
            } else if (i % 3 === 2) {
                return new lowerElevator(i);
            } else {
                return new middleElevator(i, (numFloors - 1) / 2);
            }
        });
    }
    
    displayBuilding() {
        const buildingElement = document.getElementById("building")!;
        for (const floor of this.floors) {
            const floorElement = document.createElement("div");
            floorElement.classList.add("floor");
            
            // Create button element
            const button = document.createElement("button");
            button.innerText = `Floor ${floor.number}`;
            button.onclick = () => floor.callElevator(floor.number); 
            floorElement.appendChild(button);
            
            buildingElement.appendChild(floorElement);
        }
    }
    
    findNearestElevator(floor: number): Elevator {
        let minDistance = Infinity;
        let nearestElevator: Elevator = this.elevators[0];
        for (const elevator of this.elevators) {
            const totalFloors = Math.abs(elevator.currentFloor - floor);
            const totalTime = elevator.destinationFloors.length * 2;
            const distance = totalFloors + totalTime;
            if (distance < minDistance) {
                minDistance = distance;
                nearestElevator = elevator;
            }
        }
        return nearestElevator;
    }
}

class Floor {
    number: number;
    callButton: CallButton;

    constructor(number: number) {
        this.number = number;
        this.callButton = new CallButton();
    }

    callElevator(floor: number) {
        const elevator = building.findNearestElevator(floor);
            elevator.call(floor);
            console.log(`Elevator ${elevator.number} called to floor ${floor}`);
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

    abstract call(floor: number): void;

    protected moveLock() {
        if (this.destinationFloors.length > 0) {
            const nextFloor = this.getNextFloor();
            if (nextFloor === this.currentFloor) {
                console.log("Elevator is already at the destination floor.");
                return;
            }
            const floorsToMove = Math.abs(this.currentFloor - nextFloor);
            console.log(this.destinationFloors)
            setTimeout(() => {
                this.currentFloor = nextFloor;
                console.log(`Elevator ${this.number} arrived at floor ${this.currentFloor}`);
                this.destinationFloors.shift(); 
                this.moveLock();
            }, floorsToMove * 1000);
        }
    }
    
    protected abstract getNextFloor(): number;
}

class lowerElevator extends Elevator {
    call(floor: number) {
        this.destinationFloors.push(floor);
        this.moveLock();
    }

    protected getNextFloor(): number {
        
        return this.destinationFloors[0];
    }
}

class upperElevator extends Elevator {
    constructor(number: number, currentFloor: number) {
        super(number);
        this.currentFloor = currentFloor;
    }

    call(floor: number) {
        this.destinationFloors.push(floor);
        this.moveLock();
    }

    protected getNextFloor(): number {
        // Ninja elevator always waits at the top floor
        return this.destinationFloors[0];
    }
}

class middleElevator extends Elevator {
    constructor(number: number, currentFloor: number) {
        super(number);
        this.currentFloor = currentFloor;
    }

    call(floor: number) {
        this.destinationFloors.push(floor);
        this.moveLock();
    }

    protected getNextFloor(): number {
        
        return this.destinationFloors[0];
    }
}

class CallButton {
    color: string;

    constructor() {
        this.color = "normal";
    }
}

const building = new Building(15, 3);
building.displayBuilding();
