<template>
  <div class="yhgl-list">
    <an-table
      :pDatas="users"
      :labelNames="labelNames"
      :keys="keys"
      :widths="widths"
      :total="totalNum"
      :intialPage="page"
      :funcRight="funcRight"
      :showFuncs="showFuncs"
      showPagination
      @funcClick="funcClick"
      @dblClick="dblClick"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    ></an-table>

    <div class="detail" v-show="showDetail">
      <div class="info">
        <div class="title">用户信息</div>
        <an-label-input name="用户姓名" ref="name"></an-label-input>
        <an-label-input name="电话" ref="phone"></an-label-input>
        <an-label-input name="账户" ref="account"></an-label-input>
        <an-label-radio-group
          name="类型"
          :options="typeOptions"
          :initialValue="typeInitValue"
          ref="type"
        ></an-label-radio-group>
        <an-label-radio-group
          name="状态"
          ref="state"
          :options="stateOptions"
          :initialValue="stateInitValue"
        ></an-label-radio-group>
        <an-label-input
          name="添加时间"
          ref="createTime"
          disabled
        ></an-label-input>
        <div class="func">
          <an-button name="取消" @click.native="cancel"></an-button>
          <an-button
            name="确定"
            @click.native="assert"
            v-if="funcRight && funcRight.editFlag && funcRight.editFlag == '1'"
          ></an-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnTable from "components/common/show/AnTable";
