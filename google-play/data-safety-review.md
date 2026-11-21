# Cocina Cubana: revisión de Seguridad de los datos

**Borrador para la propietaria — 21 de noviembre de 2026.**  
Aplicación: `com.beaconoftheeagle.cocinacubana`, versión `1.0.0` (código `1`).

Estas conclusiones se basan en la arquitectura preparada y el contenido auditado. Deben contrastarse con el AAB final, el manifiesto combinado y la prueba en Android. Este documento no representa respuestas ya enviadas a Google.

## Comportamiento previsto

| Función | Datos implicados | Destino y control |
|---|---|---|
| Consultar recetas e imágenes | Contenido del catálogo | Incluido localmente en la aplicación |
| Favoritos y preferencias | Identificadores de recetas e idioma | Almacenamiento local de la app |
| Notas, menú y compras | Texto y selecciones introducidos por el usuario | Almacenamiento local de la app |
| Exportar datos | Archivo JSON con los datos incluidos en la exportación | Archivo guardado solo cuando el usuario lo solicita y elige destino mediante Android |
| Importar datos | Archivo JSON seleccionado | Lectura local de ese archivo mediante el selector de Android |
| Compartir una receta | Texto elegido para compartir | Aplicación o destinatario que selecciona el usuario en la hoja de compartir |
| Imprimir | Contenido que el usuario envía a impresión | Servicio de impresión elegido mediante Android |
| Lectura en voz alta | Texto de la receta | Motor y voces instaladas para funcionamiento sin conexión; no se usa micrófono |
| Abrir fuentes | URL seleccionada | Navegador externo por acción del usuario |
| Contactar con soporte | Mensaje y datos que decida incluir el usuario | Servicio de correo elegido por el usuario; fuera de la app |

El texto libre puede contener información personal si el usuario decide introducirla. Que la app la conserve localmente no justifica describirla como anónima ni elimina la necesidad de explicarlo en la política.

## Respuestas candidatas y condiciones

| Cuestión | Respuesta candidata | Qué confirmar |
|---|---|---|
| ¿La aplicación recopila o comparte datos de usuario de los tipos declarables? | **No**, únicamente si se confirma el diseño completamente local y la aplicabilidad de las excepciones de Google para acciones iniciadas por el usuario | Sin red propia, anuncios, analítica, informes remotos de errores ni bibliotecas que transmitan datos; revisar exportación, compartir, impresión y voz |
| ¿Contiene anuncios? | No | No se incorporó SDK publicitario ni contenido publicitario en el paquete final |
| ¿Permite crear una cuenta? | No | No existen registro, inicio de sesión ni una cuenta remota de la aplicación |
| ¿Qué opciones de borrado ofrece? | Controles locales disponibles y borrado de datos desde Ajustes de Android | Identificar exactamente qué controles existen; las copias exportadas se eliminan por separado |
| ¿Cifra datos en tránsito? | No responder afirmativamente por rutina | Si no hay recopilación/transmisión declarable, la pregunta puede no corresponder. Seguir las opciones reales del formulario |
| ¿Requiere credenciales para la revisión? | No | Todo el catálogo y las funciones declaradas están accesibles sin autenticación |

El formulario puede cambiar o mostrar preguntas adicionales según las respuestas. No marcar casillas que no correspondan solo para completar el proceso.

## Puntos que deben verificarse en el paquete final

- El manifiesto combinado de lanzamiento carece del permiso `android.permission.INTERNET` y de permisos sensibles innecesarios.
- No se solicitan cámara, micrófono, ubicación, contactos ni identificador publicitario.
- Las imágenes, fuentes y archivos que necesita la app están empaquetados y no dependen de llamadas remotas.
- No hay SDK de publicidad, analítica ni diagnóstico con envío automático.
- La voz solo usa voces aptas para funcionamiento sin conexión; si no hay una voz disponible, la función lo comunica.
- La importación y exportación utilizan el archivo que selecciona el usuario, sin acceso general a todos sus archivos.
- Compartir e imprimir requieren una acción expresa. La app no elige destinatarios ni envía mensajes silenciosamente.
- Los enlaces de fuentes se abren por acción del usuario en un navegador externo.
- La configuración de copia de seguridad de Android queda revisada. Si permite respaldo del almacenamiento local, documentar ese comportamiento antes de declarar que nunca sale del dispositivo.

## Política pública y contacto

Confirmar con la propietaria el correo **centinellsuite@gmail.com** antes de usarlo como soporte o contacto de privacidad. La política debe identificar Cocina Cubana y Beacon of the Eagle LLC, describir las funciones anteriores y estar disponible en una URL pública, además de dentro de la app.

Si el usuario envía un correo de soporte, la empresa sí recibe ese mensaje. Esto es distinto de afirmar que la app recopila datos automáticamente. La política debe explicar el uso de ese correo sin inventar un plazo de retención ni prometer una eliminación que todavía no tenga procedimiento.

## Referencias oficiales

- [Cómo completar Seguridad de los datos](https://support.google.com/googleplay/android-developer/answer/10417469?hl=es): incluye tratamiento en el dispositivo, servicios de terceros y excepciones para ciertas transferencias iniciadas por el usuario.
- [Política de datos del usuario](https://support.google.com/googleplay/android-developer/answer/10144311?hl=es): política de privacidad, transparencia y correspondencia con el comportamiento real.
- [Eliminación de cuentas](https://support.google.com/googleplay/android-developer/answer/13327111?hl=es): revisar si una versión posterior incorpora creación de cuentas.

**Cambio futuro:** añadir anuncios, cuentas, sincronización, analítica, notificaciones con servicios remotos o un lector de voz en línea exige volver a revisar este documento, la política y las respuestas de Play Console.
