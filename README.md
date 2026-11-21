# Cocina Cubana · El sabor de casa

Aplicación web en español e inglés con **1041 recetas completas entre clásicos y versiones caseras**, pastelería cubana y herramientas para organizar la cocina. Proyecto preparado para Beacon of the Eagle LLC en el repositorio `Centinell2025/cocina-cubana-`.

## Contenido

| Categoría | Recetas |
| --- | ---: |
| Carnes | 90 |
| Aves | 100 |
| Pescados y mariscos | 103 |
| Arroces | 100 |
| Granos y sopas | 102 |
| Viandas y ensaladas | 110 |
| Entrantes | 110 |
| Pastelería | 198 |
| Postres | 105 |
| Bebidas sin alcohol | 23 |
| **Total** | **1041** |

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
- `dist/recipes.json`: catálogo de las 1041 recetas.
- `dist/sources.json`: referencias culinarias y alcance de consulta.
- `dist/assets/`: imágenes culinarias 3D por receta, imagen principal e iconos.
- `dist/manifest.webmanifest`, `dist/sw.js`: instalación y caché offline.
- `scripts/make_assets.py`: generación de los recursos vectoriales originales y de los iconos PNG; las imágenes 3D se guardan como recursos independientes.
- `scripts/validate.mjs`: comprobaciones funcionales y de contenido.

## Privacidad y límites

No se incluyen seguimiento, publicidad, pagos, secretos ni bibliotecas externas. Favoritos, notas, menú y lista de compras se guardan en `localStorage` del navegador; no se sincronizan automáticamente entre dispositivos. El alojamiento puede aplicar su propia autenticación para acceder al sitio.

Los tiempos son estimados. Las 1041 recetas tienen 1041 ilustraciones 3D individuales, vinculadas exclusivamente a su ID, sin reutilizar imágenes entre platos. La cobertura exacta está en `source-assets/image-coverage.json`. Si un archivo no puede cargarse, la ficha muestra los ingredientes de su propia receta. Revisar etiquetas de ingredientes si existen alergias. Las referencias documentan contexto y técnicas; no certifican cada receta editorial. La alarma del temporizador puede retrasarse si el dispositivo suspende la app.

Esta entrega es una aplicación web/PWA. No es un APK, AAB o aplicación iOS enviada a tiendas. La publicación en Google Play o App Store requiere un empaquetado y proceso de revisión independientes.

## Actualizaciones

Al cambiar recursos de la aplicación, actualizar la versión de caché en `dist/sw.js` para que los navegadores descarguen el contenido nuevo. Conservar los IDs de las recetas para no romper favoritos, notas, enlaces y menús existentes.

## Idiomas

El selector Español / English traduce la interfaz completa y las 1041 recetas del catálogo: ingredientes, notas de ingredientes, pasos, consejos y alérgenos. El idioma se guarda en los datos personales del navegador y puede cambiarse también dentro de una receta o del modo de cocina. La búsqueda encuentra nombres e ingredientes en ambos idiomas. Se conservan los mismos IDs y las identidades originales de ingredientes para mantener favoritos, notas, menús y marcas de compras al cambiar de idioma.

- `dist/i18n.js`: diccionario de la interfaz; `t()` traduce etiquetas al renderizar, nunca el contenido escrito por la persona.
- `dist/recipes.en.json`: catálogo completo en inglés con IDs, orden, cantidades y temperaturas equivalentes al español.
- Los dos catálogos y el diccionario se guardan en la caché sin conexión después de una primera carga completa.
- La lectura en voz alta usa `es-ES` o `en-US`, según la selección y las voces disponibles en el dispositivo.
- Al ampliar el catálogo, añadir la traducción correspondiente con el mismo ID; la validación exige paridad entre los dos idiomas.

## Edición ampliada 1.3.0

Se añaden 500 fórmulas completas, identificadas como versiones caseras, conservando los 200 registros originales y sus traducciones. El catálogo alcanza 700 recetas en ambos idiomas, con 100 de pastelería y 50 postres. Se mantienen los identificadores y los datos personales guardados. Las URLs de recursos y catálogos se actualizan juntas para evitar mostrar una edición antigua desde la caché.

## Catálogo por categorías 1.4.2

