<template>
  <div class="home">
    <HtPullRefresh 
      ref="pullRefresh" 
      :listData="listData" 
      :pulldown="true" 
      :pullup="true"
      :loadFinish="isLoadFinish"
      @pullUpDone="getMoreData" 
      :pullDownLoading.sync="isPullDownLoading"
      :pullUpLoading.sync="isPullUpLoading">
      <ul class="content">
        <li class="item" v-for="(item,index) of listData" :key="index">item{{index + 1}}</li>
      </ul>
    </HtPullRefresh>
  </div>
</template>

<script>
// @ is an alias to /src
import HtPullRefresh from '@c/HtPullRefresh'
import { setTimeout } from 'timers';
export default {
  name: "home",
  components: {
    HtPullRefresh
  },
  data() {
    return {
      listData: [],
      isPullDownLoading: false,
      isPullUpLoading: false,
      isLoadFinish: false,
      page:1
    }
  },
  methods: {
    getMoreData () {
      this.page++
      if(this.page == 5){
        this.isPullUpLoading = false
        this.isLoadFinish = true
        return false
      }
      setTimeout(() => {
        let newData = Array.from({length:10},(v,k) => k)
        this.listData.push(...newData)
        this.isPullUpLoading = false
      },2000)
    }
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

