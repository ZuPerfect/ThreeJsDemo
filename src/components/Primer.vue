<template>
  <div id="webgl"></div>
</template>

<script>
import { onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
// 引入dat.gui.js的一个类GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const gui = new GUI();
gui.domElement.style.right = "0px";
gui.domElement.style.width = "300px";

const rotate = {
  x: 0,
  y: 0,
  z: 0,
};
gui.add(rotate, "x", 0, 0.1).name("X轴旋转速度");
gui.add(rotate, "y", 0, 0.1).name("Y轴旋转速度");
gui.add(rotate, "z", 0, 0.1).name("Z轴旋转速度");

const centerColor = {
  color: 0xffff00,
};
const centerPosition = {
  x: 0,
  y: 0,
  z: 0,
};

const pointLightPosition = {
  x: 0,
  y: 0,
  z: 0,
};

function getTexture(text = "文字") {
  // 创建文字纹理
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "20px Arial";
  const textWidth = context.measureText(text).width;
  const padding = 10; // 背景填充的间距
  canvas.width = textWidth + padding * 2;
  canvas.height = 48 + padding * 2;
  context.font = "20px Arial";
  context.fillStyle = generateRandomColor(); // 背景颜色
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff"; // 文字颜色
  context.fillText(text, padding, 20 + padding);
  const textTexture = new THREE.CanvasTexture(canvas);
  return textTexture;
}

/**
 * 获取随机位置长方体
 */
function getRandomMeshs() {
  const num = 800;
  const meshs = [];
  for (let i = 0; i < num; i++) {
    let geometry = new THREE.BoxGeometry(5, 5, 5);
    if (i % 4 === 0) {
      geometry = new THREE.SphereGeometry(5, 8, 8);
    } else if (i % 4 === 1) {
      geometry = new THREE.CylinderGeometry(5, 5, 10);
    } else if (i % 4 === 2) {
      geometry = new THREE.PlaneGeometry(10, 5);
    } else {
      geometry = new THREE.CircleGeometry(5);
    }

    // 创建材质
    // const material = new THREE.MeshBasicMaterial({ map: textTexture });

    // 漫反射材质
    // const material = new THREE.MeshLambertMaterial({
    //   // color: 0xff00ff,
    //   color: generateRandomColor(),
    //   transparent: true,
    //   opacity: 0.9,
    //   // map: getTexture(),
    // });

    // 高光材质
    const material = new THREE.MeshPhongMaterial({
      color: generateRandomColor(),
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // 随机生成长方体xyz坐标
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 300;
    const z = (Math.random() - 0.5) * 300;
    mesh.position.set(x, y, z);
    meshs.push(mesh);
  }
  return meshs;
}

function generateRandomColor() {
  // 生成随机的 R、G、B 值
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);

  // 将 R、G、B 值转换为十六进制字符串
  var hexR = r.toString(16).padStart(2, "0");
  var hexG = g.toString(16).padStart(2, "0");
  var hexB = b.toString(16).padStart(2, "0");

  // 拼接成十六进制颜色字符串
  var hexColor = "#" + hexR + hexG + hexB;

  return hexColor;
}

function addPointLight(scene, xyz = [200, 200, 200]) {
  // 创建一个点光源
  const pointLight = new THREE.PointLight(0xffffff, 1);
  // 设置点光源的位置
  pointLight.position.set(...xyz);
  // 将点光源添加到场景中
  scene.add(pointLight);

  gui
    .add(pointLightPosition, "x", -200, 200)
    .name("点光源X轴方向位置")
    .onChange(v => (pointLight.position.x = v));
  gui
    .add(pointLightPosition, "y", -200, 200)
    .name("点光源Y轴方向位置")
    .onChange(v => (pointLight.position.y = v));
  gui
    .add(pointLightPosition, "z", -200, 200)
    .name("点光源Z轴方向位置")
    .onChange(v => (pointLight.position.z = v));

  // 创建一个点光源辅助对象，可以辅助用户看到点光源的位置
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
  // 将点光源辅助对象他添加到场景中
  scene.add(pointLightHelper);
  gui.add(pointLight, "intensity", 0, 2.0).name("光照强度").step(0.01);
}

export default {
  name: "helloThree",
  setup() {
    // 创建一个三维场景对象
    const scene = new THREE.Scene();
    // 创建一个长方形几何对象
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    // 创建一个材质对象,基础网格材质（不会收到光照的影响）
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x0000ff,
    //   transparent: true,
    //   opacity: 0.5,
    // });

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

    gui
      .add(centerPosition, "x", -200, 200)
      .name("中心矩形X轴位置")
      .onChange(v => (mesh.position.x = v));
    gui
      .add(centerPosition, "y", -200, 200)
      .name("中心矩形Y轴位置")
      .onChange(v => (mesh.position.y = v));
    gui
      .add(centerPosition, "z", -200, 200)
      .name("中心矩形Z轴位置")
      .onChange(v => (mesh.position.z = v));

    gui
      .add(centerPosition, "x", [-100, 0, 100])
      .name("中心矩形X轴位置")
      .onChange(v => (mesh.position.x = v));

    const meshList = getRandomMeshs();
    meshList.forEach(m => scene.add(m));

    addPointLight(scene);
    // addPointLight(scene, [-200, -200, -200]);

    //环境光:没有特定方向，整体改变场景的光照明暗
    // const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    // scene.add(ambient);

    /*------------- 辅助观察坐标系 ----------------*/
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

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
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    // 设置背景颜色
    renderer.setClearColor(0x000000, 1); //设置背景颜色
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", function () {
      // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。
      // renderer.render(scene, camera); //执行渲染操作
    }); //监听鼠标、键盘事件

    // 创建stats对象
    const stats = new Stats();

    const init = () => {
      // document.getElementById("webgl").appendChild(renderer.domElement);
      document.body.appendChild(renderer.domElement);
      document.body.appendChild(stats.domElement);

      window.onresize = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
    };

    const render = () => {
      stats.update();
      renderer.render(scene, camera);
      mesh.rotateY(rotate.x);
      mesh.rotateX(rotate.y);
      mesh.rotateZ(rotate.z);

      meshList.forEach(m => {
        m.rotateY(0.005);
        m.rotateX(0.005);
        m.rotateZ(0.005);
      });
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
