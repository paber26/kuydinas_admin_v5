import { createRouter, createWebHistory } from "vue-router";

// Import halaman yang mau dipakai
import Dashboard from "../components/Dashboard.vue";
import Sidebar from "../components/Sidebar.vue";
import Tryoutskd from "../components/Tryout/Tryoutskd.vue";
import DaftarAkun from "../components/Daftarakun.vue";
import Materiskd from "../components/Materiskd.vue";
import Axiostest from "../components/Axiostest.vue";
import Tryoutskdlihat from "../components/Tryout/Tryoutskdlihat.vue";
import Tryoutskdedit from "../components/Tryout/Tryoutskdedit.vue";
import BankSoal from "../components/BankSoal/BankSoal.vue";
import BankSoalCreate from "../components/BankSoal/BankSoalCreate.vue";
import TryoutBuilder from "../components/Tryout/TryoutBuilder.vue";
import TryoutCreate from "../components/Tryout/TryoutCreate.vue";
import TryoutManage from "../components/Tryout/TryoutManage.vue";

// Daftar route
const routes = [
  { path: "/", component: Dashboard },
  { path: "/sidebar", component: Sidebar },
  { path: "/tryoutskd", component: Tryoutskd },
  { path: "/daftarakun", component: DaftarAkun },
  { path: "/materiskd", component: Materiskd },
  { path: "/axiostest", component: Axiostest },
  { path: "/tryoutskd/lihat/:eid", component: Tryoutskdlihat },
  { path: "/tryoutskd/edit/:eid", component: Tryoutskdedit },
  { path: "/banksoal", component: BankSoal },
  { path: "/banksoal/create", component: BankSoalCreate },
  { path: "/tryout-builder", component: TryoutBuilder },
  { path: "/tryout-builder/create", component: TryoutCreate },
  {
    path: "/tryout-builder/:id",
    component: () => import("../components/Tryout/TryoutDetail.vue"),
  },
  { path: "/tryout-builder/:id/manage", component: TryoutManage },
];

// Buat router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
