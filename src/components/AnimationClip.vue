<!--
 * @描 述: AnimationClip 关键帧动画
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addOrbitControls } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// 创建一个三维场景对象
const scene = new THREE.Scene();

// 往场景中添加一个mesh
const addMesh = (position = [0, 0, 0]) => {
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444, //高光部分的颜色
    // wireframe: true,
    // side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  scene.add(mesh);
  return mesh;
};

export default {
  name: "AnimationClip",
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

    /*-----------------------------------几何------------------------------------*/
    const mesh = addMesh([0, 25, 0]);
    mesh.name = "Box";
    const times = [0, 2, 4, 6]; // 时间轴上，设置三个时刻0、3、6秒
    // time中三个不同时间点，物体分别对应values中的三个xyz坐标
    const values = [0, 25, 0, 100, 25, 0, 0, 25, 100, 0, 25, 0];
    // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0)，3~6秒逐渐从(100,0,0)移动到(0,0,100)
    const positionKF = new THREE.KeyframeTrack("Box.position", times, values);
    // 从2秒到5秒，物体从黄色逐渐变成蓝色
    const colorKF = new THREE.KeyframeTrack("Box.material.color", [0, 3, 6], [1, 1, 0, 0, 1, 0, 0, 0, 1]);
    // 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒
    const clip = new THREE.AnimationClip("test", 6, [positionKF, colorKF]);
    // 创建一个动画播放器
    // 包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
    const mixer = new THREE.AnimationMixer(mesh);
    // 执行播放器AnimationMixer的.clipAction()方法返回一个AnimationAction对象,AnimationAction对象用来控制如何播放，比如.play()方法。
    const clipAction = mixer.clipAction(clip);
    clipAction.play();

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
      const frameT = clock.getDelta();
      mixer.update(frameT);
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
<style></style>
