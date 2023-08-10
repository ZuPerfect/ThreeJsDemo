<!--
 * @描 述: 光源和阴影
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addOrbitControls, getGui } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const gui = getGui();

export default {
  name: "LightAndShadow",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
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
    renderer.shadowMap.enabled = true;

    // 辅助观察坐标系
    addAxesHelper(scene);
    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 400, 0);
    gui.add(directionalLight.position, "x", -400, 400);
    gui.add(directionalLight.position, "y", -400, 400);
    gui.add(directionalLight.position, "z", -400, 400);
    // 平行光设置产生阴影的光源对象,开启光源阴影的计算功能
    directionalLight.castShadow = true;
    // 设置三维场景计算阴影的范围
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.radius = 10;
    scene.add(directionalLight);

    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    // const grid = new THREE.GridHelper(400, 10, 0xc1c1c1, 0x8d8d8d);
    // scene.add(grid);

    // 可视化平行光阴影对应的正投影相机对象
    const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(cameraHelper);

    /*-----------------------------------几何------------------------------------*/
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 100, 0);
    mesh.castShadow = true;
    scene.add(mesh);
    // 地面
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400, 2, 2),
      new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

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
