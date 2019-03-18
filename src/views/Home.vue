<template>
  <div class="home">
    <HtPullRefresh ref="pullRefresh" :listData="listData" :pulldown="true" :pullLoading.sync="isPullLoading">
      <ul class="content">
        <li class="item" v-for="(item,index) of listData" :key="index">item{{index + 1}}</li>
      </ul>
    </HtPullRefresh>
  </div>
</template>

<script>
// @ is an alias to /src
import HtPullRefresh from '@c/HtPullRefresh'
export default {
  name: "home",
  components: {
    HtPullRefresh
  },
  data() {
    return {
      listData: [],
      isPullLoading: false
    }
  },
  methods: {
  },
  mounted() {
    setTimeout(() => {
      this.listData = Array.from({length:30},(v,k) => k)
      console.log(this.$refs.pullRefresh)
    },200)
  }
};
</script>

<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
}
.content{
  .item{
    padding: 10px;
    font-size:16px;
    text-align: left;
    color: #666;
    border-bottom: 1px solid #ddd;
  }
}
</style>

