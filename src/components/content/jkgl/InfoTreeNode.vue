<template>
  <div class="info-tree-node" v-show="pData.show">
    <li>
      <div>
        <!--点击展开子节点 -->
        <div class="decorate" @click="toggle">
          <an-icon
            v-if="isFolder"
            :icon="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
            :size="14"
          ></an-icon>
          <span v-if="!isFolder && !isLast" class="left-indent"></span>
          <span
            v-for="index in level - 1"
            :key="pData.id + index"
            class="left-indent"
          ></span>
        </div>
        <div class="info">
          {{ pData.name }}
        </div>
      </div>
      <ul v-if="pData.childrenList" v-show="isOpen">
        <info-tree-node
          v-for="(child, childIndex) in pData.childrenList"
          :pData="child"
          :isLast="childIndex == pData.childrenList.length - 1"
          :key="child.id"
          :level="level + 1"
          :autoExpand="autoExpand"
          :eventKey="eventKey"
        ></info-tree-node>
      </ul>
    </li>
  </div>
</template>

<script>
import AnIcon from "components/common/basic/AnIcon";
import InfoTreeNode from "./InfoTreeNode";
export default {
  name: "InfoTreeNode",
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
      type: Object, //元素必须包含id,和name元素，其中有子节点的必须包含childrenList子列表
    },
    eventKey: {
      type: String, //因为通过事件通过总线发送，当一个页面有多个树时，为了准确由父级树确定事件由子节点产生
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false, //是否最后一个
    },
  },
  data() {
    return {
      isOpen: this.autoExpand,
    };
  },
  components: {
    InfoTreeNode,
    AnIcon,
  },
  computed: {
    //是否返回
    isFolder() {
      return this.pData.childrenList && this.pData.childrenList.length > 0;
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
.info-tree-node > li > div {
  width: 100%;
  line-height: var(--interfaceContentLineHeight);
  display: flex;
  align-items: center;
}
.decorate {
  display: flex;
  white-space: pre-wrap;
}
.left-indent {
  display: inline-flex;
  width: 14px;
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
