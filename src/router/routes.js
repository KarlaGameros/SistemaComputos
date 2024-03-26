const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage") },
      {
        path: "/inicio",
        name: "inicio",
        component: () => import("pages/IndexPage"),
      },
      {
        path: "/captura",
        name: "captura",
        component: () => import("../modulos/captura/pages/IndexPage"),
      },
      {
        path: "/reservas",
        name: "reservas",
        component: () => import("../modulos/reservas/pages/IndexPage"),
      },
      {
        path: "/consulta",
        name: "consulta",
        component: () => import("../modulos/consulta/pages/IndexPage"),
      },
      {
        path: "/porCasilla",
        name: "porCasilla",
        component: () => import("../modulos/porCasilla/pages/IndexPage"),
      },
      {
        path: "/mayoria",
        name: "mayoria",
        component: () => import("../modulos/mayoria/pages/IndexPage"),
      },
      {
        path: "/solicitudes",
        name: "solicitudes",
        component: () => import("../modulos/solicitudes/pages/IndexPage"),
      },
      {
        path: "/panel",
        name: "panel",
        component: () => import("../modulos/panel/pages/IndexPage"),
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
