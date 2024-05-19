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