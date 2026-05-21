const recipeManifest = [
  "recipes/focaccia-principiantes.md",
  "recipes/bifes-a-la-criolla.md",
  "recipes/pasta-tomate.md"
];

const ingredientStorageKey = "cookfever.checkedIngredients.v1";
const progressStorageKey = "cookfever.recipeProgress.v2";

const state = {
  recipes: [],
  activeRecipe: null,
  activeStep: 0,
  checkedIngredients: readStorage(ingredientStorageKey),
  recipeProgress: readStorage(progressStorageKey)
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
  drawerSummary: document.querySelector("#drawerSummary"),
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
  prep: '<path d="M14.5 4.5 19.5 9.5"></path><path d="m4 20 9.8-9.8"></path><path d="M13.8 10.2 16 8l-2-2-2.2 2.2a4.2 4.2 0 0 0 2 2Z"></path><path d="M4 20h6"></path>',
  plus: '<path d="M12 3.5 14.6 8.8 20.4 9.6 16.2 13.7 17.2 19.5 12 16.8 6.8 19.5 7.8 13.7 3.6 9.6 9.4 8.8 12 3.5Z"></path>',
  arrowRight: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
  arrowLeft: '<path d="M19 12H5"></path><path d="m11 6-6 6 6 6"></path>',
  check: '<path d="m5 12 4.2 4.2L19 6.5"></path>',
  spark: '<path d="M12 3.5 13.3 8.2 18 9.5 13.3 10.8 12 15.5 10.7 10.8 6 9.5 10.7 8.2 12 3.5Z"></path><path d="M18 14v5"></path><path d="M15.5 16.5h5"></path>',
  reload: '<path d="M20 12a8 8 0 1 1-2.4-5.7"></path><path d="M20 4v5h-5"></path>'
};

