<template>
  <div class="interface-statistic">
    <div class="search-area">
      <an-search @search="searchStatistic">
        <template #search-title>
          <an-label-popup-select
            name="项目名称"
            :pData="projects"
            :multiSelect="false"
            :selectAssert="true"
            :initialValue="initialProject"
            ref="statisticProject"
          ></an-label-popup-select>
        </template>
        <template #search-info>
          <an-label-dropdown-select
            name="统计类型"
            :options="typeOptions"
            :initialValue="initialType"
            class="anShort"
            ref="statisticType"
          ></an-label-dropdown-select>
          <an-label-date-picker
            name="时间段"
            ref="statisticTime"
            type="daterange"
            :initialValue="initialTime"
            class="anShort"
          ></an-label-date-picker>
        </template>
      </an-search>
    </div>
    <div class="table">
      <an-table
        v-if="statisticResult"
        :pDatas="statisticResult"
        :labelNames="labelNames"
        :keys="keys"
        :showCheckbox="false"
        :showPagination="false"
        :showFuncs="false"
        @tdClick="tdClick"
      ></an-table>
    </div>

    <div class="interface-detail" v-show="showDetail && interfaces.length > 0">
      <div class="info-list">
        <an-table
          v-if="statisticResult"
          key="interfaceDetail"
          :pDatas="interfaces"
          :labelNames="interfaceLabelNames"
          :keys="interfaceKeys"
          :showCheckbox="false"
          :showPagination="false"
          :showFuncs="false"
        ></an-table>
      </div>
      <div class="info-func">
        <an-button name="确定" @click.native="showDetail = false"></an-button>
      </div>
    </div>
  </div>
</template>

<script>
import AnLabelDropdownSelect from "components/common/form/AnLabelDropdownSelect";
import AnLabelPopupSelect from "components/common/form/AnLabelPopupSelect";
import AnLabelDatePicker from "components/common/form/AnLabelDatePicker";
import AnSearch from "components/content/search/AnSearch";
import AnTable from "components/common/show/AnTable";
import AnButton from "components/common/basic/AnButton";

import AnMsgbox from "components/common/popup/AnMsgbox";

