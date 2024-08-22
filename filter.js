document.addEventListener("DOMContentLoaded", () => {
    let currentFilters = new Map();
    const filter = document.getElementById("filterContainer");
    const main = document.getElementById("main");

    filter.addEventListener("change", (e) => {
        const filterReq = e.target.getAttribute("name");

        if (!currentFilters.has(filterReq)) {
            currentFilters.set(filterReq, true);
        } else {
            currentFilters.delete(filterReq);
        }
        reloadProjects(currentFilters);
    });

    function reloadProjects(currentFilters) {
        let projects = main.children;
        
        for (let i = 0; i < projects.length; i++) {
            if (currentFilters.size) {
                const classList = Array.from(projects[i].classList);

                let hasFilter = classList.some(element => currentFilters.has(element));

                projects[i].style.display = hasFilter ? "flex" : "none";
            } else {
                projects[i].style.display = "flex";
            }
        }
    }
})