function icon(name) {
  return `<svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">${iconPaths[name] || iconPaths.check}</svg>`;
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function saveCheckedIngredients() {
  localStorage.setItem(ingredientStorageKey, JSON.stringify(state.checkedIngredients));
}

function saveRecipeProgress() {
  localStorage.setItem(progressStorageKey, JSON.stringify(state.recipeProgress));
}

function getRecipeIngredientKey(recipe) {
  return recipe.path || recipe.title;
}

function getRecipeProgressKey(recipe) {
  return recipe.path || recipe.title;
}

function getRecipeProgress(recipe) {
  return state.recipeProgress[getRecipeProgressKey(recipe)] || { lastStep: 0, completed: false };
}

function setRecipeProgress(recipe, updates) {
  const recipeKey = getRecipeProgressKey(recipe);
  state.recipeProgress[recipeKey] = {
    ...getRecipeProgress(recipe),
    ...updates
  };
  saveRecipeProgress();
}

function getIngredientStats(recipe) {
  const checked = recipe.ingredients.reduce((total, _ingredient, index) => (
    total + (isIngredientChecked(recipe, index) ? 1 : 0)
  ), 0);
  return { checked, total: recipe.ingredients.length };
}

function isIngredientChecked(recipe, index) {
  return Boolean(state.checkedIngredients[getRecipeIngredientKey(recipe)]?.[index]);
}

function setIngredientChecked(recipe, index, checked) {
  const recipeKey = getRecipeIngredientKey(recipe);
  state.checkedIngredients[recipeKey] = state.checkedIngredients[recipeKey] || {};
  if (checked) {
    state.checkedIngredients[recipeKey][index] = true;
  } else {
    delete state.checkedIngredients[recipeKey][index];
  }
  if (!Object.keys(state.checkedIngredients[recipeKey]).length) {
    delete state.checkedIngredients[recipeKey];
  }
  saveCheckedIngredients();
}

function renderPill(iconName, text, extraClass = "") {
  return `<span class="meta-pill ${extraClass}">${icon(iconName)}<span>${escapeHtml(text)}</span></span>`;
}

function getRecipeStatus(recipe) {
  const progress = getRecipeProgress(recipe);
  const pages = buildPages(recipe);
  const stats = getIngredientStats(recipe);

  if (progress.completed) {
    return {
      className: "is-done",
      label: "Lista",
      action: "Cocinar otra vez",
      iconName: "check",
      stepText: "Lista"
    };
  }

  if (progress.lastStep > 0) {
    return {
      className: "is-active",
      label: "Continuar",
      action: "Seguir receta",
      iconName: "arrowRight",
      stepText: `${Math.min(progress.lastStep + 1, pages.length)}/${pages.length} pasos`
    };
  }

  return {
    className: "",
    label: stats.checked ? `${stats.checked}/${stats.total} listos` : "Empezar",
    action: "Abrir receta",
    iconName: "arrowRight",
    stepText: stats.checked ? `${stats.checked}/${stats.total} listos` : `${pages.length} pasos`
  };
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
    prep: [],
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

    if (isPrepSection(section) && line.startsWith("- ")) {
      recipe.prep.push(cleanInline(line.slice(2)));
      continue;
    }

    if (section === "pasos" && /^###\s+/.test(line)) {
      const rawTitle = cleanInline(line.replace(/^###\s+/, ""));
      const isPlus = /^plus\s*:/i.test(rawTitle);
      currentStep = {
        title: isPlus ? rawTitle.replace(/^plus\s*:\s*/i, "").trim() : rawTitle,
        body: "",
        heat: "",
        time: "",
        detail: "",
        isPlus
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

function isPrepSection(section) {
  return [
    "preparacion previa",
    "preparación previa",
    "preparacion",
    "preparación",
    "mise en place"
  ].includes(section);
}

function renderLibrary() {
  els.recipeList.innerHTML = state.recipes.map((recipe, index) => {
    const status = getRecipeStatus(recipe);
    return `
      <button class="recipe-card ${status.className}" type="button" data-recipe-index="${index}" style="--stagger: ${index}">
        <span class="recipe-card-copy">
          <h2>${escapeHtml(recipe.title)}</h2>
          <p>${escapeHtml(recipe.description || "Receta guiada paso a paso.")}</p>
          <span class="meta-pills">
            ${renderPill("clock", recipe.time || "sin tiempo")}
            ${renderPill("gauge", recipe.difficulty || "principiante")}
            ${renderPill("servings", recipe.servings || "porciones a definir")}
            ${renderPill(status.iconName, status.stepText, "status-pill")}
          </span>
        </span>
        <span class="recipe-card-action">
          <span>${escapeHtml(status.action)}</span>
          <span class="arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </span>
      </button>
    `;
  }).join("");

  els.recipeList.querySelectorAll("[data-recipe-index]").forEach((button) => {
    button.addEventListener("click", () => openRecipe(Number(button.dataset.recipeIndex)));
  });
}

function openRecipe(index) {
  state.activeRecipe = state.recipes[index];
  const pages = buildPages(state.activeRecipe);
  const progress = getRecipeProgress(state.activeRecipe);
  state.activeStep = progress.completed ? 0 : Math.min(progress.lastStep || 0, pages.length - 1);
  els.libraryView.hidden = true;
  els.readerView.hidden = false;
  els.ingredientsDrawer.hidden = true;
  els.ingredientsToggle.setAttribute("aria-expanded", "false");
  renderRecipeShell();
  renderStep();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function getDrawerSummaryText(stats) {
  return stats.total
    ? `${stats.checked}/${stats.total} ingredientes marcados. Dejalos listos antes de avanzar fuerte.`
    : "Esta receta no tiene ingredientes cargados.";
}

function getIngredientsToggleLabel(stats) {
  return `${icon("ingredient")}<span>Ingredientes ${stats.checked}/${stats.total}</span>`;
}

function renderDrawerIngredients(recipe) {
  els.drawerIngredients.innerHTML = recipe.ingredients.map((ingredient, index) => `
    <li>${renderIngredientCheck(recipe, ingredient, index, "drawer")}</li>
  `).join("");
  bindIngredientChecks(els.drawerIngredients);
}

function syncIngredientChecks(index, checked) {
  document.querySelectorAll(`[data-ingredient-index="${index}"]`).forEach((input) => {
    const isCurrentInput = input === document.activeElement;
    input.checked = checked;
    input.closest(".ingredient-check")?.classList.toggle("is-checked", checked);
    if (isCurrentInput) input.focus({ preventScroll: true });
  });
}

function refreshIngredientUI() {
  const stats = getIngredientStats(state.activeRecipe);
  els.drawerSummary.textContent = getDrawerSummaryText(stats);
  els.ingredientsToggle.innerHTML = getIngredientsToggleLabel(stats);

  if (state.activeStep === 0) {
    const stationCount = els.stepCard.querySelector(".station-ingredients strong");
    if (stationCount) stationCount.textContent = `${stats.checked}/${stats.total} ingredientes listos`;
  }
}

function renderRecipeShell() {
  const recipe = state.activeRecipe;
  const stats = getIngredientStats(recipe);
  els.recipeTitle.textContent = recipe.title;
  els.recipeIntro.textContent = recipe.description;
  els.recipeTime.innerHTML = `${icon("clock")}<span>${escapeHtml(recipe.time || "tiempo a definir")}</span>`;
  els.recipeDifficulty.innerHTML = `${icon("gauge")}<span>${escapeHtml(recipe.difficulty || "principiante")}</span>`;
  els.servingsBadge.innerHTML = recipe.servings ? `${icon("servings")}<span>${escapeHtml(recipe.servings)}</span>` : "";
  els.drawerSummary.textContent = getDrawerSummaryText(stats);
  els.ingredientsToggle.innerHTML = getIngredientsToggleLabel(stats);
  renderDrawerIngredients(recipe);
}

function renderStep() {
  const recipe = state.activeRecipe;
  const pages = buildPages(recipe);
  const page = pages[state.activeStep];

  els.stepCard.classList.remove("is-entering");
  els.stepCard.classList.toggle("plus-page", Boolean(page.isPlus));
  els.stepCard.classList.toggle("station-page", Boolean(page.isStation));
  els.stepCard.classList.toggle("done-page", Boolean(page.isDone));
  els.stepCard.dataset.heat = page.heatLevel || "";
  els.stepCard.innerHTML = page.html;
  bindIngredientChecks(els.stepCard);
  requestAnimationFrame(() => els.stepCard.classList.add("is-entering"));
  els.previousStep.disabled = state.activeStep === 0;
  els.previousStep.innerHTML = `${icon("arrowLeft")}<span>Anterior</span>`;
  els.nextStep.innerHTML = state.activeStep === pages.length - 1
    ? `<span>Terminar</span>${icon("check")}`
    : `<span>Siguiente</span>${icon("arrowRight")}`;
  els.stepCounter.innerHTML = `
    <span class="step-counter-label">${state.activeStep + 1}/${pages.length}</span>
    <span class="step-counter-copy">${state.activeStep === 0 ? "estacion" : "paso"}</span>
    <span class="step-progress" aria-hidden="true"><span style="width: ${((state.activeStep + 1) / pages.length) * 100}%"></span></span>
  `;
}

function buildPages(recipe) {
  const stats = getIngredientStats(recipe);
  let stepNumber = 0;
  return [
    {
      isStation: true,
      html: `
        <p class="page-eyebrow">antes de prender fuego</p>
        <h2>${icon("spark")}Prepará tu estación</h2>
        <div class="station-grid">
          <button class="station-tile station-ingredients" type="button" data-open-ingredients>
            <span class="station-tile-icon">${icon("ingredient")}</span>
            <span>
              <strong>${stats.checked}/${stats.total} ingredientes listos</strong>
              <span>Abrí el checklist y marcá lo que ya tenés medido.</span>
            </span>
          </button>
          <div class="station-tile">
            <span class="station-tile-icon">${icon("equipment")}</span>
            <span>
              <strong>Mesa lista</strong>
              <span>${escapeHtml(getStationSummary(recipe))}</span>
            </span>
          </div>
        </div>
        ${recipe.prep.length ? `
          <details class="station-details">
            <summary>${icon("prep")} Ver cortes y preparación</summary>
            <ul class="prep-grid">
              ${recipe.prep.map((item) => `<li>${icon("prep")}<span>${escapeHtml(item)}</span></li>`).join("")}
            </ul>
          </details>
        ` : ""}
        ${recipe.equipment.length ? `
          <details class="station-details">
            <summary>${icon("equipment")} Ver equipo completo</summary>
            <ul class="equipment-grid">
              ${recipe.equipment.map((item) => `<li>${icon("equipment")}<span>${escapeHtml(item)}</span></li>`).join("")}
            </ul>
          </details>
        ` : ""}
        ${recipe.heatGuide ? `
          <details class="station-details heat-guide-details">
            <summary>${icon("flame")} Ver guía de fuego</summary>
            <p>${escapeHtml(recipe.heatGuide)}</p>
          </details>
        ` : ""}
      `
    },
    ...recipe.steps.map((step) => {
      if (!step.isPlus) stepNumber += 1;
      return renderStepPage(step, stepNumber);
    })
  ];
}

function renderIngredientCheck(recipe, ingredient, index, variant) {
  const inputId = `${variant}-ingredient-${index}`;
  const checked = isIngredientChecked(recipe, index);
  return `
    <label class="ingredient-check ${checked ? "is-checked" : ""}" for="${inputId}">
      <input
        id="${inputId}"
        type="checkbox"
        data-ingredient-index="${index}"
        ${checked ? "checked" : ""}
      >
      <span class="ingredient-box" aria-hidden="true">${icon("check")}</span>
      <span class="ingredient-copy">
        <strong>${formatIngredient(ingredient)}</strong>
        ${ingredient.note ? `<em>${escapeHtml(ingredient.note)}</em>` : ""}
      </span>
    </label>
  `;
}

function bindIngredientChecks(root) {
  root.querySelectorAll("[data-ingredient-index]").forEach((input) => {
    input.addEventListener("change", () => {
      const ingredientIndex = Number(input.dataset.ingredientIndex);
      const drawerScrollTop = els.drawerIngredients.scrollTop;
      setIngredientChecked(state.activeRecipe, ingredientIndex, input.checked);
      syncIngredientChecks(ingredientIndex, input.checked);
      refreshIngredientUI();
      els.drawerIngredients.scrollTop = drawerScrollTop;
    });
  });

  root.querySelectorAll("[data-open-ingredients]").forEach((button) => {
    button.addEventListener("click", () => openIngredientsDrawer());
  });
}

function renderStepPage(step, stepNumber) {
  const eyebrow = step.isPlus ? "plus opcional" : `paso ${stepNumber}`;
  const title = step.isPlus ? `${icon("plus")}${escapeHtml(step.title)}` : escapeHtml(step.title);
  const heatMeta = getHeatMeta(step.heat);

  return {
    isPlus: step.isPlus,
    heatLevel: heatMeta.level,
    html: `
      <p class="page-eyebrow">${eyebrow}</p>
      <h2>${title}</h2>
      <div class="step-body">${escapeHtml(step.body)}</div>
      ${step.detail ? `<p class="step-detail">${escapeHtml(step.detail)}</p>` : ""}
      <div class="hint-stack">
        ${step.heat ? renderCallout("heat", "Fuego", step.heat, heatMeta) : ""}
        ${step.time ? renderCallout("timer", "Tiempo", step.time) : ""}
      </div>
    `
  };
}

function summarizeList(items, fallback) {
  if (!items.length) return fallback;
  const summary = items.slice(0, 2).join(" · ");
  return items.length > 2 ? `${summary} · +${items.length - 2}` : summary;
}

function getStationSummary(recipe) {
  const parts = [];
  if (recipe.equipment.length) parts.push(`${recipe.equipment.length} utensilios`);
  if (recipe.prep.length) parts.push(`${recipe.prep.length} cortes/preparaciones`);
  return parts.length ? parts.join(" · ") : "Equipo y cortes a definir";
}

function openIngredientsDrawer() {
  els.ingredientsDrawer.hidden = false;
  els.ingredientsToggle.setAttribute("aria-expanded", "true");
  els.ingredientsDrawer.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function closeReader() {
  els.readerView.hidden = true;
  els.libraryView.hidden = false;
  els.ingredientsDrawer.hidden = true;
  els.ingredientsToggle.setAttribute("aria-expanded", "false");
  renderLibrary();
}

function completeRecipe() {
  setRecipeProgress(state.activeRecipe, {
    lastStep: buildPages(state.activeRecipe).length - 1,
    completed: true,
    completedAt: new Date().toISOString()
  });
  closeReader();
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
  closeReader();
});
els.ingredientsToggle.addEventListener("click", () => {
  const willOpen = els.ingredientsDrawer.hidden;
  els.ingredientsDrawer.hidden = !willOpen;
  els.ingredientsToggle.setAttribute("aria-expanded", String(willOpen));
});
els.previousStep.addEventListener("click", () => {
  if (state.activeStep > 0) {
    state.activeStep -= 1;
    setRecipeProgress(state.activeRecipe, { lastStep: state.activeStep, completed: false });
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
els.nextStep.addEventListener("click", () => {
  const pages = buildPages(state.activeRecipe);
  if (state.activeStep < pages.length - 1) {
    state.activeStep += 1;
    setRecipeProgress(state.activeRecipe, { lastStep: state.activeStep, completed: false });
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    completeRecipe();
  }
});

loadRecipes().catch((error) => {
  els.recipeList.innerHTML = `<div class="daily-note"><p>${escapeHtml(error.message)}</p></div>`;
});
