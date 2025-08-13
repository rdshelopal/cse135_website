document.addEventListener("DOMContentLoaded", () => {
    const projectsContainer = document.querySelector(".projects-container");
    const localButton = document.getElementById("load-local");
    const remoteButton = document.getElementById("load-remote");

    // Check if localStorage has projects, if not, fetch from projects.json
    if (!localStorage.getItem("projects")) {
        fetch("projects.json")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("projects", JSON.stringify(data)); // Store in localStorage
                console.log("✅ Projects saved to localStorage.");
            })
            .catch(error => console.error("❌ Error loading projects.json:", error));
    }

    // Function to create a project card dynamically
    function createProjectCard(project) {
        const card = document.createElement("project-card");
        card.setAttribute("title", project.title);
        card.setAttribute("image", project.image);
        card.setAttribute("alt", project.alt);
        card.setAttribute("description", project.description);
        card.setAttribute("link", project.link);
        return card;
    }

    // Function to load projects from localStorage
    function loadLocalProjects() {
        projectsContainer.innerHTML = ""; // Clear existing cards
        const storedProjects = JSON.parse(localStorage.getItem("projects"));
        if (storedProjects) {
            storedProjects.forEach(project => {
                projectsContainer.appendChild(createProjectCard(project));
            });
        } else {
            console.error("❌ No projects found in localStorage.");
        }
    }

    // Function to load projects from a remote API (JSONBin)
    function loadRemoteProjects() {
        projectsContainer.innerHTML = ""; // Clear existing cards
        fetch("https://api.jsonbin.io/v3/b/67d51b678a456b7966761edf")
            .then(response => response.json())
            .then(data => {
                data.record.forEach(project => {
                    projectsContainer.appendChild(createProjectCard(project));
                });
            })
            .catch(error => console.error("❌ Error loading remote data:", error));
    }

    // Attach event listeners
    localButton.addEventListener("click", loadLocalProjects);
    remoteButton.addEventListener("click", loadRemoteProjects);

    // Automatically load projects on page refresh
   // loadLocalProjects();
});