Se añaden 310 recetas completas: 30 de aves, 30 arroces, 40 de granos y sopas, 20 de viandas y ensaladas, 40 entrantes, 100 de pastelería y 50 postres, con traducción completa al inglés. Carnes conserva sus 90 platos y Pescados y mariscos sus 100. Todas las cantidades por categoría se verifican sobre las fichas reales. El catálogo suma 1010 recetas y conserva íntegros los 700 registros anteriores y sus IDs. Las incorporaciones son versiones caseras de formulación editorial; no se afirma que se hayan probado presencialmente. Se actualizan los recursos y la caché a la versión 1.4.2.

## Imágenes culinarias 3D · 1.5.0

Se sustituyen las diez ilustraciones de categorías y la imagen principal por imágenes en estilo 3D creadas con la herramienta integrada de generación de imágenes. Los archivos PNG originales se copian sin modificaciones a `dist/assets/*-3d.png`. Comparten cerámica crema, luz suave, volumen y texturas culinarias; la portada utiliza fondo verde oscuro. Las imágenes son representativas por categoría y la interfaz lo indica en español e inglés. La portada, tarjetas, fichas, menú y selector utilizan los nuevos recursos, incluidos en la caché sin conexión. Las 1010 recetas y sus identificadores se conservan.

### Dirección visual de las imágenes

Composición horizontal 3:2, vista de tres cuartos ligeramente elevada, alimentos apetitosos, ilustración 3D con materiales realistas y una ligera suavidad estilizada, sombras suaves, sin palabras, logos, personas ni marcas de agua. Fondos crema cálida en las categorías; verde oscuro en la portada.

| Archivo en `dist/assets/` | Composición solicitada |
| --- | --- |
| `mesa-cubana-3d.png` | Ropa vieja, arroz blanco, frijoles negros, plátano maduro frito y pastelitos de guayaba. |
| `carnes-3d.png` | Ropa vieja cubana con trozos de cerdo asado. |
| `aves-3d.png` | Pollo asado dorado en plato de cerámica. |
| `pescados-3d.png` | Pescado asado y camarones. |
| `arroces-3d.png` | Arroz amarillo y congrí. |
| `granos_sopas-3d.png` | Potaje de frijoles negros en bol. |
| `viandas_ensaladas-3d.png` | Yuca al mojo, tostones y ensalada fresca. |
| `entrantes-3d.png` | Croquetas y empanaditas cubanas. |
| `pasteleria-3d.png` | Pastelitos de guayaba, torticas y panecillo. |
| `postres-3d.png` | Flan de caramelo con coco discreto. |
| `bebidas-3d.png` | Café cubano y jugo tropical de mango. |

## Imágenes propias por receta · 1.6.0

Se elimina la asignación de una sola imagen a todas las recetas de una categoría. El nuevo `dist/recipe-images.json` contiene 24 correspondencias individuales revisadas, incluyendo las 18 recetas iniciales y seis platos de arroz, pescado, pato, viandas y potajes. Las imágenes se crearon en llamadas separadas con la herramienta integrada de generación; los PNG se conservan sin modificaciones en `source-assets/recipes/` y sus copias WebP a resolución completa se sirven desde `dist/assets/recipes/`. La conversión cambia únicamente el formato de entrega, no el encuadre ni la composición. Los prompts y la procedencia quedan en `source-assets/image-generation.json`. Cada fotografía ilustrativa aparece únicamente asociada al mismo ID en tarjetas, detalles, favoritos, menú semanal y selector. El ID conserva su imagen al cambiar de idioma.

Las 986 recetas restantes se muestran con un bloque de ingredientes, sin fotografías genéricas ni duplicadas. Si una imagen no carga, se usa ese mismo bloque informativo. Se retiran los collages de los banners de pastelería. La portada general conserva su única composición de mesa cubana. El recetario, los IDs y los datos personales se conservan.

La validación comprueba correspondencias por ID y título, archivos existentes, rutas y hashes distintos, las 18 imágenes iniciales, persistencia por idioma y ausencia de sustitución por categoría. La versión de recursos y de caché pasa a 1.6.0, incluyendo el manifiesto y las 24 imágenes para el uso sin conexión.


## Mango con crema de batir

