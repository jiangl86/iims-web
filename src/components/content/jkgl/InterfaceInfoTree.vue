<template>
  <div class="interface-info-tree">
    <ul class="tree-area" ref="treeArea">
      <info-tree-node
        v-for="item in pData"
        :pData="item"
        :key="item.id"
        :autoExpand="autoExpand"
        :eventKey="eventKey"
      ></info-tree-node>
    </ul>
  </div>
</template>

<script>
import InfoTreeNode from "./InfoTreeNode";

import { debounce } from "common/other/debounce";
export default {
  name: "InterfaceInfoTree",
  props: {
    autoExpand: {
      type: Boolean,
      default: true, //是否自动展开选中的节点，默认是
    },
    //树的列表，每个元素必须包含id,和name元素，其中有子节点的必须包含childrenList子列表
    pData: {
      type: Array,
    },
  },
  data() {
    return {
      debounceSearch: null,
      eventKey: Math.random() + "" + Math.random(), //每一个树改数据唯一，非常重要的参数
    };
  },
  components: {
    InfoTreeNode,
  },
  created() {
    this.initData(this.pData);
  },
  mounted() {
    this.$bus.$on("nodeClick", (node, eventKey) => {
      this.nodeClick(node, eventKey);
    });
  },
  watch: {
    pData() {
      this.initData(this.pData);
    },
  },
  methods: {
    //对树列表进行数据初始化，判断各节点及其子节点的选中状态
    initData(itemList) {
      for (let i = 0; i < itemList.length; i++) {
        let item = itemList[i];
        // item.name = item.name.replaceAll(" ", "&nbsp;");
        this.$set(item, "show", true); //设置是否展示，主要用于后面进行搜索展示
        if (item.childrenList) {
          this.initData(item.childrenList);
        }
      }
    },

    //点击节点事件
    nodeClick(item, eventKey) {
      //只接受当前树子节点发送的事件
      if (this.eventKey == eventKey) {
        this.$emit("nodeClick", item);
      }
    },
  },
};
</script>

<style scoped>
.main {
  background-color: white;
  display: flex;
  flex-direction: column;
}
</style>
