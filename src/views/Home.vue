<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"><br/>
    <van-button type="primary" @click="init(1)">发起请求</van-button>
    <!-- <van-button type="danger" @click="cancelFuc">取消请求</van-button> -->
    <Loading/>
  </div>
</template>

<script>
import { requestApi } from "@/request/request";
import { mapMutations } from "vuex";
import Loading from "components/Loading";
import wxconfig from '@/utils/wxconfig'
export default {
  name: "home",
  data() {
    return {
      aaa_aaa: "asdasd",
      goods: {},
      base_url: process.env.BASE_URL
    };
  },
  components: {
    Loading
  },
  created() {

  },
  mounted() {
    console.log("process", process.env);
  },
  methods: {
    init(num) {
      requestApi({
        name: "test",
        data: {
          token: num,
        },
        isCancel: true
      }).then(res => {
        console.log("init——" + num, res);
      });
    },
    ...mapMutations({
      setLoading: "SET_LOADING"
    })
  }
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
}
</style>