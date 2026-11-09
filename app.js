/**
 * PRESENTACIÓN PARETO POSVENTA — MOTOR INTERACTIVO
 * Optimizado para TV 55" HDMI y portabilidad en Pendrive
 */

// 1. DATOS POR DEFECTO (SSOT)
const DEFAULT_DATA = {
  general: {
    title: "PRESENTACIÓN PARETO POSVENTA",
    subtitle: "Análisis Estratégico de Oportunidades y Mejoras (Fábrica, Living y Terceros)",
    period: "Junio 2026",
    company: "Control de Calidad & Posventa",
    lastUpdated: "2026-11-08"
  },
  summary: {
    totalClaims: 57,
    prevMonthTotal: 36,
    twoMonthsAgoTotal: 66,
    targetReduction: "30%"
  },
  sectors: {
    fabrica: {
      name: "Sector Fábrica",
      items: [
        { cause: "Rayado / Golpeado / Marcado", qty: 14 },
        { cause: "Roto / Quebrado / Partido", qty: 9 },
        { cause: "Faltantes de Piezas / Herrajes", qty: 6 },
        { cause: "Lustre / Color / Terminación", qty: 3 },
        { cause: "Tela / Tapizado", qty: 3 },
        { cause: "Perforaciones", qty: 2 },
        { cause: "Panceado", qty: 1 },
        { cause: "Reclamos Varios", qty: 8 }
      ]
    },
    living: {
      name: "Sector Living",
      items: [
        { cause: "Problema de Lustre / Color", qty: 2 },
        { cause: "Roto / Quebrado", qty: 2 },
        { cause: "Problema de Tela / Tapizado", qty: 1 },
        { cause: "Otros Reclamos", qty: 2 }
      ]
    },
    terceros: {
      name: "Sector Terceros",
      items: [
        { cause: "Faltan piezas / Accesorios", qty: 2 },
        { cause: "Rayado / Golpeado / Marcado", qty: 1 },
        { cause: "Roto / Quebrado / Partido", qty: 1 }
      ]
    }
  },
  indicators: [
    {
      name: "Volumen Total Reclamos",
      abril: "66 Reclamos",
      mayo: "36 Reclamos",
      junio: "57 Reclamos",
      status: "REBOTE",
      type: "warning",
      conclusion: "Rebote de +58% en Junio respecto a Mayo. La suba se originó casi en su totalidad en el sector Fábrica."
    },
    {
      name: "Principal Defecto (Top 1)",
      abril: "Faltantes piezas (15%)",
      mayo: "Roto / Quebrado (19.4%)",
      junio: "Rayado / Golpeado (30.4%)",
      status: "ALERTA ROJA",
      type: "danger",
      conclusion: "Dejamos de olvidar herrajes, pero la madera se raya y rompe severamente en manipuleo interno y flete (50% del total acumulado)."
    },
    {
      name: "Segundo Defecto (Top 2)",
      abril: "Lustre / Color (13.6%)",
      mayo: "Lustre / Color (11.1%)",
      junio: "Roto / Quebrado (19.6%)",
      status: "CRÓNICO",
      type: "warning",
      conclusion: "Fallas persistentes en cabina de pintura (diferencia de tono y pérdida de brillo). Se suma el quiebre de partes."
    },
    {
      name: "Producto Más Crítico",
      abril: "Mesa Euro (18 reclamos)",
      mayo: "Mesa Euro (Terminación)",
      junio: "Mesa Euro (Golpes y Lustre)",
      status: "CRÍTICO URGENTE",
      type: "danger",
      conclusion: "Sigue concentrando el mayor volumen de reclamos de postventa por embalaje débil y daños de esquinas. Requiere nuevo packaging ya."
    }
  ],
  actions: [
    {
      area: "Logística & Transporte",
      priority: "Alta",
      title: "Protocolo de Estiba y Fijación en Camiones",
      desc: "El 50% de las fallas de fábrica corresponden a golpes y roturas. Implementar esquineros de cartón reforzado y mantas de alta densidad para traslados.",
      responsible: "Jefe de Depósito / Fletes",
      deadline: "Inmediato"
    },
    {
      area: "Cabina de Pintura & Lustre",
      priority: "Media",
      title: "Calibración de Mezclas y Control de Curado",
      desc: "Auditar la dosificación de catalizador y viscosidad de lacas. Estandarizar el tiempo de secado previo a empaque para evitar marcas por presión.",
      responsible: "Encargado de Lustre",
      deadline: "15 Días"
    },
    {
      area: "Línea Mesa Euro",
      priority: "Crítica",
      title: "Rediseño de Packaging y Refuerzo de Punteras",
      desc: "Diseñar embalaje integral de polietileno expandido y protectores plásticos en las 4 esquinas de la tapa antes de salir de línea.",
      responsible: "Ingeniería de Producto / Producción",
      deadline: "7 Días"
    }
  ]
};

