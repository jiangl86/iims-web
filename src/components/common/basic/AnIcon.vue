<template>
  <div class="an-icon" :style="{ fontSize: size + 'px', color: color }">
    <i v-if="isIcon" :class="icon"></i>
    <div v-else :style="{ width: size + 'px' }" class="div-img">
      <img :src="icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AnIcon",
  props: {
    icon: {
      type: String, //图标名称，或图片链接
    },
    size: {
      type: Number, //图标大小
      default: 14,
    },
    color: {
      type: String, //图标颜色，对图片不适用
      default: "#666",
    },
  },
  data() {
    return {
      isIcon: true,
    };
  },
  components: {},
  created() {
    if (this.icon.indexOf(".") != -1 || this.icon.indexOf("http") != -1) {
      this.isIcon = false;
    }
  },
};
</script>

<style scoped>
.div-img {
  font-size: 0;
}
img {
  width: 100%;
}
</style>
