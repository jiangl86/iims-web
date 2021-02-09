<template>
  <div class="index">
    <div class="top-nav">
      <div class="logo">
        <span class="logo_title">{{ logoTitle }}</span>
      </div>

      <div class="entrance-title">
        <span class="icons" @click="funcClick('jkgl')">
          <img src="../../assets/images/gzxx.png" />接口管理
        </span>
        <span class="icons" @click="funcClick('xmgl')">
          <img src="../../assets/images/sjkb.png" />项目管理
        </span>
        <span class="icons" @click="funcClick('yhgl')" v-if="userType == '0'">
          <img src="../../assets/images/aqyy.png" />用户管理
        </span>
      </div>

      <div class="tools">
        <div class="username" @click="changePass">
          <span
            ><img
              class="avatar"
              width="40"
              onclick=""
              src="../../assets/images/avatar.png" /></span
          ><span>修改密码</span>
        </div>
        <img
          class="logout_btn"
          title="退出"
          @click="logout"
          width="20"
          height="20"
          src="../../assets/images/logout.png"
        />
      </div>
    </div>
    <div class="show-area">
      <router-view></router-view>
    </div>

    <div class="password-reset" v-show="showPassReset">
      <div class="info">
        <div class="title">密码修改</div>
        <an-label-input name="原密码" ref="oldPass"></an-label-input>
        <an-label-input name="新密码" ref="newPass"></an-label-input>
        <an-label-input
          name="再次输入新密码"
          ref="confirmPass"
        ></an-label-input>
        <div class="func">
          <an-button name="取消" @click.native="cancel"></an-button>
          <an-button name="确定" @click.native="assert"></an-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnLabelInput from "components/common/form/AnLabelInput";
import AnButton from "components/common/basic/AnButton";

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
import { encrypt } from "common/other/encrypt";
export default {
  name: "Index",
  data() {
    return {
      logoTitle: "信息化部接口管理系统",
      showPassReset: false,
      userType: "1", //普通用户
    };
  },
  components: {
    AnLabelInput,
    AnButton,
  },
  created() {
    this.initRight();
  },
  methods: {
    initRight() {
      let params = {
        action: "get_self_info",
        user_id: localStorage.getItem("user_id"),
      };
      put("/api/user", params)
        .then((res) => {
          this.userType = res.type;
        })
        .catch((err) => {});
    },
    funcClick(code) {
      if (code == "jkgl") {
        this.$router.replace({ name: "JkglIndex" });
      } else if (code == "xmgl") {
        this.$router.replace({ name: "XmglList" });
      } else if (code == "yhgl") {
        this.$router.replace({ name: "YhglList" });
      }
    },
    //点击用户，弹出修改密码框
    changePass() {
      console.log("ass");
      this.$refs.oldPass.setValue("");
      this.$refs.newPass.setValue("");
      this.$refs.confirmPass.setValue("");
      this.showPassReset = true;
    },
    //密码修改取消
    cancel() {
      this.showPassReset = false;
    },
    //密码修改确认
    assert() {
      let oldPass = this.$refs.oldPass.value;
      let newPass = this.$refs.newPass.value;
      let confirmPass = this.$refs.confirmPass.value;
      if (!oldPass || oldPass == "") {
        AnMsgbox.msgbox({ message: "请输入原密码" });
        return;
      }
      if (!newPass || newPass == "") {
        AnMsgbox.msgbox({ message: "请输入新密码" });
        return;
      }
      if (!confirmPass || confirmPass == "") {
        AnMsgbox.msgbox({ message: "请再次输入新密码" });
        return;
      }
      if (confirmPass != newPass) {
        AnMsgbox.msgbox({ message: "两次输入密码不相同" });
        return;
      }
      let params = {
        action: "update_password",
        user_id: localStorage.getItem("user_id"),
      };
      //需要传输加密后的数据
      oldPass = encrypt(oldPass);
      newPass = encrypt(newPass);
      let data = { old_password: oldPass, new_password: newPass };
      params.data = data;
      post("/api/user", params)
        .then((res) => {
          AnMsgbox.msgbox({ message: res.msg });
          this.showPassReset = false;
        })
        .catch((err) => {
          AnMsgbox.msgbox({ message: "修改失败，请稍后再试" });
        });
    },

    logout() {
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      this.$router.replace({ name: "Login" });
    },
  },
};
</script>

<style lang="scss" scoped>
.top-nav {
  height: 60px;
  width: 100%;
  background: var(--mainColor) url("../../assets/images/topbg.png");
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
}
.logo_title {
  color: #fff;
  font-size: var(--font-size-bg);
}
.logo {
  width: 30%;
  display: flex;
  align-items: center;
}

.entrance-title {
  width: 45%;
}
.entrance-title img {
  float: left;
  margin-top: 13px;
}
.entrance-title span {
  display: block;
  margin-right: 60px;
}
.entrance-title {
  display: flex;
  color: #fff;
  cursor: pointer;
  align-items: center;
  line-height: 60px;
}
.entrance-title img {
  padding-top: 5px;
}
.tools {
  flex: 1;
  color: #fff;
  display: flex;
  align-items: center;
  margin-right: 10px;
  justify-content: flex-end;
}
.username {
  display: flex;
  align-items: center;
  margin: 0px 30px;
}
.username img {
  margin-top: 15px;
}

.show-area {
  height: calc(100vh - 60px);
  width: 100%;
  // overflow-y: scroll;
  margin-top: 60px;
}

.tools a {
  color: #fff;
}
.icons {
  text-align: center;
  border-top: 1px solid #42b983;
  span {
    color: #0079fe;
    display: block;
    &.active {
      color: #fff;
      background: #0079fe;
    }
  }
}

/* 媒体查询分辨率样式 小于1366分辨率   1024分辨率以上*/
@media screen and (max-width: 1365px) {
  .logo_title {
    font-size: var(--font-size-lg);
  }
  .entrance-title span {
    margin-right: 10px;
  }
}

//密码修改相关信息
.password-reset {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.password-reset .info {
  width: 40%;
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
