/* The above TypeScript code defines classes for a building with multiple floors and elevators,
allowing users to call the nearest elevator from a floor. */
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
        for (const floor of this.floors) {
            const floorElement = document.createElement("div");
            floorElement.classList.add("floor");
            
    
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
            const TotalBreaks = elevator.destinationFloors.length * 2;
    
            let distance: number = 0; 
            for (let i = 0; i < elevator.destinationFloors.length - 1; i++) { 
                const currentFloor: number = elevator.destinationFloors[i];
                const nextFloor: number = elevator.destinationFloors[i + 1];
                // calculate absolute distance between each pair of consecutive floors.
                distance += Math.abs(currentFloor - nextFloor);
                console.log(`the distance between ${currentFloor} to  ${nextFloor} is ${distance}`);
            }
            // console.log(`Elevator ${elevator.number} distance is  ${distance}`);
            // calculate absolute distance between last destination floor to the calling floor.
            distance += Math.abs(elevator.destinationFloors[elevator.destinationFloors.length - 1] - floor); 
            distance += TotalBreaks;
            console.log(`Elevator ${elevator.number} distance is  ${distance}`);
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

class elevatorFactory  {
    static createElevator (i: number, numFloors: number){
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
        this.currentFloor = 0; // Initialize currentFloor to 0
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
            console.log(this.destinationFloors);
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
    defaultPosition: number = 0;

    constructor(number: number) {
        super(number);
        this.currentFloor = this.defaultPosition; 
    }

    call(floor: number) {
        this.destinationFloors.push(floor);
        this.moveLock();
    }

    protected getNextFloor(): number {
        return this.destinationFloors[0];
    }
}

class upperElevator extends Elevator {
    defaultPosition: number;

    constructor(number: number, numFloors: number) {
        super(number);
        this.defaultPosition = numFloors - 1;
        this.currentFloor = this.defaultPosition; 
    }

    call(floor: number) {
        this.destinationFloors.push(floor);
        this.moveLock();
    }

    protected getNextFloor(): number {
        return this.destinationFloors[0];
    }
}

class middleElevator extends Elevator {
    defaultPosition: number;

    constructor(number: number, numFloors: number) {
        super(number);
        this.defaultPosition = Math.floor((numFloors - 1) / 2);
        this.currentFloor = this.defaultPosition; 
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
