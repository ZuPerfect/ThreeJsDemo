<!--
 * @描 述: 外部模型动画，模拟一个导弹发射的效果
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
import { addStats, addOrbitControls, addAxesHelper } from "../js/common.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 外部模型路径
const aircraftPath = new URL("../assets/gltfs/aircraft/scene.gltf", import.meta.url).href;

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// 创建一个三维场景对象
const scene = new THREE.Scene();

export default {
  name: "AnimationClip",
  setup() {
    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(40, 41, 9);
    camera.lookAt(0, 0, 0);
    addAxesHelper(scene);

    /*---------------------------创建webgl渲染器对象--------------------------*/
    // 创建webgl渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
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

    /*-------------------------------加载gltf模型-------------------------------*/
    const meshes = [];
    let mixer = null;
    let clipAction = null;
    const loadGltf = () => {
      const loader = new GLTFLoader();
      loader.load(aircraftPath, function (gltf) {
        gltf.scene.traverse(obj => {
          if (obj.isMesh) {
            meshes.push(obj);
          }
        });
        const position = meshes[0].position;
        const times = [0, 6]; // 时间轴上，设置三个时刻0、6秒
        // // time中三个不同时间点，物体分别对应values中的三个xyz坐标
        const values = [position.x, position.y, position.z, position.x, position.y, position.z + 100];
        // // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0)，3~6秒逐渐从(100,0,0)移动到(0,0,100)
        const positionKF = new THREE.KeyframeTrack("ssss.position", times, values);
        // // 从2秒到5秒，物体从黄色逐渐变成蓝色
        const colorKF = new THREE.KeyframeTrack("ssss.material.color", [0, 3, 6], [1, 1, 0, 0, 1, 0, 0, 0, 1]);
        // // 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒
        const clip = new THREE.AnimationClip("test", 6, [positionKF, colorKF]);
        // // 创建一个动画播放器
        // // 包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
        mixer = new THREE.AnimationMixer(gltf.scene.getObjectByName("Object_8"));
        // // 执行播放器AnimationMixer的.clipAction()方法返回一个AnimationAction对象,AnimationAction对象用来控制如何播放，比如.play()方法。
        clipAction = mixer.clipAction(clip);
        // // .play()控制动画播放，默认循环播放
        clipAction.play();
        // 不循环播放
        clipAction.loop = THREE.LoopOnce;
        // 物体状态停留在动画结束的时候
        clipAction.clampWhenFinished = true;
        // 返回的场景对象gltf.scene插入到threejs场景中
        scene.add(gltf.scene);
      });
    };

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
      mixer?.update(frameT);
      stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    onMounted(() => {
      init();
      loadGltf();
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
