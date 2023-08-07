import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/Primer",
    name: "Primer",
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
  {
    path: "/GltfLoader",
    name: "GltfLoader",
    component: () => import("../components/GltfLoader.vue"),
  },
  {
    path: "/PBRMeshStandardMaterial",
    name: "PBRMeshStandardMaterial",
    component: () => import("../components/PBRMeshStandardMaterial.vue"),
  },
  {
    path: "/PBRMeshPhysicalMaterial",
    name: "PBRMeshPhysicalMaterial",
    component: () => import("../components/PBRMeshPhysicalMaterial.vue"),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由变化了之后刷新页面
router.afterEach((to, from) => {
  if (from.name) {
    location.reload();
  }
});

export default router;
