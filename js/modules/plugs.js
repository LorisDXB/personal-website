import {retrieveData} from "./catalog.js";

export function initPlugs(dataFile) {
    retrieveData(dataFile)
    .then(dataSet => {
        if (!dataSet) return null;
        console.log("data retrieved:", dataSet);

        loadPlugs(dataSet);
    });
}

function loadPlugs(dataSet) {
    let plugBar = document.getElementById("plugBar");

    dataSet.forEach(plug => {
        let plugLogo = document.createElement("img");

        plugLogo.src = plug["logo"];
        plugLogo.classList.add("plugLogo");
        plugBar.append(plugLogo);
        plugLogo.addEventListener("click", () => {
            window.location = plug["link"];
        });
    });
}