// 2. ESTADO GLOBAL
let appData = loadInitialData();
let currentSlideIndex = 0;
const totalSlides = 6;
let animationFrameId = null;

// Cargar desde LocalStorage con fallback
function loadInitialData() {
  try {
    const saved = localStorage.getItem("pareto_posventa_data");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("No se pudo leer localStorage:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  appData = data;
  try {
    localStorage.setItem("pareto_posventa_data", JSON.stringify(data));
  } catch (e) {
    console.warn("No se pudo escribir en localStorage:", e);
  }
  renderAll();
  showToast("Datos actualizados correctamente");
}

// 3. INICIALIZACIÓN DE LA UI
document.addEventListener("DOMContentLoaded", () => {
  initStoryBars();
  initEventListeners();
  renderAll();
  goToSlide(0);
});

// Inicializar las 6 barras de progreso estilo Stories
function initStoryBars() {
  const container = document.getElementById("storyProgressContainer");
  container.innerHTML = "";
  for (let i = 0; i < totalSlides; i++) {
    const bar = document.createElement("div");
    bar.className = "story-progress-bar";
    bar.dataset.index = i;
    bar.innerHTML = '<div class="story-progress-fill"></div>';
    bar.addEventListener("click", () => goToSlide(i));
    container.appendChild(bar);
  }
}

// 4. NAVEGACIÓN DE DIAPOSITIVAS
function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  
  const slides = document.querySelectorAll(".slide");
  slides.forEach((s, idx) => {
    s.classList.remove("active", "prev");
    if (idx === index) {
      s.classList.add("active");
    } else if (idx < index) {
      s.classList.add("prev");
    }
  });

  currentSlideIndex = index;
  updateNavigationUI();
  triggerSlideAnimations(index);
}

function updateNavigationUI() {
  // Contador
  document.getElementById("slideCounter").textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
  
  // Botones Prev / Next
  document.getElementById("btnPrev").disabled = currentSlideIndex === 0;
  document.getElementById("btnNext").disabled = currentSlideIndex === totalSlides - 1;

  // Barras de progreso
  const bars = document.querySelectorAll(".story-progress-bar");
  bars.forEach((bar, idx) => {
    bar.classList.remove("active", "completed");
    if (idx < currentSlideIndex) {
      bar.classList.add("completed");
    } else if (idx === currentSlideIndex) {
      bar.classList.add("active");
    }
  });
}

function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    goToSlide(currentSlideIndex + 1);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    goToSlide(currentSlideIndex - 1);
  }
}

