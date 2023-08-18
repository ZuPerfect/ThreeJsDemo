<!--
 * @描 述: CSS3DRenderer(HTML标签)
 * @作 者: 朱鹏飞
-->

<template>
  <div id="tag1">正方体1</div>
  <div id="tag2">正方体2</div>
  <div id="tag3">CSS3DSprite</div>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addOrbitControls } from "../js/common.js";
// 引入CSS3渲染器CSS3DRenderer
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
// 创建一个三维场景对象
const scene = new THREE.Scene();

// 往场景中添加一个mesh
const addMesh = (position = [0, 0, 0]) => {
  const geometry = new THREE.BoxGeometry(50, 50, 50);
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
  name: "CSS3DRenderer",
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

    /*----------------------------创建css3d渲染器对象----------------------------*/
    const css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(width, height);
    css3DRenderer.domElement.style.position = "absolute";
    css3DRenderer.domElement.style.top = "0px";
    // 设置.style.pointerEvents = none，就可以解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    css3DRenderer.domElement.style.pointerEvents = "none";
    // addOrbitControls(scene, camera, css3DRenderer); // 下面设置了样式 pointer-events: none 这里就不需要使用该代码

    /*----------------------------添加平行光源----------------------------*/
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 50, 50);
    scene.add(directionalLight);

    /*--------------------------添加坐标格辅助对象-------------------------*/
    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(400, 100, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    /*-----------------------------------几何------------------------------------*/
    const mesh1 = addMesh([-100, 25, 0]);
    const mesh2 = addMesh([100, 25, 0]);
    const mesh3 = addMesh([0, 25, 0]);

    /*--------------------------------HTML标签-----------------------------------*/

    const addCSS3DObject = () => {
      const tag1 = new CSS3DObject(document.getElementById("tag1"));
      const tag2 = new CSS3DObject(document.getElementById("tag2"));
      const tagSprite = new CSS3DSprite(document.getElementById("tag3"));
      // tag1.position.set(2, 1.3, 0);
      // tag2.position.set(-2, 1.3, 0);
      // scene.add(tag1, tag2);
      tag1.scale.set(0.5, 0.5, 0.5);
      tag1.position.y += 25;
      tag2.position.y += 25;
      tagSprite.position.y += 25;
      mesh1.add(tag1);
      mesh2.add(tag2);
      mesh3.add(tagSprite);
      document.body.appendChild(css3DRenderer.domElement);
    };

    const init = () => {
      addCSS3DObject();
      document.body.appendChild(renderer.domElement);
      // 添加性能监控
      addStats(stats);
      // 窗口大小变化的时候更新场景
      window.onresize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        css3DRenderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
    };

    const render = () => {
      stats.update();
      renderer.render(scene, camera);
      css3DRenderer.render(scene, camera);
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
#tag1,
#tag2,
#tag3 {
  pointer-events: none; /* 这里设置是为了不遮挡webgl画布 */
}
</style>
