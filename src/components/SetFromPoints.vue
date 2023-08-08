<!--
 * @描 述: 几何体方法.setFromPoints()
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, addOrbitControls } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "SetFromPoints",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个缓冲类型几何体
    const geometry = new THREE.BufferGeometry();

    const pointArr = [
      // 三维向量Vector3表示的坐标值
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 100, 0),
      new THREE.Vector3(0, 100, 100),
      new THREE.Vector3(0, 0, 100),
    ];

    geometry.setFromPoints(pointArr);

    /*--------------------线模型对象---------------------*/
    // 线材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0xffff00,
    });
    // 创建线模型对象
    // const line = new THREE.Line(geometry, material);
    // 闭合线条
    const line = new THREE.LineLoop(geometry, material);
    // 非连续的线条
    // const line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    /*--------------------点模型对象---------------------*/
    // 几何体geometry作为点模型Points参数，会把几何体渲染为点，把几何体作为Mesh的参数会把几何体渲染为面。
    const pointMaterial = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 10,
    });

    const points = new THREE.Points(geometry, pointMaterial);
    scene.add(points);

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
