<template>
  <div class="interface-statistic">
    <div class="search-area"></div>
    <div class="table">
      <an-table
        :pDatas="statisticResult"
        :labelNames="labelNames"
        :keys="keys"
        :widths="widths"
        :showCheckbox="false"
        :showPagination="false"
        :showFuncs="false"
      ></an-table>
    </div>
  </div>
</template>

<script>
import AnTable from "components/common/show/AnTable";
import { put } from "network/request";
export default {
  name: "InterfaceStatistic",
  data() {
    return {
      statisticResult: null,
      labelNames: [
        "姓名",
        "添加",
        "报错",
        "完成",
        "修复",
        "修改为未完成",
        "修改为设计中",
        "总数量",
        "总设计中",
        "总未完成",
        "总已完成",
        "总异常",
      ],
      keys: [
        "user_name",
        "添加",
        "报错",
        "完成",
        "修复",
        "修改为未完成",
        "修改为设计中",
        "总数量",
        "总设计中",
        "总未完成",
        "总已完成",
        "总异常",
      ],
    };
  },
  components: { AnTable },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      console.log("bb");
      let params = {
        action: "interface_statistic",
        user_id: localStorage.getItem("user_id"),
        project_id: 1,
        begin_date: "2021-2-20",
        type: 1,
      };
      put("/api/statistic", params)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
</style>
