document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // URL DEL BACKEND EN RENDER
    // =====================================================

    const API_URL = "https://permisosfun-1.onrender.com";


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
    // FECHA MÍNIMA = HOY
    // =====================================================

    function obtenerFechaLocal() {

        const hoy = new Date();

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

    fecha.min =
        fechaActual;


    // =====================================================
    // CONTADOR DEL MOTIVO
    // =====================================================

    motivo.addEventListener(
        "input",
        () => {

            contador.textContent =
                motivo.value.length;

        }
    );


    // =====================================================
    // VALIDAR DNI
    // =====================================================

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


    // =====================================================
    // BUSCAR TRABAJADOR POR DNI
    // =====================================================

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


                    nombre.value =
                        worker.names || "";

                    area.value =
                        worker.area || "";

                    cargo.value =
                        worker.position || "";


                    nombre.dataset.autoloaded =
                        "true";

                    area.dataset.autoloaded =
                        "true";

                    cargo.dataset.autoloaded =
                        "true";


                } else {

                    nombre.dataset.autoloaded =
                        "false";

                }


            } catch (error) {

                console.warn(
                    "No se pudo consultar el trabajador:",
                    error
                );

            }

        }
    );


    // =====================================================
    // VALIDAR HORA DE RETORNO
    // =====================================================

    horaRetorno.addEventListener(
        "change",
        () => {

            if (
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


    // =====================================================
    // ENVIAR FORMULARIO
    // =====================================================

    formulario.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // =============================================
            // VALIDAR DNI
            // =============================================

            if (
                dni.value.length !== 8
            ) {

                alert(
                    "El DNI debe tener exactamente 8 números."
                );

                dni.focus();

                return;
            }


            // =============================================
            // VALIDAR NOMBRE
            // =============================================

            if (
                !nombre.value.trim()
            ) {

                alert(
                    "Ingresa el nombre completo."
                );

                nombre.focus();

                return;
            }


            // =============================================
            // VALIDAR ÁREA
            // =============================================

            if (
                !area.value.trim()
            ) {

                alert(
                    "Ingresa el área."
                );

                area.focus();

                return;
            }


            // =============================================
            // VALIDAR CARGO
            // =============================================

            if (
                !cargo.value.trim()
            ) {

                alert(
                    "Ingresa el cargo."
                );

                cargo.focus();

                return;
            }


            // =============================================
            // VALIDAR TIPO
            // =============================================

            if (
                !tipoPermiso.value
            ) {

                alert(
                    "Selecciona el tipo de permiso."
                );

                tipoPermiso.focus();

                return;
            }


            // =============================================
            // VALIDAR FECHA
            // =============================================

            if (
                !fecha.value
            ) {

                alert(
                    "Selecciona la fecha."
                );

                fecha.focus();

                return;
            }


            // =============================================
            // VALIDAR HORA DE SALIDA
            // =============================================

            if (
                !horaSalida.value
            ) {

                alert(
                    "Selecciona la hora de salida."
                );

                horaSalida.focus();

                return;
            }


            // =============================================
            // VALIDAR MOTIVO
            // =============================================

            if (
                !motivo.value.trim()
            ) {

                alert(
                    "Escribe el motivo de la solicitud."
                );

                motivo.focus();

                return;
            }


            // =============================================
            // VALIDAR HORARIOS
            // =============================================

            if (
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
                    horaRetorno.value || "",

                reason:
                    motivo.value.trim(),

                observation:
                    observaciones.value.trim()
            };


            // =============================================
            // ESTADO CARGANDO
            // =============================================

            btnEnviar.disabled =
                true;

            textoBoton.textContent =
                "Enviando...";

            loader.classList.remove(
                "hidden"
            );


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
                    resultado.id ||
                    resultado.solicitud_id ||
                    resultado.numero ||
                    resultado.numero_solicitud ||
                    "Registrada";


                numeroSolicitud.textContent =
                    numero;


                // Ocultar formulario

                formulario.classList.add(
                    "hidden"
                );


                // Mostrar confirmación

                successMessage.classList.remove(
                    "hidden"
                );


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

                btnEnviar.disabled =
                    false;

                textoBoton.textContent =
                    "Enviar solicitud";

                loader.classList.add(
                    "hidden"
                );

            }

        }
    );


    // =====================================================
    // NUEVA SOLICITUD
    // =====================================================

    nuevaSolicitud.addEventListener(
        "click",
        () => {

            formulario.reset();

            contador.textContent =
                "0";

            fecha.min =
                obtenerFechaLocal();

            successMessage.classList.add(
                "hidden"
            );

            formulario.classList.remove(
                "hidden"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


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

                        contador.textContent =
                            "0";

                        fecha.min =
                            obtenerFechaLocal();

                    },
                    0
                );

            }
        );

    }

});
