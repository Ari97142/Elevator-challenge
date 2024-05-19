# Building and Elevator Simulation Project

## Description
This project simulates a building with multiple floors and elevators using JavaScript/TypeScript. It includes classes for managing buildings, floors, and elevators, allowing simulation and control of elevator movements and interactions.

## Classes

### Building
Manages the overall structure and properties of a building, including the number of floors and elevators.

### Floor
Represents each floor in the building, handling properties such as floor number and interactions with elevators.

### Elevator
Controls the behavior and movement of each elevator, including current position, and serving floor requests.

## Elevator Algorithm Description

### SCAN Algorithm
The system efficiently finds the nearest elevator to a calling floor using the following algorithm:

Initialization: When a floor calls an elevator, the system calculates the estimated time for each available elevator to reach the floor.
Calculation: For each elevator, the system considers the current floor of the elevator and any destinations it currently has. It calculates the travel time based on the remaining time of the last destination and the distance to the calling floor.

Selection: The system selects the elevator with the shortest calculated time as the nearest one to respond to the call.

Timer Start: Upon selecting the nearest elevator, the system starts a timer to simulate the arrival time.
