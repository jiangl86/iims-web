<template>
  <div class="jkgl-index">
    <div class="left-nav"></div>
    <div class="content"></div>
  </div>
</template>

<script>
export default {
  name: "JkglIndex",
  data() {
    return {
      modules: [],
      interfaces: [],
    };
  },
  components: {},
  created() {},
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