Se añade la receta r1011 con mango en trocitos, crema ligeramente batida e imagen individual. Incluye traducción completa al inglés. El catálogo alcanza 1011 recetas y 101 postres; conserva todos los IDs anteriores.


## Hayacas y yuca

Se añaden Hayacas cubanas en hojas de plátano (r1012) y Croquetas de yuca (r1013), con versiones completas en español e inglés. Bolas de yuca rellenas de queso conserva el ID r518. El catálogo suma 1013 recetas, incluidos 102 entrantes y 101 postres.


## Catálogo ilustrado completo · 1.8.0

- 1013 recetas y 1013 imágenes individuales: cobertura completa en las diez categorías.
- 100 imágenes de arroces, 100 de aves, 100 de pescados, 100 de granos y sopas, 90 de carnes, 100 de viandas y ensaladas, 102 de entrantes, 200 de pastelería, 101 de postres y 20 de bebidas.
- Se incorporan Mango con crema de batir, Hayacas cubanas en hojas de plátano y Croquetas de yuca en español e inglés, con imágenes propias. La búsqueda de hayacas también reconoce hallacas, ayacas y anyacas.
- La receta r007 se titula Estofado de res a la criolla. La receta r518 conserva su identidad e ingredientes y ahora se llama Bolas de yuca rellenas de queso, con su propia ilustración.
- Las imágenes nuevas están optimizadas en WebP de 960 × 640 píxeles. El manifiesto incorpora revisiones por SHA-256 para actualizar también imágenes corregidas que conservan su ruta. La caché sin conexión utiliza las mismas revisiones.
- Se conservan los prompts y la procedencia de cada imagen en source-assets/image-batches. La validación completa exige una imagen válida y única por receta, títulos correspondientes y paridad del catálogo bilingüe.


## Publicación de imágenes · 1.8.0

Esta versión contiene 1013 imágenes individuales para 1013 recetas. Cada imagen se asocia exclusivamente a su receta y conserva la correspondencia en ambos idiomas. El informe exacto por categoría está en `source-assets/image-coverage.json`. Los nuevos prompts se conservan en `source-assets/image-batches/`; las copias WebP optimizadas están en `dist/assets/recipes/`.


## Sopas de pescado y camarones adobados · 1.8.1

Se incorporan Sopa de pescado pargo (r1014), Sopa de pescado lisa (r1015) y Camarones empanizados con ajo, cebolla y limón (r1016). Las tres fichas pertenecen a Pescados y mariscos, incluyen ingredientes, preparación completa, traducción al inglés e ilustraciones propias. La búsqueda reconoce lisa y liza. El adobo de los camarones lleva limón, ocho dientes de ajo y 150 g de cebolla para 600 g de camarones.

El catálogo suma 1016 recetas con 1016 imágenes individuales; Pescados y mariscos alcanza 103 recetas. Se conservan los IDs anteriores y la recuperación automática de imágenes.


## 1.9.0 — Ensaladas y frutas: 50 combinaciones

Espacio propio con 40 ensaladas y 10 preparaciones de frutas, reunidas a partir del catálogo existente. Cada receta conserva su identificador, imagen 3D, versión en inglés, favoritos, notas y opciones de menú y compras. El catálogo mantiene 1016 recetas únicas.

- Acceso desde Inicio, navegación lateral y la categoría Viandas y ensaladas.
- Enlace directo `#combinaciones`; filtros enlazables `#ensaladas` y `#frutas`.
- Búsqueda bilingüe, orden y tiempo funcionan dentro de la selección de 50 recetas.
- Contadores: 50 combinaciones, 40 ensaladas y 10 frutas.
- Versión 1.9.0 para renovar los archivos de la aplicación sin cambiar la clave de datos personales.


## 1.10.0 — Maíz y tamales, 50 ensaladas mixtas y 50 jugos y batidos

Se añaden 49 recetas completas y bilingües: caldosa cubana con maíz, harina de maíz caldosa con cerdo, 10 ensaladas mixtas y 37 jugos y batidos. Se conservan los 1016 IDs anteriores. Las hayacas usan ahora el título «Hallacas cubanas (hayacas) en hojas de plátano» y conservan su ID r1012, imagen y alias de búsqueda.

