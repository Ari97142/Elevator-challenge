import {Floor} from './Floor';

export class Timer {
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
