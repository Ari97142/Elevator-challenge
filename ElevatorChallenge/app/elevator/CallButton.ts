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