import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/login/INDEX.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("@/layout/index.vue"),
      redirect: "/users",
      children: [
        {
          path: "users",
          name: "users",
          component: () => import("@/views/users/index.vue"),
        },
        {
          path: "categories",
          name: "categories",
          component: () => import("@/views/categories/index.vue"),
        },
        {
          path: "goods",
          name: "goods",
          component: () => import("@/views/goods/index.vue"),
        },
        {
          path: "goods/add",
          name: "add",
          component: () => import("@/views/goods/add.vue"),
        },
        {
          path: "orders",
          name: "orders",
          component: () => import("@/views/orders/index.vue"),
        },
        {
          path: "params",
          name: "params",
          component: () => import("@/views/params/index.vue"),
        },
        {
          path: "reports",
          name: "reports",
          component: () => import("@/views/reports/index.vue"),
        },
        {
          path: "rights",
          name: "rights",
          component: () => import("@/views/rights/index.vue"),
        },
        {
          path: "roles",
          name: "roles",
          component: () => import("@/views/roles/index.vue"),
        },
      ],
    },
  ],
});

export default router;