- `#maiz`: 14 platos, con hallacas, ajiaco, caldosa y harina de maíz primero; filtros de tamales y hallacas, caldos y harinas, y frituras.
- `#ensaladas`: 50 ensaladas mixtas, reutilizando 40 existentes y añadiendo 10 combinaciones distintas. `#combinaciones` conserva además las 10 preparaciones de frutas.
- `#jugos`: 50 bebidas entre jugos, batidos y refrescos; reutiliza 13 existentes y añade 37. Destaca batido de coco, guarapo frío, jugo de mango y piña colada sin alcohol. Las otras 7 bebidas del catálogo se conservan.
- Imágenes individuales creadas con la herramienta integrada; los prompts y la asignación por receta se conservan en `source-assets/image-batches`.
- El catálogo completo suma 1065 recetas; la versión de recursos y caché es 1.10.0.


## 1.10.1 — Ensaladas frías y pastas para bocaditos

Se incorpora `#bocaditos` con 16 ensaladas frías existentes y 12 pastas o rellenos para bocaditos. Reutiliza 5 preparaciones y añade 7 pastas nuevas, con ingredientes para 12 panecillos, instrucciones completas ES/EN e imágenes individuales. Hay filtros independientes para ensaladas frías y pastas para bocaditos. Se conservan las selecciones de 50 ensaladas mixtas y 50 jugos y batidos. El catálogo alcanza 1072 recetas.


## 1.10.2 — Aviso de derechos de autor

Se añade el apartado `#derechos`, accesible desde la barra lateral y el pie de página, en español e inglés. Identifica a Cocina Cubana como proyecto de Beacon of the Eagle LLC, explica el uso personal del recetario y reserva a sus respectivos titulares los derechos que existan sobre elementos protegibles. No asigna titularidad no documentada ni presenta un número o certificado de registro oficial. El aviso reconoce el origen de IA de las ilustraciones y el alcance limitado sobre recetas tradicionales.

Se actualiza la versión de recursos y caché a 1.10.2. Se conservan los 1072 IDs, las imágenes, las traducciones y los datos personales del navegador.


## 1.11.0 — Pudín cubano de pan

Se añade `#pudines` con ocho variedades: pasas; coco; coco y piña; guayaba y queso crema; chocolate; plátano maduro; café; y naranja. Se reutilizan `r178` y `r609` y se incorporan seis versiones caseras (`r1073`–`r1078`), con cantidades, preparación completa en español e inglés e imágenes 3D individuales. La colección aparece en el menú, en inicio y dentro de Postres, también al entrar desde Pastelería. Sus filtros agrupan pasas y coco, frutas, y chocolate y café.

El catálogo alcanza 1078 recetas y 107 postres. Se conservan los IDs existentes y el almacenamiento de favoritos, notas, menú y compras. Los recursos y la caché pasan a 1.11.0.


## Página de inicio · 1.12.0

La ruta `#inicio` tiene una portada propia con bienvenida, buscador que abre el catálogo, accesos a recetas, favoritos, menú y compras, las diez categorías con sus cantidades reales, tres recetas destacadas con sus imágenes individuales y las colecciones de la casa. La portada se traduce al inglés y conserva el texto de búsqueda al cambiar de idioma. La PWA abre explícitamente en `#inicio`; los enlaces directos a las demás secciones y las recetas conservan su funcionamiento. Se mantienen todos los IDs, imágenes y datos personales existentes.


## 1.13.0 — Selección cubana y tamal sencillo

Se retiran 36 bebidas ajenas a la selección tradicional, incluidas todas las que contenían fresa, durazno o melocotón. Se conservan los IDs de las recetas restantes. Se añaden garapiña hervida de cáscara de piña (`r1079`), batido de mamey amarillo de Santo Domingo (`r1080`) y tamal de maíz solo con sal (`r1081`). El batido de chicozapote conserva `r1060` y ahora aparece como batido de níspero. La colección de jugos tiene 16 bebidas; la de maíz incluye el tamal sencillo. Catálogos completos en español e inglés y tres imágenes nuevas individuales. Total actual: 1045 recetas.


## 1.13.1 — Retirada de peras

Se eliminan las cuatro recetas con pera de ambos catálogos, de las colecciones y del manifiesto de imágenes: r623, r626, r931 y r941. Se conservan los IDs del resto y se actualizan el total (1041), las categorías y la caché de la aplicación.
