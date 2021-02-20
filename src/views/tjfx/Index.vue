<template>
  <div class="tjfx-index">
    <div class="left">
      <ul>
        <li
          v-for="item in statistics"
          :key="item.code"
          @click="funcClick(item.code)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "TjfxIndex",
  data() {
    return {
      statistics: [{ name: "接口统计", code: "jktj" }], //支持的统计类型
    };
  },
  components: {},
  methods: {
    funcClick(code) {
      if (code == "jktj") {
        this.$router.replace({ name: "InterfaceStatistic" });
      }
    },
  },
};
</script>

<style scoped>
.tjfx-index {
  display: flex;
  height: calc(100vh - 60px);
}
.left {
  width: 260px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
}
.content {
  flex: 1;
}
</style>
