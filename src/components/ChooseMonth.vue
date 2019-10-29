<template>
  <div class="choose-wrap">
    <div class="side-wrap">
      <ul class="year-list" ref="yearList">
        <li :class="[{'active':item.active}]" v-for="(item, index) of yearList" :key="index" @click="handleChooseYear(item)">{{item.year}}月</li>
      </ul>
    </div>
    <div class="list-wrap">
      <ul class="month-list" ref="monthList">
        <li :class="['date-item', {'selected':item.selected}, {'year-tips': item.cate == 1}]" v-for="(item, index) of monthList" :key="index" @click="handleChooseMonth(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>


<script>
import { debounce, throttle } from '@/utils'
export default {
  name: "ChooseMonth",
  data() {
    return {
      yearList: [
        // {year:2019, active:true},
      ],
      monthList: [
        // {name: "— 2019 —", cate:1},
        // {name: "03月", selected: false, cate:2},
      ],
      limitMonthCount: 6, //展示最近6个月份的
      defaultSelectedWeekCount: 4, //默认选中最近4个周
      yearListElem: null, //年列表ul DOM 
      monthListElem: null, //月列表ul DOM
      yearToListPosInfo: {}, //每个年份对应列表的起始位置信息
      yearTipsPosInfo: [], //月份列表中每个年份tips的 offsetTop
    }
  },
  watch: {
  },
  methods: {
    formatNum(num) {
      return num < 10 ? `0${num}` : num
    },

    formatTimeStamp(timeStamp, fmt) {
      let oDate = new Date(timeStamp)
      var o = {
        "M+": oDate.getMonth() + 1, //月份 
        "d+": oDate.getDate(), //日 
        "h+": oDate.getHours(), //小时 
        "m+": oDate.getMinutes(), //分 
        "s+": oDate.getSeconds(), //秒 
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度 
        "S": oDate.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "")
          .substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },

    //点击年份
    handleChooseYear(item) {
      console.log('点击年份', item)
      this.yearList.forEach(item => {
        item.active = false
      })
      item.active = true
      this.scrollMonthList(item.year)
    },

    //点击选中月份
    handleChooseMonth(item){
      console.log('点击月份', item)
      item.selected = !item.selected
    },

    // 获取最近6个月份
    generateLastSixMonth() {
      let nowYear = new Date().getFullYear()
      let nowMonth = new Date().getMonth() + 1
      let len = this.limitMonthCount
      let monthArr =  []

      while(len > 0) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        len--
        let year = nowYear
        let month = 0
        let diffMonthCount = nowMonth - len

        if(diffMonthCount <= 0){
          if(diffMonthCount <= -12){
            year = nowYear - (Math.abs(Math.ceil(-diffMonthCount / 12 )))
            month = 12 - (Math.abs(diffMonthCount)%12)
            //当月份为12时，年减1
            if(Math.abs(diffMonthCount)%12 == 0){
              year--
            }
          }else{
            year = nowYear - 1
            month = 12 + diffMonthCount
          }
        }else{
          month = diffMonthCount
        }
        monthArr.push({year, month})
      }
      console.log('monthArr', monthArr)
      return monthArr
    },

    //生成最近6个月份
    renderMonths() {
      let sourceMonthData = this.generateLastSixMonth()
      let nowYear = new Date().getFullYear()
      let nowMonth = new Date().getMonth() + 1

      sourceMonthData = sourceMonthData.map(item => {
        item.name = this.formatNum(item.month)+'月'
        item.selected = item.year == nowYear && nowMonth == item.month ? true : false
        item.cate = 2
        return item
      })

      //年份信息
      let yearList = []
      sourceMonthData.forEach((item,index) => {
        if(!yearList.includes(item.year)){
          let appendItem = {
            name: `— ${item.year}年 —`, 
            cate:1,
            year: item.year
          }
          sourceMonthData.splice(index, 0, appendItem)
          yearList.push(item.year)
        }
      })
      // console.log(sourceMonthData)
      this.monthList = sourceMonthData
      this.yearList = yearList.map(yearItem => {
        return {
          year:yearItem, 
          active: yearItem == nowYear ? true : false
        }
      })
    },

    //月份列表滚动到指定位置
    scrollMonthList(year){
      const topVal = this.yearToListPosInfo[year] && this.yearToListPosInfo[year]['startPos'] || 0
      this.monthListElem.scrollTop = topVal
    },

    //设置某年份处于 active 状态
    setYearActive(year) {
      this.yearList.forEach(item => {
        item.active = item.year == year ? true : false
      })
    },

    init() {
      this.renderMonths()
      this.$nextTick(()=>{
        // 取 li margin-bottom
        const liElemLists = this.monthListElem.querySelectorAll('li')
        const firstLiElem = liElemLists[0] //第一个li
        const lastLiElem = liElemLists[liElemLists.length - 1] //最后一个li
        let liMarginBottom = window.getComputedStyle(firstLiElem,null)['margin-bottom']
        liMarginBottom = parseInt(liMarginBottom,10)
        
        // 计算得出每个 year-tips 块的定位信息
        this.monthList.forEach((monthItem, index) => {
          if(monthItem.cate == 1) {
            const itemOffsetTop = liElemLists[index].offsetTop
            const itemOffsetHeight = liElemLists[index].offsetHeight
            const itemInfo = {
              year: monthItem.year,
              offsetTop: itemOffsetTop,
              offsetHeight: itemOffsetHeight,
            }
            this.yearTipsPosInfo.push(itemInfo)
          }
        })

        // 计算得出每个 year-tips 块的起止定位信息
        this.yearTipsPosInfo.forEach((itemPos, index) => {
          if(!this.yearToListPosInfo[itemPos.year]) {
            this.yearToListPosInfo[itemPos.year] = {}
            this.yearToListPosInfo[itemPos.year]['startPos'] = itemPos['offsetTop']
            let nextYearTips = this.yearTipsPosInfo[index+1]
            let nextYearTipsOffsetTop = nextYearTips && nextYearTips['offsetTop'] || 0

            // nextYearTipsOffsetTop 为0，说明这个year-tips是最后一个了
            if(nextYearTipsOffsetTop == 0){
              nextYearTipsOffsetTop = lastLiElem.offsetTop
            }

            this.yearToListPosInfo[itemPos.year]['endPos'] = nextYearTipsOffsetTop
          }
        })

        console.log('yearListElem height',this.yearListElem.offsetHeight)
        console.log('monthListElem height',this.monthListElem.offsetHeight)
        console.log(this.yearTipsPosInfo)
        console.log(this.yearToListPosInfo)

        this.monthListElem.scrollTop = 20000
        let vm = this
        const scrollHandler = function(ev) {
          const scrollTopVal = ev.target.scrollTop
          console.log(scrollTopVal)
          Object.keys(vm.yearToListPosInfo).forEach(key => {
            if(scrollTopVal >= vm.yearToListPosInfo[key]['startPos'] && scrollTopVal < vm.yearToListPosInfo[key]['endPos']) {
              // console.log('active year', key)
              vm.setYearActive(key)
            }
          })
        }
        this.monthListElem.addEventListener('scroll', debounce(scrollHandler, 50))

      })
    }
  },
  created() {
  },
  mounted() {
    this.yearListElem = this.$refs['yearList']
    this.monthListElem = this.$refs['monthList']
    this.init()
  }
}
</script>


<style lang="scss" scoped>
.choose-wrap{
  display: flex;
  height: 300px;
  border: 1px solid #dcdcdc;
  font-size:16px;
  .side-wrap{
    width: 22%;
    height: 100%;
    overflow-y: auto;
    background-color: #F8F8F8;
    .year-list{
      >li{
        height: 40px;
        line-height: 40px;
        padding-right: 20px;
        text-align: right;
        color: #8A9199;
        &.active{
          color: #3F3F3F;
          background-color: #fff;
        }
      }
    }
  }
  .list-wrap{
    flex: 1;
    height: 100%;
    padding:20px 30px 0;
    .month-list{
      position: relative; /*容器设置相对定位，子元素获取offsetTop才相对它的父元素*/
      height: 100%;
      overflow-y: auto;
      >li{
        height:48px;
        line-height:48px;
        text-align: center;
        background:rgba(248,248,248,1);
        border-radius:5px;
        margin-bottom: 15px;
        color: #999;
        &.selected{
          color: #47AEFE;
          background-color: #E9F5FF;
        }
        &.year-tips{
          background:#fff;
          height: auto;
          color: #8A9199;
          line-height: 1.6;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
