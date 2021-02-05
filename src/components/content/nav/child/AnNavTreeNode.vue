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
          <an-icon v-if="pData.state" :size="12" :icon="stateIcon"></an-icon>
        </div>
        <div class="info" @click="nodeClick">
          {{ pData.name }}
        </div>
      </div>
      <ul v-if="pData.childrenList" v-show="isOpen">
        <an-nav-tree-node
          v-for="child in pData.childrenList"
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
      type: Object, //元素必须包含id,和name元素，其中有子节点的必须包含childrenList子列表
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
      return this.pData.childrenList && this.pData.childrenList.length > 0;
    },
    //最末级子节点展示的图标
    stateIcon() {
      if (this.pData.state == "3") {
        return "el-icon-warning";
      } else if (this.pData.state == "2") {
        return "el-icon-success";
      } else if (this.pData.state == "1") {
        return "el-icon-remove";
      } else {
        return "el-icon-s-opportunity";
      }
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
.an-nav-tree-node > li > div {
  width: 100%;
  line-height: 35px;
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
