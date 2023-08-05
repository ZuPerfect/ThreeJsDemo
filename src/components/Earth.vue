<!--
 * @描 述: 地球
 * @作 者: 朱鹏飞
-->

<template>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, addOrbitControls, addDirectionalLight } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const earthPath = new URL("../assets/images/earth.jpeg", import.meta.url).href;
const moonPath = new URL("../assets/images/moon.jpg", import.meta.url).href;

export default {
  name: "ModelObjectsAndMaterials",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个缓冲类型几何体
    const eGeometry = new THREE.SphereGeometry(50, 80, 80);
    const mGeometry = new THREE.SphereGeometry(10, 80, 80);

    /*--------------------纹理贴图--------------------*/
    //纹理贴图加载器TextureLoader
    const textLoader = new THREE.TextureLoader();
    // .load()方法加载图像，返回一个纹理对象Texture
    const eTexture = textLoader.load(earthPath);
    const mTexture = textLoader.load(moonPath);

    /*--------------------网格材质---------------------*/
    // 高光材质（受光照的影响）
    const eMaterial = new THREE.MeshPhongMaterial({
      // color: 0xffff00,
      shininess: 10, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      map: eTexture,
    });

    const mMaterial = new THREE.MeshPhongMaterial({
      // color: 0xffff00,
      shininess: 10, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      map: mTexture,
    });

    // 创建一个网格模型
    const eMesh = new THREE.Mesh(eGeometry, eMaterial);
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    eMesh.position.set(0, 0, 0);
    // 将这个网格模型添加到场景里面
    scene.add(eMesh);

    // 创建一个网格模型
    const mMesh = new THREE.Mesh(mGeometry, mMaterial);
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mMesh.position.set(100, 100, 100);
    // 将这个网格模型添加到场景里面
    scene.add(mMesh);

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
    camera.position.set(0, 50, 100);
    camera.lookAt(20, 20, 20);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    // 添加点光源
    // addPointLight(scene);
    // 添加平行光
    addDirectionalLight(scene);
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
      eMesh.rotateY(0.003);
      mMesh.rotateY(0.003);
      // mesh.rotateX(0.001);
      // mesh.rotateZ(0.001);
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
