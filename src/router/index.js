import { createRouter, createWebHistory } from "vue-router";

// Import halaman yang mau dipakai
import Dashboard from "../components/Dashboard.vue";
import Sidebar from "../components/Sidebar.vue";
import Tryouts from "../components/Navbar.vue";
import Tryoutskd from "../components/Tryoutskd.vue";
import DaftarAkun from "../components/Daftarakun.vue";
import Materiskd from "../components/Materiskd.vue";
import Axiostest from "../components/Axiostest.vue";
import Tryoutskdlihat from "../components/Tryoutskdlihat.vue";

// Daftar route
const routes = [
  { path: "/", component: Dashboard },
  { path: "/tryouts", component: Tryouts },
  { path: "/sidebar", component: Sidebar },
  { path: "/tryoutskd", component: Tryoutskd },
  { path: "/daftarakun", component: DaftarAkun },
  { path: "/materiskd", component: Materiskd },
  { path: "/axiostest", component: Axiostest },
  { path: "/tryoutskd/lihat/:eid", component: Tryoutskdlihat },
];

// Buat router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
