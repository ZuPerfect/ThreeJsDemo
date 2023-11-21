<!--
 * @描 述: 第一个WebGL shader
 * @作 者: 朱鹏飞
-->

<template>
  <canvas id="webgl" width="500" height="500" style="background: #000"></canvas>
</template>

<script>
import { onMounted } from "vue";
import vertexShaderSource from "../shader/vertexShader.glsl";

export default {
  name: "FirstWebGL",
  setup() {
    const initWebgl = () => {
      const canvas = document.getElementById("webgl");
      const gl = canvas.getContext("webgl");
      gl.drawArrays();
      gl.createShader();
      gl.shaderSource();
      gl.complieShader();
      gl.createProgram();
      gl.attachShader();
      gl.linkProgram();
      gl.useProgram();
    };
    onMounted(() => {
      initWebgl();
    });
    return {};
  },
};
</script>
<style></style>
