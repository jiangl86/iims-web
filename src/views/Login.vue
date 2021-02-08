<template>
  <div class="login">
    <div class="system-name">信息化部管理系统</div>
    <div class="login-info">
      <div class="title"></div>
      <an-input
        name="用户名"
        placeholder="请输入"
        type="text"
        class="username"
        ref="username"
      ></an-input>
      <an-input
        name="密码"
        placeholder="请输入"
        type="password"
        class="password"
        ref="password"
      ></an-input>
      <an-button
        name="登录"
        color="#406dfc"
        letterColor="white"
        class="login-btn"
        @click.native="loginClick"
      ></an-button>
    </div>
  </div>
</template>

<script>
import AnInput from "components/common/basic/AnInput";
import AnButton from "components/common/basic/AnButton";
import { login } from "network/request";

import AnMsgbox from "components/common/popup/AnMsgbox";
export default {
  name: "Login",
  data() {
    return {};
  },
  components: {
    AnInput,
    AnButton,
  },
  created() {},
  methods: {
    loginClick() {
      let name = this.$refs.username.value;
      let password = this.$refs.password.value;
      if (!name || name == "") {
        AnMsgbox.msgbox({ message: "请输入用户名" });
        return;
      }
      if (!password || password == "") {
        AnMsgbox.msgbox({ message: "请输入密码" });
        return;
      }
      name = name.trim();
      let sha256 = require("js-sha256");
      var hash = sha256.create();
      hash.update(password);
      password = hash.hex();
      console.log(password);
      login(name, password)
        .then((res) => {
          let data = res.data;
          if (data.ret == 0) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);
            this.$router.replace({ name: "Home" });
          } else {
            AnMsgbox.msgbox({ message: data.msg });
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.system-name {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translate(-50%);
  font-size: 40px;
}
.login-info {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: white;
  border: 1px solid #ccc;
}
.username,
.password {
  margin: 20px 20px 0;
}
.username >>> input[type="text"],
.password >>> input[type="password"] {
  height: 40px;
}
.login-btn >>> button {
  margin: 20px 20px 0;
  height: 40px;
  width: 360px;
}
</style>
