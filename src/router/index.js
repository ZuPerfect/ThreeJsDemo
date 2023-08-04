import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "HelloWorld",
    component: () => import("../components/Primer.vue"),
  },
  {
    path: "/BufferGeometry",
    name: "BufferGeometry",
    component: () => import("../components/BufferGeometry.vue"),
  },
  {
    path: "/Earth",
    name: "Earth",
    component: () => import("../components/Earth.vue"),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
