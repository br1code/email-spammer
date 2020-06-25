# Email Spammer

Vamos a crear un servicio de email spam. Permitiremos que alguna entidad/plataforma/persona pueda crear una lista de email spam, la cual envíe un template pre-definido. Cualquier persona podrá suscribirse a esta lista de spam (esto último no sería un caso en la vida real, pero estamos simulando que alguien se creó una cuenta de usuario y esto al mismo tiempo haría que se suscriba a esta lista de spam). 

Para crear una lista de spam, se pedirán los siguientes datos:

- template (el template HTML que se utilizará para crear el email)
- frecuencia en segundos de envío de spam (cada cuánto se debe hacer spam)

Para esto, crearemos una página que contenga un pequeño formulario para crear la lista de spam. El servidor debe devolver el id (unico identificador) de la lista de spam.

Con este id, las personas podrán subscribirse a esta lista de spam.

Por lo tanto, el schema de una lista de spam ("spamList") se vería asi:

- template: string
- frecuencia: number
- subscribers: array de Subscriber (comienza vacío)

En un ejemplo real, la suscripción a una lista de spam ocurriría luego de que un usuario se registre en alguna página/plataforma/app con su email. 

En este caso, esa situación será simulada y lo único que haremos es recibir los datos del nuevo suscriptor mas el id de la lista de spam a la que quiere unirse y con estos datos, registrar al nuevo suscriptor en la lista de spam correspondiente.

Para poder recibir estos datos, expondremos un endpoint (una ruta en nuestro webserver/api) que reciba los siguientes datos:

> Sujeto a cambios

- listId (id de la lista de spam a la cual esta persona quiere suscribirse)
- email 
- first name (su primer nombre, será usado en el template del email para mostrar un mensaje personalizado)
- last name (su primer nombre, será usado en el template del email para mostrar un mensaje personalizado)

Con estos datos, crearemos un registro nuevo en la collección de suscriptores. Y además, agregaremos este "Subscriber" al array de "subscribers" de la lista de spam correspondiente.

Por lo tanto, el schema de un "Subscriber" podría verse asi:

- email: string
- firstName: string
- lastName: string

---

Este servicio, cada x tiempo deberá enviar un email a cada suscriptor. El contenido de este email no importa mucho por ahora.

Cómo podemos implementar esto? que algo se ejecute cada x tiempo? 

Debe haber librerias para esto, pero como esto simplemente es una demo o una app de práctica, seguramente usaremos 
un setInterval() y ya fue. Quizás que se ejecute cada varios minutos. 

> Heroku detiene nuestra instancia de app a los 5 min de no recibir requests? no me acuerdo.

Para enviar emails, podemos usar la libreria https://nodemailer.com/about/

---

Una persona también puede desuscribirse. En cada email enviado, debe haber un link que redireccione a una página web 
con un botón para confirmar la "de-suscripción". 

Una persona puede suscribirse a esta lista de spam con su email (en realidad esto pasaría cuando el usuario se registre en el sistema, pero como no tenemos ese sistema, vamos a abstraer este mismo y solo vamos a ser el servicio que se encarga del spam). Por lo tanto, vamos a recibir un email de x persona y lo vamos a suscribir a la lista de spam.

Cada 30 minutos, vamos a enviar un correo spam random a todos los emails registrados.

Una persona puede tocar un link en el email para desuscribirse. Este lo debería llevar a una página (Una interfaz super simple) en el que pueda tocar un botón para confirmar su desubscripción. Esto iria al backend y quitaría ese email de nuestra lista de spam