<template>
  <div class="an-tree-node" v-show="pData.show">
    <li>
      <div>
        <!--点击展开子节点 -->
        <div class="decorate" @click="toggle">
          <span
            v-for="index in level"
            :key="pData.id + index"
            class="left-indent"
          ></span>
          <an-icon
            v-if="isFolder"
            :icon="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
            :size="18"
          ></an-icon>
          <span v-else style="width: 18px"></span>
        </div>
        <div class="info" @click="nodeSelect">
          {{ pData.name }}
          <an-icon
            v-show="pData.selected"
            color="green"
            icon="el-icon-check"
          ></an-icon>
        </div>
      </div>
      <ul v-if="pData.children" v-show="isOpen">
        <an-tree-node
          v-for="child in pData.children"
          :pData="child"
          :key="child.id"
          :level="level + 1"
          :autoExpandSelect="autoExpandSelect"
        ></an-tree-node>
      </ul>
    </li>
  </div>
</template>

<script>
import AnIcon from "components/common/basic/AnIcon";
import AnTreeNode from "./AnTreeNode";
export default {
  name: "AnTreeNode",
  props: {
    level: {
      type: Number,
      default: 1, //节点在树中的层级，从第1层开始
    },
    autoExpandSelect: {
      type: Boolean,
      default: true, //是否自动展开选中的节点，默认是
    },
    pData: {
      type: Object, //元素必须包含id,和name元素，其中有子节点的必须包含children子列表
    },
  },
  data() {
    return {
      isOpen: true, //是否打开
    };
  },
  components: {
    AnTreeNode,
    AnIcon,
  },
  created() {
    //判断是否打开子节点
    if (this.autoExpandSelect) {
      this.isOpen = this.pData.childSelected;
    } else {
      this.isOpen = false;
    }
  },
  computed: {
    //是否返回
    isFolder() {
      return this.pData.children && this.pData.children.length > 0;
    },
  },
  methods: {
    //是否展开
    toggle() {
      this.isOpen = !this.isOpen;
    },
    //是否选择子节点
    nodeSelect() {
      this.$bus.$emit("nodeClick", this.pData);
    },
  },
};
</script>

<style scoped>
.an-tree-node > li > div {
  width: 100%;
  line-height: var(--liHeight);
  /* border-bottom: 1px solid #eee; */
  display: flex;
  align-items: center;
}
.decorate {
  display: flex;
}
.left-indent {
  display: inline-flex;
  width: 10px;
}

.info {
  padding-left: 2px;
  position: relative;
  flex: 1;
  text-align: left;
  display: flex;
}
.info > div {
  color: green;
  position: absolute;
  right: 10px;
  top: center;
  align-self: center;
}
</style>
