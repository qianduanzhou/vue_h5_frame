<template>
  <div class="error">
    <p class="error-title">404页面未找到</p>
  </div>
</template>

<script>
export default {};
</script>

<style  lang='less' stoped>
.error {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .error-img {
    width: 100%;
    display: block;
  }
  .error-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
  }
}
</style>