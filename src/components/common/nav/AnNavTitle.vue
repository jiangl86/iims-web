<template>
  <div class="title">
    <label>您所在的位置：{{ name }}</label>
  </div>
</template>

<script>
export default {
  name: "title",
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
.title {
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid #ccc;
  text-align: left;
  position: fixed;
  background: #fff;
  border-bottom: 1px solid #ccc;
  z-index: 10;
  padding-left: 19px;
}
.title label {
  text-align: left;
}
</style>