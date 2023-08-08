<!--
 * @描 述: 三维样条曲线：在三维空间中随意设置几个顶点坐标，然后作为三维样条曲线CatmullRomCurve3的参数，你就可以生成一条穿过这几个点的光滑曲线。
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
  name: "CatmullRomCurve3",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个缓冲类型几何体
    const geometry = new THREE.BufferGeometry();

    // 三维向量Vector3创建一组顶点坐标
    const arr = [
      new THREE.Vector3(-50, 20, 90),
      new THREE.Vector3(-10, 40, 40),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(60, -60, 0),
      new THREE.Vector3(70, 0, 80),
    ];
    // 三维样条曲线
    const curve = new THREE.CatmullRomCurve3(arr);

    // //getPoints是基类Curve的方法，平面曲线会返回一个vector2对象作为元素组成的数组
    const pointArr = curve.getPoints(50); //分段数50，返回51个顶点-获取点的方式并不是按照曲线等间距的方式，而是会考虑曲线斜率变化，斜率变化快的位置返回的顶点更密集
    // const pointArr = curve.getSpacedPoints(50); //分段数50，返回51个顶点-是按照曲线长度等间距返回顶点数据

    geometry.setFromPoints(pointArr);

    /*--------------------线模型对象---------------------*/
    // 线材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0xffff00,
    });
    // 创建线模型对象
    const line = new THREE.Line(geometry, material);
    // 闭合线条
    // const line = new THREE.LineLoop(geometry, material);
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
