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
import { routes } from "./router/index";
export default {
  name: "mainApp",
  setup() {
    const menuList = reactive(routes.map(r => r.name));
    return { menuList };
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 5px;
  border-radius: 10px;
}
/* 自定义滚动条滑块的形状 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
}
.navi {
  position: absolute;
  margin-top: 60px;
  height: 600px;
  width: 150px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0px 10px 10px 0px;
  padding: 10px;
  overflow-y: auto;
}

.navi .item {
  margin: 10px 5px;
}

.router-link-active {
  text-decoration: none;
  color: yellow;
}
a {
  text-decoration: none;
  color: white;
}
a:hover {
  color: #409eff;
}
</style>
