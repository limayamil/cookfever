const recipeManifest = [
  "recipes/estructura-receta.md",
  "recipes/focaccia-principiantes.md",
  "recipes/bifes-a-la-criolla.md",
  "recipes/pasta-tomate.md"
];

const state = {
  recipes: [],
  activeRecipe: null,
  activeStep: 0
};

const els = {
  libraryView: document.querySelector("#libraryView"),
  readerView: document.querySelector("#readerView"),
  recipeList: document.querySelector("#recipeList"),
  uploadButton: document.querySelector("#uploadButton"),
  reloadButton: document.querySelector("#reloadButton"),
  recipeFile: document.querySelector("#recipeFile"),
  backButton: document.querySelector("#backButton"),
  ingredientsToggle: document.querySelector("#ingredientsToggle"),
  ingredientsDrawer: document.querySelector("#ingredientsDrawer"),
  drawerIngredients: document.querySelector("#drawerIngredients"),
  servingsBadge: document.querySelector("#servingsBadge"),
  recipeTitle: document.querySelector("#recipeTitle"),
  recipeIntro: document.querySelector("#recipeIntro"),
  recipeTime: document.querySelector("#recipeTime"),
  recipeDifficulty: document.querySelector("#recipeDifficulty"),
  stepCard: document.querySelector("#stepCard"),
  previousStep: document.querySelector("#previousStep"),
  nextStep: document.querySelector("#nextStep"),
  stepCounter: document.querySelector("#stepCounter")
};

const iconPaths = {
  clock: '<circle cx="12" cy="12" r="8.25"></circle><path d="M12 7.5v5l3.25 1.9"></path>',
  gauge: '<path d="M4.8 15.8a7.2 7.2 0 1 1 14.4 0"></path><path d="M12 15l3.7-4.2"></path><path d="M8.2 11.7l-1.4-1.4"></path><path d="M15.8 11.7l1.4-1.4"></path>',
  servings: '<path d="M8 3v18"></path><path d="M5.5 3v6.5a2.5 2.5 0 0 0 5 0V3"></path><path d="M16 3v18"></path><path d="M16 3c2.1.9 3.3 2.7 3.3 5.2 0 2.3-1.2 4.2-3.3 5"></path>',
  flame: '<path d="M12 21c3.2 0 5.8-2.4 5.8-5.6 0-2.9-2-4.7-3.7-6.2-.9-.8-1.8-1.6-2.1-2.7-.9 1-1.4 2.2-1.3 3.6-1.5-.6-2.5-1.8-2.9-3.6-1.1 1.6-1.7 3.4-1.7 5.2C6.1 16.9 8.5 21 12 21Z"></path><path d="M12 18.1c1.3 0 2.4-1 2.4-2.4 0-1.2-.8-2-1.6-2.7-.4-.4-.8-.8-.9-1.3-.8.8-1.3 1.8-1.3 2.9 0 2 1 3.5 1.4 3.5Z"></path>',
  snow: '<path d="M12 3v18"></path><path d="M4.2 7.5 19.8 16.5"></path><path d="M19.8 7.5 4.2 16.5"></path><path d="m9.5 4.5 2.5 2.4 2.5-2.4"></path><path d="m9.5 19.5 2.5-2.4 2.5 2.4"></path>',
  timer: '<path d="M10 2h4"></path><path d="M12 14l2.4-2.4"></path><circle cx="12" cy="13" r="7.5"></circle>',
  ingredient: '<path d="M6 20c5.2 0 9.5-4.3 9.5-9.5V5H10C4.8 5 2 8.3 2 12.5 2 16.6 4.9 20 6 20Z"></path><path d="M6.5 17.5 16 8"></path><path d="M14 20c4.5-.3 8-4.1 8-8.7V7h-4.1"></path>',
  equipment: '<path d="M5 11h14"></path><path d="M7 11v7a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-7"></path><path d="M9 11V7a3 3 0 0 1 6 0v4"></path><path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"></path>',
  arrowRight: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
  arrowLeft: '<path d="M19 12H5"></path><path d="m11 6-6 6 6 6"></path>',
  check: '<path d="m5 12 4.2 4.2L19 6.5"></path>',
  reload: '<path d="M20 12a8 8 0 1 1-2.4-5.7"></path><path d="M20 4v5h-5"></path>'
};

