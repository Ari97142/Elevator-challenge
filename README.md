
# Code Specification Document

## Overview:

The provided code simulates a building with multiple floors and elevators. It allows users to call an elevator from any floor and simulates the movement of the elevator to fulfill the request.

## Classes:

1. **Building**:
   - Attributes:
     - `numFloors`: Number of floors in the building.
     - `numElevators`: Number of elevators in the building.
     - `floors`: Array containing instances of the `Floor` class.
     - `elevators`: Array containing instances of the `Elevator` class.
   - Methods:
     - `constructor(numFloors, numElevators)`: Initializes the building with the specified number of floors and elevators.
     - `displayBuilding()`: Displays the building by creating floor elements with call buttons for each floor.
     - `findNearestElevator(floor)`: Finds the nearest elevator to a specified floor using the nearest algorithm.

2. **Floor**:
   - Attributes:
     - `number`: Floor number.
     - `callButton`: Instance of the `CallButton` class.
   - Methods:
     - `constructor(number)`: Initializes the floor with a specified number.
     - `callElevator(floor)`: Calls the nearest elevator to the specified floor.

3. **Elevator** (Abstract class):
   - Attributes:
     - `number`: Elevator number.
     - `currentFloor`: Current floor of the elevator.
     - `destinationFloors`: Array containing the destination floors of the elevator.
     - `defaultPosition`: Default position of the elevator.
   - Methods:
     - `call(floor)`: Abstract method to call the elevator to a specified floor.
     - `moveLock()`: Controls the movement of the elevator based on its destination floors.
     - `getNextFloor()`: Abstract method to determine the next floor the elevator should move to.

4. **LowerElevator**, **MiddleElevator**, **UpperElevator** (Concrete subclasses of Elevator):
   - Methods:
     - `call(floor)`: Adds the specified floor to the destination floors of the elevator.
     - `getNextFloor()`: Retrieves the next floor from the destination floors array.

5. **CallButton**:
   - Attributes:
     - `color`: Color of the call button (normal state).
   - Methods:
     - `constructor()`: Initializes the call button with a normal color.

## Nearest Elevator Algorithm:

The `findNearestElevator(floor)` method in the `Building` class implements the algorithm to find the nearest elevator to a specified floor:
1. It calculates the total breaks (stops) required for each elevator based on its destination floors.
2. For each elevator, it calculates the total distance (in floors) from its current position to the specified floor, including the breaks.
3. It selects the elevator with the minimum total distance as the nearest one.

---
