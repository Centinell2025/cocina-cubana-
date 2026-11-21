# Cocina Cubana: guía para Google Play

**Fecha de preparación:** 21 de noviembre de 2026.  
**Estado de trabajo:** paquete Android generado para preparar la publicación; la prueba en teléfono y los formularios de Google Play siguen pendientes. La compilación y firma se documentan en el informe técnico adjunto. Este documento no acredita publicación ni aprobación.

## 1. Identidad de esta aplicación

| Campo | Valor preparado |
|---|---|
| Nombre | Cocina Cubana |
| Empresa | Beacon of the Eagle LLC |
| Identificador Android | `com.beaconoftheeagle.cocinacubana` |
| Versión | `1.0.0` |
| Código de versión | `1` |
| Android objetivo | API 36, Android 16 |
| Android mínimo | API 26, Android 8.0 |
| Idiomas | Español e inglés |
| Categoría sugerida | Comida y bebida |
| Precio | Pendiente de decisión de la propietaria |
| Correo de soporte candidato | `centinellsuite@gmail.com`: confirmar antes de publicar |

El identificador es distinto del de la aplicación infantil. Los nombres de paquete son únicos y permanentes en Google Play; comprueba este valor antes de la primera carga. [Crear y configurar una app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=es)

## 2. Qué incluye la versión preparada

El catálogo auditado contiene **1.041 recetas**, con contenido en español e inglés e imágenes locales. Se distribuyen en carnes (90), aves (100), pescados y mariscos (103), arroces (100), granos y sopas (102), viandas y ensaladas (110), entrantes (109), pastelería (200), postres (107) y bebidas (57).

Favoritos, notas, menú, compras e idioma se conservan localmente. La versión Android está diseñada sin cuenta de usuario, anuncios, analítica ni permiso de Internet. Exportar e importar archivos, compartir texto e imprimir son acciones voluntarias mediante opciones de Android. La lectura utiliza voces instaladas para uso sin conexión. El temporizador necesita la aplicación activa y puede retrasarse durante la suspensión.

La verificación técnica de contenido no equivale a probar las recetas en una cocina. La ficha de la tienda no debe afirmar esa validación ni anunciar un registro de derechos de autor que no conste.

## 3. Antes de entrar en Play Console

- [x] AAB de lanzamiento preparado: **Cocina_Cubana_1.0.0_Google_Play.aab**. Verifica su SHA-256 con el informe adjunto.
- [ ] Conservar la clave de carga y su contraseña de forma segura. No incluirlas en un ZIP público, repositorio ni ficha de tienda.
- [ ] Instalar y probar el APK de prueba en un teléfono Android.
- [ ] Confirmar el correo de soporte y el precio: gratuito o de pago. No usar automáticamente el precio de otra aplicación.
- [ ] Elegir los países de distribución y el público al que se dirige.
- [ ] Revisar el borrador de privacidad y publicar su versión definitiva en una URL pública.
- [ ] Capturar pantallas reales del teléfono para la ficha.