// 5. ATALLOS DE TECLADO Y EVENTOS
function initEventListeners() {
  document.getElementById("btnNext").addEventListener("click", nextSlide);
  document.getElementById("btnPrev").addEventListener("click", prevSlide);

  // Teclado
  window.addEventListener("keydown", (e) => {
    // Si el modal está abierto, no navegar diapositivas
    const modal = document.getElementById("editorModal");
    if (modal.classList.contains("active")) {
      if (e.key === "Escape") closeModal();
      return;
    }

    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Home") {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    } else if (e.key.toLowerCase() === "e") {
      e.preventDefault();
      openModal();
    } else if (e.key === "F11") {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // Pantalla Completa
  document.getElementById("btnFullscreen").addEventListener("click", toggleFullscreen);

  // Editor Modal
  document.getElementById("btnEdit").addEventListener("click", openModal);
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("btnCancelModal").addEventListener("click", closeModal);
  document.getElementById("btnSaveModal").addEventListener("click", saveModalChanges);

  // Pestañas del Editor
  const tabs = document.querySelectorAll(".editor-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Botones de agregar fila en editor
  document.getElementById("btnAddFabricaRow").addEventListener("click", () => addTableRow("editFabricaTbody", "Nuevo Defecto", 1));
  document.getElementById("btnAddLivingRow").addEventListener("click", () => addTableRow("editLivingTbody", "Nuevo Defecto", 1));
  document.getElementById("btnAddTercerosRow").addEventListener("click", () => addTableRow("editTercerosTbody", "Nuevo Defecto", 1));

  // Exportar / Importar JSON
  document.getElementById("btnExportJson").addEventListener("click", exportJsonData);
  document.getElementById("inputFileJson").addEventListener("change", importJsonFile);
  document.getElementById("btnImportFromPaste").addEventListener("click", importFromPastedExcel);
  document.getElementById("btnResetDefault").addEventListener("click", resetToDefaultData);

  // Redimensionado de ventana
  window.addEventListener("resize", () => {
    triggerSlideAnimations(currentSlideIndex);
  });
}

function toggleFullscreen() {
  const elem = document.documentElement;
  const label = document.getElementById("fullscreenText");
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      console.warn("Fullscreen no soportado:", err);
    });
    label.textContent = "Salir Pantalla Completa";
  } else {
    document.exitFullscreen();
    label.textContent = "Pantalla Completa";
  }
}

// 6. RENDERIZADO GLOBAL DE LA APLICACIÓN
function renderAll() {
  const g = appData.general;
  const s = appData.summary;

  // Header & Portada
  document.getElementById("headerTitle").textContent = g.company || "Control de Calidad & Posventa";
  document.getElementById("headerPeriod").textContent = `${g.period} — Fábrica, Living y Terceros`;
  document.getElementById("coverTitle").textContent = g.title;
  document.getElementById("coverSubtitle").textContent = g.subtitle;

  // Cálculos de totales
  const fTotal = appData.sectors.fabrica.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const lTotal = appData.sectors.living.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const tTotal = appData.sectors.terceros.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const grandTotal = fTotal + lTotal + tTotal;

  // KPIs Portada
  document.getElementById("kpiTotalJune").textContent = grandTotal;
  const prevTotal = Number(s.prevMonthTotal || 36);
  const diffPct = prevTotal > 0 ? Math.round(((grandTotal - prevTotal) / prevTotal) * 100) : 0;
  const sign = diffPct > 0 ? "+" : "";
  document.getElementById("kpiVariation").textContent = `${sign}${diffPct}% vs Mayo (${prevTotal})`;

  document.getElementById("kpiFabrica").textContent = fTotal;
  document.getElementById("kpiFabricaPct").textContent = grandTotal > 0 ? `${((fTotal / grandTotal) * 100).toFixed(1)}% del total` : "0%";

  document.getElementById("kpiLiving").textContent = lTotal;
  document.getElementById("kpiLivingPct").textContent = grandTotal > 0 ? `${((lTotal / grandTotal) * 100).toFixed(1)}% del total` : "0%";

  document.getElementById("kpiTerceros").textContent = tTotal;
  document.getElementById("kpiTercerosPct").textContent = grandTotal > 0 ? `${((tTotal / grandTotal) * 100).toFixed(1)}% del total` : "0%";

  // Renderizar Indicadores (Slide 2)
  renderIndicatorsSlide();

  // Renderizar Tabla Mini Pareto Fábrica (Slide 3)
  renderTableMiniFabrica(fTotal);

  // Renderizar Compromisos / Acciones (Slide 6)
  renderActionsSlide();
}

