<!--
 * @描 述: 继续threejs实现的柜体摆放案例
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
const obj1Path = new URL(
  "../assets/objs/small cabinet for program v2.obj",
  import.meta.url
).href;
const obj2Path = new URL(
  "../assets/objs/wide wide cabinet for program v2.obj",
  import.meta.url
).href;

const loaderObj = (objPath) => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(objPath, (obj) => {
      resolve(obj);
    });
  });
};

export default {
  name: "CabinetPlacement",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();

    // 漫反射网格材质（受光照的影响）
    const material = new THREE.MeshLambertMaterial({
      color: 0xff00ff,
      // side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      // map: getTexture("中心矩阵"),
    });

    /*--------------------obj模型加载--------------------*/
    //纹理贴图加载器TextureLoader
    const loadObj = () => {
      let dragControls1 = null;
      let dragControls2 = null;
      const obj1Loader = loaderObj(obj1Path);
      const obj2Loader = loaderObj(obj2Path);
      Promise.all([obj1Loader, obj2Loader]).then((groups) => {
        groups[0].position.y += 330;
        groups.forEach((group) => {
          group.rotation.x += -Math.PI / 2;
        });

        scene.add(...groups);

        // 创建拖动控制器
        dragControls1 = new DragControls(
          [groups[0]],
          camera,
          renderer.domElement
        );
        dragControls2 = new DragControls(
          [groups[1]],
          camera,
          renderer.domElement
        );
        dragControls1.transformGroup = true;
        dragControls2.transformGroup = true;

        // 监听拖动开始事件
        dragControls1.addEventListener("dragstart", function (event) {
          // 停止渲染循环，防止拖动过程中产生闪烁
          controls.enabled = false;
          dragControls2.enabled = false;
        });

        // 监听拖动结束事件
        dragControls1.addEventListener("dragend", function (event) {
          // 启动渲染循环
          controls.enabled = true;
          dragControls2.enabled = true;
          const group = event.object;
          const snapMesh = groups[1].getObjectByName("bottom paper (1)");
          const center1 = new THREE.Vector3();
          const box1 = new THREE.Box3().setFromObject(snapMesh);
          box1.getCenter(center1);

          const mesh = group.getObjectByName("paper (1)");
          const center2 = new THREE.Vector3();
          const box2 = new THREE.Box3().setFromObject(mesh);
          box2.getCenter(center2);

          if (center1.distanceTo(center2) < 200) {
            const offsetX = center2.x - center1.x;
            const offsetY = center2.y - center1.y;
            const offsetZ = center2.z - center1.z;
            group.position.x -= offsetX;
            group.position.y -= offsetY;
            group.position.z -= offsetZ;
          }

          // const box3 = new THREE.Box3().setFromObject(group);
          // const boxHelper = new THREE.Box3Helper(box3, 0xffff00);
          // scene.add(boxHelper)
        });

        // 监听拖动开始事件
        dragControls2.addEventListener("dragstart", function (event) {
          // 停止渲染循环，防止拖动过程中产生闪烁
          controls.enabled = false;
          dragControls1.enabled = false;
        });

        // 监听拖动结束事件
        dragControls2.addEventListener("dragend", function (event) {
          // 启动渲染循环
          controls.enabled = true;
          dragControls1.enabled = true;
        });
      });
    };

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(10, width / height, 1, 30000);
    camera.position.set(0, 0, 2000);
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

    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(5000, 50, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    addAxesHelper(scene);

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
