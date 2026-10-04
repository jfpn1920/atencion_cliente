// ===== Atención Cliente =====
// Clave con la que se guardan los datos en localStorage
const CLAVE = 'atencionCliente';
// Lista con los id de los campos del formulario
const CAMPOS = ['nombre', 'correo', 'telefono', 'asunto', 'mensaje', 'acepto'];
// Estado: lo que se está escribiendo (borrador) y los mensajes ya enviados
let estado = { borrador: {}, enviados: [] };
// ===== Referencias a elementos del HTML =====
const formulario = document.getElementById('formulario'); // el formulario
const aviso = document.getElementById('aviso');           // aviso de éxito o error
const lista = document.getElementById('lista');           // lista del historial
const contador = document.getElementById('contador');     // contador de caracteres
const btnBorrar = document.getElementById('btn-borrar');  // botón borrar historial
// ===== Funciones de localStorage =====
// Guarda el estado actual en el navegador (como texto JSON)
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// Carga el estado guardado (si existe) al abrir la página
function cargar() {
    const datos = localStorage.getItem(CLAVE); // lee el texto guardado
    if (datos) estado = { ...estado, ...JSON.parse(datos) }; // lo mezcla con el estado base
}
// ===== Funciones del formulario =====
// Lee el valor de un campo (las casillas devuelven true/false)
function leer(id) {
    const campo = document.getElementById(id);
    return campo.type === 'checkbox' ? campo.checked : campo.value.trim();
}
// Copia lo que hay escrito en el formulario al borrador y lo guarda
function guardarBorrador() {
    CAMPOS.forEach(id => estado.borrador[id] = leer(id));
    guardar();
    contador.textContent = `${leer('mensaje').length}/300`; // actualiza el contador
}
// Escribe el borrador guardado dentro de los campos del formulario
function mostrarBorrador() {
    CAMPOS.forEach(id => {
        const campo = document.getElementById(id);
        const valor = estado.borrador[id];
        if (valor === undefined) return; // si no hay nada guardado, lo deja igual
        if (campo.type === 'checkbox') campo.checked = valor;
        else campo.value = valor;
    });
    contador.textContent = `${leer('mensaje').length}/300`;
}
// Muestra el texto de error de un campo (texto vacío = sin error)
function error(id, texto) {
    document.getElementById('error-' + id).textContent = texto;
    return texto === ''; // devuelve true si el campo está bien
}
// Revisa todos los campos y devuelve true solo si todos son válidos
function validar() {
    const resultados = [
        error('nombre', leer('nombre').length >= 3 ? '' : 'Escribe al menos 3 letras.'),
        error('correo', /^\S+@\S+\.\S+$/.test(leer('correo')) ? '' : 'Escribe un correo válido.'),
        error('telefono', /^(\d{7,10})?$/.test(leer('telefono')) ? '' : 'Usa entre 7 y 10 números.'),
        error('mensaje', leer('mensaje').length >= 10 ? '' : 'El mensaje es muy corto (mínimo 10).'),
        error('acepto', leer('acepto') ? '' : 'Debes aceptar para continuar.')
    ];
    return resultados.every(bien => bien); // true si ninguno falló
}
// Muestra un aviso bajo el botón (clase "ok" = verde, "mal" = rojo)
function mostrarAviso(texto, clase) {
    aviso.textContent = texto;
    aviso.className = 'aviso ' + clase;
}
// Dibuja la lista de mensajes enviados
function mostrarHistorial() {
    lista.innerHTML = ''; // vacía la lista
    if (estado.enviados.length === 0) return void (lista.innerHTML = '<li>Aún no has enviado mensajes.</li>');
    estado.enviados.forEach(m => {
        const li = document.createElement('li');
        li.textContent = `${m.fecha} · ${m.asunto} · ${m.nombre}`;
        lista.appendChild(li);
    });
}
// ===== Eventos =====
// Cada vez que se escribe algo, se guarda el borrador
formulario.addEventListener('input', guardarBorrador);
// Al enviar el formulario
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // evita que la página se recargue
    // Si hay errores, avisa en rojo y se detiene
    if (!validar()) return mostrarAviso('⚠️ Revisa los campos marcados.', 'mal');
    // Guarda el mensaje en el historial y limpia el borrador
    estado.enviados.push({ nombre: leer('nombre'), asunto: leer('asunto'), fecha: new Date().toLocaleString('es-CO') });
    estado.borrador = {};
    formulario.reset();
    guardar();
    mostrarBorrador();
    mostrarHistorial();
    mostrarAviso('✅ ¡Mensaje enviado! Gracias por escribirnos.', 'ok');
});
// Botón "Borrar historial"
btnBorrar.addEventListener('click', () => {
    estado.enviados = [];
    guardar();
    mostrarHistorial();
});
cargar();
mostrarBorrador();
mostrarHistorial();