function renderIndicatorsSlide() {
  const container = document.getElementById("indicatorListContainer");
  container.innerHTML = "";
  
  appData.indicators.forEach(ind => {
    const card = document.createElement("div");
    card.className = `indicator-card ${ind.type || "warning"}`;
    card.innerHTML = `
      <div class="ind-header">
        <span class="ind-name">${ind.name}</span>
        <span class="ind-badge ${ind.type || "warning"}">${ind.status}</span>
      </div>
      <div class="ind-metric-row">
        <span>Abril: <strong>${ind.abril}</strong></span>
        <span>Mayo: <strong>${ind.mayo}</strong></span>
        <span>Junio: <strong>${ind.junio}</strong></span>
      </div>
      <div class="ind-conclusion">${ind.conclusion}</div>
    `;
    container.appendChild(card);
  });
}

function renderTableMiniFabrica(totalFabrica) {
  const tbody = document.getElementById("tbodyFabricaMini");
  tbody.innerHTML = "";

  // Ordenar de mayor a menor para el Pareto
  const sorted = [...appData.sectors.fabrica.items].sort((a, b) => b.qty - a.qty);
  let cumSum = 0;

  sorted.forEach((item, idx) => {
    cumSum += item.qty;
    const pct = totalFabrica > 0 ? (item.qty / totalFabrica) * 100 : 0;
    const cumPct = totalFabrica > 0 ? (cumSum / totalFabrica) * 100 : 0;
    const isVital = cumPct <= 80.5 || idx < 3;

    const tr = document.createElement("tr");
    if (isVital) tr.className = "vital-row";
    tr.innerHTML = `
      <td>${item.cause}</td>
      <td style="text-align: right; font-weight: 700;">${item.qty}</td>
      <td style="text-align: right;">${pct.toFixed(1)}%</td>
      <td style="text-align: right; font-weight: 700;">${cumPct.toFixed(1)}%</td>
      <td style="text-align: center;">
        <span class="${isVital ? 'badge-vital' : 'badge-trivial'}">
          ${isVital ? '80% Vital' : '20% Trivial'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderActionsSlide() {
  const container = document.getElementById("actionsGridContainer");
  container.innerHTML = "";

  appData.actions.forEach(act => {
    let cardClass = "medium";
    if (act.priority === "Crítica") cardClass = "critical";
    else if (act.priority === "Alta") cardClass = "high";

    const card = document.createElement("div");
    card.className = `action-card ${cardClass}`;
    card.innerHTML = `
      <div>
        <div class="action-area">${act.area} • Prioridad ${act.priority}</div>
        <div class="action-title">${act.title}</div>
        <div class="action-desc">${act.desc}</div>
      </div>
      <div class="action-footer">
        <div>Responsable: <strong>${act.responsible}</strong></div>
        <div>Plazo: <strong>${act.deadline}</strong></div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 7. MOTOR DE ANIMACIÓN Y GRÁFICOS (CANVAS NATIVO HIGH-DPI)
function triggerSlideAnimations(slideIdx) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  if (slideIdx === 1) {
    animateEvolutionChart();
  } else if (slideIdx === 2) {
    animateParetoChart("canvasParetoFabrica", appData.sectors.fabrica.items, "Fábrica");
  } else if (slideIdx === 3) {
    animateParetoChart("canvasParetoLiving", appData.sectors.living.items, "Living");
    animateParetoChart("canvasParetoTerceros", appData.sectors.terceros.items, "Terceros");
  } else if (slideIdx === 4) {
    animateHistoricalDefectsChart();
  }
}

// Helper para configurar Canvas con nitidez Retina / 4K
function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const parent = canvas.parentElement;
  const rect = parent.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { canvas, ctx, width: rect.width, height: rect.height };
}

// GRÁFICO 1: EVOLUCIÓN MENSUAL (ABRIL -> MAYO -> JUNIO)
function animateEvolutionChart() {
  const setup = setupCanvas("canvasEvolucion");
  if (!setup) return;
  const { ctx, width, height } = setup;

  const fTotal = appData.sectors.fabrica.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const lTotal = appData.sectors.living.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const tTotal = appData.sectors.terceros.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const juneTotal = fTotal + lTotal + tTotal;

  const months = [
    { label: "Abril 2026", value: Number(appData.summary.twoMonthsAgoTotal || 66), color: "#38bdf8" },
    { label: "Mayo 2026", value: Number(appData.summary.prevMonthTotal || 36), color: "#10b981" },
    { label: "Junio 2026 (Actual)", value: juneTotal, color: "#f43f5e" }
  ];

  let progress = 0;
  const maxVal = Math.max(...months.map(m => m.value)) * 1.25;

  function draw() {
    progress += 0.05;
    if (progress > 1) progress = 1;

    ctx.clearRect(0, 0, width, height);

    // Ejes y padding
    const paddingLeft = 50;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 50;
    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Líneas guía horizontales
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      const valLabel = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillStyle = "#64748b";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(valLabel, paddingLeft - 10, y + 4);
    }

    // Dibujar barras
    const barWidth = Math.min(80, chartW / (months.length * 1.8));
    const step = chartW / months.length;

    months.forEach((m, idx) => {
      const x = paddingLeft + step * idx + (step - barWidth) / 2;
      const barH = (m.value / maxVal) * chartH * progress;
      const y = paddingTop + chartH - barH;

      // Barra
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fill();

      // Número arriba de la barra
      if (progress > 0.4) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(m.value * progress), x + barWidth / 2, y - 10);
      }

      // Nombre del mes abajo
      ctx.fillStyle = idx === 2 ? "#f43f5e" : "#94a3b8";
      ctx.font = idx === 2 ? "bold 13px sans-serif" : "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(m.label, x + barWidth / 2, height - paddingBottom + 25);
    });

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

