<template>
  <main>
    <div class="navi">
      <div class="item" v-for="(menu, index) in menuList" :key="index" :title="menu">
        <router-link :to="'/' + menu"> {{ menu.length < 10 ? menu : menu.slice(0, 10) + "..." }}</router-link>
      </div>
    </div>
    <router-view :key="$route.fullPath"></router-view>
  </main>
</template>
<script>
import { reactive } from "vue";
export default {
  name: "mainApp",
  setup() {
    const menuList = reactive([
      "Primer",
      "BufferGeometry",
      "Earth",
      "GltfLoader",
      "PBRMeshStandardMaterial",
      "PBRMeshPhysicalMaterial",
    ]);

    return { menuList };
  },
};
</script>
<style scope>
.navi {
  position: absolute;
  margin-top: 60px;
  height: 600px;
  width: 150px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0px 10px 10px 0px;
  padding: 10px;
}

.navi .item {
  margin: 5px;
}
</style>
