<template>
  <q-layout view="lHh LpR lFf" class="bg-blue-grey-1">
    <q-header elevated class="bg-pink-1 text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          color="white"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> </q-toolbar-title>
        <q-btn
          v-if="partido == true || candidatura == true"
          label="Cerrar sesión"
          flat
          dense
          icon="power_settings_new"
          @click="cerrarSesion"
        />
        <q-btn v-else flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list padding>
        <div class="text-center q-pa-md">
          <q-img src="../assets/Conoceles2@300x.png" />
        </div>
        <div class="text-weight-bold text-black q-pa-md">
          Bienvenido(a) <br />
          {{ usuario_Nombre }}
        </div>

        <q-item
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'inicio' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section> Inicio </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SCC-REG-CI')"
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'cuestionario' }"
          active-class="text-pink-ieen-1"
          @click="cuestionarios('curricular')"
        >
          <q-item-section avatar>
            <q-icon name="looks_one" />
          </q-item-section>
          <q-item-section> Cuestionario Curricular </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SCC-REG-CI')"
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'cuestionario_Identidad' }"
          active-class="text-pink-ieen-1"
          @click="cuestionarios('identidad')"
        >
          <q-item-section avatar>
            <q-icon name="looks_two" />
          </q-item-section>
          <q-item-section> Cuestionario de Identidad </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SCC-VAL-CA')"
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'lista_Candidatos' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="verified" />
          </q-item-section>
          <q-item-section> Validación de candidaturas </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SCC-VAL-PP')"
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'registro_Candidatos' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section> Registro por partidos políticos</q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SCC-VAL-OB')"
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'observaciones' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="pending_actions" />
          </q-item-section>

          <q-item-section> Correcciones </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SCC-HIS-SC')"
          clickable
          v-ripple
          class="text-grey-8"
          :to="{ name: 'solicitudes' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="pending_actions" />
          </q-item-section>

          <q-item-section> Solicitudes de corrección </q-item-section>
        </q-item>
      </q-list>
      <div class="absolute-bottom">
        <div
          v-if="
            candidatura == true ||
            partido == true ||
            oficina == 'Oficina Central IEEN'
          "
          class="text-subtitle1 text-center q-pb-lg"
        >
          Consulta aquí el
          <a
            class="text-bold text-pink"
            target="blanck"
            href="https://ieenayarit.org/PDF/Conoceles/Manual_Registro_Candidatura.pdf"
            >Manual Candidatura <q-icon name="menu_book" />
          </a>
        </div>
        <div
          v-if="partido == true || oficina == 'Oficina Central IEEN'"
          class="text-subtitle1 text-center q-pb-lg"
        >
          Consulta aquí el
          <a
            class="text-bold text-pink"
            target="blanck"
            href="https://ieenayarit.org/PDF/Conoceles/Manual_Registro_PP.pdf"
            >Manual Partidos Políticos <q-icon name="menu_book" />
          </a>
        </div>
        <div class="text-subtitle1 text-center q-pb-lg">
          Consulta aquí nuestro
          <a
            class="text-bold text-pink"
            target="blanck"
            href="https://ieenayarit.org/Transparencia/Avisos/2024/AP_Sistema_Conoceles.pdf"
            >Aviso de privacidad.<q-icon name="verified_user" />
          </a>
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-pink-1 text-white">
      <q-toolbar>
        <q-toolbar-title
          ><div>&#169; Unidad Técnica de Informática y Estadística</div>
          <div class="absolute-right q-pa-xs">
            <q-btn
              flat
              round
              dense
              href="https://www.facebook.com/IEENayarit?mibextid=sCpJLy"
              target="_blank"
            >
              <i
                class="fa-brands fa-square-facebook fa-2xl"
                style="color: #ffffff"
              ></i>
            </q-btn>
            <q-btn
              flat
              round
              dense
              href="https://www.youtube.com/@IEENayarit"
              target="_blank"
            >
              <i class="fa-brands fa-youtube fa-2xl" style="color: #ffffff"></i>
            </q-btn>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { defineComponent, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EncryptStorage } from "storage-encryption";
