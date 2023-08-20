<!--
 * @描 述: MorphAnimation 变形动画原理
 * @作 者: 朱鹏飞
-->

<template>
  <div class="btns">
    <div class="btn" @click="stopAnimate">停止</div>
    <div class="btn" @click="playAnimate">播放</div>
    <div class="btn" id="paused" @click="pauseAnimate">{{ pausedText }}</div>
    <div class="btn" @click="timeScale(2)">2倍速</div>
    <div class="btn" @click="timeScale(1)">1倍速</div>
  </div>
</template>

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
  name: "MorphAnimation",
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

    /*-----------------------------------材质------------------------------------*/
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      // side: THREE.DoubleSide,
    });

    /*-----------------------------------几何------------------------------------*/
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const target1 = new THREE.BoxGeometry(50, 200, 50).attributes.position;
    const target2 = new THREE.BoxGeometry(10, 50, 0).attributes.position;
    geometry.morphAttributes.position = [target1, target2];
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.morphTargetInfluences[0] = 0.0;
    mesh.morphTargetInfluences[1] = 1.0;
    /*-----------------------------------生成形变动画------------------------------------*/
    mesh.name = "Box";
    const KF1 = new THREE.KeyframeTrack(
      "Box.morphTargetInfluences[0]",
      [0, 5],
      [0, 1]
    );
    const KF2 = new THREE.KeyframeTrack(
      "Box.morphTargetInfluences[1]",
      [5, 10],
      [0, 1]
    );
    // 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒
    const clip = new THREE.AnimationClip("test", 10, [KF1, KF2]);
    // 创建一个动画播放器
    // 包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
    const mixer = new THREE.AnimationMixer(mesh);
    // 执行播放器AnimationMixer的.clipAction()方法返回一个AnimationAction对象,AnimationAction对象用来控制如何播放，比如.play()方法。
    const clipAction = mixer.clipAction(clip);
    // .play()控制动画播放，默认循环播放
    clipAction.play();
    // 不循环播放
    // clipAction.loop = THREE.LoopOnce;
    // 物体状态停留在动画结束的时候
    clipAction.clampWhenFinished = true;
    gui.add(clipAction, "time", 0, 10);

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

    const timeScale = (v) => {
      clipAction.timeScale = v;
    };

    return { stopAnimate, playAnimate, pauseAnimate, timeScale, pausedText };
  },
};
</script>
<style>
.btns {
  display: flex;
  position: absolute;
  top: 10px;
  right: 500px;
  z-index: 2;
}
.btn {
  cursor: pointer;
  background-color: bisque;
  padding: 5px 20px;
  margin: 5px;
}
</style>
