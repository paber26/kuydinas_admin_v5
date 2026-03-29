import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../components/Dashboard.vue";
import Tryoutskd from "../components/Tryout/Tryoutskd.vue";
import Tryoutskdlihat from "../components/Tryout/Tryoutskdlihat.vue";
import Tryoutskdedit from "../components/Tryout/Tryoutskdedit.vue";
import BankSoal from "../components/BankSoal/BankSoal.vue";
import BankSoalCreate from "../components/BankSoal/BankSoalCreate.vue";
import TryoutBuilder from "../components/Tryout/TryoutBuilder.vue";
import TryoutCreate from "../components/Tryout/TryoutCreate.vue";
import TryoutManage from "../components/Tryout/TryoutManage.vue";
import Login from "../components/Auth/Login.vue";
import TopupPackages from "../components/Topup/TopupPackages.vue";
import Accounts from "../components/Users/Accounts.vue";

const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/auth/google/callback",
    name: "AdminGoogleCallback",
    component: () => import("../views/auth/GoogleCallback.vue"),
  },
  {
    path: "/",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/banksoal",
    component: BankSoal,
    meta: { requiresAuth: true },
  },
  {
    path: "/banksoal/create",
    component: BankSoalCreate,
    meta: { requiresAuth: true },
  },
  {
    path: "/tryoutskd",
    component: Tryoutskd,
    meta: { requiresAuth: true },
  },
  {
    path: "/tryout-builder",
    component: TryoutBuilder,
    meta: { requiresAuth: true },
  },
  {
    path: "/tryout-builder/create",
    component: TryoutCreate,
    meta: { requiresAuth: true },
  },
  {
    path: "/tryout-builder/:id",
    component: () => import("../components/Tryout/TryoutDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/tryout-builder/:id/manage",
    component: TryoutManage,
    meta: { requiresAuth: true },
  },
  {
    path: "/topup-packages",
    component: TopupPackages,
    meta: { requiresAuth: true },
  },
  {
    path: "/accounts",
    component: Accounts,
    meta: { requiresAuth: true },
  },
  {
    path: "/tryoutskd/lihat/:eid",
    component: Tryoutskdlihat,
    meta: { requiresAuth: true },
  },
  {
    path: "/tryoutskd/edit/:eid",
    component: Tryoutskdedit,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // jika belum login
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // jika sudah login tapi buka login page
  if (to.path === "/login" && token) {
    return next("/");
  }

  // jika halaman admin tapi bukan admin
  if (to.meta.requiresAuth && token && role !== "admin") {
    return next("/login");
  }

  next();
});

export default router;
