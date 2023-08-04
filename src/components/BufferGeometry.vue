<template>
  <div id="webgl"></div>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { addStats, addAxesHelper, addPointLight, addOrbitControls } from "../js/common.js";

// 定义一些常量
const stats = new Stats();
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "BufferGeometry",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个缓冲类型几何体
    const geometry = new THREE.BufferGeometry();
    // 通过JavaScript类型化数组Float32Array创建一组xyz坐标数据用来表示几何体的顶点坐标
    const verticesArray = [
      [0, 0, 0], //顶点1坐标
      [50, 0, 0], //顶点2坐标
      [0, 100, 0], //顶点3坐标
      [0, 0, 10], //顶点4坐标
      [0, 0, 100], //顶点5坐标
      [50, 0, 10], //顶点6坐标
    ];
    const rectVerticesArray = [
      [0, 0, 0], //顶点1坐标
      [80, 0, 0], //顶点2坐标
      [80, 80, 0], //顶点3坐标
      // [0, 0, 0], //顶点4坐标   和顶点1位置相同
      // [80, 80, 0], //顶点5坐标  和顶点3位置相同
      [0, 80, 0], //顶点6坐标
    ];
    const normalsArray = [
      [0, 0, 1], //顶点1法线( 法向量 )
      [0, 0, 1], //顶点2法线
      [0, 0, 1], //顶点3法线
      [0, 0, 1], //顶点4法线
    ];

    // 顶点数据
    const vertices = new Float32Array(rectVerticesArray.flat());
    // 通过javascript类型化数组Uint16Array创建顶点索引.index数据。
    const indexes = new Uint16Array([0, 1, 2, 0, 2, 3]);
    // 每个顶点的法线数据和顶点位置数据一一对应
    const normals = new Float32Array(normalsArray.flat());
    // 索引数据赋值给几何体的index属性
    geometry.index = new THREE.BufferAttribute(indexes, 1);
    // 通过threejs的属性缓冲区对象BufferAttribute (opens new window)表示threejs几何体顶点数据。
    // 创建属性缓冲区对象
    // 3个为一组，表示一个顶点的xyz坐标
    const attribue = new THREE.BufferAttribute(vertices, 3);
    // 设置几何体顶点
    geometry.attributes.position = attribue;
    // 设置几何体的顶点法线属性.attributes.normal
    geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

    /*--------------------网格材质---------------------*/
    // 基础网格材质（不受光照的影响）
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   side: THREE.DoubleSide,
    //   transparent: true, // 开启透明
    //   opacity: 0.8, // 透明度
    //   // wireframe: true, // 是否显示三角网
    // });

    // 高光材质（受光照的影响）
    // !!!使用受光照影响的材质，几何体BufferGeometry需要定义顶点法线数据!!!
    const material = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      side: THREE.DoubleSide,
    });

    // 创建一个网格模型
    const mesh = new THREE.Mesh(geometry, material);
    // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 0, 0);
    // 将这个网格模型添加到场景里面
    scene.add(mesh);

    /*--------------------点模型对象---------------------*/
    // 几何体geometry作为点模型Points参数，会把几何体渲染为点，把几何体作为Mesh的参数会把几何体渲染为面。
    // const material = new THREE.PointsMaterial({
    //   color: 0xffff00,
    //   size: 10,
    // });

    // const points = new THREE.Points(geometry, material);
    // scene.add(points);

    /*--------------------线模型对象---------------------*/
    // 线材质对象
    // const material = new THREE.LineBasicMaterial({
    //   color: 0xffff00,
    // });
    // // 创建线模型对象
    // const line = new THREE.Line(geometry, material);
    // // 闭合线条
    // // const line = new THREE.LineLoop(geometry, material);
    // // 非连续的线条
    // // const line = new THREE.LineSegments(geometry, material);
    // scene.add(line);

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
    // 辅助观察坐标系
    addAxesHelper(scene);
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
