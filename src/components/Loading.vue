<template>
  <div class="loading">
    <van-loading size="24px" color="#1989fa" vertical v-if="loading">加载中...</van-loading>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState([
      'loading'
    ])
  },
}
</script>