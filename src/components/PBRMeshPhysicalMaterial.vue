<!--
 * @描 述: MeshPhysicalMaterial清漆层
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addAmbientLight, getGui, addPointLight, addOrbitControls } from "../js/common.js";

const cubePath = new URL("../assets/images/", import.meta.url).href;

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const gui = getGui("0px", "400px");

export default {
  name: "PBRMeshPhysicalMaterial",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个球类型几何体
    const geometry = new THREE.SphereGeometry(50, 80, 80);
    const boxGeometry = new THREE.BoxGeometry(50, 50, 50);

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
    const material = new THREE.MeshPhysicalMaterial({
      metalness: 1, //金属度属性
      roughness: 0, //表面粗糙度
      // envMapIntensity：控制环境贴图对mesh表面影响程度
      //默认值1, 设置为0.0,相当于没有环境贴图
      envMapIntensity: 1,
      clearcoat: 1.0, //物体表面清漆层或者说透明涂层的厚度
      clearcoatRoughness: 0.8, //透明涂层表面的粗糙度
      envMap: textureCube, //设置pbr材质环境贴图
      transmission: 1, //玻璃材质透光率，transmission替代opacity
      ior: 1.5, //折射率
    });

    // 设置场景背景贴图
    scene.background = textureCube;

    // 创建一个网格模型
    const mesh = new THREE.Mesh(geometry, material);
    const boxMesh = new THREE.Mesh(boxGeometry, material);
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 0, 0);
    boxMesh.position.set(100, 0, 100);
    // 将这个网格模型添加到场景里面
    scene.add(mesh);
    scene.add(boxMesh);

    gui.add(mesh.material, "metalness", 0, 1).name("金属度属性");
    gui.add(mesh.material, "roughness", 0, 1).name("表面粗糙度");
    gui.add(mesh.material, "clearcoat", 0, 1).name("控制环境贴图对mesh表面影响程度");
    gui.add(mesh.material, "clearcoatRoughness", 0, 1).name("透明涂层表面的粗糙度");
    gui.add(mesh.material, "envMapIntensity", 0, 10).name("物体表面清漆层或者说透明涂层的厚度");
    gui.add(mesh.material, "transmission", 0, 1).name("玻璃材质透光率");
    gui.add(mesh.material, "ior", 1, 2.333).name("折射率");

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
    // addPointLight(scene);
    // 添加环境光
    addAmbientLight(scene);
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
      // mesh.rotateY(0.001);
      // mesh.rotateX(0.001);
      // mesh.rotateZ(0.001);
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
