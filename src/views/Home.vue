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
    this.init(1)
    this.init(2)
    this.init(3)
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