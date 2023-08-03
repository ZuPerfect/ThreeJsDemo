<template>
  <div id="webgl"></div>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { getGui, addStats, addAxesHelper, addPointLight, addOrbitControls } from "../js/common.js";

const gui = getGui();
const stats = new Stats();

const centerColor = {
  color: 0xffff00,
};

export default {
  name: "BufferGeometry",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个长方形几何对象
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    // 漫反射网格材质（受光照的影响）
    const material = new THREE.MeshLambertMaterial({
      color: centerColor.color,
      // side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      // map: getTexture("中心矩阵"),
    });

    // 创建一个网格模型
    const mesh = new THREE.Mesh(geometry, material);
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 0, 0);
    // 将这个网格模型添加到场景里面
    scene.add(mesh);

    gui
      .addColor(centerColor, "color")
      .name("中心矩形的颜色")
      .onChange(v => {
        mesh.material.color.set(v);
      });

    // 添加点光源
    addPointLight(scene);

    // 辅助观察坐标系
    addAxesHelper(scene);

    // 创建一个透视投影的相机对象
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(width, height);
    renderer.render(scene, camera);

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
<style>
body {
  overflow: hidden;
  margin: 0px;
}
</style>

<style scoped>
.greetings {
  font-size: 20px;
  color: red;
}
#webgl {
  margin-top: 20px;
  margin-left: 100px;
}
</style>
