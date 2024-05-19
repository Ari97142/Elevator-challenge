
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
