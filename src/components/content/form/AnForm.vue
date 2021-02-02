<template>
  <div class="an-form">
    <!-- <div class="title">
      <label>您所在的位置：{{ name }}</label>
    </div>  -->
    <an-nav-title></an-nav-title>
    <div class="basic-info">
      <slot></slot>
    </div>
    <div class="tabs-info">
      <slot name="tabs-info"> </slot>
    </div>
    <div class="audit-info">
      <slot name="audit-info"></slot>
    </div>
  </div>
</template>
<script>
import AnNavTitle from "components/common/nav/AnNavTitle";
export default {
  name: "AnForm",
  data() {
    return {};
  },
  props: {
    name: {
      type: String,
    },
  },
  components: {
    AnNavTitle,
  },
};
</script>

<style scoped>
.an-form {
  position: relative;
  width: 100%;
}
.basic-info {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 58px 20px 0px 20px;
}
.basic-info {
  padding-top: 58px;
}
.basic-info > div {
  margin-bottom: 10px;
}
/*短输入框*/
.anShort {
  width: 31%;
  margin-right: 1%;
}
/*占整行输入框*/
.anLong {
  width: 95%;
  margin-right: 1%;
}

/*整行文本域 父级*/
.anTextarea {
  width: 95%;
  margin-right: 1%;
}

/*分割线*/
.Dividing_line {
  width: 97% !important;
  border: none;
  height: 2px;
  margin: 0 auto;
  background: #7cb4eb;
}

/* 媒体查询分辨率样式 小于1366分辨率  呈现一行占2个input 框 */
@media screen and (max-width: 1365px) {
  .anShort {
    width: 47% !important;
    margin-right: 1%;
  }
}
</style>
