<template>
  <div class="jkgl-index">
    <div class="left-nav" ref="leftNav">
      <an-nav-tree name="接口管理系统" :height="treeHeight"></an-nav-tree>
    </div>
    <div class="content"></div>
  </div>
</template>

<script>
import AnNavTree from "components/content/nav/AnNavTree";
export default {
  name: "JkglIndex",
  data() {
    return {
      modules: [],
      interfaces: [],

      treeHeight: 0,
    };
  },
  components: {
    AnNavTree,
  },
  created() {},
  mounted() {
    this.treeHeight = this.$refs.leftNav.offsetHeight;
    console.log(this.treeHeight);
  },
};
</script>

<style scoped>
.jkgl-index {
  display: flex;
  height: calc(100vh - 60px);
}
.left-nav {
  width: 200px;
  background-color: blue;
}
.content {
  flex: 1;
}
</style>
