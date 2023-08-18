import { createRouter, createWebHashHistory } from "vue-router";

export const routes = [
  {
    path: "/",
    name: "",
    component: () => import("../components/Primer.vue"),
  },
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
  {
    path: "/GenerateArcVertex",
    name: "GenerateArcVertex",
    component: () => import("../components/GenerateArcVertex.vue"),
  },
  {
    path: "/SetFromPoints",
    name: "SetFromPoints",
    component: () => import("../components/SetFromPoints.vue"),
  },
  {
    path: "/Curve",
    name: "Curve",
    component: () => import("../components/Curve.vue"),
  },
  {
    path: "/CatmullRomCurve3",
    name: "CatmullRomCurve3",
    component: () => import("../components/CatmullRomCurve3.vue"),
  },
  {
    path: "/QuadraticBezierCurve",
    name: "QuadraticBezierCurve",
    component: () => import("../components/QuadraticBezierCurve.vue"),
  },
  {
    path: "/TubeGeometry",
    name: "TubeGeometry",
    component: () => import("../components/TubeGeometry.vue"),
  },
  {
    path: "/LatheGeometry",
    name: "LatheGeometry",
    component: () => import("../components/LatheGeometry.vue"),
  },
  {
    path: "/ShapeGeometry",
    name: "ShapeGeometry",
    component: () => import("../components/ShapeGeometry.vue"),
  },
  {
    path: "/ExtrudeGeometry",
    name: "ExtrudeGeometry",
    component: () => import("../components/ExtrudeGeometry.vue"),
  },
  {
    path: "/EdgesGeometry",
    name: "EdgesGeometry",
    component: () => import("../components/EdgesGeometry.vue"),
  },
  {
    path: "/LightAndShadow",
    name: "LightAndShadow",
    component: () => import("../components/LightAndShadow.vue"),
  },
  {
    path: "/Sprite",
    name: "Sprite",
    component: () => import("../components/Sprite.vue"),
  },
  {
    path: "/EffectComposer",
    name: "EffectComposer",
    component: () => import("../components/EffectComposer.vue"),
  },
  {
    path: "/Raycaster",
    name: "Raycaster",
    component: () => import("../components/Raycaster.vue"),
  },
  {
    path: "/CSS2DRenderer",
    name: "CSS2DRenderer",
    component: () => import("../components/CSS2DRenderer.vue"),
  },
  {
    path: "/TagPositionSet",
    name: "TagPositionSet",
    component: () => import("../components/TagPositionSet.vue"),
  },
  {
    path: "/TagGltf",
    name: "TagGltf",
    component: () => import("../components/TagGltf.vue"),
  },
  {
    path: "/CSS3DRenderer",
    name: "CSS3DRenderer",
    component: () => import("../components/CSS3DRenderer.vue"),
  },
  {
    path: "/AnimationClip",
    name: "AnimationClip",
    component: () => import("../components/AnimationClip.vue"),
  },
  {
    path: "/GltfAnimation",
    name: "GltfAnimation",
    component: () => import("../components/GltfAnimation.vue"),
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
