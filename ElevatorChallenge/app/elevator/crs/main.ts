import { BuildingManager } from './classes/BuildingManager';
// import config from '../app/config/buildingConfig.json';

class SystemManager {
    buildingManager: BuildingManager;

    constructor() {
        this.buildingManager = new BuildingManager();
    }

    initialize() {
        const addBuildingBtn = document.getElementById('add-building-btn');
        addBuildingBtn?.addEventListener('click', this.buildingManager.promptForBuildingDetails.bind(this.buildingManager));

        this.buildingManager.addBuilding(15, 3);
    }

    // addBuildingsFromConfig() {
    //     config.buildings.forEach((building: { id: number, floors: number, elevators: number }) => {
    //         this.buildingManager.addBuilding(building.floors, building.elevators);
    //     });
    // }
}

const systemManager = new SystemManager();
systemManager.initialize();
