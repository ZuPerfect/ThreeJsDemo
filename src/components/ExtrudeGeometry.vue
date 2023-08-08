<!--
 * @描 述: 拉伸ExtrudeGeometry
 *        是基于一个基础的平面轮廓Shape进行变换，生成一个几何体。
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
  name: "ExtrudeGeometry",
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
    const geometryOpt = {
      depth: 50, // 拉伸长度
      bevelThickness: 5, // 倒角尺寸拉伸方向
      bevelSize: 5, //倒角尺寸:垂直拉伸方向
      bevelSegments: 20, //倒圆角：倒角细分精度，默认3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, geometryOpt);

    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // gui.add(geometryOpt, "depth", 0, 100).onChange(v => (geometry.parameters.options.depth = v));
    gui.add(geometryOpt, "bevelThickness", 0, 100).onChange(v => (geometry.parameters.options.bevelThickness = v));
    gui.add(geometryOpt, "bevelSize", 0, 100).onChange(v => (geometry.parameters.options.bevelSize = v));
    gui.add(geometryOpt, "bevelSegments", 0, 100).onChange(v => (geometry.parameters.options.bevelSegments = v));

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
