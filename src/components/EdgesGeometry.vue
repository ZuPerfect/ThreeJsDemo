<!--
 * @描 述: 模型边界线EdgesGeometry
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, getGui, addAmbientLight, addOrbitControls } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const gui = getGui();

export default {
  name: "EdgesGeometry",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      side: THREE.DoubleSide,
    });
    /*----------------------------扫描------------------------------*/
    // 1、扫描轮廓
    const shape = new THREE.Shape([
      // 按照特定顺序，依次书写多边形顶点坐标
      new THREE.Vector2(0, 0), //多边形起点
      new THREE.Vector2(0, 10),
      new THREE.Vector2(10, 10),
      new THREE.Vector2(10, 0),
    ]);

    // 2、扫描轨迹
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -50, -50),
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(8, 50, 50),
      new THREE.Vector3(-5, 0, 100),
    ]);

    const extrudeSettings = {
      extrudePath: curve, //扫描轨迹
      steps: 100, //沿着路径细分精度，越大越光滑
    };
    // 3、扫描造型
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
    });
    const line = new THREE.LineSegments(edges, edgesMaterial);
    mesh.add(line);

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
    addPointLight(scene, [200, 200, 200], false);
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
