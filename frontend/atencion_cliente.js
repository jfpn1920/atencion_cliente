//------------------------------------//
//--|funcionalidad_atencion_cliente|--//
//------------------------------------//
const CLAVE = 'atencionCliente';
const CAMPOS = ['nombre', 'correo', 'telefono', 'asunto', 'mensaje', 'acepto'];
let estado = { borrador: {}, enviados: [] };
const formulario = document.getElementById('formulario');
const aviso = document.getElementById('aviso');
const lista = document.getElementById('lista');
const contador = document.getElementById('contador');
const btnBorrar = document.getElementById('btn-borrar');
//----------------------------//
//--|guardar_y_cargar_datos|--//
//----------------------------//
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
function cargar() {
    const datos = localStorage.getItem(CLAVE);
    if (datos) estado = { ...estado, ...JSON.parse(datos) };
}
//-------------------------------//
//--|leer_datos_del_formulario|--//
//-------------------------------//
function leer(id) {
    const campo = document.getElementById(id);
    return campo.type === 'checkbox' ? campo.checked : campo.value.trim();
}
function guardarBorrador() {
    CAMPOS.forEach(id => estado.borrador[id] = leer(id));
    guardar();
    contador.textContent = `${leer('mensaje').length}/300`;
}
function mostrarBorrador() {
    CAMPOS.forEach(id => {
        const campo = document.getElementById(id);
        const valor = estado.borrador[id];
        if (valor === undefined) return;
        if (campo.type === 'checkbox') campo.checked = valor;
        else campo.value = valor;
    });
    contador.textContent = `${leer('mensaje').length}/300`;
}
//--------------------//
//--|validar_campos|--//
//--------------------//
function error(id, texto) {
    document.getElementById('error-' + id).textContent = texto;
    return texto === '';
}
function validar() {
    const resultados = [
        error('nombre', leer('nombre').length >= 3 ? '' : 'Escribe al menos 3 letras.'),
        error('correo', /^\S+@\S+\.\S+$/.test(leer('correo')) ? '' : 'Escribe un correo válido.'),
        error('telefono', /^(\d{7,10})?$/.test(leer('telefono')) ? '' : 'Usa entre 7 y 10 números.'),
        error('mensaje', leer('mensaje').length >= 10 ? '' : 'El mensaje es muy corto (mínimo 10).'),
        error('acepto', leer('acepto') ? '' : 'Debes aceptar para continuar.')
    ];
    return resultados.every(bien => bien);
}
//--------------------------------//
//--|mostrar_avisos_e_historial|--//
//--------------------------------//
function mostrarAviso(texto, clase) {
    aviso.textContent = texto;
    aviso.className = 'aviso ' + clase;
}
//-----------------------//
//--|mostrar_historial|--//
//-----------------------//
function mostrarHistorial() {
    lista.innerHTML = '';
    if (estado.enviados.length === 0) {
        lista.innerHTML = '<li>Aún no has enviado mensajes.</li>';
        return;
    }
    estado.enviados.forEach(m => {
        const li = document.createElement('li');
        li.textContent = `${m.fecha} · ${m.asunto} · ${m.nombre}`;
        lista.appendChild(li);
    });
}
formulario.addEventListener('input', guardarBorrador);
//-----------------------//
//--|enviar_formulario|--//
//-----------------------//
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!validar()) {
        return mostrarAviso('⚠️ Revisa los campos marcados.', 'mal');
    }
    estado.enviados.push({
        nombre: leer('nombre'),
        asunto: leer('asunto'),
        fecha: new Date().toLocaleString('es-CO')
    });
    estado.borrador = {};
    formulario.reset();
    guardar();
    mostrarBorrador();
    mostrarHistorial();
    mostrarAviso('✅ ¡Mensaje enviado! Gracias por escribirnos.', 'ok');
});
//----------------------//
//--|borrar_historial|--//
//----------------------//
btnBorrar.addEventListener('click', () => {
    estado.enviados = [];
    guardar();
    mostrarHistorial();
});
//------------------------//
//--|iniciar_aplicacion|--//
//------------------------//
cargar();
mostrarBorrador();
mostrarHistorial();