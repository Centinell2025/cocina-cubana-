# Cocina Cubana · Patrimonio y alta cocina

Recetario visual en español con **410 recetas**, preparado para Beacon of the Eagle LLC. Combina cocina cubana, postres y pastelería con historia documentada, herramientas de cocina y propuestas de presentación y servicio.

## Abrir la aplicación

**[Entrar a Cocina Cubana](https://centinell2025.github.io/cocina-cubana-/)**

El `index.html` de la raíz dirige a `dist/` y conserva los enlaces internos. Así, GitHub Pages abre la aplicación en lugar de mostrar este README. El repositorio es [Centinell2025/cocina-cubana-](https://github.com/Centinell2025/cocina-cubana-).

## Las 410 recetas

| Categoría | Recetas |
| --- | ---: |
| Carnes | 70 |
| Aves | 45 |
| Pescados y mariscos | 25 |
| Arroces | 25 |
| Granos y sopas | 24 |
| Viandas y ensaladas | 18 |
| Entrantes | 18 |
| Pastelería | 65 |
| Postres | 90 |
| Bebidas sin alcohol | 30 |
| **Total** | **410** |

Cada receta incluye ingredientes medidos, rendimiento, tiempos estimados, dificultad, pasos, consejos y alérgenos orientativos. Las **410 fichas de chef** añaden preparación previa, técnica, emplatado, servicio y contexto cultural. Se distinguen las preparaciones tradicionales, las variantes caseras y las reinterpretaciones contemporáneas.

La ampliación incorpora **20 jugos nuevos** dentro de una selección de **30 bebidas sin alcohol**, junto con cafés, batidos y otras bebidas del recetario.

Los espacios de bebidas reúnen **23 jugos y refrescos, cuatro batidos y tres preparaciones de café o chocolate**. La sección de **12 helados, sorbetes, granizados, semifríos y paletas** forma parte de los postres.

## Patrimonio y alta cocina

- **Historia 1726–2026:** diez hitos seleccionados, con antecedentes indígenas anteriores al periodo y aportaciones españolas, africanas y afrocubanas. La ventana de 300 años es una selección editorial, no una fecha de nacimiento de la cocina cubana. Aquí, «indígenas» se refiere a pueblos originarios del Caribe, incluidos los taínos.
- **Fuentes consultables:** referencias culturales, culinarias y de seguridad, con una explicación del alcance de cada fuente. No se atribuye antigüedad a una receta nueva por utilizar un ingrediente antiguo.
- **Seis talleres:** preparación previa, fondos y salsas, texturas, pastelería y frío, emplatado y servicio, y cuaderno de pruebas.
- **Tres menús de degustación:** «Memoria de la mesa cubana», «Costa, huerta y coco» y «Salón de dulces y café», enlazados con sus recetas.
- **Seis menús por ocasión:** familia, cena elegante, mesa vegetal, merienda, costa y celebración; cada uno enlaza sus platos y una bebida del recetario.
- **Ocho completas y combinaciones:** propuestas con un principal, acompañamientos, bebida y, cuando corresponde, postre. Cada una enlaza sus recetas y explica cómo organizar el servicio.
- **Siete imágenes originales generadas con IA**, junto con ilustraciones por categoría. Son imágenes ilustrativas; no son fotografías de platos preparados o ensayados para este proyecto.

Las formulaciones y acabados son **propuestas editoriales que requieren pruebas reales en cocina**. Esta colección no tiene certificación, afiliación ni distinciones Michelin. La [Guía Michelin](https://guide.michelin.com/us/en/article/features/what-is-a-michelin-star) concede estrellas a restaurantes, con un máximo de tres.

## Herramientas para cocinar

- Búsqueda por nombre o ingrediente, con o sin tildes; categorías, tiempo y ordenación.
- Dos filtros para **115 recetas de carnes y aves**: tipo de carne y corte o presentación, con una selección de **71 asados**. Los cortes no especificados en la fórmula se indican como tales.
- **Ocho panes**, incluidos el pan de maíz y el pan de casabe tostado preparado con casabe comercial listo para comer.
- **12 fritos y plátanos**, organizados en tostones y plátano verde, maduros fritos y frituras variadas; cada grupo permite filtrar sus recetas.
- Colecciones de frutas en miel, en almíbar y de melao de caña. **Frutas en miel reúne seis recetas:** cinco nuevas preparaciones y las brochetas de frutas con miel y limón. El **dulce de grosella está en almíbar** y se elabora con azúcar.
- Favoritos y notas personales; porciones ajustables, modo paso a paso, lectura en voz alta y temporizador.
- Menú semanal y lista de compras que suma ingredientes compatibles y permite marcar, copiar e imprimir.
- Exportación e importación de datos personales, navegación con teclado, texto grande y diseño adaptable a móvil.
- PWA instalable y uso sin conexión tras una primera carga correcta, según el soporte del navegador.

Al cambiar las porciones, se ajustan las cantidades de la lista de ingredientes. Los moldes, las cantidades escritas en los pasos y los tiempos corresponden a la tanda base; deben revisarse al escalar.

## Ejecutar y comprobar

La app no requiere dependencias externas ni compilación. Para ejecutar la versión web:

```bash
python3 -m http.server 8080 --directory dist
```

Abre `http://localhost:8080`. Esta versión carga archivos JSON y debe servirse por HTTP/HTTPS. La instalación PWA requiere HTTPS o localhost.

Para comprobar contenido, referencias, recursos y funciones:

```bash
npm test
```

El comando equivale a `node scripts/validate.mjs`.

### HTML portátil

```bash
npm run bundle
```

Genera **`dist/Cocina_Cubana_Recetario.html`**, con los datos y recursos integrados para abrir el recetario como un solo archivo. La instalación PWA corresponde a la versión web alojada.

## Archivos principales

| Archivo | Contenido |
| --- | --- |
| `dist/recipes.json` | 410 recetas y fichas de chef |
| `dist/meat-cuts.json` | Tipos de carne, cortes o presentaciones y selección de asados |
| `dist/collections.json` | Diez colecciones de recetas, grupos de fritos y ocho completas y combinaciones |
| `dist/heritage.json` | Historia, raíces culturales y referencias |
| `dist/haute-cuisine.json` | Talleres, menús y organización del servicio |
| `dist/sources.json` | Fuentes y alcance de consulta |
| `dist/index.html`, `dist/app.js`, `dist/styles.css` | Interfaz y funcionamiento |
| `dist/assets/` | Imágenes, ilustraciones e iconos |
| `dist/manifest.webmanifest`, `dist/sw.js` | Instalación y caché sin conexión |
| `scripts/validate.mjs`, `scripts/build-standalone.mjs` | Validación y generación del HTML portátil |

## Privacidad y mantenimiento

Favoritos, notas, menú y compras se guardan en el navegador mediante `localStorage`; no se sincronizan automáticamente entre dispositivos. La app no incorpora seguimiento, publicidad ni pagos. Los tiempos son estimados, los alérgenos deben contrastarse con las etiquetas de los productos y el temporizador puede retrasarse si el dispositivo se suspende.

Conserva los IDs de las recetas para mantener favoritos, notas y menús existentes. Al modificar recursos, actualiza la versión de caché en `dist/sw.js` y regenera el HTML portátil. Esta entrega es una aplicación web/PWA; su distribución como APK, AAB o aplicación iOS requiere un proceso de empaquetado y revisión adicional.

El HTML descargable incluye el contenido y las herramientas; carga las imágenes desde GitHub Pages. Para exportar también las imágenes dentro del archivo, ejecuta `node scripts/build-standalone.mjs --embed-images`.
