<template>
  <q-layout
    view="lHh LpR lFf"
    :class="!$q.dark.isActive ? 'bg-blue-grey-1' : ''"
  >
    <q-header class="bg-pink-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Cómputos </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          :icon="!modo ? 'dark_mode' : 'light_mode'"
          @click="modoOscuro(!modo)"
        >
          <q-tooltip>{{ !modo ? "Modo oscuro" : "Modo claro" }}</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <div class="text-center">
          <q-img src="../assets/Computos.png" />
        </div>
        <div
          :class="
            $q.dark.isActive
              ? 'text-white text-weight-bold q-pa-md'
              : 'text-weight-bold text-grey-8 q-pa-md'
          "
        >
          Bienvenido(a) <br />{{ usuario_Nombre }}
        </div>

        <q-item
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'inicio' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section> Inicio </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SC-CAP-VA')"
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'votoAnticipado' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="how_to_vote" />
          </q-item-section>
          <q-item-section> Voto anticipado </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SC-CAP-RES')"
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'captura' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="edit_square" />
          </q-item-section>
          <q-item-section> Captura </q-item-section>
        </q-item>
        <q-expansion-item
          v-if="CatalogosConList.length > 0"
          expand-separator
          icon="collections_bookmark"
          label="Reservas"
          class="text-grey-8 label-title text-bold"
        >
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SC-REG-RES')"
            clickable
            v-ripple
            :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
            :to="{ name: 'reservas' }"
            active-class="text-pink-ieen-1"
          >
            <q-item-section avatar>
              <q-icon name="content_copy" />
            </q-item-section>
            <q-item-section> Reservas </q-item-section>
          </q-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SC-RES-VA')"
            clickable
            v-ripple
            :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
            :to="{ name: 'reservasVA' }"
            active-class="text-pink-ieen-1"
          >
            <q-item-section avatar>
              <q-icon name="content_copy" />
            </q-item-section>
            <q-item-section> Reservas voto anticipado</q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SC-CON-RES')"
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'consulta' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="search" />
          </q-item-section>
          <q-item-section> Consulta </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SC-REG-CAS')"
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'porCasilla' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="archive" />
          </q-item-section>
          <q-item-section> Por casilla </q-item-section>
        </q-item>
        <q-item
          v-if="CatalogosConList.some((element) => element == 'SC-MAY-RES')"
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'mayoria' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section> Mayoría </q-item-section>
        </q-item>
        <q-expansion-item
          v-if="CatalogosConList.some((element) => element == 'SC-REG-SOL')"
          expand-separator
          icon="checklist"
          label="Solicitudes"
          class="text-grey-8 label-title text-bold"
        >
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SC-REG-SOL')"
            clickable
            v-ripple
            :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
            :to="{ name: 'solicitudes' }"
            active-class="text-pink-ieen-1"
          >
            <q-item-section avatar>
              <q-icon name="clear_all" />
            </q-item-section>
            <q-item-section> Solicitudes </q-item-section>
          </q-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SC-REG-SOL')"
            clickable
            v-ripple
            :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
            :to="{ name: 'solicitudesVA' }"
            active-class="text-pink-ieen-1"
          >
            <q-item-section avatar>
              <q-icon name="clear_all" />
            </q-item-section>
            <q-item-section> Solicitudes voto anticipado </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item
          v-if="CatalogosConList.some((element) => element == 'SC-PAN-RES')"
          clickable
          v-ripple
          :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'"
          :to="{ name: 'panel' }"
          active-class="text-pink-ieen-1"
        >
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section> Panel </q-item-section>
        </q-item>
      </q-list>
      <!-- <div class="absolute-bottom">
        <div class="text-subtitle1 text-center q-pb-lg">
          Consulta aquí el
          <a
            class="text-bold text-pink"
            target="blanck"
            href="https://ieenayarit.org/PDF/Computos/Manual_Computos.pdf"
            >Manual de usuario <q-icon name="menu_book" />
          </a>
        </div>
      </div> -->
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="bg-pink-ieen text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>&#169; Unidad Técnica de Informatica y Estadística</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth-store";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { EncryptStorage } from "storage-encryption";

//----------------------------------------------------------

const leftDrawerOpen = ref(false);
const $q = useQuasar();
const route = useRoute();
const authStore = useAuthStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const usuario = ref("");
const userName = ref("");
const { modulos, sistemas, apps, usuario_Nombre } = storeToRefs(authStore);
const CatalogosConList = ref([]);
const modo = ref(false);

//----------------------------------------------------------

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

//----------------------------------------------------------

onBeforeMount(async () => {
  if (route.query.key) {
    encryptStorage.encrypt("key", route.query.key);
  }

  if (route.query.sistema) {
    encryptStorage.encrypt("sistema", route.query.sistema);
  }

  if (route.query.usr) {
    encryptStorage.encrypt("usuario", route.query.usr);
    usuario.value = encryptStorage.decrypt("usuario");
  } else {
    if (encryptStorage.decrypt("usuario") != null) {
      usuario.value = encryptStorage.decrypt("usuario");
    }
  }

  if (route.query.userNameL) {
    encryptStorage.encrypt("userNameL", route.query.userNameL);
  }

  if (encryptStorage.decrypt("userNameL")) {
    userName.value = route.query.userNameL;
  }
  await loadMenu();
});

//----------------------------------------------------------

const modoOscuro = (valor) => {
  modo.value = valor;
  $q.dark.set(modo.value);
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

//----------------------------------------------------------

const loadMenu = async () => {
  $q.loading.show();
  await authStore.loadSistemas();
  await authStore.loadModulos();
  await authStore.loadPerfil();
  await authStore.loadUsuario();
  await authStore.loadOficina();
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "SC-CAP-RES":
        CatalogosConList.value.push("SC-CAP-RES");
        break;
      case "SC-REG-RES":
        CatalogosConList.value.push("SC-REG-RES");
        break;
      case "SC-RES-VA":
        CatalogosConList.value.push("SC-RES-VA");
        break;
      case "SC-CON-RES":
        CatalogosConList.value.push("SC-CON-RES");
        break;
      case "SC-REG-CAS":
        CatalogosConList.value.push("SC-REG-CAS");
        break;
      case "SC-MAY-RES":
        CatalogosConList.value.push("SC-MAY-RES");
        break;
      case "SC-REG-SOL":
        CatalogosConList.value.push("SC-REG-SOL");
        break;
      case "SC-PAN-RES":
        CatalogosConList.value.push("SC-PAN-RES");
        break;
      case "SC-CAP-VA":
        CatalogosConList.value.push("SC-CAP-VA");
        break;
      case "SC-CAP-VA":
        CatalogosConList.value.push("SC-CAP-VA");
        break;
    }
  });
  $q.loading.hide();
};
</script>
<style lang="scss">
.bg-pink-ieen {
  color: white;
  background: #d1308a !important;
}
.text-pink-ieen-1 {
  color: #d1308a !important;
}
</style>
