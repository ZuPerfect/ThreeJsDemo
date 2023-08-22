<!--
 * @描 述: 拆解模型
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import {
  addStats,
  addOrbitControls,
  addAxesHelper,
  addDirectionalLight,
} from "../js/common.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// const objPath = new URL(
//   "../assets/objs/small cabinet for program v2.obj",
//   import.meta.url
// ).href;
const objPath = new URL(
  "../assets/objs/wide wide cabinet for program v2.obj",
  import.meta.url
).href;

export default {
  name: "CabinetPlacement",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();

    /*--------------------obj模型加载--------------------*/
    //纹理贴图加载器TextureLoader
    const loadObj = () => {
      const loader = new OBJLoader();
      loader.load(objPath, function (obj) {
        obj.rotation.x += -Math.PI / 2;
        scene.add(obj);
        // 创建拖动控制器
        const dragControl = new DragControls(
          [obj],
          camera,
          renderer.domElement
        );

        // 监听拖动开始事件
        dragControl.addEventListener("dragstart", function (event) {
          // 停止渲染循环，防止拖动过程中产生闪烁
          controls.enabled = false;
        });

        // 监听拖动结束事件
        dragControl.addEventListener("dragend", function (event) {
          // 启动渲染循环
          controls.enabled = true;
          const obj = event.object;
          // 初始化中心点坐标
          const center = new THREE.Vector3();
          const box = new THREE.Box3().setFromObject(obj);
          box.getCenter(center);
          const div = document.createElement("div");
          div.innerHTML = obj.name;
          const tag = new CSS2DObject(div);
          tag.position.copy(center);
          scene.add(tag);
        });
      });
    };

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(10, width / height, 1, 30000);
    camera.position.set(1755, 4926, 4487);
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

    /*----------------------------创建css2d渲染器对象----------------------------*/
    const css2DRenderer = new CSS2DRenderer();
    css2DRenderer.setSize(width, height);
    css2DRenderer.domElement.style.position = "absolute";
    css2DRenderer.domElement.style.top = "0px";
    // 设置.style.pointerEvents = none，就可以解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    css2DRenderer.domElement.style.pointerEvents = "none";

    // 添加平行光
    addDirectionalLight(scene);

    // 添加交互控制器
    const controls = addOrbitControls(scene, camera, renderer);

    const init = () => {
      document.body.appendChild(renderer.domElement);
      document.body.appendChild(css2DRenderer.domElement);
      loadObj();
      addStats(stats);
      window.onresize = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        css2DRenderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
    };

    const render = () => {
      stats.update();
      renderer.render(scene, camera);
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
