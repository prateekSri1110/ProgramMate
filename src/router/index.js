import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import UserCode from "@/components/UserCode.vue";
import { auth } from "@/firebase";
import Admin from "@/components/Admin.vue";

// all routes for intercommunication between components
const routes = [
  { path: "/", component: Home },
  {
    path: "/usercode",
    component: UserCode,
    meta: { requiresAuth: true },
  },
  { path: "/admin/:id", name: "admin", component: Admin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth Guard to not dirrectly access the Code Panel without login
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
