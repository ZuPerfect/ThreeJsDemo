<!--
 * @描 述: 继续threejs实现的柜体摆放案例
 * @作 者: 朱鹏飞
-->

<template>
  <div class="btns">
    <div class="btn" @click="addObjectModel(1)">添加模型1</div>
    <div class="btn" @click="addObjectModel(2)">添加模型2</div>
  </div>
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
const SNAP_BUFFER = 200;
const width = window.innerWidth;
const height = window.innerHeight;
// 模型路径
const obj1Path = new URL("../assets/objs/small cabinet for program v2.obj", import.meta.url).href;
const obj2Path = new URL("../assets/objs/wide wide cabinet for program v2.obj", import.meta.url).href;
const objList = [];
const dragControlList = [];
const objConfig = {
  obj1: {
    topFaceName: "paper (1):1",
    bottomFaceName: "paper (1)",
  },
  obj2: {
    topFaceName: "bottom paper (1)",
    bottomFaceName: "paper bottom (1)",
    centerStep: 4,
  },
};

/**
 * 加载模型
 * @param {} objPath 模型路径
 */
const loaderObj = objPath => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(objPath, obj => {
      resolve(obj);
    });
  });
};

/**
 * 禁用非当前使用的拖动控制器
 * @param {} dragControlList 所有的拖动控制器数组
 * @param {} currentIdx 当前正在使用的控制器索引
 */
const disableControls = dragControlList => {
  dragControlList.forEach(c => (c.enabled = false));
};

/**
 * 激活所有的拖动控制器
 * @param {} dragControlList 所有的拖动控制器数组
 */
const enableControls = dragControlList => {
  dragControlList.forEach(c => (c.enabled = true));
};

