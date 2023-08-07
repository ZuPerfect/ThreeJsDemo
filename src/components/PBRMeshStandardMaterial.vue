<!--
 * @描 述: PBR材质金属度和粗糙度-材质
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, addOrbitControls } from "../js/common.js";

const cubePath = new URL("../assets/images/", import.meta.url).href;

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "PBRMeshStandardMaterial",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个球类型几何体
    const geometry = new THREE.SphereGeometry(50, 80, 80);

    // 加载环境贴图
    // 加载周围环境6个方向贴图
    // 上下左右前后6张贴图构成一个立方体空间
    // 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
    // 'py.jpg', 'ny.jpg'：y轴贴图
    // 'pz.jpg', 'nz.jpg'：z轴贴图
    const textureCube = new THREE.CubeTextureLoader()
      .setPath(cubePath + "/")
      .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

    // CubeTexture表示立方体纹理对象，父类是纹理对象Texture
    textureCube.encoding = THREE.sRGBEncoding;
    /*--------------------PBR材质---------------------*/
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      metalness: 1, //金属度属性
      roughness: 0, //表面粗糙度
      // envMapIntensity：控制环境贴图对mesh表面影响程度
      //默认值1, 设置为0.0,相当于没有环境贴图
      envMapIntensity: 1,
      envMap: textureCube, //设置pbr材质环境贴图
    });

    // 设置场景背景贴图
    scene.background = textureCube;

    // 创建一个网格模型
    const mesh = new THREE.Mesh(geometry, material);
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 0, 0);
    // 将这个网格模型添加到场景里面
    scene.add(mesh);

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    // 添加点光源
    addPointLight(scene);
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
