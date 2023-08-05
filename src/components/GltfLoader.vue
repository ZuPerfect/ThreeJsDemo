<!--
 * @描 述: gltf模型加载
 * @作 者: 朱鹏飞
-->

<template>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  addStats,
  addAxesHelper,
  addAmbientLight,
  addPointLight,
  addOrbitControls,
  addDirectionalLight,
} from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const aircraftPath = new URL("../assets/gltfs/aircraft/scene.gltf", import.meta.url).href;

export default {
  name: "GltfLoader",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();

    /*--------------------gltf模型加载--------------------*/
    //纹理贴图加载器TextureLoader
    const loader = new GLTFLoader();
    loader.load(aircraftPath, function (gltf) {
      // 返回的场景对象gltf.scene插入到threejs场景中
      scene.add(gltf.scene);
    });

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(10, width / height, 1, 3000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height);
    // 设置背景颜色
    renderer.setClearColor(0x1e1e1e, 1); //设置背景颜色
    renderer.render(scene, camera);

    // 添加点光源
    addPointLight(scene);
    // 添加平行光
    // addDirectionalLight(scene);
    // 添加环境光
    // addAmbientLight(scene);
    // 辅助观察坐标系
    // addAxesHelper(scene);
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
