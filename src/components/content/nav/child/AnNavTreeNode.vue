<template>
  <div class="an-nav-tree-node" v-show="pData.show">
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
          <an-icon v-else :size="18" :icon="stateIcon"></an-icon>
        </div>
        <div class="info" @click="nodeClick">
          {{ pData.name }}
        </div>
      </div>
      <ul v-if="pData.children" v-show="isOpen">
        <an-nav-tree-node
          v-for="child in pData.children"
          :pData="child"
          :key="child.id"
          :level="level + 1"
          :autoExpand="autoExpand"
          :eventKey="eventKey"
        ></an-nav-tree-node>
      </ul>
    </li>
  </div>
</template>

<script>
import AnIcon from "components/common/basic/AnIcon";
import AnNavTreeNode from "./AnNavTreeNode";
export default {
  name: "AnNavTreeNode",
  props: {
    level: {
      type: Number,
      default: 1, //节点在树中的层级，从第1层开始
    },
    autoExpand: {
      type: Boolean,
      default: true, //是否自动展开选中的节点，默认是
    },
    pData: {
      type: Object, //元素必须包含id,和name元素，其中有子节点的必须包含children子列表
    },
    eventKey: {
      type: String, //因为通过事件通过总线发送，当一个页面有多个树时，为了准确由父级树确定事件由子节点产生
      required: true,
    },
  },
  data() {
    return {
      isOpen: this.autoExpand,
    };
  },
  components: {
    AnNavTreeNode,
    AnIcon,
  },
  computed: {
    //是否返回
    isFolder() {
      return this.pData.children && this.pData.children.length > 0;
    },
  },
  created() {},

  methods: {
    //是否展开
    toggle() {
      this.isOpen = !this.isOpen;
    },
    //是否选择子节点
    nodeClick() {
      this.$bus.$emit("nodeClick", this.pData, this.eventKey);
    },
  },
};
</script>

<style scoped>
</style>
