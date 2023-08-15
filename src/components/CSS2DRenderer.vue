<!--
 * @描 述: CSS2DRenderer(HTML标签)
 * @作 者: 朱鹏飞
-->

<template>
  <div id="tag1">这是第一个正方体</div>
  <div id="tag2">这是第二个正方体</div>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addOrbitControls } from "../js/common.js";
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

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
  mesh.position.set(...position);
  scene.add(mesh);
  return mesh;
};

export default {
  name: "CSS2DRenderer",
  setup() {
    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(-6.892031979223322, 4.2769926569586545, 11.265193278221345);
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

    /*----------------------------创建css2d渲染器对象----------------------------*/
    const css2DRenderer = new CSS2DRenderer();
    // css2DRenderer.render(scene, camera);
    css2DRenderer.setSize(width, height);
    // addOrbitControls(scene, camera, css2DRenderer);

    /*----------------------------添加平行光源----------------------------*/
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 50, 50);
    scene.add(directionalLight);

    /*--------------------------添加坐标格辅助对象-------------------------*/
    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(40, 100, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    /*-----------------------------------几何------------------------------------*/
    const mesh = addMesh([-2, 0.5, 0]);
    const mesh1 = addMesh([2, 0.5, 0]);

    /*--------------------------------HTML标签-----------------------------------*/

    const addCSS2DObject = () => {
      const tag1 = new CSS2DObject(document.getElementById("tag1"));
      const tag2 = new CSS2DObject(document.getElementById("tag2"));
      tag1.position.set(2, 1.3, 0);
      tag2.position.set(-2, 1.3, 0);
      scene.add(tag1, tag2);
      css2DRenderer.domElement.style.position = "absolute";
      css2DRenderer.domElement.style.top = "0px";
      // 设置.style.pointerEvents = none，就可以解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
      css2DRenderer.domElement.style.pointerEvents = "none";
      document.body.appendChild(css2DRenderer.domElement);
    };

    const init = () => {
      addCSS2DObject();
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
<style>
#tag1 {
  color: red;
  background-color: white;
}
</style>
