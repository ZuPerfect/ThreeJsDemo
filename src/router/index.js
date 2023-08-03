import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "HelloWorld",
    component: () => import("../components/Primer.vue"),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
