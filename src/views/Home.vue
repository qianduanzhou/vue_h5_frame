<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"><br/>
    <p>Home</p>
    <Loading/>
  </div>
</template>

<script>
import { requestApi } from "@/request/request";
import { mapMutations } from "vuex";
import Loading from "components/Loading";
export default {
  name: "home",
  data() {
    return {

    };
  },
  components: {
    Loading
  },
  created() {

  },
  mounted() {

  },
  methods: {
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