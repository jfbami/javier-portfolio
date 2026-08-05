/**
 * Renders a case-study page from the shared PROJECTS catalog.
 * Each sub-page is a thin shell that declares <body data-project-id="…">;
 * everything below is filled from that project's data in projects.js.
 */

(function () {
    "use strict";

    const SECTION_HEADINGS = {
        approach: "Technical Approach & Design Choices",
        context: "Context & the Why",
        validation: "Validating via A/B testing",
        reflections: "Personal Reflections & Engineering Gaps",
    };

    /** Running order used unless a project sets its own caseStudy.order. */
    const DEFAULT_ORDER = ["approach", "context", "reflections"];

    function createElement(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function findProject(id) {
        if (typeof PROJECTS === "undefined") return null;
        return PROJECTS.find((project) => project.id === id) || null;
    }

    /** Open a full-screen lightbox for an image; close on click or Escape. */
    function openLightbox(src, alt) {
        const overlay = createElement("div", "lightbox");
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-label", alt || "Expanded image");

        const image = createElement("img");
        image.src = src;
        image.alt = alt || "";
        overlay.appendChild(image);

        const close = () => {
            overlay.remove();
            document.removeEventListener("keydown", onKey);
        };
        function onKey(event) {
            if (event.key === "Escape") close();
        }

        overlay.addEventListener("click", close);
        document.addEventListener("keydown", onKey);
        document.body.appendChild(overlay);
    }

    /** Build an expandable figure (single image or a small gallery) with a caption. */
    function buildFigure(block) {
        const figure = createElement("figure", "case-figure");

        const grid = createElement("div", "case-figure-grid");
        if (block.images.length > 1) grid.classList.add("is-gallery");

        block.images.forEach((picture) => {
            const cell = createElement("div", "case-figure-cell");

            const button = createElement("button", "case-figure-item");
            // Charts ship with a light background of their own; give them a white plate.
            if (block.plate) button.classList.add("case-figure-item--plate");
            button.type = "button";
            button.setAttribute("aria-label", picture.label ? "Expand: " + picture.label : "Expand image");

            const image = createElement("img");
            image.src = picture.src;
            image.alt = picture.alt || picture.label || "";
            image.loading = "lazy";
            button.appendChild(image);
            button.addEventListener("click", () => openLightbox(picture.src, picture.alt || picture.label));

            cell.appendChild(button);
            if (picture.label) cell.appendChild(createElement("span", "case-figure-label", picture.label));
            grid.appendChild(cell);
        });
        figure.appendChild(grid);

        if (block.caption) figure.appendChild(createElement("figcaption", null, block.caption));
        return figure;
    }

    /** Render an array of blocks (string -> <p>, { list } -> <ul>, { images } -> figure). */
    function renderBlocks(parent, blocks) {
        blocks.forEach((block) => {
            if (typeof block === "string") {
                parent.appendChild(createElement("p", null, block));
            } else if (block && block.heading) {
                parent.appendChild(createElement("h3", null, block.heading));
            } else if (block && block.link) {
                const paragraph = createElement("p", null, block.link.prefix || "");
                const anchor = createElement("a", "inline-link", block.link.label);
                anchor.href = block.link.url;
                anchor.target = "_blank";
                anchor.rel = "noopener";
                paragraph.appendChild(anchor);
                parent.appendChild(paragraph);
            } else if (block && Array.isArray(block.list)) {
                const list = createElement("ul");
                block.list.forEach((item) => list.appendChild(createElement("li", null, item)));
                parent.appendChild(list);
            } else if (block && Array.isArray(block.images)) {
                parent.appendChild(buildFigure(block));
            }
        });
    }

    function renderHead(project) {
        document.title = project.title + " | Javier Fernandez-Budiman";
        document.getElementById("cs-domain").textContent = project.domain;
        document.getElementById("cs-title").textContent = project.title;
        document.getElementById("cs-lead").textContent = project.teaser;

        if (project.status === "in-progress") {
            const badge = createElement("span", "status-badge status-badge--inline");
            badge.append(createElement("span", "dot"), document.createTextNode("In development"));
            document.getElementById("cs-domain").after(badge);
        }
    }

    function renderMeta(project) {
        const meta = document.getElementById("cs-meta");
        if (!project.facts || !project.facts.length) {
            meta.remove(); // otherwise the empty <dl> leaves a stray rule under the lead
            return;
        }
        project.facts.forEach((fact) => {
            const group = document.createElement("div");
            group.append(
                createElement("dt", null, fact.label),
                createElement("dd", null, fact.value)
            );
            meta.appendChild(group);
        });
    }



    function renderDevBanner(project) {
        if (project.status !== "in-progress") return;
        const banner = createElement("div", "dev-banner");
        banner.append(
            createElement("span", "dot"),
            createElement(
                "p",
                null,
                "This case study is in development. The full technical spec is being written."
            )
        );
        document.getElementById("cs-dev").appendChild(banner);
    }

    function renderBody(project) {
        const body = document.getElementById("cs-body");
        const order = (project.caseStudy && project.caseStudy.order) || DEFAULT_ORDER;
        order.forEach((key) => {
            const blocks = project.caseStudy && project.caseStudy[key];
            if (!blocks || !blocks.length) return;
            body.appendChild(createElement("h2", null, SECTION_HEADINGS[key]));
            renderBlocks(body, blocks);
        });
    }

    function renderExtra(project) {
        const extra = document.getElementById("cs-extra");

        if (project.stack && project.stack.length) {
            const label = createElement("p", "extra-label", "Stack");
            const tags = createElement("ul", "tech-tags");
            project.stack.forEach((tech) => tags.appendChild(createElement("li", null, tech)));
            extra.append(label, tags);
        }

        const links = createElement("div", "extra-links");
        const addLink = (label, href) => {
            const link = createElement("a", "source-link", label + " ");
            link.href = href;
            link.target = "_blank";
            link.rel = "noopener";
            link.appendChild(createElement("span", "arrow", "↗"));
            links.appendChild(link);
        };

        if (project.repo) addLink("View source on GitHub", project.repo);
        (project.links || []).forEach((item) => addLink(item.label, item.url));
        if (links.children.length) extra.appendChild(links);
    }

    function render() {
        const project = findProject(document.body.dataset.projectId);
        if (!project) return;

        renderHead(project);
        renderMeta(project);

        renderDevBanner(project);
        renderBody(project);
        renderExtra(project);
    }

    render();
})();
