<!--
 * @描 述: 精灵模型Sprite
 * @作 者: 朱鹏飞
-->

<template></template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addOrbitControls, getGui } from "../js/common.js";
const locatePath = new URL("../assets/images/locate.png", import.meta.url).href;
const snowPath = new URL("../assets/images/snow.png", import.meta.url).href;

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const gui = getGui();

export default {
  name: "Sprite",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(0.474087028275489, 1.8052817252397322, 13.755491629459673);
    camera.lookAt(0.8684413580923376, 3.617825388108112, -0.26446450930015014);
    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.render(scene, camera);

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
    const texture = new THREE.TextureLoader().load(locatePath);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    const waterSpriteMaterial = new THREE.SpriteMaterial({
      // color: 0xffffff,
      map: new THREE.TextureLoader().load(snowPath),
    });

    gui.add(spriteMaterial, "rotation", 0, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // 精灵模型Sprite默认是一个矩形形状，默认长宽都是1，默认在坐标原点位置
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.5, 0);
    gui.add(sprite.scale, "x", 0, 100);
    gui.add(sprite.scale, "y", 0, 100);
    mesh.position.set(4, 0.5, 0);
    scene.add(mesh);
    scene.add(sprite);

    const group = new THREE.Group();
    for (let i = 0; i < 16000; i++) {
      // 精灵模型共享材质
      const sprite = new THREE.Sprite(waterSpriteMaterial);
      group.add(sprite);
      // sprite.scale.set(0.2, 0.2, 0.2);
      // 设置精灵模型位置，在长方体空间上上随机分布
      const x = 500 * (Math.random() - 0.5);
      const y = 300 * Math.random();
      const z = 500 * (Math.random() - 0.5);
      sprite.position.set(x, y, z);
    }
    scene.add(group);

    function loop() {
      // loop()每次执行都会更新雨滴的位置，进而产生动画效果
      group.children.forEach(sprite => {
        // 雨滴的y坐标每次减1
        sprite.position.y -= 0.2;
        if (sprite.position.y < 0) {
          // 如果雨滴落到地面，重置y，从新下落
          sprite.position.y = 300;
        }
      });
      requestAnimationFrame(loop);
    }
    loop();

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
