import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCandidatosStore = defineStore("useCandidatosStore", {
  state: () => ({
    actualizarInf: false,
    distrito_Id: { value: 0, label: "Todos" },
    municipio_Id: { value: 0, label: "Todos" },
    demarcacion_Id: { value: 0, label: "Todos" },
    genero_Id: "Todos",
    cargo_Id: "Todos",
    estatus_Id: "Todos",
    partido_Id: { value: 0, label: "Todos" },
    coalicion_Id: { value: 0, label: "Todos" },
    modal: false,
    actualizarConsentimiento: false,
    actualizar: false,
    visualizar: false,
    isEditar: false,
    modalInstrucciones: false,
    modalSustituir: false,
    modalConsentimiento: false,
    modalFotogafia: false,
    loading: false,
    list_Candidatos_By_Eleccion: [],
    list_Candidatos_By_Partido: [],
    list_Suplentes: [],
    list_RP: [],
    list_Formacion_Academica: [],
    list_Observaciones: [],
    list_Propuestas: [],
    candidato: {
      uno_Aviso_Privacidad: null,
      dos_Publicacion: null,
      tres_Informe_Estadistico: null,
      id: null,
      tipo: null,
      tipo_Eleccion_Id: null,
      tipo_Eleccion: null,
      municipio_Id: null,
      cargo: null,
      municipio: null,
      distrito_Id: null,
      demarcacion_Id: null,
      demarcacion: null,
      coalicion_Id: null,
      is_Coalicion: false,
      tipo_Candidato: null,
      orden: null,
      activo: null,
      fecha_Registro: null,
      nombre_Completo: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      nombre_Completo: null,
      mote: null,
      sexo: null,
      url_Foto: null,
      clave_Elector: null,
      rfc: null,
      curp: null,
      fecha_Nacimiento: null,
      ocupacion: null,
      telefono: null,
      correo: null,
      pertenece_Grupo_Vulnerable_Propietario: false,
      pertenece_Grupo_Vulnerable: false,
      grupo_Vulnerable: null,
      partido_Id: null,
      partido_Propietario: null,
      url_Logo_Partido: null,
      grupo_Vulnerable_1: null,
      grupo_Vulnerable_2: null,
      grupo_Vulnerable_3: null,
      grupo_Vulnerable_4: null,
      edad: null,
      avance_Curricular: null,
      faltante_Curricular: null,
      avance_Identidad: null,
      faltante_Identidad: null,
      consentimiento_URL: null,
      no_Formula: null,
    },
    propietario_1: {
      id: null,
      tipo: null,
      nombre_Completo: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      mote: null,
      sexo: null,
      url_Foto: null,
      clave_Elector: null,
      rfc: null,
      curp: null,
      fecha_Nacimiento: null,
      ocupacion: null,
      telefono: null,
      correo: null,
      pertenece_Grupo_Vulnerable: false,
      grupo_Vulnerable: null,
      partido_Id: null,
      partido: null,
      url_Logo_Partido: null,
      grupo_Vulnerable_1: null,
      grupo_Vulnerable_2: null,
      grupo_Vulnerable_3: null,
      grupo_Vulnerable_4: null,
      edad: null,
    },
    propietario_2: {
      id: null,
      tipo: null,
      nombre_Completo: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      mote: null,
      sexo: null,
      url_Foto: null,
      clave_Elector: null,
      rfc: null,
      curp: null,
      fecha_Nacimiento: null,
      ocupacion: null,
      telefono: [],
      correo: null,
      pertenece_Grupo_Vulnerable: false,
      grupo_Vulnerable: null,
      partido_Id: null,
      partido: null,
      url_Logo_Partido: null,
      grupo_Vulnerable_1: null,
      grupo_Vulnerable_2: null,
      grupo_Vulnerable_3: null,
      grupo_Vulnerable_4: null,
      edad: null,
    },
    suplente_1: {
      id: null,
      tipo: null,
      nombre_Completo: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      mote: null,
      sexo: null,
      url_Foto: null,
      clave_Elector: null,
      rfc: null,
      curp: null,
      fecha_Nacimiento: null,
      ocupacion: null,
      telefono: [],
      correo: null,
      pertenece_Grupo_Vulnerable: false,
      grupo_Vulnerable: null,
      partido_Id: null,
      partido: null,
      url_Logo_Partido: null,
      grupo_Vulnerable_1: null,
      grupo_Vulnerable_2: null,
      grupo_Vulnerable_3: null,
      grupo_Vulnerable_4: null,
      edad: null,
    },
    suplente_2: {
      id: null,
      tipo: null,
      nombre_Completo: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      mote: null,
      sexo: null,
      url_Foto: null,
      clave_Elector: null,
      rfc: null,
      curp: null,
      fecha_Nacimiento: null,
      ocupacion: null,
      telefono: null,
      correo: null,
      pertenece_Grupo_Vulnerable: false,
      grupo_Vulnerable: null,
      partido_Id: null,
      partido: null,
      url_Logo_Partido: null,
      grupo_Vulnerable_1: null,
      grupo_Vulnerable_2: null,
      grupo_Vulnerable_3: null,
      grupo_Vulnerable_4: null,
      edad: null,
    },
    datos_Generales: {
      id: null,
      candidato_Id: null,
      puesto_Candidato: null,
      facebook: null,
      twitter: null,
      youtube: null,
      instagram: null,
      tik_Tok: null,
      pagina_Web: null,
      email: null,
      telefono: null,
      domicilio: null,
      grado_Maximo_Estudios: null,
      estatus_Grado_Estudios: null,
      historia_Laboral: null,
      trayectoria: null,
      motivo_Cargo_Publico: null,
      propuesta_Genero: null,
    },
    formacion_Academica: {
      candidato_Id: null,
      puesto_Candidato: null,
      formacion: null,
    },
    propuesta: {
      id: null,
      candidato_Id: null,
      puesto_Candidato: null,
      propuesta: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------

    actualizarInformacion(valor) {
      this.actualizarInf = valor;
    },

    initDatosGenerales() {
      this.datos_Generales.id = null;
      this.datos_Generales.candidato_Id = null;
      this.datos_Generales.puesto_Candidato = null;
      this.datos_Generales.facebook = null;
      this.datos_Generales.twitter = null;
      this.datos_Generales.youtube = null;
      this.datos_Generales.instagram = null;
      this.datos_Generales.tik_Tok = null;
      this.datos_Generales.pagina_Web = null;
      this.datos_Generales.telefono = null;
      this.datos_Generales.domicilio = null;
      this.datos_Generales.email = null;
      this.datos_Generales.grado_Maximo_Estudios = null;
      this.datos_Generales.estatus_Grado_Estudios = null;
      this.datos_Generales.historia_Laboral = null;
      this.datos_Generales.trayectoria = null;
      this.datos_Generales.motivo_Cargo_Publico = null;
      this.datos_Generales.propuesta_Genero = null;
      this.list_Propuestas = [];
    },

    initCandidato() {
      this.candidato.activo = null;
      this.candidato.id = null;
      this.candidato.puesto = null;
      this.candidato.estatus = null;
      this.candidato.municipio_Id = null;
      this.candidato.municipio = null;
      this.candidato.no_Distrito = null;
      this.candidato.distrito_Id = null;
      this.candidato.distrito = null;
      this.candidato.demarcacion_Id = null;
      this.candidato.demarcacion = null;
      this.candidato.coalicion_Id = null;
      this.candidato.is_Coalicion = null;
      this.candidato.tipo_Candidato = null;
      this.candidato.orden = null;
      this.candidato.partido_Id = null;
      this.candidato.aprobado = null;
      this.candidato.validado = null;
      this.candidato.validado_IEEN = null;
      this.candidato.nombres = null;
      this.candidato.apellido_Paterno = null;
      this.candidato.apellido_Materno = null;
      this.candidato.nombre_Completo = null;
      this.candidato.mote = null;
      this.candidato.sexo = null;
      this.candidato.url_Foto = null;
      this.candidato.clave_Elector = null;
      this.candidato.rfc = null;
      this.candidato.curp = null;
      this.candidato.fecha_Nacimiento = null;
      this.candidato.ocupacion = null;
      this.candidato.telefono = null;
      this.candidato.correo = null;
      this.candidato.pertenece_Grupo_Vulnerable_Propietario = null;
      this.candidato.grupo_Vulnerable_Propietario = null;
      this.candidato.consentimiento_URL = null;
      this.candidato.avance_Curricular = null;
      this.candidato.faltante_Curricular = null;
      this.candidato.validado = false;
      this.candidato.validado_IEEN = false;
    },

    initFormacion() {
      this.formacion_Academica.id = null;
      this.formacion_Academica.candidato_Id = null;
      this.formacion_Academica.puesto_Candidato = null;
      this.formacion_Academica.formacion = null;
    },

    initPropuesta() {
      this.propuesta.id = null;
      this.propuesta.puesto_Candidato = null;
      this.propuesta.candidato_Id = null;
      this.propuesta.propuesta = null;
    },

    actualizarConsentiento(valor) {
      this.modalConsentimiento = valor;
    },

    actualizarFotografia(valor) {
      this.modalFotogafia = valor;
    },

    actualizarTabla(valor) {
      this.actualizar = valor;
    },

    actualizarVisualizar(valor) {
      this.visualizar = valor;
    },

    actualizarModalInstrucciones(valor) {
      this.modalInstrucciones = valor;
    },

    //-----------------------------------------------------------
    async updateFotografia(id, puesto, candidato) {
      try {
        const resp = await api.post(
          `/Candidatos/ActualizarFoto/${id}/${puesto}`,
          candidato,
          {
            headers: {
              "Conten-Type": "multipart/form-data",
            },
          }
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadCandidatosByPartido(partido, eleccion) {
      try {
        this.loading = true;
        let resp = await api.get(
          `/Candidatos/ByPartidoTipoEleccion/${partido}/${eleccion}`
        );
        let { data } = resp.data;
        let listCandidatos = data.map((candidato) => {
          return {
            id: candidato.id,
            puesto: candidato.puesto,
            puestoLetra:
              candidato.puesto == 0
                ? "Propietaria"
                : candidato.puesto == 1
                ? "Suplente"
                : candidato.puesto == 2
                ? "Propietaria sindica"
                : "Suplente sindica",
            estatus: candidato.estatus,
            avance_Curricular: candidato.avance_Curricular,
            municipio: candidato.municipio,
            municipio_Id: candidato.municipio_Id,
            distrito_Id: candidato.distrito_Id,
            distrito: candidato.distrito,
            no_Distrito: candidato.no_Distrito,
            demarcacion_Id: candidato.demarcacion_Id,
            demarcacion: candidato.demarcacion,
            tipo_Candidato: candidato.tipo_Candidato,
            orden: candidato.orden,
            validado: candidato.validado,
            aprobado: candidato.aprobado,
            nombre_Completo: `${candidato.nombres} ${
              candidato.apellido_Paterno
            } ${
              candidato.apellido_Materno != null
                ? candidato.apellido_Materno
                : ""
            }`,
            nombres: candidato.nombres,
            apellido_Paterno: candidato.apellido_Paterno,
            apellido_Materno: candidato.apellido_Materno,
            mote: candidato.mote,
            sexo: candidato.sexo,
            url_Foto: candidato.url_Foto,
            clave_Elector: candidato.clave_Elector,
            rfc: candidato.rfc,
            curp: candidato.curp,
            fecha_Nacimiento: candidato.fecha_Nacimiento,
            ocupacion: candidato.ocupacion,
            telefono: candidato.telefono,
            correo: candidato.correo,
            pertenece_Grupo_Vulerable: candidato.pertenece_Grupo_Vulerable,
            grupo_Vulnerable: candidato.grupo_Vulnerable,
            consentimiento_URL: candidato.consentimiento_URL,
            avance_Curricular: candidato.avance_Curricular,
            faltante_Curricular: candidato.faltante_Curricular,
            avance_Identidad: candidato.avance_Identidad,
            faltante_Identidad: candidato.faltante_Identidad,
            logo_Partido: candidato.logo_Partido,
            partido_Id: candidato.partido_Id,
            partido: candidato.partido,
            edad: candidato.edad,
            tipo_Eleccion_Id: candidato.tipo_Eleccion_Id,
            tipo_Eleccion: candidato.tipo_Eleccion,
            is_Coalicion: candidato.is_Coalicion,
            logo_Coalicion: candidato.logo_Coalicion,
            coalicion: candidato.coalicion,
            coalicion_Id: candidato.coalicion_Id,
            informacion_Pausada: candidato.informacion_Pausada,
            informacion_Actualizada: candidato.informacion_Actualizada,
            is_Comun: candidato.is_Comun,
            logo_Comun: candidato.logo_Comun,
          };
        });
        this.loading = false;
        this.list_Candidatos_By_Partido = listCandidatos;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadCandidatosByEleccion(eleccion) {
      try {
        this.loading = true;
        let ultimo_Id = 0;
        let color = true;
        let resp = await api.get(`/Candidatos/ByTipoEleccion/${eleccion}`);
        let { data } = resp.data;
        let listCandidatos = data.map((candidato) => {
          if (candidato.id != ultimo_Id) {
            ultimo_Id = candidato.id;
            color = !color;
          }
          return {
            faltantes: candidato.faltantes,
            porcentaje: (
              (candidato.evaluacion_Candidato == null
                ? 0
                : candidato.evaluacion_Candidato / 49) * 100
            ).toFixed(3),
            evaluacion_Candidato:
              candidato.evaluacion_Candidato == null
                ? 0
                : candidato.evaluacion_Candidato,
            id: candidato.id,
            color: color,
            puesto: candidato.puesto,
            puestoLetra:
              candidato.puesto == 0
                ? "Propietaria"
                : candidato.puesto == 1
                ? "Suplente"
                : candidato.puesto == 2
                ? "Propietaria síndico"
                : "Suplente síndico",
            estatus: candidato.estatus,
            municipio: candidato.municipio,
            municipio_Id: candidato.municipio_Id,
            distrito: candidato.distrito,
            distrito_Id: candidato.distrito_Id,
            no_Distrito: candidato.no_Distrito,
            demarcacion: candidato.demarcacion,
            demarcacion_Id: candidato.demarcacion_Id,
            tipo_Candidato: candidato.tipo_Candidato,
            orden: candidato.orden,
            validado: candidato.validado,
            validado_IEEN: candidato.validado_IEEN,
            aprobado: candidato.aprobado,
            nombre_Completo: `${candidato.nombres} ${
              candidato.apellido_Paterno
            } ${
              candidato.apellido_Materno != null
                ? candidato.apellido_Materno
                : ""
            }`,
            nombres: candidato.nombres,
            apellido_Paterno: candidato.apellido_Paterno,
            apellido_Materno: candidato.apellido_Materno,
            mote: candidato.mote,
            sexo: candidato.sexo,
            url_Foto: candidato.url_Foto,
            clave_Elector: candidato.clave_Elector,
            rfc: candidato.rfc,
            curp: candidato.curp,
            fecha_Nacimiento: candidato.fecha_Nacimiento,
            ocupacion: candidato.ocupacion,
            telefono: candidato.telefono,
            correo: candidato.correo,
            pertenece_Grupo_Vulerable: candidato.pertenece_Grupo_Vulerable,
            grupo_Vulnerable: candidato.grupo_Vulnerable,
            consentimiento_URL: candidato.consentimiento_URL,
            avance_Curricular: candidato.avance_Curricular,
            faltante_Curricular: candidato.faltante_Curricular,
            avance_Identidad: candidato.avance_Identidad,
            faltante_Identidad: candidato.faltante_Identidad,
            logo_Partido: candidato.logo_Partido,
            partido_Id: candidato.partido_Id,
            partido: candidato.partido,
            edad: candidato.edad,
            tipo_Eleccion_Id: candidato.tipo_Eleccion_Id,
            tipo_Eleccion: candidato.tipo_Eleccion,
            is_Coalicion: candidato.is_Coalicion,
            logo_Coalicion: candidato.logo_Coalicion,
            coalicion: candidato.coalicion,
            coalicion_Id: candidato.coalicion_Id,
            informacion_Pausada: candidato.informacion_Pausada,
            informacion_Actualizada: candidato.informacion_Actualizada,
          };
        });
        this.loading = false;
        this.list_Candidatos_By_Eleccion = listCandidatos;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //--------------------------- --------------------------------
    async loadCandidatoById(puesto, id) {
      try {
        let resp = await api.get(`/Candidatos/${id}/${puesto}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.candidato.consentimiento_URL = data.consentimiento_URL;
            if (puesto == 0) {
              this.candidato.cargo = "Propietario";
            } else if (puesto == 1) {
              this.candidato.cargo = "Suplente";
            } else if (puesto == 2) {
              this.candidato.cargo = "Propietario sindico";
            } else if (puesto == 3) {
              this.candidato.cargo = "Suplente sindico";
            }
            this.candidato.uno_Aviso_Privacidad = data.uno_Aviso_Privacidad;
            this.candidato.dos_Publicacion = data.dos_Publicacion;
            this.candidato.tres_Informe_Estadistico =
              data.tres_Informe_Estadistico;
            this.candidato.no_Formula = data.no_Formula;
            this.candidato.puesto = data.puesto;
            this.candidato.activo = data.activo;
            this.candidato.id = data.id;
            this.candidato.puesto = data.puesto;
            this.candidato.estatus = data.tipo_Eleccion_Id;
            this.candidato.municipio_Id = data.municipio_Id;
            this.candidato.municipio = data.municipio;
            this.candidato.no_Distrito = data.no_Distrito;
            this.candidato.distrito_Id = data.distrito_Id;
            this.candidato.distrito = data.distrito;
            this.candidato.demarcacion_Id = data.demarcacion_Id;
            this.candidato.demarcacion = data.demarcacion;
            this.candidato.coalicion_Id = data.coalicion_Id;
            this.candidato.is_Coalicion = data.is_Coalicion;
            this.candidato.tipo_Candidato = data.tipo_Candidato;
            this.candidato.orden = data.orden;
            this.candidato.partido_Id = data.partido_Id;
            this.candidato.aprobado = data.aprobado;
            this.candidato.validado = data.validado;
            this.candidato.validado_IEEN = data.validado_IEEN;
            this.candidato.nombres = data.nombres;
            this.candidato.apellido_Paterno = data.apellido_Paterno;
            this.candidato.apellido_Materno = data.apellido_Materno;
            this.candidato.nombre_Completo = `${data.nombres} ${data.apellido_Paterno} ${data.apellido_Materno}`;
            this.candidato.mote = data.mote;
            this.candidato.sexo = data.sexo;
            this.candidato.url_Foto = data.url_Foto;
            this.candidato.clave_Elector = data.clave_Elector;
            this.candidato.rfc = data.rfc;
            this.candidato.curp = data.curp;
            this.candidato.fecha_Nacimiento = data.fecha_Nacimiento;
            this.candidato.ocupacion = data.ocupacion;
            this.candidato.telefono = data.telefono;
            this.candidato.correo = data.correo;
            this.candidato.pertenece_Grupo_Vulnerable_Propietario =
              data.pertenece_Grupo_Vulnerable_Propietario;
            this.candidato.grupo_Vulnerable_Propietario =
              data.grupo_Vulnerable_Propietario;
            this.candidato.avance_Curricular = data.avance_Curricular;
            this.candidato.faltante_Curricular = data.faltante_Curricular;
            this.candidato.edad = data.edad;
            this.candidato.partido = data.partido;
            this.candidato.url_Logo_Partido = data.logo_Partido;
            this.candidato.tipo_Eleccion = data.tipo_Eleccion;
            this.candidato.faltante_Identidad = data.faltante_Identidad;
            this.candidato.avance_Identidad = data.avance_Identidad;
            this.candidato.informacion_Pausada = data.informacion_Pausada;
            this.candidato.validadas = data.validadas;
            this.candidato.aplicadas = data.aplicadas;
            this.candidato.publicadas = data.publicadas;
            this.candidato.informacion_Pausada = data.informacion_Pausada;
            this.candidato.informacion_Actualizada =
              data.informacion_Actualizada;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadCandidatoToArray(tipo, id) {
      try {
        let resp = null;
        resp = await api.get(`/Candidatos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.propietario_2.tipo_Eleccion = data.tipo_Eleccion;
            this.suplente_1.tipo_Eleccion = data.tipo_Eleccion;
            this.suplente_2.tipo_Eleccion = data.tipo_Eleccion;

            this.suplente_1.tipo_Candidato = data.tipo_Candidato;
            this.propietario_2.tipo_Candidato = data.tipo_Candidato;
            this.suplente_2.tipo_Candidato = data.tipo_Candidato;
            //-----------------------------------------------------
            //PROPIETARIO 1
            this.propietario_1.tipo_Eleccion = data.tipo_Eleccion;
            this.propietario_1.tipo_Candidato = data.tipo_Candidato;
            this.propietario_1.id = data.id;
            this.propietario_1.tipo = "Propietario 1";
            this.propietario_1.nombre_Completo = `${data.nombres_Propietario} ${data.apellido_Paterno_Propietario} ${data.apellido_Materno_Propietario}`;
            this.propietario_1.nombres = data.nombres_Propietario;
            this.propietario_1.apellido_Paterno =
              data.apellido_Paterno_Propietario;
            this.propietario_1.apellido_Materno =
              data.apellido_Materno_Propietario;
            this.propietario_1.mote = data.mote_Propietario;
            this.propietario_1.sexo = data.sexo_Propietario;
            this.propietario_1.url_Foto = data.url_Foto_Propietario;
            this.propietario_1.clave_Elector = data.clave_Elector_Propietario;
            this.propietario_1.rfc = data.rfC_Propietario;
            this.propietario_1.curp = data.curP_Propietario;
            this.propietario_1.fecha_Nacimiento =
              data.fecha_Nacimiento_Propietario;
            this.propietario_1.ocupacion = data.ocupacion_Propietario;
            this.propietario_1.correo = data.correo_Propietario;
            this.propietario_1.pertenece_Grupo_Vulnerable =
              data.pertenece_Grupo_Vulnerable_Propietario;
            this.propietario_1.grupo_Vulnerable =
              data.grupo_Vulnerable_Propietario;
            this.propietario_1.partido_Id = data.partido_Id;
            this.propietario_1.partido = data.partido_Propietario;
            if (data.telefono_Propietario != null) {
              this.propietario_1.telefono =
                data.telefono_Propietario.split(",");
            }
            //-----------------------------------------------------
            //PROPIETARIO 2
            this.propietario_2.id = data.id;
            this.propietario_2.tipo = "Propietario sindico";
            this.propietario_2.nombre_Completo = `${data.nombres_Propietario_2} ${data.apellido_Paterno_Propietario_2} ${data.apellido_Materno_Propietario_2}`;
            this.propietario_2.nombres = data.nombres_Propietario_2;
            this.propietario_2.apellido_Paterno =
              data.apellido_Paterno_Propietario_2;
            this.propietario_2.apellido_Materno =
              data.apellido_Materno_Propietario_2;
            this.propietario_2.mote = data.mote_Propietario_2;
            this.propietario_2.sexo = data.sexo_Propietario_2;
            this.propietario_2.clave_Elector = data.clave_Elector_Propietario_2;
            this.propietario_2.url_Foto = data.url_Foto_Propietario_2;
            this.propietario_2.rfc = data.rfC_Propietario_2;
            this.propietario_2.curp = data.curP_Propietario_2;
            this.propietario_2.fecha_Nacimiento =
              data.fecha_Nacimiento_Propietario_2;
            this.propietario_2.ocupacion = data.ocupacion_Propietario_2;
            if (data.telefono_Propietario_2 != null) {
              this.propietario_2.telefono =
                data.telefono_Propietario_2.split(",");
            }
            this.propietario_2.correo = data.correo_Propietario_2;
            this.propietario_2.pertenece_Grupo_Vulnerable =
              data.pertenece_Grupo_Vulerable_Propietario_2;
            this.propietario_2.grupo_Vulnerable =
              data.grupo_Vulnerable_Propietario_2;
            this.propietario_2.partido_Id = data.partido_Propietario_2_Id;
            this.propietario_2.partido = data.partido_Propietario_2;
            this.propietario_2.url_Logo_Partido =
              data.url_Logo_Partido_Propietario_2;
            //-----------------------------------------------------
            //SUPLENTE 1
            this.suplente_1.id = data.id;
            this.suplente_1.tipo = "Suplente";
            this.suplente_1.nombre_Completo = `${data.nombres_Suplente} ${data.apellido_Paterno_Suplente} ${data.apellido_Materno_Suplente}`;
            this.suplente_1.nombres = data.nombres_Suplente;
            this.suplente_1.apellido_Paterno = data.apellido_Paterno_Suplente;
            this.suplente_1.apellido_Materno = data.apellido_Materno_Suplente;
            this.suplente_1.mote = data.mote_Suplente;
            this.suplente_1.sexo = data.sexo_Suplente;
            this.suplente_1.clave_Elector = data.clave_Elector_Suplente;
            this.suplente_1.url_Foto = data.url_Foto_Suplente;
            this.suplente_1.rfc = data.rfC_Suplente;
            this.suplente_1.curp = data.curP_Suplente;
            this.suplente_1.fecha_Nacimiento = data.fecha_Nacimiento_Suplente;
            this.suplente_1.ocupacion = data.ocupacion_Suplente;
            if (data.telefono_Suplente != null) {
              this.suplente_1.telefono = data.telefono_Suplente.split(",");
            }
            this.suplente_1.correo = data.correo_Suplente;
            this.suplente_1.pertenece_Grupo_Vulnerable =
              data.pertenece_Grupo_Vulnerable_Suplente;
            this.suplente_1.grupo_Vulnerable = data.grupo_Vulnerable_Suplente;
            this.suplente_1.partido_Id = data.partido_Suplente_Id;
            this.suplente_1.url_Logo_Partido = data.url_Logo_Partido_Suplente;
            this.suplente_1.partido = data.partido_Suplente;
            //-----------------------------------------------------
            //SUPLENTE 2
            this.suplente_2.id = data.id;
            this.suplente_2.tipo = "Suplente sindico";
            this.suplente_2.nombre_Completo = `${data.nombres_Suplente_2} ${data.apellido_Paterno_Suplente_2} ${data.apellido_Materno_Suplente_2}`;
            this.suplente_2.nombres = data.nombres_Suplente_2;
            this.suplente_2.apellido_Paterno = data.apellido_Paterno_Suplente_2;
            this.suplente_2.apellido_Materno = data.apellido_Materno_Suplente_2;
            this.suplente_2.mote = data.mote_Suplente_2;
            this.suplente_2.sexo = data.sexo_Suplente_2;
            this.suplente_2.url_Foto = data.url_Foto_Suplente_2;
            this.suplente_2.clave_Elector = data.clave_Elector_Suplente_2;
            this.suplente_2.rfc = data.rfC_Suplente_2;
            this.suplente_2.curp = data.curP_Suplente_2;
            this.suplente_2.fecha_Nacimiento = data.fecha_Nacimiento_Suplente_2;
            this.suplente_2.ocupacion = data.ocupacion_Suplente_2;
            if (data.telefono_Suplente_2 != null) {
              this.suplente_2.telefono = data.telefono_Suplente_2.split(",");
            }
            this.suplente_2.correo = data.correo_Suplente_2;
            this.suplente_2.pertenece_Grupo_Vulnerable =
              data.pertenece_Grupo_Vulnerable_Suplente_2;
            this.suplente_2.grupo_Vulnerable = data.grupo_Vulnerable;
            this.suplente_2.partido_Id = data.partido_Suplente_2_Id;
            this.suplente_2.partido = data.partido_Suplente_2;
            this.suplente_2.url_Logo_Partido = data.url_Logo_Partido_Suplente_2;

            this.list_Suplentes = [];
            if (tipo == "DIP" || tipo == "REG") {
              this.list_Suplentes.push(this.suplente_1);
            } else if (tipo == "PYS") {
              this.list_Suplentes.push(
                this.suplente_1,
                this.propietario_2,
                this.suplente_2
              );
            }
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //DATOS GENERALES
    async loadDatosGeneralesById(id, puesto) {
      try {
        let resp = null;
        resp = await api.get(`/CandidatosDatosGenerales/${id}/${puesto}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.datos_Generales.id = data.id;
            this.datos_Generales.candidato_Id = data.candidato_Id;
            this.datos_Generales.puesto_Candidato = data.puesto_Candidato;
            this.datos_Generales.facebook = data.facebook;
            this.datos_Generales.twitter = data.twitter;
            this.datos_Generales.youtube = data.youtube;
            this.datos_Generales.instagram = data.instagram;
            this.datos_Generales.tik_Tok = data.tik_Tok;
            this.datos_Generales.pagina_Web = data.pagina_Web;
            this.datos_Generales.email = data.email;
            this.datos_Generales.telefono = data.telefono;
            this.datos_Generales.domicilio = data.domicilio;
            this.datos_Generales.grado_Maximo_Estudios =
              data.grado_Maximo_Estudios;
            this.datos_Generales.estatus_Grado_Estudios =
              data.estatus_Grado_Estudios;
            this.datos_Generales.historia_Laboral = data.historia_Laboral;
            this.datos_Generales.trayectoria = data.trayectoria;
            this.datos_Generales.motivo_Cargo_Publico =
              data.motivo_Cargo_Publico;
            this.datos_Generales.propuesta_Genero = data.propuesta_Genero;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async createDatosGenerales(id, datos_Generales) {
      try {
        const resp = await api.post(
          `/CandidatosDatosGenerales/${id}`,
          datos_Generales
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async updateDatosGenerales(datos_Generales) {
      try {
        const resp = await api.put(
          `/CandidatosDatosGenerales/${datos_Generales.id}`,
          datos_Generales
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //FORMACION ACADEMICA
    async loadFormacionAcademica(id, puesto) {
      try {
        let resp = await api.get(
          `/CandidatosFormacionAcademica/GetAll/${id}/${puesto}`
        );
        let { data } = resp.data;
        this.list_Formacion_Academica = data.map((item) => {
          return {
            id: item.id,
            candidato_Id: item.candidato_Id,
            puesto_Candidato: item.puesto_Candidato,
            formacion: item.formacion,
            nombre_Completo: item.formacion,
            nombre:
              item.formacion.length >= 110
                ? item.formacion.slice(0, 110) + "..."
                : item.formacion,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadFormacionById(id, puesto) {
      try {
        let resp = null;
        resp = await api.get(`/CandidatosFormacionAcademica/${id}/${puesto}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.formacion_Academica.id = data.id;
            this.formacion_Academica.formacion = data.formacion;
            this.formacion_Academica.puesto_Candidato = data.puesto_Candidato;
            this.formacion_Academica.candidato_Id = data.candidato_Id;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async createFormacionAcademica(id, formacion) {
      try {
        const resp = await api.post(
          `/CandidatosFormacionAcademica/${id}`,
          formacion
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async updateFormacionAcademica(formacion) {
      try {
        const resp = await api.put(
          `/CandidatosFormacionAcademica/${formacion.id}`,
          formacion
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async deleteFormacionAcademica(id) {
      try {
        const resp = await api.delete(`/CandidatosFormacionAcademica/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //PROPUESTAS
    async createPropuesta(id, propuesta) {
      try {
        const resp = await api.post(`/CandidatosPropuestas/${id}`, propuesta);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadPropuestas(id, puesto) {
      try {
        let resp = null;
        resp = await api.get(`/CandidatosPropuestas/GetAll/${id}/${puesto}`);
        let { data } = resp.data;
        this.list_Propuestas = data.map((propuesta, index) => {
          return {
            numero: `Propuesta ${index + 1}`,
            id: propuesta.id,
            candidato_Id: propuesta.candidato_Id,
            puesto_Candidato: propuesta.puesto_Candidato,
            propuesta: propuesta.propuesta,
            nombre_Completo: propuesta.propuesta,
            nombre:
              propuesta.propuesta.length >= 80
                ? propuesta.propuesta.slice(0, 80) + "..."
                : propuesta.propuesta,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async addPropuesta(id, propuesta, puesto_Candidato, candidato_Id) {
      try {
        let nuevoId = null;
        if (id == null) {
          var ultimoId =
            this.list_Propuestas.length > 0
              ? this.list_Propuestas[this.list_Propuestas.length - 1].id
              : 0;
          nuevoId = ultimoId + 1;
        } else {
          nuevoId = id;
        }

        this.list_Propuestas.push({
          id: nuevoId,
          nombre_Completo: propuesta,
          puesto_Candidato: puesto_Candidato,
          candidato_Id: candidato_Id,
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadPropuestaById(id) {
      try {
        let resp = null;
        resp = await api.get(`/CandidatosPropuestas/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.propuesta.id = data.id;
            this.propuesta.candidato_Id = data.candidato_Id;
            this.propuesta.propuesta = data.propuesta;
            this.propuesta.puesto_Candidato = data.puesto_Candidato;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async updatePropuesta(propuesta) {
      try {
        const resp = await api.put(
          `/CandidatosPropuestas/${propuesta.id}`,
          propuesta
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async deletePropuesta(id) {
      try {
        const resp = await api.delete(`/CandidatosPropuestas/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //CONSENTIMIENTO
    async subirConsentimiento(candidato_Id, puesto, file) {
      try {
        const resp = await api.post(
          `/Candidatos/Consentimiento/${candidato_Id}/${puesto}`,
          file,
          {
            headers: {
              "Conten-Type": "multipart/form-data",
            },
          }
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //UPDATE CONSENTIMIENTO
    async updateConsentimiento(candidato_Id, puesto, file) {
      try {
        const resp = await api.put(
          `/Candidatos/EditarConsentimiento/${candidato_Id}/${puesto}`,
          file,
          {
            headers: {
              "Conten-Type": "multipart/form-data",
            },
          }
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //OBSERVACIONES
    async observacionesByCandidatoByPuesto(candidato_Id, puesto) {
      try {
        let resp = null;
        resp = await api.get(
          `/ObservacionesCandidatos/ByCandidato/${candidato_Id}/${puesto}`
        );
        let { data } = resp.data;
        this.list_Observaciones = data.map((observacion) => {
          return {
            id: observacion.id,
            empleado_Id: observacion.empleado_Id,
            candidato_Id: observacion.candidato_Id,
            puesto: observacion.puesto,
            identidad: observacion.identidad,
            propuesta_1: observacion.propuesta_1,
            propuesta_2: observacion.propuesta_2,
            genero: observacion.genero,
            trayectoria: observacion.trayectoria,
            historia_Profesional: observacion.historia_Profesional,
            motivo_Cargo_Publico: observacion.motivo_Cargo_Publico,
            formacion: observacion.formacion,
            fecha_Registro: observacion.fecha_Registro,
            faltantes: observacion.faltantes,
            informacion_Pausada: observacion.informacion_Pausada,
            validadas: observacion.validadas,
            aplicadas: observacion.aplicadas,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async subsanarObservacion(id, rubro) {
      try {
        const resp = await api.get(
          `/ObservacionesCandidatos/Subsanar/${id}/${rubro}`
        );
        const { success, data } = resp.data;
        if (success === true) {
          return { success, data };
        } else {
          return { success, data };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
