<!--
 * @描 述: 轮廓填充ShapeGeometry
 *        有些时候已知一个多边形的外轮廓坐标，想通过这些外轮廓坐标生成一个多边形几何体平面，这时候你可以借助threejs提供的轮廓填充ShapeGeometry几何体实现。
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, addAmbientLight, addOrbitControls } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "ShapeGeometry",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();

    // 一组二维向量表示一个多边形轮廓坐标
    const pointsArr = [
      new THREE.Vector2(-50, -50),
      new THREE.Vector2(-60, 0),
      new THREE.Vector2(0, 50),
      new THREE.Vector2(60, 0),
      new THREE.Vector2(50, -50),
    ];

    // Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
    const shape = new THREE.Shape(pointsArr);

    const geometry = new THREE.ShapeGeometry(shape);

    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    // 添加点光源
    addPointLight(scene);
    // 添加环境光
    // addAmbientLight(scene);
    // 辅助观察坐标系
    addAxesHelper(scene);
    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    const init = () => {
      document.body.appendChild(renderer.domElement);
      addStats(stats);
      window.onresize = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
    };

    const render = () => {
      stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    onMounted(() => {
      init();
      render();
    });

    return {};
  },
};
</script>