import { put } from "network/request";
import { dateFormat } from "common/date/dateFormat";
export default {
  name: "InterfaceStatistic",
  data() {
    return {
      statisticResult: null, //统计结果列表
      labelNames: this.names1,
      keys: this.keys1, //表格展示的内容
      names1: [
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
      ], //按人员统计时展示信息
      keys1: [
        "user_name",
        "add",
        "bug",
        "finish",
        "repair",
        "un_finish",
        "design",
        "total_num",
        "total_design",
        "total_un_finish",
        "total_finish",
        "total_bug",
      ],
      names2: [
        "一级模块",
        "子模块",
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
      ], //按人员统计时展示信息
      keys2: [
        "first_module_name",
        "module_name",
        "add",
        "bug",
        "finish",
        "repair",
        "un_finish",
        "design",
        "total_num",
        "total_design",
        "total_un_finish",
        "total_finish",
        "total_bug",
      ],

      typeOptions: [
        { id: 0, name: "按人员统计" },
        { id: 1, name: "按模块统计" },
      ], //统计类型
      initialType: [{ id: 0, name: "按人员统计" }],
      initialTime: [],
      //项目相关内容
      projects: [], //所有可以查看统计的项目
      initialProject: "", //初始选中的项目名称

      //是否展示对应接口列表
      showDetail: false,
      interfaces: [],
      interfaceLabelNames: [
        "接口名称",
        "当前状态",
        "之前状态",
        "操作人",
        "操作时间",
        "添加人",
      ],
      interfaceKeys: [
        "name",
        "current_state",
        "before-state",
        "operate_user_name",
        "operate_user_time",
        "create_user_name",
      ],
    };
  },
  components: {
    AnTable,
    AnSearch,
    AnLabelDropdownSelect,
    AnLabelPopupSelect,
    AnLabelDatePicker,
    AnButton,
  },
  created() {
    this.initData();
  },

  methods: {
    //获取所有可以查看的项目,并初始化初始选中的项目
    initialProjects() {
      let params = {
        action: "list_project",
        user_id: localStorage.getItem("user_id"),
        state: "0",
      };
      put("/api/project", params)
        .then((res) => {
          if (res.ret == 0 && res.retlist) {
            this.projects = res.retlist;
            //初始化初始选中的项目
            if (localStorage.getItem("project_id") != null) {
              for (let i = 0; i < this.projects.length; i++) {
                let project = this.projects[i];
                if (project.id == localStorage.getItem("project_id")) {
                  this.initialProject = project.name;
                  break;
                }
              }
            }
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
          AnMsgbox.msgbox({ message: "服务器错误，请稍后再试" });
        });
    },

    //初始化数据
    initData() {
      //初始化项目信息
      this.initialProjects();
      //初始化时间信息
      let today = new Date();
      let begin_date = new Date();
      begin_date.setDate(begin_date.getDate() - 7);
      this.initialTime.push(dateFormat(begin_date));
      this.initialTime.push(dateFormat(today));
    },
    //
    //查询获取统计数据
    searchStatistic() {
      if (this.$refs.statisticProject.selected.length == 0) {
        AnMsgbox.msgbox({ message: "请选择要统计的项目" });
        return;
      }
      let statProjectId = this.$refs.statisticProject.selected[0].id;
      let statType = this.$refs.statisticType.value;
      statType = statType == 1 ? 1 : 0;
      let statTime = this.$refs.statisticTime.value;
      //设置需要展示的内容
      this.labelNames = statType == 0 ? this.names1 : this.names2;
      this.keys = statType == 0 ? this.keys1 : this.keys2;

      //查询参数
      let params = {
        action: "interface_statistic",
        user_id: localStorage.getItem("user_id"),
        project_id: statProjectId,
        type: statType,
      };
      if (statTime && statTime.length > 0) {
        params.begin_date = statTime[0];
        params.end_date = statTime[1];
      }
      put("/api/statistic", params)
        .then((data) => {
          if (data.ret == 0 && data.retlist) {
            this.statisticResult = data.retlist;
          } else {
            AnMsgbox.msgbox({ message: data.msg });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //单击表格某一列数据查询对应信息
    tdClick(item, index) {
      console.log(index);
      if (this.$refs.statisticProject.selected.length == 0) {
        AnMsgbox.msgbox({ message: "请选择要统计的项目" });
        return;
      }
      let statProjectId = this.$refs.statisticProject.selected[0].id;
      let statTime = this.$refs.statisticTime.value;
      let statType = this.$refs.statisticType.value;
      statType = statType == 1 ? 1 : 0; //0是按人员，1是按模块
      index = statType == 1 ? index - 1 : index; //按人员查询时多减一列，因为有一级模块名称
      //仅数字列点击才展示数据
      if (index >= 1) {
        let params = {
          action: "list_interface",
          user_id: localStorage.getItem("user_id"),
          project_id: statProjectId,
        };
        if (statType == 0) {
          params.search_user_id = item.user_id;
        } else {
          params.module_id = item.module_id;
        }
        if (statTime && statTime.length > 0) {
          params.begin_date = statTime[0];
          params.end_date = statTime[1];
        }
        //点击前7列时按照操作类型查询
        if (index <= 6) {
          params.type = 1;
          params.operate_type = 0;

          if (index == 2) {
            params.operate_type = 6;
          } else if (index == 3) {
            params.operate_type = 1;
          } else if (index == 4) {
            params.operate_type = 2;
          } else if (index == 5) {
            params.operate_type = 3;
          } else if (index == 6) {
            params.operate_type = 4;
          }
        }
        //否则按照状态查询
        else {
          params.type = 0;

          if (index == 8) {
            params.state = 0;
          } else if (index == 9) {
            params.state = 1;
          } else if (index == 10) {
            params.state = 2;
          } else if (index == 11) {
            params.state = 3;
          }
        }
        console.log(params);
        put("/api/statistic", params)
          .then((data) => {
            if (data.ret == 0 && data.retlist) {
              this.interfaces = data.retlist;
              this.showDetail = true;
            } else {
              AnMsgbox.msgbox({ message: data.msg });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
.interface-statistic {
  position: relative;
}
.interface-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: calc(100vh - 100px);
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
}
.info-list {
  height: 50%;
  overflow-y: auto;
  background-color: white;
}
.info-func {
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
}
</style>
