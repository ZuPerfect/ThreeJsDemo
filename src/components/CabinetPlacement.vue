<!--
 * @描 述: 继续threejs实现的柜体摆放案例
 * @作 者: 朱鹏飞
-->

<template>
  <div class="btns"></div>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import { addStats, addOrbitControls, addAxesHelper, addDirectionalLight } from "../js/common.js";
import { DragControls } from "three/addons/controls/DragControls.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;
const obj1Path = new URL("../assets/objs/small cabinet for program v2.obj", import.meta.url).href;
const obj2Path = new URL("../assets/objs/wide wide cabinet for program v2.obj", import.meta.url).href;

const loaderObj = objPath => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(objPath, obj => {
      resolve(obj);
    });
  });
};

const disableControls = (dragControlList, currentIdx) => {
  dragControlList.forEach((c, idx) => {
    if (currentIdx !== idx) {
      c.enabled = false;
    }
  });
};

const enableControls = dragControlList => {
  dragControlList.forEach(c => {
    c.enabled = true;
  });
};

export default {
  name: "CabinetPlacement",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();

    /*--------------------obj模型加载--------------------*/
    //纹理贴图加载器TextureLoader
    const loadObj = () => {
      const dragControlList = [];
      const obj1Loader = loaderObj(obj1Path);
      const obj2Loader = loaderObj(obj2Path);
      const obj3Loader = loaderObj(obj1Path);
      Promise.all([obj1Loader, obj2Loader, obj3Loader]).then(groups => {
        let offset = 0;
        groups.forEach(group => {
          group.rotation.x += -Math.PI / 2;
          group.position.z += offset;
          offset += 400;
        });

        scene.add(...groups);

        for (let i = 0; i < groups.length; i++) {
          const dragControl = new DragControls([groups[i]], camera, renderer.domElement);
          dragControl.transformGroup = true;
          dragControlList.push(dragControl);
        }

        dragControlList.forEach((dragControl, i) => {
          dragControl.addEventListener("dragstart", function (event) {
            controls.enabled = false;
            disableControls(dragControlList, i);
          });
          dragControl.addEventListener("drag", function (event) {
            controls.enabled = false;
            disableControls(dragControlList, i);
          });
          dragControl.addEventListener("dragend", function (event) {
            controls.enabled = true;
            enableControls(dragControlList);
            if (i === 0 || i === 2) {
              const group = event.object;
              const snapMesh = groups[1].getObjectByName("bottom paper (1)");
              const center1 = new THREE.Vector3();
              const box1 = new THREE.Box3().setFromObject(snapMesh);
              const min = box1.min;
              const max = box1.max;
              // 计算每个轴的长度和一半长度
              const sizeX = max.x - min.x;
              const sizeY = max.y - min.y;
              const sizeZ = max.z - min.z;

              const leftCenter = new THREE.Vector3(
                min.x + (sizeX / 4) * 1,
                min.y + (sizeY / 4) * 1,
                min.z + (sizeZ / 4) * 2
              );

              const rightCenter = new THREE.Vector3(
                min.x + (sizeX / 4) * 3,
                min.y + (sizeY / 4) * 3,
                min.z + (sizeZ / 4) * 2
              );

              box1.getCenter(center1);

              const mesh = group.getObjectByName("paper (1)");
              const center2 = new THREE.Vector3();
              const box2 = new THREE.Box3().setFromObject(mesh);
              box2.getCenter(center2);

              if (center1.distanceTo(center2) < 200) {
                const offsetX = center2.x - center1.x;
                const offsetY = center2.y - center1.y;
                const offsetZ = center2.z - center1.z;
                group.position.x -= offsetX;
                group.position.y -= offsetY;
                group.position.z -= offsetZ;
              } else if (leftCenter.distanceTo(center2) < 200) {
                const offsetX = center2.x - leftCenter.x;
                const offsetY = center2.y - leftCenter.y;
                const offsetZ = center2.z - leftCenter.z;
                group.position.x -= offsetX;
                group.position.y -= offsetY;
                group.position.z -= offsetZ;
              } else if (rightCenter.distanceTo(center2) < 200) {
                const offsetX = center2.x - rightCenter.x;
                const offsetY = center2.y - rightCenter.y;
                const offsetZ = center2.z - rightCenter.z;
                group.position.x -= offsetX;
                group.position.y -= offsetY;
                group.position.z -= offsetZ;
              }
            }
          });
        });
      });
    };

    // 创建一个透视投影的相机对象
    const camera = new THREE.PerspectiveCamera(10, width / height, 1, 30000);
    camera.position.set(0, 0, 2000);
    camera.lookAt(0, 0, 0);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height);
    // 设置背景颜色
    renderer.setClearColor(0x1e1e1e, 1); //设置背景颜色
    renderer.render(scene, camera);

    // 添加平行光
    addDirectionalLight(scene);

    // 坐标格辅助对象. 坐标格实际上是2维线数组.
    const grid = new THREE.GridHelper(5000, 50, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    // addAxesHelper(scene);

    // 添加交互控制器
    const controls = addOrbitControls(scene, camera, renderer);

    const init = () => {
      document.body.appendChild(renderer.domElement);
      loadObj();
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
