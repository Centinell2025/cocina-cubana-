# Cocina Cubana · El sabor de casa

Aplicación web en español con **200 recetas completas**, pastelería cubana y herramientas para organizar la cocina. Proyecto preparado para Beacon of the Eagle LLC en el repositorio `Centinell2025/cocina-cubana-`.

## Contenido

| Categoría | Recetas |
| --- | ---: |
| Carnes | 25 |
| Aves | 20 |
| Pescados y mariscos | 20 |
| Arroces | 20 |
| Granos y sopas | 20 |
| Viandas y ensaladas | 15 |
| Entrantes | 15 |
| Pastelería | 30 |
| Postres | 25 |
| Bebidas sin alcohol | 10 |
| **Total** | **200** |

Cada receta incluye ingredientes medidos, rendimiento base, preparación, cocción, reposo, dificultad, pasos, consejos y alérgenos orientativos. Se identifican los clásicos y las variantes caseras. Las formulaciones son originales y no se presentan como recetas ensayadas presencialmente.

## Funciones

- Búsqueda por nombre o ingrediente, con o sin tildes.
- Categorías, filtro de tiempo total y ordenación alfabética o por duración.
- Favoritos y notas personales guardados en el navegador.
- Ingredientes ajustables por porciones. Las cantidades escritas en los pasos, los moldes y los tiempos corresponden al rendimiento base y tienen un aviso visible.
- Modo paso a paso, lectura en voz alta según las voces disponibles y temporizador.
- Menú semanal con comida y cena durante siete días.
- Lista de compras que suma ingredientes del mismo nombre y unidad, conserva elementos manuales y permite marcar, copiar e imprimir.
- Exportación e importación de datos personales en JSON.
- Diseño adaptable, navegación con teclado y opción de texto grande.
- Aplicación web instalable (PWA), con recetas e ilustraciones disponibles sin conexión después de una primera carga correcta. El soporte depende del navegador y de las políticas de acceso del alojamiento.

## Ejecutar

La aplicación no necesita paquetes externos ni un proceso de compilación. Hay que servir `dist/` por HTTP/HTTPS; no abrir `index.html` mediante `file://` porque carga datos JSON.

```bash
python3 -m http.server 8080 --directory dist
```

Abrir `http://localhost:8080`. La instalación PWA y el service worker requieren HTTPS o localhost. El código de producción se encuentra íntegramente en `dist/`.

## Comprobar el proyecto

```bash
node scripts/validate.mjs
```

Las comprobaciones incluyen integridad y cantidad de recetas, referencias, recursos, búsqueda, filtros, favoritos, porciones del menú, lista de compras y escape de texto. La verificación de interfaz se realiza adicionalmente en navegador de escritorio y móvil.

## Archivos principales

- `dist/index.html`: estructura accesible y diálogos.
- `dist/styles.css`: diseño responsive y estilos de impresión.
- `dist/app.js`: interfaz y funciones del recetario.
- `dist/recipes.json`: catálogo de las 200 recetas.
- `dist/sources.json`: referencias culinarias y alcance de consulta.
- `dist/assets/`: ilustraciones vectoriales originales por categoría e iconos.
- `dist/manifest.webmanifest`, `dist/sw.js`: instalación y caché offline.
- `scripts/make_assets.py`: generación reproducible de ilustraciones; Pillow para los iconos PNG.
- `scripts/validate.mjs`: comprobaciones funcionales y de contenido.

## Privacidad y límites

No se incluyen seguimiento, publicidad, pagos, secretos ni bibliotecas externas. Favoritos, notas, menú y lista de compras se guardan en `localStorage` del navegador; no se sincronizan automáticamente entre dispositivos. El alojamiento puede aplicar su propia autenticación para acceder al sitio.

Los tiempos son estimados. Las ilustraciones representan categorías, no fotografías de cada preparación. Revisar etiquetas de ingredientes si existen alergias. Las referencias documentan contexto y técnicas; no certifican cada receta editorial. La alarma del temporizador puede retrasarse si el dispositivo suspende la app.

Esta entrega es una aplicación web/PWA. No es un APK, AAB o aplicación iOS enviada a tiendas. La publicación en Google Play o App Store requiere un empaquetado y proceso de revisión independientes.

## Actualizaciones

Al cambiar recursos de la aplicación, actualizar la versión de caché en `dist/sw.js` para que los navegadores descarguen el contenido nuevo. Conservar los IDs de las recetas para no romper favoritos, notas, enlaces y menús existentes.
