<template>
  <div class="interface-info">
    <div class="name"><span>接口名称</span>：{{ name }}</div>
    <div v-if="description" class="description">{{ description }}</div>

    <div v-if="design" class="design">
      <div class="title"><span>接口设计</span>：</div>
      <div>{{ design }}</div>
    </div>
    <div v-if="address" class="address">
      <span>接口地址</span>：{{ address }}
    </div>
    <div v-if="params" class="params">
      <div class="title"><span>接口请求参数</span>：</div>
      <div><interface-info-tree :pData="paramsArr"></interface-info-tree></div>
    </div>
    <div v-if="result" class="result">
      <div class="title"><span>接口返回信息</span>：</div>
      <div><interface-info-tree :pData="resultArr"></interface-info-tree></div>
    </div>
  </div>
</template>

<script>
import InterfaceInfoTree from "components/content/jkgl/InterfaceInfoTree";

import { dataFormat } from "common/other/strFormat";
export default {
  props: {
    name: {
      type: String, //接口名称
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    design: {
      type: String,
    },
    params: {
      type: String,
    },
    result: {
      type: String,
    },
  },
  name: "InterfaceInfo",
  data() {
    return {
      resultArr: [], //根据result初始化的数据
      paramsArr: [], //根据params初始化的数据
    };
  },
  components: {
    InterfaceInfoTree,
  },
  watch: {
    result() {
      this.initResult();
    },
    params() {
      this.initParams();
    },
  },
  created() {
    this.initResult();
    this.initParams();
  },
  methods: {
    initResult() {
      if (this.result) {
        let formatStr = dataFormat(this.result);
        let tempArr = formatStr.split("\n");
        let treeArr = this.initTreeData(0, tempArr, -1).tree;
        this.resultArr.splice(0, this.resultArr.length);
        for (let i = 0; i < treeArr.length; i++) {
          this.resultArr.push(treeArr[i]);
        }
      }
    },
    initParams() {
      if (this.params) {
        let formatStr = dataFormat(this.params);
        let tempArr = formatStr.split("\n");
        this.paramsArr.splice(0, this.paramsArr.length);
        this.paramsArr.push(...this.initTreeData(0, tempArr, -1).tree);
      }
    },
    initTreeData(startIndex, tempArr, parent_id) {
      let treeArr = [];
      for (let i = startIndex; i < tempArr.length; i++) {
        let node = { id: i, name: tempArr[i] };
        if (parent_id != -1) {
          node.parent_id = parent_id;
        }
        treeArr.push(node);
        if (tempArr[i].indexOf("}") != -1 || tempArr[i].indexOf("]") != -1) {
          return { tree: treeArr, index: i };
        }
        if (tempArr[i].indexOf("{") != -1 || tempArr[i].indexOf("[") != -1) {
          node.children = 1;
          let childInfo = this.initTreeData(i + 1, tempArr, i);
          if (childInfo.tree.length > 0) {
            node.childrenList = childInfo.tree;
          }
          i = childInfo.index;
        }
      }
      return { tree: treeArr, index: tempArr.length };
    },
  },
};
</script>

<style scoped>
.interface-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  font-size: var(--interfaceContentFontSize);
  line-height: var(--interfaceContentFontSize);
}
.name {
  font-weight: 600;
  margin-top: 10px;
}
.description {
  margin-top: 15px;
}
.address {
  margin-top: 15px;
}
.address span {
  font-weight: 600;
}
.design,
.params,
.result {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.design .title,
.params .title,
.result .title {
  font-weight: 600;
}
</style>
