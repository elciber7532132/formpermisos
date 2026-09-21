document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // URL DEL BACKEND EN RENDER
    // =====================================================

    const API_URL = "https://permisosfun-1.onrender.com";


    // =====================================================
    // ELEMENTOS DEL FORMULARIO
    // =====================================================

    const formulario =
        document.getElementById("solicitudForm");

    const btnEnviar =
        document.getElementById("btnEnviar");

    const textoBoton =
        document.getElementById("textoBoton");

    const loader =
        document.getElementById("loader");

    const successMessage =
        document.getElementById("successMessage");

    const numeroSolicitud =
        document.getElementById("numeroSolicitud");

    const nuevaSolicitud =
        document.getElementById("nuevaSolicitud");

    const motivo =
        document.getElementById("motivo");

    const contador =
        document.getElementById("contador");

    const fecha =
        document.getElementById("fecha");

    const horaSalida =
        document.getElementById("hora_salida");

    const horaRetorno =
        document.getElementById("hora_retorno");

    const dni =
        document.getElementById("dni");

    const nombre =
        document.getElementById("nombre");

    const area =
        document.getElementById("area");

    const cargo =
        document.getElementById("cargo");

    const tipoPermiso =
        document.getElementById("tipo_permiso");

    const observaciones =
        document.getElementById("observaciones");


    // =====================================================
    // DOCUMENTO SUSTENTATORIO
    // =====================================================

    const documento =
        document.getElementById("documento");

    const nombreArchivo =
        document.getElementById("nombreArchivo");


    // =====================================================
    // MOSTRAR ARCHIVO SELECCIONADO
    // =====================================================

    if (documento) {

        documento.addEventListener(
            "change",
            () => {

                const archivo =
                    documento.files[0];

                if (!archivo) {

                    if (nombreArchivo) {
                        nombreArchivo.textContent = "";
                    }

                    return;
                }


                // -----------------------------------------
                // TIPOS PERMITIDOS
                // -----------------------------------------

                const tiposPermitidos = [
                    "image/jpeg",
                    "image/png",
                    "application/pdf"
                ];


                if (
                    !tiposPermitidos.includes(
                        archivo.type
                    )
                ) {

                    alert(
                        "Solo se permiten archivos JPG, JPEG, PNG o PDF."
                    );

                    documento.value = "";

                    if (nombreArchivo) {
                        nombreArchivo.textContent = "";
                    }

                    return;
                }


                // -----------------------------------------
                // TAMAÑO MÁXIMO: 4 MB
                // -----------------------------------------

                const maximo =
                    4 * 1024 * 1024;


                if (
                    archivo.size > maximo
                ) {

                    alert(
                        "El archivo no puede superar los 4 MB."
                    );

                    documento.value = "";

                    if (nombreArchivo) {
                        nombreArchivo.textContent = "";
                    }

                    return;
                }


                // -----------------------------------------
                // MOSTRAR NOMBRE
                // -----------------------------------------

                if (nombreArchivo) {

                    nombreArchivo.textContent =
                        "📎 Archivo seleccionado: " +
                        archivo.name;

                }

            }
        );

    }


    // =====================================================
    // CONVERTIR ARCHIVO A BASE64
    // =====================================================

    function archivoABase64(archivo) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload = () => {

                    resolve(
                        reader.result
                    );

                };


                reader.onerror = () => {

                    reject(
                        new Error(
                            "No se pudo leer el archivo."
                        )
                    );

                };


                reader.readAsDataURL(
                    archivo
                );

            }
        );

    }


    // =====================================================
    // FECHA MÍNIMA = HOY
    // =====================================================

    function obtenerFechaLocal() {

        const hoy =
            new Date();

        const año =
            hoy.getFullYear();

        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");

        return `${año}-${mes}-${dia}`;
    }


    const fechaActual =
        obtenerFechaLocal();


    if (fecha) {

        fecha.min =
            fechaActual;

    }


    // =====================================================
    // CONTADOR DEL MOTIVO
    // =====================================================

    if (
        motivo &&
        contador
    ) {

        motivo.addEventListener(
            "input",
            () => {

                contador.textContent =
                    motivo.value.length;

            }
        );

    }


    // =====================================================
    // VALIDAR DNI
    // =====================================================

    if (dni) {

        dni.addEventListener(
            "input",
            () => {

                dni.value =
                    dni.value.replace(
                        /\D/g,
                        ""
                    );


                if (
                    dni.value.length > 8
                ) {

                    dni.value =
                        dni.value.substring(
                            0,
                            8
                        );

                }

            }
        );

    }


    // =====================================================
    // BUSCAR TRABAJADOR POR DNI
    // =====================================================

    if (dni) {

        dni.addEventListener(
            "blur",
            async () => {

                if (
                    dni.value.length !== 8
                ) {

                    return;

                }


                try {

                    const respuesta =
                        await fetch(
                            `${API_URL}/api/public/worker?dni=${encodeURIComponent(dni.value)}`
                        );


                    const resultado =
                        await respuesta.json();


                    if (
                        respuesta.ok &&
                        resultado.found &&
                        resultado.worker
                    ) {

                        const worker =
                            resultado.worker;


                        if (nombre) {

                            nombre.value =
                                worker.names || "";

                            nombre.dataset.autoloaded =
                                "true";

                        }


                        if (area) {

                            area.value =
                                worker.area || "";

                            area.dataset.autoloaded =
                                "true";

                        }


                        if (cargo) {

                            cargo.value =
                                worker.position || "";

                            cargo.dataset.autoloaded =
                                "true";

                        }

                    } else {

                        if (nombre) {

                            nombre.dataset.autoloaded =
                                "false";

                        }

                    }


                } catch (error) {

                    console.warn(
                        "No se pudo consultar el trabajador:",
                        error
                    );

                }

            }
        );

    }


    // =====================================================
    // VALIDAR HORA DE RETORNO
    // =====================================================

    if (horaRetorno) {

        horaRetorno.addEventListener(
            "change",
            () => {

                if (
                    horaSalida &&
                    horaSalida.value &&
                    horaRetorno.value &&
                    horaRetorno.value <=
                        horaSalida.value
                ) {

                    alert(
                        "La hora de retorno debe ser posterior a la hora de salida."
                    );

                    horaRetorno.value =
                        "";

                }

            }
        );

    }


    // =====================================================
    // ENVIAR FORMULARIO
    // =====================================================

    if (formulario) {

        formulario.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // =============================================
                // VALIDAR DNI
                // =============================================

                if (
                    !dni ||
                    dni.value.length !== 8
                ) {

                    alert(
                        "El DNI debe tener exactamente 8 números."
                    );

                    if (dni) {
                        dni.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR NOMBRE
                // =============================================

                if (
                    !nombre ||
                    !nombre.value.trim()
                ) {

                    alert(
                        "Ingresa el nombre completo."
                    );

                    if (nombre) {
                        nombre.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR ÁREA
                // =============================================

                if (
                    !area ||
                    !area.value.trim()
                ) {

                    alert(
                        "Ingresa el área."
                    );

                    if (area) {
                        area.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR CARGO
                // =============================================

                if (
                    !cargo ||
                    !cargo.value.trim()
                ) {

                    alert(
                        "Ingresa el cargo."
                    );

                    if (cargo) {
                        cargo.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR TIPO
                // =============================================

                if (
                    !tipoPermiso ||
                    !tipoPermiso.value
                ) {

                    alert(
                        "Selecciona el tipo de permiso."
                    );

                    if (tipoPermiso) {
                        tipoPermiso.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR FECHA
                // =============================================

                if (
                    !fecha ||
                    !fecha.value
                ) {

                    alert(
                        "Selecciona la fecha."
                    );

                    if (fecha) {
                        fecha.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR HORA DE SALIDA
                // =============================================

                if (
                    !horaSalida ||
                    !horaSalida.value
                ) {

                    alert(
                        "Selecciona la hora de salida."
                    );

                    if (horaSalida) {
                        horaSalida.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR MOTIVO
                // =============================================

                if (
                    !motivo ||
                    !motivo.value.trim()
                ) {

                    alert(
                        "Escribe el motivo de la solicitud."
                    );

                    if (motivo) {
                        motivo.focus();
                    }

                    return;
                }


                // =============================================
                // VALIDAR HORARIOS
                // =============================================

                if (
                    horaRetorno &&
                    horaRetorno.value &&
                    horaRetorno.value <=
                        horaSalida.value
                ) {

                    alert(
                        "La hora de retorno debe ser posterior a la hora de salida."
                    );

                    horaRetorno.focus();

                    return;
                }


                // =============================================
                // VALIDAR DOCUMENTO
                // =============================================

                let documentoBase64 = "";
                let documentoNombre = "";
                let documentoTipo = "";


                if (
                    documento &&
                    documento.files &&
                    documento.files.length > 0
                ) {

                    const archivo =
                        documento.files[0];


                    const tiposPermitidos = [
                        "image/jpeg",
                        "image/png",
                        "application/pdf"
                    ];


                    if (
                        !tiposPermitidos.includes(
                            archivo.type
                        )
                    ) {

                        alert(
                            "Solo se permiten archivos JPG, JPEG, PNG o PDF."
                        );

                        documento.value = "";

                        return;
                    }


                    const maximo =
                        4 * 1024 * 1024;


                    if (
                        archivo.size > maximo
                    ) {

                        alert(
                            "El archivo no puede superar los 4 MB."
                        );

                        documento.value = "";

                        return;
                    }


                    try {

                        documentoBase64 =
                            await archivoABase64(
                                archivo
                            );

                        documentoNombre =
                            archivo.name;

                        documentoTipo =
                            archivo.type;

                    } catch (error) {

                        alert(
                            "No se pudo leer el documento seleccionado."
                        );

                        console.error(error);

                        return;
                    }

                }


                // =============================================
                // DATOS PARA EL BACKEND
                // =============================================

                const datos = {

                    dni:
                        dni.value.trim(),

                    names:
                        nombre.value.trim(),

                    position:
                        cargo.value.trim(),

                    area:
                        area.value.trim(),

                    type:
                        tipoPermiso.value,

                    date:
                        fecha.value,

                    exit_time:
                        horaSalida.value,

                    return_time:
                        horaRetorno
                            ? horaRetorno.value || ""
                            : "",

                    reason:
                        motivo.value.trim(),

                    observation:
                        observaciones
                            ? observaciones.value.trim()
                            : "",

                    // -----------------------------------------
                    // DOCUMENTO SUSTENTATORIO
                    // -----------------------------------------

                    document:
                        documentoBase64,

                    document_name:
                        documentoNombre,

                    document_type:
                        documentoTipo

                };


                // =============================================
                // ESTADO CARGANDO
                // =============================================

                if (btnEnviar) {

                    btnEnviar.disabled =
                        true;

                }


                if (textoBoton) {

                    textoBoton.textContent =
                        "Enviando...";

                }


                if (loader) {

                    loader.classList.remove(
                        "hidden"
                    );

                }


                try {

                    // =========================================
                    // ENVIAR A RENDER
                    // =========================================

                    const respuesta =
                        await fetch(
                            `${API_URL}/api/public/permissions`,
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        datos
                                    )

                            }
                        );


                    // =========================================
                    // LEER RESPUESTA
                    // =========================================

                    let resultado = {};


                    try {

                        resultado =
                            await respuesta.json();

                    } catch (error) {

                        resultado = {};

                    }


                    // =========================================
                    // ERROR
                    // =========================================

                    if (
                        !respuesta.ok
                    ) {

                        throw new Error(
                            resultado.error ||
                            resultado.message ||
                            "No se pudo registrar la solicitud."
                        );

                    }


                    // =========================================
                    // SOLICITUD REGISTRADA
                    // =========================================

                    const numero =
                        resultado.request?.id ||
                        resultado.permission?.id ||
                        resultado.id ||
                        resultado.solicitud_id ||
                        resultado.numero ||
                        resultado.numero_solicitud ||
                        "Registrada";


                    if (numeroSolicitud) {

                        numeroSolicitud.textContent =
                            numero;

                    }


                    // Ocultar formulario

                    formulario.classList.add(
                        "hidden"
                    );


                    // Mostrar confirmación

                    if (successMessage) {

                        successMessage.classList.remove(
                            "hidden"
                        );

                    }


                    // Ir arriba

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });


                } catch (error) {

                    console.error(
                        "Error al enviar solicitud:",
                        error
                    );


                    alert(
                        error.message ||
                        "Ocurrió un error al enviar la solicitud."
                    );


                } finally {

                    if (btnEnviar) {

                        btnEnviar.disabled =
                            false;

                    }


                    if (textoBoton) {

                        textoBoton.textContent =
                            "Enviar solicitud";

                    }


                    if (loader) {

                        loader.classList.add(
                            "hidden"
                        );

                    }

                }

            }
        );

    }


    // =====================================================
    // NUEVA SOLICITUD
    // =====================================================

    if (nuevaSolicitud) {

        nuevaSolicitud.addEventListener(
            "click",
            () => {

                formulario.reset();


                if (contador) {

                    contador.textContent =
                        "0";

                }


                if (fecha) {

                    fecha.min =
                        obtenerFechaLocal();

                }


                if (nombreArchivo) {

                    nombreArchivo.textContent =
                        "";

                }


                if (successMessage) {

                    successMessage.classList.add(
                        "hidden"
                    );

                }


                formulario.classList.remove(
                    "hidden"
                );


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    // =====================================================
    // LIMPIAR
    // =====================================================

    const btnLimpiar =
        document.getElementById(
            "btnLimpiar"
        );


    if (btnLimpiar) {

        btnLimpiar.addEventListener(
            "click",
            () => {

                setTimeout(
                    () => {

                        if (contador) {

                            contador.textContent =
                                "0";

                        }


                        if (fecha) {

                            fecha.min =
                                obtenerFechaLocal();

                        }


                        if (nombreArchivo) {

                            nombreArchivo.textContent =
                                "";

                        }

                    },
                    0
                );

            }
        );

    }

});
