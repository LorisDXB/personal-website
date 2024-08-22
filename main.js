let knownLanguages = [
    "C",
    "Lua",
    "JS",
    "Html",
    "Css"
];

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://leetcode-stats-api.herokuapp.com/moosasaur")
        .then(response => {
            if (!response.ok) {
                throw new Error("couldn't fetch leetcode data");
            } else {
                return response.json();
            }
        })
        .then(data => {
            loadLeetCodeStats(data);
        })
    
    loadFilters();
    fetch("projects.json").then(response => {
        if (!response.ok) {
            throw new Error("couldn't fetch the Json");
        }
        response.json()
        .then(data => loadProjects(data));
    })

    function loadLeetCodeStats(leetCodeStats) {
        const stats = document.getElementById("statistics");
        const hardSpan = document.getElementById("hard");
        const mediumSpan = document.getElementById("medium");
        const easySpan = document.getElementById("easy");
        const allSpan = document.getElementById("all");

        let total = leetCodeStats["hardSolved"] + leetCodeStats["mediumSolved"] + leetCodeStats["easySolved"];

        hardSpan.innerHTML = leetCodeStats["hardSolved"];
        mediumSpan.innerHTML = leetCodeStats["mediumSolved"];
        easySpan.innerHTML = leetCodeStats["easySolved"];
        allSpan.innerHTML = total;
        stats.style.display = "flex";
    } 

    function loadFilters() {
        const filter = document.getElementById("filterContainer");

        for (let i = 0; i < knownLanguages.length; i++) {
            filter.append(initInput(filter, knownLanguages[i]));
        }
    }
    
    function initInput(filter, lang) {
        const parameterDiv = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");

        input.type = "checkbox";
        input.name = "language";
        input.name = lang;
        label.innerHTML = lang;

        parameterDiv.append(label);
        parameterDiv.append(input);
        parameterDiv.classList.add("parameter");
        return parameterDiv
    }

    function loadProjects(jsonData) {
        const main = document.getElementById("main");

        for (let i = 0; i < jsonData.length; i++) {
            main.append(initProject(jsonData[i], i));
        }
    }

    function initProject(projectData, i) {
        const projectDiv = document.createElement("div");
        const langText = document.createElement("span");
        const nameText = document.createElement("span");

        langText.textContent = projectData["lang"];
        langText.classList.add("langText");
        nameText.textContent = projectData["name"];
        nameText.classList.add("nameText");

        projectDiv.append(langText);
        projectDiv.append(nameText);
        projectDiv.classList.add("project");
        for (let i = 0; i < projectData["lang"].length; i++) {
            projectDiv.classList.add(projectData["lang"][i]);
        }

        projectDiv.addEventListener("click", function() {
            spawnProjectPage(projectData);
        });
        if (i % 2 == 0) {
            projectDiv.classList.add("even");
        } else {
            projectDiv.classList.add("odd");
        }
        projectDiv.classList.add("button");
        return projectDiv;
    }

    function spawnProjectPage(projectData) {
        const projectContainer = document.getElementById("projectContainer");
        const projectName = document.getElementById("projectName");
        const projectInfo = document.getElementById("projectInfoText");
        const projectPreview = document.getElementById("previewImage");
        const projectSkills = document.getElementById("projectSkills");
        const projectLink = document.getElementById("projectLink");

        projectContainer.style.display = "flex";
        projectName.textContent = `Project: ${projectData["name"]}`;
        projectInfo.textContent = projectData["info"];
        projectPreview.src = projectData["preview"];
        projectPreview.onerror = function() {
            projectPreview.src = "assets/preview/fallback.png";
        };
        projectSkills.innerHTML = "";
        for (let i = 0; i < projectData["lang"].length; i++) {
            const langIcon = document.createElement("img");

            langIcon.classList.add("skillIcon");
            langIcon.src = `assets/img/${projectData["lang"][i]}.png`;
            projectSkills.append(langIcon);
        }
        projectLink.href = projectData["link"]; 
    }
});