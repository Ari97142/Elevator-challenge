
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
        const numFloors = this.building.numFloors; // Total number of floors
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