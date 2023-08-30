<!--
 * @描 述: 骨骼关节Bone
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addOrbitControls, getGui } from "../js/common.js";
const gui = getGui();

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// 创建一个三维场景对象
const scene = new THREE.Scene();

export default {
  name: "Bone",
  setup() {
    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(4, 218, 377);
    camera.lookAt(0, 0, 0);

    /*---------------------------创建webgl渲染器对象--------------------------*/
    // 创建webgl渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    /*----------------------------添加平行光源----------------------------*/
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 50, 50);
    scene.add(directionalLight);

    /*--------------------------添加坐标格辅助对象-------------------------*/
    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(400, 100, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    /*-----------------------------------Bone------------------------------------*/
    const Bone1 = new THREE.Bone(); // 关节1，用来作为根关节
    const Bone2 = new THREE.Bone(); // 关节2
    const Bone3 = new THREE.Bone(); // 关节3

    // 设置关节父子关系，多个骨头关节构成一个树结构
    Bone1.add(Bone2);
    Bone2.add(Bone3);

    Bone2.position.y = 60;
    Bone3.position.y = 30;
    Bone1.position.set(0, 0, 0);

    Bone1.rotateX(Math.PI / 6);
    Bone2.rotateX(Math.PI / 6);

    const group = new THREE.Group();
    group.add(Bone1);
    const skeletonHelper = new THREE.SkeletonHelper(group);
    group.add(skeletonHelper);

    scene.add(group);
    gui.add(Bone1.rotation, "x", 0, Math.PI / 3).name("关节1");
    gui.add(Bone2.rotation, "x", 0, Math.PI / 3).name("关节2");

    const init = () => {
      document.body.appendChild(renderer.domElement);
      // 添加性能监控
      addStats(stats);
      // 窗口大小变化的时候更新场景
      window.onresize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
    };

    const clock = new THREE.Clock();
    const render = () => {
      stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    onMounted(() => {
      init();
      render();
    });

    const stopAnimate = () => {
      clipAction.stop();
    };

    const playAnimate = () => {
      clipAction.play();
    };

    const pausedText = ref("暂停");
    const pauseAnimate = () => {
      if (clipAction.paused) {
        clipAction.paused = false;
        pausedText.value = "暂停";
      } else {
        clipAction.paused = true;
        pausedText.value = "继续";
      }
    };

    const timeScale = v => {
      clipAction.timeScale = v;
    };

    return { stopAnimate, playAnimate, pauseAnimate, timeScale, pausedText };
  },
};
</script>
