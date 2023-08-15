<!--
 * @描 述: 射线拾取模型
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addOrbitControls } from "../js/common.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// 引入渲染器通道RenderPass
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// 引入OutlinePass通道（可以给指定的某个模型对象添加一个高亮发光描边效果）
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// 创建一个三维场景对象
const scene = new THREE.Scene();
// 往场景中添加一个mesh
const addMesh = (position = [0, 0, 0]) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444, //高光部分的颜色
    // wireframe: true,
    // side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // 精灵模型Sprite默认是一个矩形形状，默认长宽都是1，默认在坐标原点位置
  mesh.position.set(...position);
  scene.add(mesh);
  return mesh;
};

export default {
  name: "Raycaster",
  setup() {
    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(-6.892031979223322, 4.2769926569586545, 11.265193278221345);
    camera.lookAt(0, 0, 0);
    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });

    renderer.setSize(width, height);
    renderer.render(scene, camera);
    // 创建后处理对象EffectComposer，WebGL渲染器作为参数
    const composer = new EffectComposer(renderer);
    // 创建一个渲染器通道，场景和相机作为参数
    const renderPass = new RenderPass(scene, camera);
    // 设置renderPass通道
    composer.addPass(renderPass);
    // 发光描边
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 50, 50);
    scene.add(directionalLight);

    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(40, 100, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    /*-----------------------------------几何------------------------------------*/
    const mesh = addMesh([-2, 0.5, 0]);
    const mesh1 = addMesh([2, 0.5, 0]);

    // renderer.domElement.addEventListener("click", function (event) {
    //   const px = event.offsetX;
    //   const py = event.offsetY;
    //   const x = (px / width) * 2 - 1;
    //   const y = -(py / height) * 2 + 1;
    //   const raycaster = new THREE.Raycaster();
    //   raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //   const intersects = raycaster.intersectObjects([mesh, mesh1]);
    //   if (intersects.length > 0) {
    //     outlinePass.selectedObjects = intersects.map(o => o.object);
    //   }
    // });

    renderer.domElement.addEventListener("pointermove", function (event) {
      const px = event.offsetX;
      const py = event.offsetY;
      const x = (px / width) * 2 - 1;
      const y = -(py / height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycaster.intersectObjects([mesh, mesh1]);
      if (intersects.length > 0) {
        outlinePass.selectedObjects = intersects.map(o => o.object);
      }
    });

    // three.js场景中有多个模型的话，你希望给哪个模型对象设置发光描边效果，就可以通过OutlinePass的选择对象属性.selectedObjects设置。
    // outlinePass.selectedObjects = [mesh];
    // OutlinePass有很多控制高亮外边框样式的属性，下面介绍几个比较常用的属性
    outlinePass.visibleEdgeColor.set(0x00ffff);
    // 高亮发光描边的厚度
    outlinePass.edgeThickness = 4;
    // 高亮描边发光的强度
    outlinePass.edgeStrength = 6;
    // 模型闪烁频率控制，默认0不闪烁
    // outlinePass.pulsePeriod = 2;
    composer.addPass(outlinePass);

    const init = () => {
      document.body.appendChild(renderer.domElement);
      // 添加性能监控
      addStats(stats);
      // 窗口大小变化的时候更新场景
      window.onresize = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
    };

    const render = () => {
      stats.update();
      composer.render();
      // renderer.render(scene, camera); // 如果加了渲染通道，直接调用composer.render()即可
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
