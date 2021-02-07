<template>
  <div class="login">登录页面</div>
</template>

<script>
import { login } from "network/request";
export default {
  name: "Login",
  data() {
    return {};
  },
  components: {},
  created() {
    login("15031231747", "R15031231747@")
      .then((res) => {
        let data = res.data;
        if (data.ret == 0) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
</style>
