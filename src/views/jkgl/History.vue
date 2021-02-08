<template>
  <div class="history">
    <div class="item-info" v-for="(item, index) in pData" :key="item.id">
      <div class="title">
        <span>{{ item.user_name }}</span
        ><span class="action">{{ item.action }}</span
        ><span class="time">{{ item.create_time }}</span>
      </div>
      <div v-if="item.description" class="description">
        详细信息：{{ item.description }}
      </div>
      <span v-if="hasMore(item)" @click="moreClick(index)" class="more">
        {{ moreText[index] }}
      </span>
      <div v-show="showMore[index]">
        <div class="address" v-if="item.address">
          <div>地址变更为：</div>
          {{ item.address }}
        </div>
        <div class="design" v-if="item.design">
          <div>设计变更为：</div>
          {{ item.design }}
        </div>
        <div class="params" v-if="item.params">
          <div>参数变更为：</div>
          {{ item.params }}
        </div>
        <div class="result" v-if="item.result">
          <div>返回结果变更为：</div>
          {{ item.result }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dataFormat } from "common/other/strFormat";
export default {
  name: "History",
  props: {
    pData: {
      type: Array, //数组类型，每个数组中至少包含id,action,user_name,create_time
    },
  },
  data() {
    return {
      showMore: Array(this.pData.length).fill(false),
      moreText: Array(this.pData.length).fill("更多"),
      ss: "",
    };
  },
  components: {},

  methods: {
    getResult(str) {
      str = dataFormat(str);
      return str;
    },

    hasMore(item) {
      if (item.address || item.design || item.params || item.result) {
        return true;
      }
      return false;
    },
    moreClick(index) {
      let value = !this.showMore[index];
      this.showMore.splice(index, 1, value);
      this.moreText[index] = this.showMore[index] ? "收起" : "更多";
    },
  },
};
</script>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  background-color: white;
}
.item-info {
  width: calc(100% - 20px);
  border-bottom: 1px dotted #ccc;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 10px;
  padding: 10px;
}
.title {
  font-weight: 600;
  margin-bottom: 10px;
}
.title .time {
  font-weight: 400;
  color: #666;
}
.title span {
  margin-right: 14px;
}
.more {
  color: var(--mainColor);
}
.more:hover {
  cursor: pointer;
}
.address,
.design,
.params,
.result {
  margin-top: 10px;
}

textarea {
  width: 100%;
  height: 100%;
}
</style>