import { useCandidatosStore } from "src/stores/candidatos-store";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const candidatosStore = useCandidatosStore();
const usuario = ref("");
const userName = ref("");
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { modulos, sistemas, apps, usuario_Nombre } = storeToRefs(authStore);
const CatalogosConList = ref([]);
const leftDrawerOpen = ref(false);
const showAvance = ref(false);
const partido = ref(false);
const candidatura = ref(false);
const oficina = ref(null);

onBeforeMount(async () => {
  showAvance.value = true;
  if (route.query.key) {
    encryptStorage.encrypt("key", route.query.key);
  }

  if (route.query.sistema) {
    encryptStorage.encrypt("sistema", route.query.sistema);
  }

  if (route.query.candidato_id) {
    encryptStorage.encrypt("candidato_id", route.query.candidato_id);
  }

  if (route.query.puesto_Candidato) {
    encryptStorage.encrypt("puesto_Candidato", route.query.puesto_Candidato);
  }
  if (route.query.partido_id) {
    encryptStorage.encrypt("partido_id", route.query.partido_id);
  }

  if (route.query.userNameL) {
    encryptStorage.encrypt("userNameL", route.query.userNameL);
  }

  if (encryptStorage.decrypt("partido_id")) {
    partido.value = true;
  } else {
    partido.value = false;
  }

  if (encryptStorage.decrypt("candidato_id")) {
    candidatura.value = true;
  } else {
    candidatura.value = false;
  }

  if (encryptStorage.decrypt("userNameL")) {
    userName.value = route.query.userNameL;
  }

  if (route.query.usr) {
    encryptStorage.encrypt("usuario", route.query.usr);
    usuario.value = encryptStorage.decrypt("usuario");
  } else {
    if (localStorage.getItem("usuario") != null) {
      usuario.value = encryptStorage.decrypt("usuario");
    }
  }

  await loadMenu();
});

const cuestionarios = async (tipo) => {
  await candidatosStore.loadCandidatoById(
    encryptStorage.decrypt("puesto_Candidato"),
    encryptStorage.decrypt("candidato_id")
  );
  if (tipo == "curricular") {
    router.push({
      name: "cuestionario",
    });
  } else if (tipo == "identidad") {
    router.push({
      name: "cuestionario_Identidad",
    });
  }
};

const cerrarSesion = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location = "https://acceso.sistemas-ieenayarit.org";
};

const loadMenu = async () => {
  $q.loading.show();
  await authStore.loadSistemas();
  await authStore.loadModulos();
  await authStore.loadPerfil();
  await authStore.loadUsuario();
  oficina.value = encryptStorage.decrypt("oficina");
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "SCC-REG-CI":
        CatalogosConList.value.push("SCC-REG-CI");
        break;
      case "SCC-VAL-PP":
        CatalogosConList.value.push("SCC-VAL-PP");
        break;
      case "SCC-VAL-CA":
        CatalogosConList.value.push("SCC-VAL-CA");
        break;
      case "SCC-VAL-OB":
        CatalogosConList.value.push("SCC-VAL-OB");
        break;
      case "SCC-HIS-SC":
        CatalogosConList.value.push("SCC-HIS-SC");
        break;
    }
  });
  $q.loading.hide();
};

const show = () => {
  $q.bottomSheet({
    message: "Aplicaciones",
    grid: true,
    actions: apps.value,
  }).onOk((action) => {
    if (action.label == "Cerrar sesión") {
      localStorage.clear();
      sessionStorage.clear();
      window.location = "https://acceso.sistemas-ieenayarit.org";
    } else if (action.label == "Ir a universo") {
      window.location = `https://acceso.sistemas-ieenayarit.org?key=${encryptStorage.decrypt(
        "key"
      )}&UserName=${encryptStorage.decrypt("userNameL")}`;
    } else {
      window.location =
        action.url +
        `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
          action.id
        }&usr=${encryptStorage.decrypt("usuario")}`;
    }
  });
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
<style lang="scss">
.bg-pink-1 {
  background: #d1308a !important;
}
.text-pink-ieen-1 {
  color: #d1308a !important;
}
.bg-blue-1 {
  background: #00668c !important;
}
.bg-blue-2 {
  background: #f5f4f1 !important;
}
.bg-blue-3 {
  background: #b6ccd8 !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>
