"use strict";
exports.__esModule = true;
exports.BuildingManager = void 0;
var Building_1 = require("./Building");
var BuildingManager = /** @class */ (function () {
    function BuildingManager() {
        this.buildings = [];
    }
    BuildingManager.prototype.promptForBuildingDetails = function () {
        var numFloors = parseInt(prompt('Enter number of floors:') || '0');
        var numElevators = parseInt(prompt('Enter number of elevators:') || '0');
        if (numFloors > 0 && numElevators > 0) {
            this.addBuilding(numFloors, numElevators);
        }
        else {
            alert('Invalid input. Please enter positive integers.');
        }
    };
    BuildingManager.prototype.addBuilding = function (numFloors, numElevators) {
        var building = new Building_1.Building(numFloors, numElevators);
        this.buildings.push(building);
        var buildingContainer = document.getElementById('building-container');
        if (buildingContainer) {
            building.displayBuilding(buildingContainer);
        }
    };
    return BuildingManager;
}());
exports.BuildingManager = BuildingManager;
