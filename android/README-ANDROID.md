# Cocina Cubana para Android

Aplicación Android de Beacon of the Eagle LLC que incluye el recetario de `../dist`, sus traducciones y sus ilustraciones. No carga el sitio de ChatGPT ni requiere iniciar sesión.

## Configuración

- Identificador de producción: `com.beaconoftheeagle.cocinacubana`.
- Versión: `1.0.1`, código `2`.
- Android mínimo: 8.0 / API 26. Compilación y destino: API 36.
- JDK 17, Gradle 8.11.1, Android Gradle Plugin 8.10.1, AndroidX WebKit 1.14.0.
- Instalar Android SDK Platform 36 y Build Tools 35.0.0 (versión predeterminada compatible de AGP 8.10.1).
- En el dispositivo: Android System WebView o Chrome 100 o posterior. Las versiones anteriores muestran una pantalla nativa de actualización, sin intentar abrir código incompatible.
- Abrir esta carpeta `android` en Android Studio y permitir la sincronización de dependencias.
- Configurar la ruta local del SDK en Android Studio o en `local.properties` (`sdk.dir=...`). Este archivo no se incorpora al repositorio.

`app/build.gradle` empaqueta directamente `../dist` mediante `assets.srcDirs`. No es necesario mantener una segunda copia del catálogo. El punto de entrada es `https://appassets.androidplatform.net/assets/index.html`, un origen local interceptado por `WebViewAssetLoader`; no es un servidor externo.

## Compilar

Desde esta carpeta, con Gradle Wrapper disponible:

```sh
./gradlew :app:assembleDebug
./gradlew :app:bundleRelease
./gradlew :app:assemblePreview
```

En Windows se utiliza `gradlew.bat` en lugar de `./gradlew`.

- APK de pruebas: `app/build/outputs/apk/debug/app-debug.apk`. El identificador de depuración termina en `.debug`, para no sustituir la aplicación de producción.
- APK para que la propietaria pruebe: `app/build/outputs/apk/preview/app-preview.apk`, firmado cuando las variables de firma están configuradas. Aparece como **Cocina Cubana Prueba** y utiliza el identificador separado `com.beaconoftheeagle.cocinacubana.preview`. Su instalación no interfiere con una futura versión descargada desde Google Play.
- La versión de depuración aparece como **Cocina Cubana QA**. La versión de producción mantiene **Cocina Cubana**.
- AAB de producción: `app/build/outputs/bundle/release/app-release.aab`.
- **Sin las variables de firma indicadas abajo, el AAB de release se genera sin firma y no puede cargarse en Google Play.**
- Si el paquete recibido no incluye los archivos ejecutables del Wrapper y su JAR, un equipo con Gradle puede generarlos con `gradle wrapper --gradle-version 8.11.1 --distribution-type bin`; no sustituyas el JAR por uno de origen desconocido.

## Firma de carga

La clave de carga debe permanecer bajo el control de la propietaria. No se genera ni se incluye ninguna clave de producción en este proyecto.

La configuración admite estas cuatro variables de entorno, todas obligatorias cuando se configura la firma:

| Variable | Contenido |
|---|---|
| `COCINA_KEYSTORE_PATH` | Ruta de la clave de carga existente |
| `COCINA_KEYSTORE_PASSWORD` | Contraseña del almacén |
| `COCINA_KEY_ALIAS` | Alias de la clave |
| `COCINA_KEY_PASSWORD` | Contraseña de la clave |

Para verificar la configuración y compilar el AAB de producción y el APK de prueba firmados:

```sh
./gradlew checkUploadSigning :app:bundleRelease :app:assemblePreview
```

También puede utilizarse Android Studio → **Build → Generate Signed Bundle / APK → Android App Bundle**, con la clave de carga de la propietaria. Guarda la clave y su copia de seguridad en una ubicación privada, fuera del proyecto, y utiliza Play App Signing al configurar Google Play. No pegues contraseñas en el código, archivos de proyecto o conversaciones.

## Funciones nativas

La Activity habilita almacenamiento DOM local, confirmaciones, Atrás, impresión, compartir, portapapeles, exportación e importación con el selector de documentos de Android, voces instaladas sin conexión y pantalla encendida durante el modo de cocina.

La app no solicita permisos de red, archivos, cámara, micrófono ni ubicación. Los enlaces externos `http`, `https` y `mailto` se abren en las aplicaciones del sistema. Todo contenido de red dentro de la WebView se bloquea. El respaldo automático del almacenamiento de la app está desactivado; la persona controla las copias JSON desde Ayuda.

