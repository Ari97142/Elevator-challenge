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
}

const systemManager = new SystemManager();
systemManager.initialize();