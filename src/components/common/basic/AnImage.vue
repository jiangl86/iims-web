<template>
  <div class="an-image">
    <el-image
      style="width: 100px; height: 100px"
      :fit="fit"
      :src="src"
      :preview-src-list="previewSrcList"
      :z-index="zIndex"
      @load="load"
      @error="error"
    >
    </el-image>
  </div>
</template>
<script>
export default {
  name: "anImage",
  data() {
    return {};
  },
  props: {
    src: {
      type: String, //图片源，同原生
      required: true,
    },
    fit: {
      type: String, //确定图片如何适应容器框，同原生 object-fit , 可选值：fill / contain / cover / none / scale-down
      default: "fill",
    },
    alt: {
      //原生 alt
      type: String,
    },
    referrerPolicy: {
      //原生 referrerPolicy
      type: String,
    },
    scrollContainer: {
      //开启懒加载后，监听 scroll 事件的容器
      type: String,
    },
    previewSrcList: {
      //开启图片预览功能
      type: Array,
    },
    zIndex: {
      //设置图片预览的 z-index
      type: Number,
      default: 2000,
    },
  },
  methods: {
    load(e) {
      this.$emit("load", e); //图片加载成功触发
    },
    error(e) {
      this.$emit("error", e); //图片加载失败时触发
    },
  },
};
</script>
<style scoped>
</style>