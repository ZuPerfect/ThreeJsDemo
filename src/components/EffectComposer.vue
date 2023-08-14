<!--
 * @描 述: 后处理EffectComposer
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addOrbitControls, getGui } from "../js/common.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// 引入渲染器通道RenderPass
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// 引入OutlinePass通道（可以给指定的某个模型对象添加一个高亮发光描边效果）
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
// 引入UnrealBloomPass通道
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
// 引入GlitchPass通道（GlitchPass通道会产生闪屏效果）
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const gui = getGui();

export default {
  name: "EffectComposer",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
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
    // Bloom发光通道
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
    // GlitchPass通道会产生闪屏效果
    const glitchPass = new GlitchPass();
    // 辅助观察坐标系
    // addAxesHelper(scene);
    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 50, 50);
    scene.add(directionalLight);

    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(40, 100, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    /*-----------------------------------几何------------------------------------*/
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const mesh1 = new THREE.Mesh(geometry1, material);

    // 精灵模型Sprite默认是一个矩形形状，默认长宽都是1，默认在坐标原点位置
    mesh.position.set(-2, 0.5, 0);
    mesh1.position.set(2, 0.5, 0);
    scene.add(mesh);
    scene.add(mesh1);

    // three.js场景中有多个模型的话，你希望给哪个模型对象设置发光描边效果，就可以通过OutlinePass的选择对象属性.selectedObjects设置。
    outlinePass.selectedObjects = [mesh];
    // OutlinePass有很多控制高亮外边框样式的属性，下面介绍几个比较常用的属性
    outlinePass.visibleEdgeColor.set(0x00ffff);
    // 高亮发光描边的厚度
    outlinePass.edgeThickness = 4;
    // 高亮描边发光的强度
    outlinePass.edgeStrength = 6;
    // 模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 2;
    composer.addPass(outlinePass);
    // bloom发光强度
    bloomPass.strength = 1.0;
    composer.addPass(bloomPass);

    // 设置glitchPass通道
    composer.addPass(glitchPass);

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
      composer.render();
      // renderer.render(scene, camera);
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
