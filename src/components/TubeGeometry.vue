<!--
 * @描 述: 曲线路径管道TubeGeometry
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, addOrbitControls, getGui } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const gui = getGui();
const guiSeting = {
  isCameraMove: false,
};

export default {
  name: "TubeGeometry",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 三维向量Vector3创建一组顶点坐标
    const arr = [
      new THREE.Vector3(-50, 20, 90),
      new THREE.Vector3(-10, 40, 40),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(60, -60, 0),
      new THREE.Vector3(70, 0, 80),
    ];
    // 三维样条曲线
    const path = new THREE.CatmullRomCurve3(arr);

    // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
    const geometry = new THREE.TubeGeometry(path, 500, 2, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xffff00,
    //   shininess: 20, //高光部分的亮度，默认30
    //   specular: 0x444444, //高光部分的颜色
    //   // wireframe: true,
    //   side: THREE.DoubleSide,
    // });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const pointsArr = path.getSpacedPoints(2500);

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.copy(pointsArr[0]);
    camera.lookAt(pointsArr[1]);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    // 添加点光源
    // const pointLight = addPointLight(scene, [200, 200, 200], false);
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
    gui.add(guiSeting, "isCameraMove").name("相机是否在管道内运动");

    let i = 0;

    const render = () => {
      if (guiSeting.isCameraMove) {
        if (i < pointsArr.length - 1) {
          // 相机位置设置在当前位置
          camera.position.copy(pointsArr[i]);
          // pointLight.position.copy(pointsArr[i]);
          camera.lookAt(pointsArr[i + 1]);
          i++;
        } else {
          i = 0;
        }
      }
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
