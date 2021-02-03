<template>
  <div class="xmgl-module-list">
    <an-tree-table
      :pDatas="moduleDatas"
      :labelNames="labelNames"
      :keys="keys"
      :widths="widths"
      showCheckbox
    >
      <div v-if="canEdit" class="funcs">
        <an-button
          name="添加"
          icon="el-icon-plus"
          color="green"
          letterColor="white"
          @click.native="addClick"
        ></an-button>
        <an-button
          name="修改"
          icon="el-icon-edit"
          @click.native="editClick"
        ></an-button>
        <an-button
          name="删除"
          icon="el-icon-delete"
          @click.native="delClick"
        ></an-button>
      </div>
    </an-tree-table>

    <div class="detail" v-show="showDetail">
      <div class="info">
        <div class="title">模块信息</div>
        <an-label-input name="模块名称" ref="name"></an-label-input>
        <an-label-popup-select
          name="管理员"
          :initialValue="adminInitialValue"
          :pData="adminUsers"
          ref="admin"
        ></an-label-popup-select>
        <an-label-popup-select
          name="开发人员"
          :initialValue="developerInitialValue"
          :pData="developerUsers"
          ref="developer"
        ></an-label-popup-select>
        <an-label-popup-select
          name="其他人员"
          :initialValue="othersInitialValue"
          :pData="othersUsers"
          ref="others"
        ></an-label-popup-select>
        <div class="func">
          <an-button name="取消" @click.native="cancel"></an-button>
          <an-button name="确定" @click.native="assert"></an-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnTreeTable from "components/common/show/AnTreeTable";
import AnLabelPopupSelect from "components/common/form/AnLabelPopupSelect";
import AnLabelInput from "components/common/form/AnLabelInput";
import AnButton from "components/common/basic/AnButton";
import { post, put } from "network/request";
export default {
  name: "XmglModuleList",
  data() {
    return {
      xmInfo: null, //查看的项目id
      canEdit: false, //是否可以编辑
      showDetail: false, //是否展示详细信息面板
      moduleDatas: [],
      labelNames: ["模块名称", "管理员", "开发人员", "其他用户"],
      keys: ["name", "admin_names", "developer_names", "others_names"],
      widths: ["20%", "20%", "30%", "28%"],

      adminUsers: [], //管理员备选数据
      developerUsers: [], //开发人员备选数据
      othersUsers: [], //其他人员备选数据，三个数据实际一样的，因目前select组件没有对数据进行值复制，直接引用的，所以此处三个进行了复制，否则有问题，后续修复select组件后，不用这样处理
      adminInitialValue: "",
      developerInitialValue: "",
      othersInitialValue: "",
    };
  },
  components: {
    AnTreeTable,
    AnButton,
    AnLabelPopupSelect,
    AnLabelInput,
  },
  created() {
    this.xmInfo = this.$route.query.xmInfo;
    if (this.$route.query.canEdit) {
      this.canEdit = this.$route.query.canEdit;
    }
    this.getModuleList();
    this.getUserList();
  },
  methods: {
    getModuleList() {},
    //获取用户数据
    getUserList() {
      //获取可选择的用户
      let userParams = {
        action: "list_user",
        user_id: localStorage.getItem("user_id"),
        delete_state: "0",
      };
      post("/api/user", userParams)
        .then((res) => {
          if (res.ret == 0) {
            for (let i = 0; i < res.retlist.length; i++) {
              let ele = res.retlist[i];
              this.adminUsers.push({ id: ele.id, name: ele.name });
              this.developerUsers.push({
                id: ele.id,
                name: ele.name,
              });
              this.othersUsers.push({ id: ele.id, name: ele.name });
            }
          }
        })
        .catch((err) => {
          AnMsgbox.msgbox({ message: "暂时无法获取数据" });
        });
    },
    //点击添加按钮
    addClick() {
      this.showDetail = true;
    },
    //点击修改按钮
    editClick() {},
    //点击删除按钮
    delClick() {},
    //点击取消
    cancel() {
      this.showDetail = false;
    },
  },
};
</script>

<style scoped>
.funcs {
  display: flex;
}
.funcs > div {
  margin-right: 10px;
}

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
