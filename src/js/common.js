import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function addStats(stats) {
  // 创建stats对象,性能监听
  document.body.appendChild(stats.domElement);
}

export function addAxesHelper(scene) {
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
}

export function addOrbitControls(scene, camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", function () {
    // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。
    // renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件
}

export function getGui() {
  const gui = new GUI();
  gui.domElement.style.right = "0px";
  gui.domElement.style.width = "300px";
  return gui;
}

export function addPointLight(scene, xyz = [200, 200, 200]) {
  const pointLightPosition = { x: 200, y: 200, z: 200 };
  const gui = getGui();
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

export function addDirectionalLight(scene) {
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(100, 100, 100);
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  //   directionalLight.target = mesh;
  scene.add(directionalLight);
}
