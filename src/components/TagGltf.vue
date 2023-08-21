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
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// 引入渲染器通道RenderPass
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// 引入OutlinePass通道（可以给指定的某个模型对象添加一个高亮发光描边效果）
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
// 伽马校正后处理Shader
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

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
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height);
    // 创建后处理对象EffectComposer，WebGL渲染器作为参数
    const composer = new EffectComposer(renderer);
    // 创建一个渲染器通道，场景和相机作为参数
    const renderPass = new RenderPass(scene, camera);
    // 设置renderPass通道
    composer.addPass(renderPass);
    // 发光描边

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    // OutlinePass有很多控制高亮外边框样式的属性，下面介绍几个比较常用的属性
    outlinePass.visibleEdgeColor.set(0x00ffff);
    // 高亮发光描边的厚度
    outlinePass.edgeThickness = 4;
    // 高亮描边发光的强度
    outlinePass.edgeStrength = 6;
    // 模型闪烁频率控制，默认0不闪烁
    // outlinePass.pulsePeriod = 2;
    composer.addPass(outlinePass);
    // 创建伽马校正通道
    const gammaPass = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaPass);

    // 添加交互控制器
    addOrbitControls(scene, camera, renderer);

    /*-------------------------------加载gltf模型-------------------------------*/
    const loadGltf = () => {
      const loader = new GLTFLoader();
      loader.load(aircraftPath, function (gltf) {
        const meshes = [];
        gltf.scene.traverse(function (obj) {
          if (obj.isMesh) {
            obj.material.side = THREE.FrontSide;
            const div = document.createElement("div");
            div.innerHTML = obj.name;
            const tag = new CSS2DObject(div);
            obj.add(tag);

            meshes.push(obj);
          }
        });

        renderer.domElement.addEventListener("pointermove", function (event) {
          const px = event.offsetX;
          const py = event.offsetY;
          const x = (px / window.innerWidth) * 2 - 1;
          const y = -(py / window.innerHeight) * 2 + 1;
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
          const intersects = raycaster.intersectObjects(meshes);
          if (intersects.length > 0) {
            outlinePass.selectedObjects = [intersects[0].object];
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
      composer.render(); // 如果加了渲染通道，直接调用composer.render()即可
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
