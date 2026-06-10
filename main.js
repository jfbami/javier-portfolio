/**
 * Javier Fernandez-Budiman - Portfolio
 * Renders the project showcase from the PROJECTS catalog (see projects.js).
 * Each card is one link wrapping the image and title, so either navigates
 * to the project's dedicated case-study page.
 */

(function () {
    "use strict";

    /** Create an element with an optional class and text content. */
    function createElement(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    /** Sleek "In Development" badge + indeterminate progress bar. */
    function buildProgressOverlay() {
        const fragment = document.createDocumentFragment();

        const badge = createElement("span", "status-badge");
        badge.append(createElement("span", "dot"), document.createTextNode("In development"));

        const track = createElement("span", "progress-track");
        track.appendChild(createElement("span", "progress-fill"));

        fragment.append(badge, track);
        return fragment;
    }

    /** Build the large image block for a card, with status overlay if needed. */
    function buildMedia(project) {
        const media = createElement("div", "project-card-media");

        const image = createElement("img");
        image.src = project.image;
        image.alt = project.title + " preview";
        image.loading = "lazy";
        media.appendChild(image);

        if (project.status === "in-progress") {
            media.appendChild(buildProgressOverlay());
        }
        return media;
    }

    /** Build the text block (index, title, domain, teaser, call-to-action). */
    function buildBody(project, position) {
        const body = createElement("div", "project-card-body");
        body.append(
            createElement("span", "project-card-index", position),
            createElement("h2", "project-card-title", project.title),
            createElement("span", "project-card-domain", project.domain),
            createElement("p", "project-card-teaser", project.teaser)
        );

        const ctaText = project.status === "in-progress" ? "Preview " : "View project ";
        const cta = createElement("span", "project-card-cta", ctaText);
        const arrow = createElement("span", "arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        cta.appendChild(arrow);
        body.appendChild(cta);

        return body;
    }

    /** Build one full project card as a list item containing a link. */
    function buildCard(project, position) {
        const link = createElement("a", "project-card");
        link.href = project.url;
        if (project.status === "in-progress") link.classList.add("is-in-progress");
        link.append(buildMedia(project), buildBody(project, position));

        const item = document.createElement("li");
        item.appendChild(link);
        return item;
    }

    /** Render every project in the catalog into the grid. */
    function renderProjects() {
        const grid = document.getElementById("project-grid");
        if (!grid || typeof PROJECTS === "undefined") return;

        const fragment = document.createDocumentFragment();
        PROJECTS.forEach((project, index) => {
            const position = String(index + 1).padStart(2, "0");
            fragment.appendChild(buildCard(project, position));
        });
        grid.appendChild(fragment);
    }

    renderProjects();
})();
