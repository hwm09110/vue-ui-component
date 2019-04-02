<template>
  <div ref="scroll_container" class="pull-refresh-wrapper">
    <div class="pull-refresh-inner">
      <div class="pull-refresh-head" :class="{pullRefreshLoading:pullDownLoading}" v-show="pulldown">
        <div class="pull-refresh-text" v-show="!pullDownLoading">{{pullDownMsg}}</div>
        <div class="pull-refresh-loading" v-show="pullDownLoading">
          <span class="loading-icon-box">
            <span class="loading-icon"></span>
          </span>
          <span class="loading-text">{{pullLoadingText}}</span>
        </div>
      </div>
      <slot></slot>
      <div class="pullup-load" :class="{pullUpLoading:pullUpLoading}" v-show="!loadFinish && pullup && showPullUp">
        <div class="pullup-load-text" v-show="!pullUpLoading">{{pullUpMsg}}</div>
        <div class="pullup-loading" v-show="pullUpLoading">
          <span class="loading-icon-box">
            <span class="loading-icon"></span>
          </span>
          <span class="loading-text">{{pullLoadingText}}</span>
        </div>
      </div>
      <div class="load-finish" v-show="loadFinish">{{loadFinishText}}</div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    props: {
      /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
      probeType: {
          type: Number,
          default: 1
      },
      /**
       * 是否开启下拉刷新
       */
      pulldown: {
          type: Boolean,
          default: false
      },
      /**
       * 是否开启上拉加载
       */
      pullup: {
          type: Boolean,
          default: false
      },
      /**
      * 列表的数据
      */
      listData: {
        type: Array,
        default: null
      },
      /**
       * 当数据更新后，刷新scroll的延时。
       */
      refreshDelay: {
        type: Number,
        default: 20
      },
      /**
       * 处于下拉刷新loading状态
       */
      pullDownLoading: {
        type: Boolean,
        default: false
      },
      /**
       * 处于上拉加载loading状态
       */
      pullUpLoading: {
        type: Boolean,
        default: false
      },
      /**
       * 上拉加载完所有数据
       */
      loadFinish: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pullDownMsg: "下拉刷新",
        pullLoadingText: "加载中...",
        pullUpMsg: "上拉加载更多",
        loadFinishText: "已加载完全部数据了！",
        showPullUp: true
      }
    },
    watch: {
       // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      listData() {
        // console.log(this.scrollObj)
        setTimeout(() => {
          this.scrollObj.refresh()
          console.log(this.scrollObj.maxScrollY)
          if(this.scrollObj.maxScrollY == 0){
            this.showPullUp = false
          }
        },this.refreshDelay)
      }
    },
    methods: {
      _initScroll() {
        if(!this.$refs.scroll_container){
          return false
        }
        let options = {
          probeType: this.probeType,
          click: true, //better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
          pullUpLoad: this.pullUpLoad
        }
        this.scrollObj = new BScroll(this.$refs.scroll_container, options)

        //滚动事件触发
        this.scrollObj.on('scroll',(pos) => {
          let posY = pos.y
          //下拉刷新
          if(this.pulldown){
            if(posY > 60){
              this.pullDownMsg = "松开即可刷新了"
            }else{
              this.pullDownMsg = "下拉刷新"
            }
          }

          //上拉加载
          if(this.pullup && !this.loadFinish){
            let maxScrollY = this.scrollObj.maxScrollY
            if(posY - maxScrollY < -50){
              this.pullUpMsg = "松开即可加载更多"
            }else{
              this.pullUpMsg = "上拉加载更多"
            }
          }
        })

        //鼠标/手指离开
        this.scrollObj.on('touchEnd',(pos) => {
          let posY = pos.y
          //开启下拉刷新
          if(this.pulldown && !this.pullDownLoading){
            if(posY > 60){
              this.$emit('update:pullDownLoading',true)
              this.pullDownMsg = "下拉刷新"
              //下拉到达触发刷新事件,可以请求后台数据
              this.$emit('pullDownDone')
            }
          }

          //上拉加载
          if(this.pullup && !this.loadFinish && !this.pullUpLoading){
            let maxScrollY = this.scrollObj.maxScrollY
            if(posY - maxScrollY <= -50){
              this.$emit('update:pullUpLoading',true)
              this.pullUpMsg = "上拉加载更多"
              let scrollToVal = maxScrollY-50
              setTimeout(() => {
                this.scrollObj.refresh()
              },80)
              setTimeout(() => {
                this.scrollObj.scrollTo(0,scrollToVal)
              },150)
              //上拉到达触发加载事件,可以请求后台数据
              this.$emit('pullUpDone')
            }
          }
        })
      }
    },
    mounted() {
      // 保证在DOM渲染完毕后初始化better-scroll
      setTimeout(() => {
        this._initScroll()
      }, 20)
    }
  }
</script>


<style lang="scss" scope>
  .pull-refresh-wrapper {
    overflow-y: auto;
    transition: 330ms;
    -webkit-overflow-scrolling: touch;
    user-select: none;
    position: relative;
    height: 100%;
  }

  //下拉刷新
  .pull-refresh-head {
    position: absolute;
    left: 0;
    top: -50px;
    width: 100%;
    height: 50px;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    color: #969799;
    line-height: 50px;
    .pull-refresh-text{
      text-align: center;
    }
  }

  //上拉加载提示
  .pullup-load{
    // display: none;
    position: absolute;
    left: 0;
    bottom: -50px;
    width: 100%;
    height: 50px;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    color: #969799;
    line-height: 50px;
    .pullup-load-text{
      text-align: center;
    }
  }

  .pullRefreshLoading,
  .pullUpLoading{
    position: initial;
  }

  //全部加载完提示
  .load-finish{
    width: 100%;
    height: 50px;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    color: #969799;
    line-height: 50px;
  }

  // loading icon
  .loading-icon-box{
    .loading-icon{
      display: inline-block;
      vertical-align: middle;
    }
  }
  .loading-icon,
  .loading-icon:before,
  .loading-icon:after {
    background: #30a5ff;
    animation: loadAnimation 1s infinite ease-in-out;
    width: 0.3em;
    height: 0.5em;
  }
  .loading-icon {
    color: #30a5ff;
    text-indent: -9999em;
    position: relative;
    font-size: 11px;
    line-height: normal;
    margin: 0 15px;
    transform: translateZ(0);
    animation-delay: -0.16s;
  }
  .loading-icon:before,
  .loading-icon:after {
    position: absolute;
    top: 0;
    content: '';
  }
  .loading-icon:before {
    left: -0.6em;
    animation-delay: -0.32s;
  }
  .loading-icon:after {
    left: 0.6em;
  }
  @keyframes loadAnimation {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 0.8em;
    }
    40% {
      box-shadow: 0 -0.8em;
      height: 1.2em;
    }
  }
</style>