// GRÁFICO 2: PARETO ANIMADO (BARRAS + CURVA ACUMULADA AL 80%)
function animateParetoChart(canvasId, items, sectorName) {
  const setup = setupCanvas(canvasId);
  if (!setup) return;
  const { ctx, width, height } = setup;

  const sorted = [...items].sort((a, b) => b.qty - a.qty);
  const total = sorted.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  if (total === 0) return;

  let cumSum = 0;
  const data = sorted.map(item => {
    cumSum += item.qty;
    return {
      cause: item.cause,
      qty: item.qty,
      pct: item.qty / total,
      cumPct: cumSum / total
    };
  });

  let progress = 0;

  function draw() {
    progress += 0.04;
    if (progress > 1) progress = 1;

    ctx.clearRect(0, 0, width, height);

    const padL = 45;
    const padR = 45;
    const padT = 35;
    const padB = 65;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const maxQty = Math.max(...data.map(d => d.qty)) * 1.25;

    // Línea de corte 80% (Pareto)
    const y80 = padT + chartH * (1 - 0.8);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padL, y80);
    ctx.lineTo(width - padR, y80);
    ctx.stroke();
    ctx.setLineDash([]);

    // Etiqueta 80%
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Línea 80%", width - padR - 5, y80 - 6);

    // Eje izquierdo (Cantidades)
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxQty), padL - 8, padT + 8);
    ctx.fillText("0", padL - 8, padT + chartH);

    // Eje derecho (Porcentaje 100%)
    ctx.textAlign = "left";
    ctx.fillText("100%", width - padR + 8, padT + 8);
    ctx.fillText("80%", width - padR + 8, y80 + 4);
    ctx.fillText("0%", width - padR + 8, padT + chartH);

    const count = data.length;
    const colW = chartW / count;
    const barW = Math.max(14, colW * 0.55);

    // Dibujar Barras
    data.forEach((d, i) => {
      const x = padL + i * colW + (colW - barW) / 2;
      const barH = (d.qty / maxQty) * chartH * progress;
      const y = padT + chartH - barH;

      // Color de barra: azul corporativo o rojo si es foco crítico
      if (d.cumPct <= 0.805 || i < 2) {
        ctx.fillStyle = "#38bdf8"; // Vital
      } else {
        ctx.fillStyle = "#334155"; // Trivial
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Cantidad sobre la barra
      if (progress > 0.5) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(d.qty, x + barW / 2, y - 6);
      }

      // Nombre truncado abajo
      ctx.save();
      ctx.translate(x + barW / 2, padT + chartH + 12);
      ctx.rotate(-Math.PI / 4.2);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      const shortName = d.cause.length > 18 ? d.cause.substring(0, 16) + "…" : d.cause;
      ctx.fillText(shortName, 0, 0);
      ctx.restore();
    });

    // Dibujar Curva Acumulada
    ctx.beginPath();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;

    const points = [];
    data.forEach((d, i) => {
      const x = padL + i * colW + colW / 2;
      const curCum = d.cumPct * progress;
      const y = padT + chartH * (1 - curCum);
      points.push({ x, y, pct: d.cumPct });

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Puntos en la curva
    if (progress > 0.6) {
      points.forEach(p => {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0b0f19";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

// GRÁFICO 3: DEFECTOS HISTÓRICOS (ABRIL VS MAYO VS JUNIO)
function animateHistoricalDefectsChart() {
  const setup = setupCanvas("canvasDefectosHistoricos");
  if (!setup) return;
  const { ctx, width, height } = setup;

  const categories = [
    { name: "Faltantes", abril: 15.0, mayo: 8.3, junio: 13.0 },
    { name: "Lustre/Color", abril: 13.6, mayo: 11.1, junio: 6.6 },
    { name: "Roto/Quebrado", abril: 26.7, mayo: 19.4, junio: 19.6 },
    { name: "Rayado/Golpe", abril: 13.3, mayo: 11.1, junio: 30.4 }
  ];

  let progress = 0;

  function draw() {
    progress += 0.05;
    if (progress > 1) progress = 1;

    ctx.clearRect(0, 0, width, height);

    const padL = 40;
    const padR = 30;
    const padT = 30;
    const padB = 40;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const maxVal = 35; // 35%
    const catStep = chartW / categories.length;
    const barW = Math.min(22, (catStep - 20) / 3);

    // Eje y líneas
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(padL, padT + chartH);
    ctx.lineTo(width - padR, padT + chartH);
    ctx.stroke();

    categories.forEach((cat, idx) => {
      const groupX = padL + idx * catStep + (catStep - barW * 3) / 2;

      // Barra Abril
      const hAbril = (cat.abril / maxVal) * chartH * progress;
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(groupX, padT + chartH - hAbril, barW, hAbril);

      // Barra Mayo
      const hMayo = (cat.mayo / maxVal) * chartH * progress;
      ctx.fillStyle = "#10b981";
      ctx.fillRect(groupX + barW + 2, padT + chartH - hMayo, barW, hMayo);

      // Barra Junio
      const hJunio = (cat.junio / maxVal) * chartH * progress;
      ctx.fillStyle = cat.junio > 20 ? "#ef4444" : "#f59e0b";
      ctx.fillRect(groupX + (barW + 2) * 2, padT + chartH - hJunio, barW, hJunio);

      // Label categoría
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cat.name, groupX + (barW * 3) / 2, height - padB + 20);
    });

    // Leyenda arriba
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(padL, 10, 10, 10);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Abril", padL + 15, 19);

    ctx.fillStyle = "#10b981";
    ctx.fillRect(padL + 70, 10, 10, 10);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Mayo", padL + 85, 19);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(padL + 140, 10, 10, 10);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Junio (Alerta Roja)", padL + 155, 19);

    if (progress < 1) requestAnimationFrame(draw);
  }

  draw();
}

// 8. FUNCIONALIDADES DEL MODAL EDITOR
function openModal() {
  populateModalFields();
  document.getElementById("editorModal").classList.add("active");
}

function closeModal() {
  document.getElementById("editorModal").classList.remove("active");
}

function populateModalFields() {
  const g = appData.general;
  const s = appData.summary;

  document.getElementById("editTitle").value = g.title || "";
  document.getElementById("editSubtitle").value = g.subtitle || "";
  document.getElementById("editPeriod").value = g.period || "";
  document.getElementById("editCompany").value = g.company || "";
  document.getElementById("editPrevMonth").value = s.prevMonthTotal || 36;
  document.getElementById("editTwoMonthsAgo").value = s.twoMonthsAgoTotal || 66;
  document.getElementById("editTargetReduction").value = s.targetReduction || "30%";

  populateTableRows("editFabricaTbody", appData.sectors.fabrica.items);
  populateTableRows("editLivingTbody", appData.sectors.living.items);
  populateTableRows("editTercerosTbody", appData.sectors.terceros.items);
  populateIndicadoresEditor();
  populateAccionesEditor();
}

function populateTableRows(tbodyId, items) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";
  items.forEach(it => {
    addTableRow(tbodyId, it.cause, it.qty);
  });
}

function addTableRow(tbodyId, cause = "Defecto nuevo", qty = 1) {
  const tbody = document.getElementById(tbodyId);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="input-cause" value="${cause}"></td>
    <td><input type="number" class="input-qty" value="${qty}" min="0"></td>
    <td style="text-align: center;">
      <button class="btn-table-action" onclick="this.closest('tr').remove()">&times;</button>
    </td>
  `;
  tbody.appendChild(tr);
}

function populateIndicadoresEditor() {
  const container = document.getElementById("editIndicadoresContainer");
  container.innerHTML = "";
  appData.indicators.forEach((ind, i) => {
    const div = document.createElement("div");
    div.style.marginBottom = "14px";
    div.style.border = "1px solid var(--border-subtle)";
    div.style.padding = "12px";
    div.style.borderRadius = "6px";
    div.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 6px; font-size: 13px; color: var(--accent-blue);">${ind.name}</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <input type="text" class="form-input ind-abril" value="${ind.abril}" placeholder="Abril">
        <input type="text" class="form-input ind-mayo" value="${ind.mayo}" placeholder="Mayo">
        <input type="text" class="form-input ind-junio" value="${ind.junio}" placeholder="Junio">
      </div>
      <textarea class="form-textarea ind-conclusion" rows="2">${ind.conclusion}</textarea>
    `;
    container.appendChild(div);
  });
}

