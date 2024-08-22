document.addEventListener("DOMContentLoaded", () => {
    initProjectCard();

    function initProjectCard() {
        const projectContainer = document.getElementById("projectContainer");

        projectContainer.addEventListener("click", (e) => {
            projectContainer.style.display = "none";
        });
    }
});