import AnLabelInput from "components/common/form/AnLabelInput";
import AnLabelPopupSelect from "components/common/form/AnLabelPopupSelect";
import AnLabelRadioGroup from "components/common/form/AnLabelRadioGroup";
import AnButton from "components/common/basic/AnButton";

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
export default {
  name: "YhglList",
  data() {
    return {
      showDetail: false,
      showFuncs: false, //是否显示功能操作按钮
      chooseUserId: 0, //选中用户Id，添加时为0
      typeInitValue: "1", //用户初始类型
      stateInitValue: "1", //用户初始状态
      users: [],
      page: 1, //当前页码
      pageSize: 15, //每页数量
      totalNum: 0,
      labelNames: ["姓名", "电话", "账号", "类型", "状态", "添加时间"],
      keys: [
        "name",
        "phone",
        "account",
        "typeName",
        "stateName",
        "create_time",
      ],
      widths: ["20%", "20%", "20%", "20%", "5%", "10%"],
      typeOptions: [
        { label: "系统管理员", value: "0" },
        { label: "普通用户", value: "1" },
      ],
      stateOptions: [
        { label: "正常", value: "1" },
        { label: "未激活", value: "2 " },
      ],
      funcRight: null,
      url: "/api/user",
    };
  },
  components: {
    AnTable,
    AnLabelInput,
    AnLabelPopupSelect,
    AnLabelRadioGroup,
    AnButton,
  },
  created() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      let params = {
        action: "list_user",
        page_size: this.pageSize,
        page_num: this.page,
        delete_state: "0",
        user_id: localStorage.getItem("user_id"),
      };
      post("/api/user", params)
        .then((data) => {
          if (data.ret == 0) {
            this.totalNum = data.total_count;
            this.users = data.retlist;
            this.initUsers();
            if (data.funcRight) {
              this.funcRight = data.funcRight;
              this.showFuncs = true;
            } else {
              this.showFuncs = false;
              this.funcRight = null;
            }
            console.log(this.funcRight);
          } else {
            //异常处理
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //给用户加上状态名称
    initUsers() {
      this.users.map((ele) => {
        this.$set(ele, "typeName", ele.type == "0" ? "系统管理员" : "普通用户");
        this.$set(ele, "stateName", ele.state == "1" ? "正常" : "未激活");
      });
      console.log(this.users);
    },

    //切换页面
    pageChange(page) {
      this.page = page;
      this.getUserData();
    },

    //变化每页数量
    sizeChange(size) {
      this.pageSize = size;
      this.getUserData();
    },
    //双击某一条数据，开启修改
    dblClick(user) {
      this.chooseUserId = user.id;
      this.$refs.name.setValue(user.name);
      this.$refs.phone.setValue(user.phone);
      this.$refs.account.setValue(user.account);
      this.$refs.type.setValue(user.type);
      this.$refs.state.setValue(user.state);
      this.$refs.createTime.setValue(user.create_time);
      this.showDetail = true;
    },
    //点击相关功能
    funcClick(code, selected) {
      console.log(code);
      if (code == "add") {
        this.showDetail = true;
        this.chooseUserId = 0;
      } else if (code == "edit") {
        let user = selected[0];
        this.chooseUserId = user.id;
        this.$refs.name.setValue(user.name);
        this.$refs.phone.setValue(user.phone);
        this.$refs.account.setValue(user.account);
        this.$refs.type.setValue(user.type);
        this.$refs.state.setValue(user.state);
        this.$refs.createTime.setValue(user.create_time);
        this.showDetail = true;
      } else if (code == "del") {
        console.log("del");
        //首先判断自己的账户是否在选中列表中，如果是，提醒，不能删除
        if (
          selected.findIndex(
            (ele) => ele.id == localStorage.getItem("user_id")
          ) != -1
        ) {
          AnMsgbox.msgbox({ message: "不能删除自己" });
          return;
        }
        //获取选中的id进行删除
        let ids = "";
        for (let i = 0; i < selected.length; i++) {
          ids += selected[i].id + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        let data = {
          action: "delete_user",
          user_id: localStorage.getItem("user_id"),
          delete_user_ids: ids,
        };
        post(this.url, data)
          .then((res) => {
            AnMsgbox.msgbox({ message: res.msg });
            this.getUserData();
          })
          .catch((err) => {
            AnMsgbox.msgbox({ message: "删除失败", type: "warning" });
          });
      } else if (code == "resetPass") {
        let user = selected[0];
        let data = {
          action: "reset_password",
          user_id: localStorage.getItem("user_id"),
          update_user_id: user.id,
        };
        post(this.url, data)
          .then((res) => {
            AnMsgbox.msgbox({ message: res.msg });
          })
          .catch((err) => {
            AnMsgbox.msgbox({ message: "重置失败", type: "warning" });
          });
      }
    },

    //还原detail为空
    recoverDetail() {
      this.$refs.name.setValue("");
      this.$refs.phone.setValue("");
      this.$refs.account.setValue("");
    },

    //点击取消
    cancel() {
      this.showDetail = false;
    },

    //点击确认
    assert() {
      this.nameInitialValue = "aa";
      let userInfo = {};
      let name = this.$refs.name.value;
      let phone = this.$refs.phone.value;
      let account = this.$refs.account.value;
      let type = this.$refs.type.value;
      let state = this.$refs.state.value;
      if (!name || name.trim() == "") {
        AnMsgbox.msgbox({
          title: "提示",
          message: "请输入姓名",
          type: "warning",
        });
        return;
      }
      if (!phone || phone.trim() == "") {
        AnMsgbox.msgbox({
          title: "提示",
          message: "请输入电话",
          type: "warning",
        });
        return;
      }
      if (!account || account.trim() == "") {
        AnMsgbox.msgbox({
          title: "提示",
          message: "请输入账户",
          type: "warning",
        });
        return;
      }
      userInfo.name = name.trim();
      userInfo.phone = phone.trim();
      userInfo.account = account.trim();
      userInfo.type = type;
      let data = {};
      data.user_id = localStorage.getItem("user_id");
      //如果是添加
      if (this.chooseUserId == 0) {
        data.action = "add_user";

        data.data = userInfo;
        post(this.url, data)
          .then((data) => {
            AnMsgbox.msgbox({ message: data.msg });
            this.recoverDetail();
            this.getUserData();
            this.showDetail = false;
          })
          .catch((err) => {
            AnMsgbox.msgbox({
              message: "添加失败，请稍候再试",
              type: "warning",
            });
          });
      } else {
        //修改
        data.update_user_id = this.chooseUserId;
        data.action = "update_user";
        userInfo.state = state;
        data.data = userInfo;
        post(this.url, data)
          .then((res) => {
            AnMsgbox.msgbox({ message: res.msg });
            this.recoverDetail();
            this.getUserData();
            this.showDetail = false;
          })
          .catch((err) => {
            AnMsgbox.msgbox({
              message: "修改失败，请稍候再试",
              type: "warning",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.detail {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.detail .info {
  width: 70%;
  border: 1px solid #ccc;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.info > div {
  padding: 0 10px;
  margin-bottom: 10px;
}

.info .title {
  height: 40px;
  line-height: 40px;
  color: white;
  font-size: var(--font-size-md);
  background-color: var(--mainColor);
}
.info .func {
  display: flex;
  justify-content: center;
}
</style>
