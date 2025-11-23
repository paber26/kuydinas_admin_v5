import { createRouter, createWebHistory } from "vue-router";

// Import halaman yang mau dipakai
import Dashboard from "../components/Dashboard.vue";
import Sidebar from "../components/Sidebar.vue";
import Tryouts from "../components/Navbar.vue";
import Tryoutskd from "../components/Tryoutskd.vue";
import Akun from "../components/Akun.vue";
import Materiskd from "../components/Materiskd.vue";

// Daftar route
const routes = [
  { path: "/", component: Dashboard },
  { path: "/tryouts", component: Tryouts },
  { path: "/sidebar", component: Sidebar },
  { path: "/tryoutskd", component: Tryoutskd },
  { path: "/akun", component: Akun },
  { path: "/materiskd", component: Materiskd },
];

// Buat router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
