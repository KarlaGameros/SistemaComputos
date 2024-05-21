const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/inicio",
        name: "inicio",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/cuestionario",
        name: "cuestionario",
        component: () =>
          import("../modulos/cuestionarioCurricular/pages/IndexPage"),
      },
      {
        path: "/cuestionario_visualizar",
        name: "cuestionario_visualizar",
        component: () =>
          import("../modulos/cuestionarioCurricular/pages/IndexPage"),
      },
      {
        path: "/cuestionario_Identidad",
        name: "cuestionario_Identidad",
        component: () =>
          import("../modulos/cuestionarioIdentidad/pages/IndexPage"),
      },
      {
        path: "/lista_Candidatos",
        name: "lista_Candidatos",
        component: () => import("../modulos/candidatos/pages/IndexPage"),
      },
      {
        path: "/registro_Candidatos",
        name: "registro_Candidatos",
        component: () =>
          import("../modulos/candidatosPartidos/pages/IndexPage"),
      },
      {
        path: "/validarCurricular",
        name: "validarCurricular",
        component: () => import("../modulos/validarCurricular/pages/IndexPage"),
      },
      {
        path: "/validarIdentidad",
        name: "validarIdentidad",
        component: () => import("../modulos/validarIdentidad/pages/IndexPage"),
      },
      {
        path: "/observaciones",
        name: "observaciones",
        component: () => import("../modulos/observaciones/pages/IndexPage.vue"),
      },
      {
        path: "/solicitudes",
        name: "solicitudes",
        component: () =>
          import("../modulos/solicitudesCorreccion/pages/IndexPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
