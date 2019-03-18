<template>
  <div ref="scroll_container" class="pull-refresh-wrapper">
    <div class="pull-refresh-inner">
      <div class="pull-refresh-head" :class="{pullRefreshLoading:pullLoading}">
        <div class="pull-refresh-text" v-show="!pullLoading">{{pullMsg}}</div>
        <div class="pull-refresh-loading" v-show="pullLoading">
          <span class="loading-icon-box">
            <span class="loading-icon"></span>
          </span>
          <span class="loading-text">{{pullLoadingText}}</span>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
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
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
      pulldown: {
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
       * 处于loading状态
       */
      pullLoading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pullMsg: "下拉刷新",
        pullRefreshLoading: false,
        pullLoadingText: "加载中..."
      }
    },
    watch: {
       // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      listData() {
        console.log(this.scrollObj)
        setTimeout(() => {
          this.scrollObj.refresh()
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
          click: true //better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
        }
        this.scrollObj = new BScroll(this.$refs.scroll_container, options)

        //滚动事件触发
        this.scrollObj.on('scroll',(pos) => {
          if(this.pulldown){
            //下拉刷新
            if(pos.y > 60){
              this.pullMsg = "松开即可刷新了"
              this.pullRefreshLoading = true
            }else{
              this.pullMsg = "下拉刷新"
            }
          }
        })

        //鼠标/手指离开
        this.scrollObj.on('touchEnd',(pos) => {
          console.log(pos)
          if(this.pulldown){
            if(pos.y > 60){
              // this.pullLoading = true
              this.$emit('update:pullLoading',true)
              this.pullMsg = "下拉刷新"
              setTimeout(() => {
                // this.pullLoading = false
                this.$emit('update:pullLoading',false)
              },6000)
              //下拉到达触发刷新事件
              this.$emit('pullDownDone')
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


<style lang="scss">
  .pull-refresh-wrapper {
    overflow-y: auto;
    transition: 330ms;
    -webkit-overflow-scrolling: touch;
    user-select: none;
    position: relative;
    height: 100%;
  }
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
    .pull-refresh-loading{
      .loading-icon{
        display: inline-block;
        vertical-align: middle;
        // animation:loadRotate 1s linear infinite;
      }
    }
  }
  .pullRefreshLoading{
    position: initial;
  }


  @-webkit-keyframes loadRotate{
    from{
      -webkit-transform: rotate(0deg);
    }
    to{
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes loadRotate{
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }

  // loading icon
  .loading-icon,
  .loading-icon:before,
  .loading-icon:after {
    background: #30a5ff;
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
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
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
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
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loading-icon:after {
    left: 0.6em;
  }
  @-webkit-keyframes load1 {
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
  @keyframes load1 {
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