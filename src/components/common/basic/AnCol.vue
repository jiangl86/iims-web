<template>
  <div class="an-col">
    <el-col
      :span="span"
      :offset="offset"
      :pull="pull"
      :push="push"
      :xs="xs"
    ></el-col>
  </div>
</template>

<script>
export default {
  name: "AnCol",
  props: {
    span: {
      type: Number,
      default: 24,
    },
    offset: {
      type: Number,
    },
    pull: {
      type: Number,
    },
    push: {
      type: Number,
    },
    xs: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
</style>
