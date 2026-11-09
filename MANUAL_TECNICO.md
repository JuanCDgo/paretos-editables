# Manual Técnico — Presentación Pareto Posventa (Arquitectura & Portabilidad)

## 1. Visión General de la Arquitectura
La aplicación fue diseñada bajo el principio de **cero fricción operativa (Zero-Dependency Offline SPA)**. No requiere Node.js, compiladores, ni servidores web locales (`http://localhost`). Funciona de manera nativa abriendo el protocolo local `file:///` con doble clic en cualquier navegador moderno.

### Estructura de Archivos
```text
c:\Users\juanm\.gemini\antigravity\scratch\Trabajo\Paretos-editables\
├── index.html                           # Estructura semántica de diapositivas y modales
├── style.css                            # Sistema de diseño industrial, layout 16:9 y responsividad
├── app.js                               # Controlador de estado, Canvas Pareto y eventos de teclado
├── default_data.json                    # Plantilla base y esquema de datos inicial
├── Reporte_Pareto_Posventa_Junio_2026.xlsx # Planilla Excel con fórmulas nativas de Pareto
├── MANUAL_USUARIO.md                    # Documentación para usuario final y presentación
└── MANUAL_TECNICO.md                    # Este documento
```

---

## 2. Motor de Gráficos Pareto (Canvas Nativo High-DPI)
Para evitar fallas de renderizado por falta de conexión a internet en salas de reuniones corporativas, **no se utilizan CDNs externos** (como Chart.js o D3 externos que fallan si no hay WiFi). 

El motor de dibujo está programado en JavaScript puro utilizando la API de Canvas 2D:
- **Soporte Retina y 4K:** Utiliza `window.devicePixelRatio` para escalar el canvas en televisores de 55" de ultra alta definición, evitando el efecto borroso común en pantallas grandes.
- **Interpolación y Animación Easing:** Cada vez que una diapositiva se activa (`data-slide="X"`), se llama a `requestAnimationFrame` para animar el crecimiento vertical de las barras y el trazado de la curva acumulada de 0% a 100%.
- **Línea de Corte 80/20:** Trazo discontinuo (`setLineDash([5, 5])`) a la altura del 80% del eje secundario, con marcado de causas "Pocos Vitales" vs "Muchos Triviales".

---

## 3. Modelo de Datos y Persistencia
El estado de la aplicación se estructura en un objeto JSON con la siguiente interfaz:

```json
{
  "general": {
    "title": "string",
    "subtitle": "string",
    "period": "string",
    "company": "string",
    "lastUpdated": "string"
  },
  "summary": {
    "totalClaims": "number",
    "prevMonthTotal": "number",
    "twoMonthsAgoTotal": "number",
    "targetReduction": "string"
  },
  "sectors": {
    "fabrica": { "name": "string", "items": [{ "cause": "string", "qty": "number" }] },
    "living": { "name": "string", "items": [{ "cause": "string", "qty": "number" }] },
    "terceros": { "name": "string", "items": [{ "cause": "string", "qty": "number" }] }
  },
  "indicators": [
    { "name": "string", "abril": "string", "mayo": "string", "junio": "string", "status": "string", "type": "string", "conclusion": "string" }
  ],
  "actions": [
    { "area": "string", "priority": "string", "title": "string", "desc": "string", "responsible": "string", "deadline": "string" }
  ]
}
```

### Ciclo de Persistencia
1. **Lectura inicial:** `app.js` comprueba la clave `pareto_posventa_data` en `localStorage`. Si no existe o falla, carga `DEFAULT_DATA`.
2. **Edición en vivo:** Al modificar valores en el modal y pulsar "Aplicar", se actualiza la clave en `localStorage` y se redibujan el DOM y los lienzos de Canvas.
3. **Portabilidad:** La función `exportJsonData()` crea un Blob `data:text/json` descargable para respaldos en pendrive. La función `importJsonFile()` procesa archivos `.json` mediante `FileReader` nativo.

---

## 4. Fórmulas de la Planilla Excel
El archivo `Reporte_Pareto_Posventa_Junio_2026.xlsx` fue generado mediante Python `openpyxl`:
- Frecuencia Relativa: `=C6/$C$14` (Cantidad / Total Absoluto).
- Frecuencia Acumulada: Fila inicial `=D6`, filas subsecuentes `=E5+D6`.
- Regla 80/20: `=IF(E6<=0.805, "Pocos Vitales (80%)", "Muchos Triviales (20%)")`.
- Resumen Dinámico: Vínculos directos entre celdas inter-hojas (ej: `='Pareto Fabrica'!C13`).