El temporizador de la interfaz sigue siendo un temporizador con la aplicación abierta: no se implementan alarmas exactas, servicio en primer plano ni notificaciones en segundo plano. La lectura requiere una voz instalada que no necesite red; si no existe, aparece una explicación para instalarla en Android.

La navegación de la Activity admite Android 16 y aplica los espacios reservados para barras del sistema y teclado. Se conservan orientación flexible y tamaño ajustable para tablets.

## Contrato del puente

La WebView inyecta `CocinaNative` solo en el origen exacto `https://appassets.androidplatform.net`. Solo se aceptan mensajes del frame principal. No se utiliza `addJavascriptInterface`.

```js
CocinaNative.onmessage = event => {
  const reply = JSON.parse(event.data);
  // {id, ok, result, error}
};
CocinaNative.postMessage(JSON.stringify({
  id: "request-1",
  action: "copyText",
  payload: {text: "Ingredientes de mi receta"}
}));
```

| Acción | Payload | Resultado de éxito |
|---|---|---|
| `shareText` | `{title, text}` | `{opened: true}` |
| `copyText` | `{text}` | `{copied: true}` |
| `exportData` | `{filename, content}` (JSON en cadena) | `{saved: true, filename}` |
| `importData` | `{}` | `{text}` (JSON en cadena) |
| `print` | `{title}` | `{opened: true}` |
| `speak` | `{text, language}` (`es` / `en`, con región opcional) | `{started: true}` |
| `stopSpeech` | `{}` | `{stopped: true}` |
| `keepAwake` | `{enabled: boolean}` | `{enabled}` |

Las respuestas siempre incluyen `id`, `ok`, `result` y `error`; los campos sin valor contienen `null`. Cancelar un selector de archivos devuelve `ok: false, error: "cancelled"`. La interfaz debe tratarlo como cancelación, no anunciar que el archivo se guardó. El JSON importado y exportado se limita a 32 MiB (33.554.432 bytes), y la importación debe pasar además la validación de estructura de la aplicación web. Los textos de compartir y copiar se limitan a 64.000 caracteres; lectura al límite del motor TTS.

Para Atrás, la interfaz define `window.cocinaHandleBack()`, que devuelve `true` si cerró un diálogo o navegó dentro de la app, y `false` si debe salir. Si esa función no existe, por ejemplo en la página de privacidad, se utiliza el historial local antes de salir.

La impresión nativa emite el evento `afterprint` cuando finaliza o se cierra el servicio de impresión. No retires las clases CSS de impresión inmediatamente después de recibir `{opened:true}`.

## Verificación antes de subir

Probar el APK en un dispositivo Android real, incluyendo primer inicio sin conexión, búsqueda y recetas en ambos idiomas, favoritos después de cerrar, menú y compras, guardar/restaurar una copia, Atrás y diálogos, compartir, impresión/PDF, teclado y rotación. Probar TTS con una voz instalada sin red. Verificar la política pública de privacidad, los datos de soporte y las declaraciones de Google Play contra la versión final.

La configuración de destino API, la compilación y los controles del proyecto no sustituyen la revisión de Google Play ni garantizan su aprobación.

### Smoke test Android aislado

Se incluye un único test de instrumentación sin bibliotecas de pruebas externas. Verifica el manifiesto sin permisos, respaldo desactivado, API 36, catálogos español e inglés de 1.041 recetas, 1.041 imágenes locales, arranque de la Activity, DOM, puente Android, decodificación de una imagen y ausencia de recursos remotos al iniciar. Solo acepta el identificador `.debug`; no abre ni modifica la instalación de producción o la de prueba de la propietaria. No hace clics, no introduce datos ni genera capturas.

```sh
./gradlew :app:assembleDebug :app:assembleDebugAndroidTest
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell am instrument -w com.beaconoftheeagle.cocinacubana.debug.test/com.beaconoftheeagle.cocinacubana.OfflineSmokeInstrumentation
```

Ejecutar únicamente en el emulador de QA o un dispositivo de pruebas elegido. El resultado esperado es `OK (1 test)` y `INSTRUMENTATION_CODE: -1`. El chequeo de arranque tiene un tiempo máximo acotado; si el emulador no inicia o no dispone de WebView compatible, debe informarse como verificación no completada, sin atribuir al APK una prueba que no se ejecutó.