function icon(name) {
  return `<svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">${iconPaths[name] || iconPaths.check}</svg>`;
}

function renderPill(iconName, text, extraClass = "") {
  return `<span class="meta-pill ${extraClass}">${icon(iconName)}<span>${escapeHtml(text)}</span></span>`;
}

function getHeatMeta(value = "") {
  const normalized = value.toLowerCase();
  if (normalized.includes("sin fuego") || normalized.includes("apagada")) {
    return { level: "none", label: "Sin fuego", iconName: "snow" };
  }
  if (normalized.includes("medio-alto") || normalized.includes("medio alto")) {
    return { level: "medium-high", label: "Medio-alto", iconName: "flame" };
  }
  if (normalized.includes("medio-bajo") || normalized.includes("medio bajo")) {
    return { level: "medium-low", label: "Medio-bajo", iconName: "flame" };
  }
  if (normalized.includes("alto")) {
    return { level: "high", label: "Alto", iconName: "flame" };
  }
  if (normalized.includes("medio")) {
    return { level: "medium", label: "Medio", iconName: "flame" };
  }
  if (normalized.includes("bajo")) {
    return { level: "low", label: "Bajo", iconName: "flame" };
  }
  return { level: "guide", label: "Guia", iconName: "flame" };
}

function renderCallout(type, label, value, heatMeta = null) {
  const modifier = type === "heat" ? ` heat-${heatMeta.level}` : " timer";
  const iconName = type === "heat" ? heatMeta.iconName : "timer";
  return `
    <div class="cook-callout ${modifier}">
      <span class="callout-icon">${icon(iconName)}</span>
      <span class="callout-copy">
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(value)}</span>
      </span>
    </div>
  `;
}

els.reloadButton.innerHTML = icon("reload");
els.backButton.innerHTML = `${icon("arrowLeft")}<span>Recetas</span>`;
els.ingredientsToggle.innerHTML = `${icon("ingredient")}<span>Ingredientes</span>`;

async function loadRecipes() {
  els.recipeList.innerHTML = "";
  const loaded = await Promise.all(
    recipeManifest.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
      return parseRecipe(await response.text(), path);
    })
  );
  state.recipes = loaded;
  renderLibrary();
}

async function loadLocalRecipe(file) {
  if (!file) return;
  const markdown = await file.text();
  const recipe = parseRecipe(markdown, file.name);
  state.recipes = [recipe, ...state.recipes.filter((item) => item.path !== file.name)];
  renderLibrary();
  openRecipe(0);
  els.recipeFile.value = "";
}

function parseRecipe(markdown, path) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const recipe = {
    path,
    title: "Receta sin titulo",
    description: "",
    servings: "",
    time: "",
    difficulty: "",
    heatGuide: "",
    ingredients: [],
    equipment: [],
    steps: []
  };

  let section = "";
  let currentStep = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("# ")) {
      recipe.title = cleanInline(line.slice(2));
      continue;
    }

    if (line.startsWith("## ")) {
      section = cleanInline(line.slice(3)).toLowerCase();
      currentStep = null;
      continue;
    }

    if (section === "datos" && line.startsWith("- ")) {
      const [key, ...rest] = line.slice(2).split(":");
      const value = rest.join(":").trim();
      assignMeta(recipe, key.trim().toLowerCase(), cleanInline(value));
      continue;
    }

    if (section === "ingredientes" && line.startsWith("- ")) {
      recipe.ingredients.push(parseIngredient(line.slice(2)));
      continue;
    }

    if (section === "equipo" && line.startsWith("- ")) {
      recipe.equipment.push(cleanInline(line.slice(2)));
      continue;
    }

    if (section === "pasos" && /^###\s+/.test(line)) {
      currentStep = {
        title: cleanInline(line.replace(/^###\s+/, "")),
        body: "",
        heat: "",
        time: "",
        detail: ""
      };
      recipe.steps.push(currentStep);
      continue;
    }

    if (section === "pasos" && currentStep && line.startsWith("- ")) {
      const [key, ...rest] = line.slice(2).split(":");
      const value = cleanInline(rest.join(":").trim());
      const field = key.trim().toLowerCase();
      if (field === "accion") currentStep.body = value;
      if (field === "fuego") currentStep.heat = value;
      if (field === "tiempo") currentStep.time = value;
      if (field === "detalle") currentStep.detail = value;
      continue;
    }
  }

  if (!recipe.steps.length) {
    recipe.steps.push({
      title: "Empezar",
      body: "Revisá ingredientes y utensilios antes de cocinar.",
      heat: recipe.heatGuide,
      time: "",
      detail: ""
    });
  }

  return recipe;
}

