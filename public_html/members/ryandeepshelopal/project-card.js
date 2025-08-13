class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--card-border, #ddd);
                    border-radius: 8px;
                    padding: 16px;
                    max-width: 350px;
                    background: var(--card-bg, white);
                    color: var(--card-text, black);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease-in-out;
                }
                :host(:hover) {
                    transform: scale(1.05);
                }
                 h2 {
                    font-size: 1.2em;
                    margin: 0 0 10px 0;
                }
                img {
                    width: 100%;  /* Ensures image fills container */
                    height: 200px; /* Set a fixed height */
                    object-fit: cover; /* Crop and maintain aspect ratio */
                    border-radius: 4px;
                }
                p {
                    font-size: 1em;
                }
                a {
                    text-decoration: none;
                    color: blue;
                    font-weight: bold;
                }
            </style>
            <h2></h2>
            <img src="" alt="">
            <p></p>
            <a href="#" target="_blank">Github</a>
        `;
    }

    static get observedAttributes() {
        return ["title", "image", "alt", "description", "link"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") this.shadowRoot.querySelector("h2").textContent = newValue;
        if (name === "image") this.shadowRoot.querySelector("img").src = newValue;
        if (name === "alt") this.shadowRoot.querySelector("img").alt = newValue;
        if (name === "description") this.shadowRoot.querySelector("p").textContent = newValue;
        if (name === "link") this.shadowRoot.querySelector("a").href = newValue;
    }
}

customElements.define("project-card", ProjectCard);