Para aplicaciones nuevas Google solicita **Android App Bundle (`.aab`)**. El APK es útil para instalar y probar directamente. Desde el 31 de agosto de 2026 las apps móviles nuevas y sus actualizaciones deben apuntar a **API 36 o superior**. [Android App Bundles](https://developer.android.com/guide/app-bundle?hl=es-419) · [API objetivo](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en-UM)

Play App Signing administra la firma de las aplicaciones distribuidas por Google; tu **clave de carga** sirve para firmar el AAB que presentas. Guarda esa clave. [Firma de aplicaciones](https://support.google.com/googleplay/android-developer/answer/9842756?hl=es)

## 4. Prueba práctica en teléfono

Instala **Cocina_Cubana_1.0.0_Prueba.apk**. Aparece como **Cocina Cubana Prueba** y usa el identificador `com.beaconoftheeagle.cocinacubana.preview`, separado de la futura app de Google Play. No subas este APK como versión de producción. Las notas y favoritos de la prueba no pasarán automáticamente a producción: expórtalos desde Ayuda si quieres conservarlos. Android necesita una versión actualizada de System WebView o Chrome (100 o posterior).


Realiza una pasada con Wi-Fi y datos móviles desactivados:

1. Abre la app desde cero y consulta varias categorías, recetas e imágenes.
2. Busca una receta, cambia de idioma, guarda un favorito y una nota. Cierra y vuelve a abrir para comprobar que se conservan.
3. Añade elementos al menú y la compra. Comprueba su edición y eliminación.
4. Exporta tus datos, verifica el archivo e impórtalo. Antes de probar la restauración, conserva una copia del archivo.
5. Prueba lectura con una voz sin conexión instalada. Si no hay voces disponibles, comprueba el mensaje y la salida de esa función.
6. Verifica que compartir muestra la selección de aplicaciones y que imprimir abre el servicio de Android.
7. Prueba el temporizador con la app abierta y revisa cómo se informa de sus límites al suspenderla.
8. Comprueba el botón Atrás, la rotación, el teclado, el tamaño de letra y la navegación dentro de una receta.

Después, revisa un enlace de fuente con conexión: debe abrirse por elección del usuario en el navegador. Registra cualquier fallo antes de enviar. Las comprobaciones automáticas de archivos no reemplazan esta prueba en Android.

## 5. Crear la ficha en Google Play

Entra en [Google Play Console](https://play.google.com/console/) con la cuenta propietaria. Crea una aplicación nueva y usa **Cocina Cubana**, español como idioma principal y tipo **Aplicación**. Selecciona el precio únicamente cuando esté decidido.

Usa `ficha-es.txt` para español y `listing-en-US.txt` para inglés. Pega únicamente nombre y descripciones; las notas de propietaria al final de esos archivos no pertenecen a la ficha.

Recursos gráficos necesarios:

| Recurso | Especificación |
|---|---|
| Icono de tienda | PNG de 512 × 512 px; máximo 1024 KB |
| Gráfico destacado | 1024 × 500 px; JPEG o PNG sin transparencia |
| Capturas de teléfono | Entre 2 y 8, reales de la app; cada lado entre 320 y 3840 px |
| Recomendación para capturas | Cuatro imágenes de 1080 × 1920 px permiten mostrar bien el uso vertical |

Se incluyen `graphics/icon-512.png` y gráficos destacados de 1024 × 500 en español e inglés. Las capturas reales de teléfono siguen pendientes. No presentar maquetas o imágenes generadas como capturas reales. [Recursos de vista previa](https://support.google.com/googleplay/android-developer/answer/9866151?hl=es)

## 6. Completar contenido y privacidad

En el panel de la aplicación, completa anuncios, acceso a la app, público objetivo, clasificación de contenido y Seguridad de los datos según la versión probada. El documento `data-safety-review.md` orienta las respuestas; no es un formulario ya enviado.

`privacy-policy.html` contiene la **política bilingüe preparada**, también incluida en la app. Confirma el correo antes de publicarla en una URL accesible sin inicio de sesión. El sitio original es privado: no cambies su audiencia para usarlo como política. Aloja la política definitiva en un espacio público apropiado y enlázala desde la app y Play Console.

Todas las aplicaciones necesitan política de privacidad, incluso si no acceden a datos personales sensibles. No marques «sin recopilación» sin revisar el paquete final y sus servicios. [Datos del usuario](https://support.google.com/googleplay/android-developer/answer/10144311?hl=es) · [Seguridad de los datos](https://support.google.com/googleplay/android-developer/answer/10417469?hl=es) · [Preparar la revisión](https://support.google.com/googleplay/android-developer/answer/9859455?hl=es)

## 7. Subir, probar y solicitar revisión

1. Abre la pista de **prueba interna** y crea una versión con el AAB firmado.
2. Completa las notas de versión y revisa errores o advertencias de Play Console.
3. Distribuye la prueba a las personas elegidas cuando corresponda y recoge los fallos observados.
4. Comprueba qué requisitos de acceso a producción muestra esa cuenta.
5. Envía a revisión únicamente cuando estén completos la prueba, la ficha y los formularios.

Si la cuenta es **personal y fue creada después del 13 de noviembre de 2023**, Google exige una prueba cerrada con al menos **12 participantes inscritos continuamente durante 14 días** y una solicitud posterior de acceso a producción. No es una exigencia universal de todas las cuentas. La existencia de una LLC no determina por sí sola el tipo registrado en Play Console. [Requisitos de pruebas](https://support.google.com/googleplay/android-developer/answer/14151465?hl=es)

Una aplicación basada en contenido web puede publicarse si cumple las políticas. Google exige funcionamiento estable, contenido útil y autorización sobre la web incorporada; la aceptación depende de su revisión. [Funcionalidad y experiencia](https://support.google.com/googleplay/android-developer/answer/9898783?hl=es) · [WebView y contenido repetitivo](https://support.google.com/googleplay/android-developer/answer/9899034?hl=es)

### Registro de verificación final

| Comprobación | Resultado a completar |
|---|---|
| Compilación y firma AAB | Correctas; ver `verificacion-entrega.md` |
| Instalación y funciones en teléfono | Pendiente |
| Correo y precio confirmados | Pendiente |
| URL pública de privacidad | Pendiente |
| Capturas reales | Pendiente |
| Formularios de Play Console | Pendiente |
| Envío y resultado de revisión | No enviados por este documento |