function assignMeta(recipe, key, value) {
  const map = {
    descripcion: "description",
    porciones: "servings",
    tiempo: "time",
    dificultad: "difficulty",
    "guia de fuego": "heatGuide"
  };
  if (map[key]) recipe[map[key]] = value;
}

function parseIngredient(text) {
  const normalized = cleanInline(text);
  const match = normalized.match(/^([^|]+)\|([^|]+)(?:\|(.+))?$/);
  if (!match) return { amount: "", name: normalized, note: "" };
  return {
    amount: match[1].trim(),
    name: match[2].trim(),
    note: (match[3] || "").trim()
  };
}

function cleanInline(text) {
  return text.replace(/\*\*/g, "").trim();
}

function renderLibrary() {
  els.recipeList.innerHTML = state.recipes.map((recipe, index) => `
    <button class="recipe-card" type="button" data-recipe-index="${index}" style="--stagger: ${index}">
      <span>
        <h2>${escapeHtml(recipe.title)}</h2>
        <p>${escapeHtml(recipe.description || "Receta guiada paso a paso.")}</p>
        <span class="meta-pills">
          ${renderPill("clock", recipe.time || "sin tiempo")}
          ${renderPill("gauge", recipe.difficulty || "principiante")}
          ${renderPill("servings", recipe.servings || "porciones a definir")}
        </span>
      </span>
      <span class="arrow" aria-hidden="true">${icon("arrowRight")}</span>
    </button>
  `).join("");

  els.recipeList.querySelectorAll("[data-recipe-index]").forEach((button) => {
    button.addEventListener("click", () => openRecipe(Number(button.dataset.recipeIndex)));
  });
}

