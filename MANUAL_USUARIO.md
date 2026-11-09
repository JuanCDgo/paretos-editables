# Manual de Usuario — Presentación Pareto Posventa (Ejecutiva & TV 55")

Sistema interactivo de presentación y análisis de calidad diseñado para reuniones mensuales con encargados de fábrica, gerencia de producción y dueños.

---

## 1. Cómo iniciar la presentación en la sala de reunión

### Desde un Pendrive (100% Offline, sin internet ni instalaciones)
1. Copiá la carpeta `Paretos-editables` completa a tu pendrive.
2. Conectá el pendrive a la notebook de la reunión.
3. Conectá el cable HDMI al televisor de 55 pulgadas.
4. Entrá a la carpeta y hacé **doble clic en `index.html`**. Se abrirá de inmediato en Google Chrome, Microsoft Edge o cualquier navegador preinstalado.
5. Presioná la tecla **`F11`** o hacé clic en el botón **`Pantalla Completa`** arriba a la derecha.

---

## 2. Controles durante la presentación en vivo

Podés pasar las diapositivas de cualquiera de estas formas:
- **Teclado o Puntero / Clicker inalámbrico:**
  - `Flecha Derecha (→)` o `Barra Espaciadora`: Siguiente diapositiva.
  - `Flecha Izquierda (←)`: Diapositiva anterior.
  - `Inicio`: Ir a la portada.
  - `Fin`: Ir al plan de acción final.
  - `E`: Abrir panel de edición de datos.
  - `F11`: Entrar o salir de pantalla completa.
- **Mouse / Pantalla táctil:**
  - Haciendo clic en los botones `Anterior` y `Siguiente` abajo a la derecha.
  - Haciendo clic directo sobre cualquiera de las **6 barras de progreso estilo Stories** en el borde superior de la pantalla.

---

## 3. Estructura de las Diapositivas (El ritmo de la reunión)

1. **Slide 1 — Portada Ejecutiva:** Título, período ("Junio 2026") y tarjetas KPI principales (Total reclamos: 57, repunte de +58% vs Mayo, participación de Fábrica 80.7%, Living 12.3%, Terceros 7.0%).
2. **Slide 2 — Semáforo y Evolución Trimestral:** Gráfico de evolución Abril (66) -> Mayo (36) -> Junio (57) y panel de indicadores con las alertas directivas.
3. **Slide 3 — Pareto Sector Fábrica (El plato fuerte):** Diagrama animado de Pareto donde las barras se dibujan solas y la curva 80/20 se traza en vivo, destacando que Rayado (30.4%) + Roto (19.6%) + Faltantes (13.0%) concentran el 63% de los problemas.
4. **Slide 4 — Pareto Living & Terceros:** Dos gráficos de Pareto paralelos para las líneas tapizadas y los proveedores externos.
5. **Slide 5 — Trazabilidad Histórica de Fallas:** Cómo mutaron los defectos principales en los 3 meses (de faltantes de tornillería en Abril a roturas y marcas de flete en Junio).
6. **Slide 6 — Matriz de Acción Directiva:** 3 compromisos operativos concretos con responsables y plazos (Logística/Fletes, Cabina de Lustre y Mesa Euro).

---

## 4. Cómo actualizar los datos mes a mes (100% Editable)

No necesitás tocar código de programación ni editar archivos raros:
1. Tocá el botón **`⚙ Editar Datos`** (o presioná la tecla **`E`**).
2. Se abrirá una ventana limpia con pestañas:
   - **General & Período:** Cambiá el mes (ej: "Julio 2026") y los totales de meses anteriores.
   - **Fábrica / Living / Terceros:** Modificá los nombres de los reclamos y sus cantidades, o agregá filas nuevas con el botón `+ Agregar Fila`. **El sistema calcula automáticamente el total y los porcentajes en vivo.**
   - **Indicadores de Calidad:** Editá las conclusiones ejecutivas (Alerta Roja, Mesa Euro, etc.).
   - **Planes de Acción:** Editá las acciones, responsables y fechas de entrega.
3. Hacé clic en **`Aplicar y Ver Presentación`**. Los datos se guardan al instante en tu equipo.

---

## 5. Cómo llevar los datos en el Pendrive

Dentro del panel de edición, en la pestaña **`Guardar / Exportar / Pendrive`**:
- **Descargar Archivo JSON de Datos:** Te descarga un archivo (ej: `pareto_posventa_julio_2026.json`). Guardalo en el pendrive para tener una copia de respaldo de cada mes.
- **Cargar Archivo JSON:** Si abrís la presentación en otra computadora que no tiene tus datos guardados, tocás este botón, seleccionás tu archivo del pendrive y se carga todo automáticamente en 1 segundo.
- **Copiar y Pegar desde Excel:** Podés copiar una tabla de 2 columnas de Excel (Causa y Cantidad) y pegarla directamente en la caja de texto para importarla a Fábrica sin tipear nada a mano.

---

## 6. Archivo Excel de Respaldo (`Reporte_Pareto_Posventa_Junio_2026.xlsx`)

En la misma carpeta tenés la planilla de cálculo complementaria para cuando un gerente o directivo te pida la tabla con fórmulas:
- **Pestaña `Dashboard Resumen`:** Resumen general de la empresa, KPIs y matriz de calidad.
- **Pestañas `Pareto Fabrica`, `Pareto Living`, `Pareto Terceros`:** Tablas estructuradas con fórmulas de porcentaje (`=C6/$C$14`), porcentaje acumulado y clasificación automática de 80% Pocos Vitales vs 20% Muchos Triviales.
- **Pestaña `Histórico Trimestral`:** Tablas de cierre de Abril y Mayo 2026.