function populateAccionesEditor() {
  const container = document.getElementById("editAccionesContainer");
  container.innerHTML = "";
  appData.actions.forEach((act, i) => {
    const div = document.createElement("div");
    div.style.marginBottom = "14px";
    div.style.border = "1px solid var(--border-subtle)";
    div.style.padding = "12px";
    div.style.borderRadius = "6px";
    div.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <input type="text" class="form-input act-area" value="${act.area}" placeholder="Área">
        <input type="text" class="form-input act-priority" value="${act.priority}" placeholder="Prioridad">
      </div>
      <input type="text" class="form-input act-title" value="${act.title}" placeholder="Título" style="margin-bottom: 8px;">
      <textarea class="form-textarea act-desc" rows="2" style="margin-bottom: 8px;">${act.desc}</textarea>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <input type="text" class="form-input act-responsible" value="${act.responsible}" placeholder="Responsable">
        <input type="text" class="form-input act-deadline" value="${act.deadline}" placeholder="Plazo">
      </div>
    `;
    container.appendChild(div);
  });
}

function saveModalChanges() {
  // General
  appData.general.title = document.getElementById("editTitle").value;
  appData.general.subtitle = document.getElementById("editSubtitle").value;
  appData.general.period = document.getElementById("editPeriod").value;
  appData.general.company = document.getElementById("editCompany").value;
  appData.summary.prevMonthTotal = Number(document.getElementById("editPrevMonth").value || 0);
  appData.summary.twoMonthsAgoTotal = Number(document.getElementById("editTwoMonthsAgo").value || 0);
  appData.summary.targetReduction = document.getElementById("editTargetReduction").value;

  // Fábrica
  appData.sectors.fabrica.items = extractTableItems("editFabricaTbody");
  appData.sectors.living.items = extractTableItems("editLivingTbody");
  appData.sectors.terceros.items = extractTableItems("editTercerosTbody");

  // Indicadores
  const indCards = document.querySelectorAll("#editIndicadoresContainer > div");
  indCards.forEach((c, i) => {
    if (appData.indicators[i]) {
      appData.indicators[i].abril = c.querySelector(".ind-abril").value;
      appData.indicators[i].mayo = c.querySelector(".ind-mayo").value;
      appData.indicators[i].junio = c.querySelector(".ind-junio").value;
      appData.indicators[i].conclusion = c.querySelector(".ind-conclusion").value;
    }
  });

  // Acciones
  const actCards = document.querySelectorAll("#editAccionesContainer > div");
  actCards.forEach((c, i) => {
    if (appData.actions[i]) {
      appData.actions[i].area = c.querySelector(".act-area").value;
      appData.actions[i].priority = c.querySelector(".act-priority").value;
      appData.actions[i].title = c.querySelector(".act-title").value;
      appData.actions[i].desc = c.querySelector(".act-desc").value;
      appData.actions[i].responsible = c.querySelector(".act-responsible").value;
      appData.actions[i].deadline = c.querySelector(".act-deadline").value;
    }
  });

  saveData(appData);
  closeModal();
  triggerSlideAnimations(currentSlideIndex);
}

function extractTableItems(tbodyId) {
  const rows = document.querySelectorAll(`#${tbodyId} tr`);
  const items = [];
  rows.forEach(r => {
    const cause = r.querySelector(".input-cause")?.value.trim();
    const qty = Number(r.querySelector(".input-qty")?.value || 0);
    if (cause) {
      items.push({ cause, qty });
    }
  });
  return items;
}

// 9. EXPORTAR / IMPORTAR / RESTABLECER
function exportJsonData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement("a");
  const filename = `pareto_posventa_${appData.general.period.toLowerCase().replace(/\s+/g, '_')}.json`;
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`Archivo ${filename} descargado`);
}

function importJsonFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed.sectors && parsed.general) {
        saveData(parsed);
        populateModalFields();
        showToast("Datos importados con éxito");
      } else {
        alert("El archivo no tiene el formato válido de datos de Pareto.");
      }
    } catch (err) {
      alert("Error al leer el archivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

function importFromPastedExcel() {
  const text = document.getElementById("pasteExcelTextarea").value.trim();
  if (!text) {
    alert("Pegá primero el texto copiado de Excel.");
    return;
  }

  const lines = text.split("\n");
  const newItems = [];
  lines.forEach(line => {
    const parts = line.split("\t");
    if (parts.length >= 2) {
      const cause = parts[0].trim();
      const qty = parseInt(parts[1].trim(), 10);
      if (cause && !isNaN(qty)) {
        newItems.push({ cause, qty });
      }
    }
  });

  if (newItems.length > 0) {
    appData.sectors.fabrica.items = newItems;
    populateTableRows("editFabricaTbody", newItems);
    showToast(`Se importaron ${newItems.length} filas a Fábrica`);
    document.getElementById("pasteExcelTextarea").value = "";
  } else {
    alert("No se detectaron columnas válidas (Causa + Cantidad separadas por tabulación).");
  }
}

function resetToDefaultData() {
  if (confirm("¿Estás seguro de restablecer todos los datos a la versión original de Junio 2026?")) {
    saveData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
    populateModalFields();
    showToast("Datos restablecidos a los originales");
  }
}

// Toast helper
function showToast(msg) {
  const toast = document.getElementById("toastNotice");
  const text = document.getElementById("toastText");
  text.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