function openRecipe(index) {
  state.activeRecipe = state.recipes[index];
  state.activeStep = 0;
  els.libraryView.hidden = true;
  els.readerView.hidden = false;
  els.ingredientsDrawer.hidden = true;
  els.ingredientsToggle.setAttribute("aria-expanded", "false");
  renderRecipeShell();
  renderStep();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderRecipeShell() {
  const recipe = state.activeRecipe;
  els.recipeTitle.textContent = recipe.title;
  els.recipeIntro.textContent = recipe.description;
  els.recipeTime.innerHTML = `${icon("clock")}<span>${escapeHtml(recipe.time || "tiempo a definir")}</span>`;
  els.recipeDifficulty.innerHTML = `${icon("gauge")}<span>${escapeHtml(recipe.difficulty || "principiante")}</span>`;
  els.servingsBadge.innerHTML = recipe.servings ? `${icon("servings")}<span>${escapeHtml(recipe.servings)}</span>` : "";
  els.drawerIngredients.innerHTML = recipe.ingredients.map((ingredient) => `
    <li>${icon("ingredient")}<span>${formatIngredient(ingredient)}</span></li>
  `).join("");
}

function renderStep() {
  const recipe = state.activeRecipe;
  const pages = buildPages(recipe);
  const page = pages[state.activeStep];

  els.stepCard.classList.remove("is-entering");
  els.stepCard.innerHTML = page.html;
  requestAnimationFrame(() => els.stepCard.classList.add("is-entering"));
  els.previousStep.disabled = state.activeStep === 0;
  els.previousStep.innerHTML = `${icon("arrowLeft")}<span>Anterior</span>`;
  els.nextStep.innerHTML = state.activeStep === pages.length - 1
    ? `<span>Terminar</span>${icon("check")}`
    : `<span>Siguiente</span>${icon("arrowRight")}`;
  els.stepCounter.innerHTML = `
    <span>${state.activeStep + 1}/${pages.length}</span>
    <span class="step-progress" aria-hidden="true"><span style="width: ${((state.activeStep + 1) / pages.length) * 100}%"></span></span>
  `;
}

function buildPages(recipe) {
  const heatGuideMeta = getHeatMeta(recipe.heatGuide);
  return [
    {
      html: `
        <p class="page-eyebrow">antes de prender fuego</p>
        <h2>${icon("ingredient")}Ingredientes medidos</h2>
        <ul class="ingredient-grid">
          ${recipe.ingredients.map((ingredient) => `
            <li>${icon("ingredient")}<span><strong>${formatIngredient(ingredient)}</strong>${ingredient.note ? `<em>${escapeHtml(ingredient.note)}</em>` : ""}</span></li>
          `).join("")}
        </ul>
      `
    },
    {
      html: `
        <p class="page-eyebrow">puesta a punto</p>
        <h2>${icon("equipment")}Equipo listo</h2>
        <ul class="equipment-grid">
          ${recipe.equipment.map((item) => `<li>${icon("equipment")}<span>${escapeHtml(item)}</span></li>`).join("")}
        </ul>
        ${recipe.heatGuide ? renderCallout("heat", "Guia de fuego", recipe.heatGuide, heatGuideMeta) : ""}
      `
    },
    ...recipe.steps.map((step, index) => ({
      html: `
        <p class="page-eyebrow">paso ${index + 1}</p>
        <h2>${escapeHtml(step.title)}</h2>
        <div class="step-body">${escapeHtml(step.body)}</div>
        ${step.detail ? `<p class="step-detail">${escapeHtml(step.detail)}</p>` : ""}
        <div class="hint-stack">
          ${step.heat ? renderCallout("heat", "Fuego", step.heat, getHeatMeta(step.heat)) : ""}
          ${step.time ? renderCallout("timer", "Tiempo", step.time) : ""}
        </div>
      `
    }))
  ];
}

function formatIngredient(ingredient) {
  const parts = [ingredient.amount, ingredient.name].filter(Boolean);
  return escapeHtml(parts.join(" "));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.uploadButton.addEventListener("click", () => els.recipeFile.click());
els.reloadButton.addEventListener("click", loadRecipes);
els.recipeFile.addEventListener("change", (event) => {
  loadLocalRecipe(event.target.files[0]).catch((error) => {
    els.recipeList.innerHTML = `<div class="daily-note"><p>${escapeHtml(error.message)}</p></div>`;
  });
});
els.backButton.addEventListener("click", () => {
  els.readerView.hidden = true;
  els.libraryView.hidden = false;
});
els.ingredientsToggle.addEventListener("click", () => {
  const willOpen = els.ingredientsDrawer.hidden;
  els.ingredientsDrawer.hidden = !willOpen;
  els.ingredientsToggle.setAttribute("aria-expanded", String(willOpen));
});
els.previousStep.addEventListener("click", () => {
  if (state.activeStep > 0) {
    state.activeStep -= 1;
    renderStep();
  }
});
els.nextStep.addEventListener("click", () => {
  const pages = buildPages(state.activeRecipe);
  if (state.activeStep < pages.length - 1) {
    state.activeStep += 1;
    renderStep();
  } else {
    els.readerView.hidden = true;
    els.libraryView.hidden = false;
  }
});

loadRecipes().catch((error) => {
  els.recipeList.innerHTML = `<div class="daily-note"><p>${escapeHtml(error.message)}</p></div>`;
});
