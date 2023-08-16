<!--
 * @描 述: 标注模型
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addOrbitControls } from "../js/common.js";
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const aircraftPath = new URL("../assets/gltfs/aircraft/scene.gltf", import.meta.url).href;
// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// 创建一个三维场景对象
const scene = new THREE.Scene();

export default {
  name: "TagGltf",
  setup() {
    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    /*---------------------------创建webgl渲染器对象--------------------------*/
    // 创建webgl渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height);
    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    /*-------------------------------加载gltf模型-------------------------------*/
    const loadGltf = () => {
      const loader = new GLTFLoader();
      loader.load(aircraftPath, function (gltf) {
        gltf.scene.traverse(function (obj) {
          if (obj.isMesh) {
            const div = document.createElement("div");
            div.textContent = obj.name;
            const tag = new CSS2DObject(div);
            obj.add(tag);
          }
        });
        // 返回的场景对象gltf.scene插入到threejs场景中
        scene.add(gltf.scene);
      });
    };

    /*----------------------------创建css2d渲染器对象----------------------------*/
    const css2DRenderer = new CSS2DRenderer();
    css2DRenderer.setSize(width, height);
    css2DRenderer.domElement.style.position = "absolute";
    css2DRenderer.domElement.style.top = "0px";
    // 设置.style.pointerEvents = none，就可以解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    css2DRenderer.domElement.style.pointerEvents = "none";

    /*----------------------------添加平行光源----------------------------*/
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 50, 50);
    scene.add(directionalLight);

    /*--------------------------添加坐标格辅助对象-------------------------*/
    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(40, 100, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    const init = () => {
      document.body.appendChild(renderer.domElement);
      document.body.appendChild(css2DRenderer.domElement);
      loadGltf();
      // 添加性能监控
      addStats(stats);
      // 窗口大小变化的时候更新场景
      window.onresize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        css2DRenderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
    };

    const render = () => {
      stats.update();
      renderer.render(scene, camera); // 如果加了渲染通道，直接调用composer.render()即可
      css2DRenderer.render(scene, camera);
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
