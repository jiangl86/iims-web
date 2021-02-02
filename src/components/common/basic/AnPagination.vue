<template>
  <div class="an-pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15, 30, 50, 100]"
      :pager-count="5"
      :page-size="pageSize"
      :total="total"
      :background="background"
      :prev-text="prevText"
      :next-text="nextText"
      layout="total, prev, pager, next, sizes"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "AnPagination",
  props: {
    initialPage: {
      type: Number,
    },
    total: {
      type: Number, //总条目数
      required: true,
    },
    background: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 15,
    },
    prevText: {
      type: String,
      default: "上一页",
    },
    nextText: {
      type: String,
      default: "下一页",
    },
  },
  data() {
    return {
      currentPage: this.initialPage ? this.initialPage : 1,
    };
  },
  components: {},
  methods: {
    //num是设置的每页条数
    handleSizeChange(pageSize) {
      this.$emit("sizeChange", pageSize);
    },
    //page为当前选中页
    handleCurrentChange(currentPage) {
      this.$emit("pageChange", currentPage);
    },
  },
};
</script>

<style scoped>
</style>
