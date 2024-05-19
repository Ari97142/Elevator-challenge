"use strict";
exports.__esModule = true;
var BuildingManager_1 = require("./classes/BuildingManager");
// import config from '../app/config/buildingConfig.json';
var SystemManager = /** @class */ (function () {
    function SystemManager() {
        this.buildingManager = new BuildingManager_1.BuildingManager();
    }
    SystemManager.prototype.initialize = function () {
        var addBuildingBtn = document.getElementById('add-building-btn');
        addBuildingBtn === null || addBuildingBtn === void 0 ? void 0 : addBuildingBtn.addEventListener('click', this.buildingManager.promptForBuildingDetails.bind(this.buildingManager));
        this.buildingManager.addBuilding(15, 3);
    };
    return SystemManager;
}());
var systemManager = new SystemManager();
systemManager.initialize();
