import * as config from "./config.js";
import {initCatalog} from "./modules/catalog.js";
import {initPlugs} from "./modules/plugs.js";

document.addEventListener("DOMContentLoaded", () => {
    initCatalog(config.projectDataFile);
    initPlugs(config.plugDataFile); 
});