export default {
  name: "CabinetPlacement",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();

    /*---------------创建一个透视投影的相机对象---------------*/
    const camera = new THREE.PerspectiveCamera(10, width / height, 1, 30000);
    camera.position.set(8753, 7315, 8194);
    camera.lookAt(0, 0, 0);

    /*----------------------创建渲染器-----------------------*/
    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({
      // 锯齿模糊
      antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    // 设置渲染器的尺寸
    renderer.setSize(width, height);
    // 设置背景颜色
    renderer.setClearColor(0x1e1e1e, 1); //设置背景颜色
    // 渲染当前场景
    renderer.render(scene, camera);

    /*----------------------添加光照-----------------------*/
    // 添加平行光
    addDirectionalLight(scene);

    /*--------------------添加辅助坐标系--------------------*/
    addAxesHelper(scene);

    /*---------------------添加辅助网格---------------------*/
    const grid = new THREE.GridHelper(5000, 50, 0xc1c1c1, 0x8d8d8d);
    scene.add(grid);

    /*--------------------添加场景控制器--------------------*/
    // 添加交互控制器
    const controls = addOrbitControls(scene, camera, renderer);

    const addDragControls = obj => {
      // 为每一个模型创建一个拖动控制器
      const dragControl = new DragControls([obj], camera, renderer.domElement);
      // 设置拖动整个模型整体
      dragControl.transformGroup = true;

      dragControl.addEventListener("dragstart", function (event) {
        // 为了避免交互控件冲突，这里禁用场景交互控件
        controls.enabled = false;
        disableControls(dragControlList);
        this.enabled = true;
      });
      dragControl.addEventListener("drag", function (event) {
        controls.enabled = false;
      });
      dragControl.addEventListener("dragend", function (event) {
        // 拖动结束之后，恢复场景交互控件
        controls.enabled = true;
        enableControls(dragControlList);
        const curMoveObj = event.object;
        // 除了移动的这个，其他的模型的顶面都是待吸附的
        const notCurObjList = objList.filter(obj => curMoveObj.uuid !== obj.uuid);
        const topFaceCenters = [];
        notCurObjList.forEach(obj => {
          const objType = obj.userData.type;
          const snapMesh = obj.getObjectByName(objConfig[objType].topFaceName);
          const snapMeshBoxCenter = new THREE.Vector3();
          const snapMeshBox = new THREE.Box3().setFromObject(snapMesh);
          if (objConfig[objType].centerStep) {
            const min = snapMeshBox.min;
            const max = snapMeshBox.max;
            // 计算每个轴的长度和一半长度
            const sizeX = max.x - min.x;
            const sizeY = max.y - min.y;
            const sizeZ = max.z - min.z;

            const leftCenter = new THREE.Vector3(
              min.x + (sizeX / objConfig[objType].centerStep) * 1,
              min.y + (sizeY / objConfig[objType].centerStep) * 1,
              min.z + (sizeZ / objConfig[objType].centerStep) * 2
            );

            const rightCenter = new THREE.Vector3(
              min.x + (sizeX / objConfig[objType].centerStep) * 3,
              min.y + (sizeY / objConfig[objType].centerStep) * 3,
              min.z + (sizeZ / objConfig[objType].centerStep) * 2
            );
            topFaceCenters.push(leftCenter, rightCenter);
          } else {
            snapMeshBox.getCenter(snapMeshBoxCenter);
          }

          topFaceCenters.push(snapMeshBoxCenter);
        });

        const curMoveObjType = curMoveObj.userData.type;
        const currentDragSnapFaceMesh = curMoveObj.getObjectByName(objConfig[curMoveObjType].bottomFaceName);
        const currentDragSnapFaceMeshCenter = new THREE.Vector3();
        const currentDragSnapFaceMeshBox = new THREE.Box3().setFromObject(currentDragSnapFaceMesh);
        currentDragSnapFaceMeshBox.getCenter(currentDragSnapFaceMeshCenter);
        const okCenter = topFaceCenters.find(c => c.distanceTo(currentDragSnapFaceMeshCenter) < SNAP_BUFFER);
        if (okCenter) {
          const offsetX = currentDragSnapFaceMeshCenter.x - okCenter.x;
          const offsetY = currentDragSnapFaceMeshCenter.y - okCenter.y;
          const offsetZ = currentDragSnapFaceMeshCenter.z - okCenter.z;
          curMoveObj.position.x -= offsetX;
          curMoveObj.position.y -= offsetY;
          curMoveObj.position.z -= offsetZ;
        }
      });

      // 将当前模型的控制器添加到控制器数组中
      dragControlList.push(dragControl);
    };

    /*--------------------obj模型加载--------------------*/
    const addObjectModel = modelType => {
      if (modelType === 1) {
        loaderObj(obj1Path).then(obj => {
          obj.rotation.x += -Math.PI / 2;
          obj.userData = {
            type: "obj1",
          };
          addDragControls(obj);
          objList.push(obj);
          scene.add(obj);
        });
      } else if (modelType === 2) {
        loaderObj(obj2Path).then(obj => {
          obj.rotation.x += -Math.PI / 2;
          obj.userData = {
            type: "obj2",
          };
          addDragControls(obj);
          objList.push(obj);
          scene.add(obj);
        });
      }
    };

    /**
     * 初始化
     */
    const init = () => {
      // 将渲染器所属dom添加到body中
      document.body.appendChild(renderer.domElement);
      // loadObj();
      // 添加性能监控（左上角控件）
      addStats(stats);
      // 监听窗口大小，保证窗口调整的时候渲染器正常渲染
      window.onresize = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
    };

    /**
     * 循环渲染
     */
    const render = () => {
      stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    /**
     * 挂载完成钩子函数
     */
    onMounted(() => {
      init();
      render();
    });

    return {
      addObjectModel,
    };
  },
};
</script>
<style>
.btns {
  display: flex;
  position: absolute;
  top: 10px;
  right: 500px;
  z-index: 2;
}
.btn {
  cursor: pointer;
  background-color: bisque;
  padding: 5px 20px;
  margin: 5px;
}
</style>
