<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
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
    this.init1()
    this.init2()
    this.init3()
  },
  mounted() {
    console.log("process", process.env);
  },
  methods: {
    init1(num) {
      requestApi({
        name: "test",
        data: {
          token: "1",
        },
      }).then(res => {
        console.log("init1", res, 1);
      });
    },
    init2(num) {
      requestApi({
        name: "test",
        data: {
          token: "2",
        },
      }).then(res => {
        console.log("init2", res, 2);
      });
    },
    init3(num) {
      requestApi({
        name: "test",
        data: {
          token: "3",
        },
      }).then(res => {
        console.log("init3", res, 3);
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