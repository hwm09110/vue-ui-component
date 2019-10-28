<template>
  <div class="choose-wrap">
    <div class="side-wrap">
      <div class="year">2019年</div>
      <ul class="months" ref="monthList">
        <li :class="[{'active':item.active}]" v-for="(item, index) of months" :key="index" @click="handleChooseMonth(item)">{{item.month}}月</li>
      </ul>
    </div>
    <div class="list-wrap">
      <ul class="date-list" ref="dateList">
        <li :class="['date-item', {'selected':item.selected}]" v-for="(item, index) of weekDateList" :key="index" @click="handleChooseDate(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: "ChooseWeekDate",
  data() {
    return {
      months: [
        {year:2019, month:4, active:false},
      ],
      weekDateList: [
        {name: "12月02日~12月08日", selected: false,},
      ],
      limitMonthCount: 6, //展示最近6个月份的
      defaultSelectedWeekCount: 7, //默认选中最近7个周
      monthListElem: null,
      dateListElem: null,
    }
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

    //点击月份
    handleChooseMonth(itemMonth) {
      console.log('点击月份', itemMonth)
      this.months.forEach(item => {
        item.active = false
      })
      itemMonth.active = true
    },

    //点击选中日期
    handleChooseDate(itemDate){
      console.log('点击日期', itemDate)
      itemDate.selected = !itemDate.selected
    },

    //计算某年某月某日是星期几 dateStr=> 2019-10-28
    getWeekOfDate(dateStr) {
      return new Date(dateStr).getDay()
    },

    // 获取最近7个月份
    generateLastSevenMonth() {
      let nowYear = new Date().getFullYear()
      let nowMonth = new Date().getMonth() + 1
      let len = this.limitMonthCount
      let monthArr =  []

      while(len > 0) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        len--
        let year = nowYear
        let month = 0
        if(nowMonth - len <= 0){
          year = nowYear - 1
          month = 12 + (nowMonth - len)
        }else{
          month = nowMonth - len
        }
        monthArr.push({year, month})
      }
      console.log(monthArr)
      return monthArr
    },

    //生成最近7个月份
    renderMonths() {
      let sourceMonthData = this.generateLastSevenMonth()
      let nowMonth = new Date().getMonth() + 1
      this.months = sourceMonthData.map(item => {
        item.active = nowMonth == item.month ? true : false
        return item
      })
    },

    //生成最近7个月份的按周时间选项
    renderWeekDate() {
      let firstMonth = this.months[0]
      let lastMonth = this.months[this.months.length - 1]
      let startYM = `${firstMonth.year}-${firstMonth.month}`
      let endYM = `${lastMonth.year}-${lastMonth.month}`
      console.log(startYM)
      console.log(endYM)
      let weekDateSourceData = this.generateWeekDateList(startYM, endYM)
      let startSelectedIndex = weekDateSourceData.length - this.defaultSelectedWeekCount
      this.weekDateList = weekDateSourceData.map((item, index) => {
        item.selected = index >= startSelectedIndex ? true : false
        return item
      })

    },

    //获取一个月有多少天
    getDateCountOfMonth(year, month) {
      return new Date(year, month, 0).getDate()
    },

    //获取某两个月间的周，如 2019-10-28~2019-11-03
    //sDate=>2019-04 eDate=>2019-10
    generateWeekDateList(sDate, eDate) {
      let endDateInfo = eDate && eDate.split('-')
      let endMonthNowDate = new Date().getDate()
      let endMonthDateCount = this.getDateCountOfMonth(endDateInfo[0], endDateInfo[1])
      // 取开始月份1号是星期几
      let startMonthWeekOfFirstDate = this.getWeekOfDate(sDate+'-1')
      // 取结束月份最后一天是星期几
      let endMonthWeekOfLastDate = this.getWeekOfDate(eDate+'-'+endMonthDateCount)

      let startWeekDate , endWeekDate

      // 如果开始月份1号是星期一
      if(startMonthWeekOfFirstDate == 1) {
        // 如果结束月份最后一天是星期日
        startWeekDate = sDate + '-1'
      }else{
        //取开始日期最近的周一的日期
        let dateOfMondayTimeStamp = new Date(sDate+'-1').getTime() - ( startMonthWeekOfFirstDate == 0 ? 6 : (startMonthWeekOfFirstDate - 1) )*24*60*60*1000
        let realStartDateYear = new Date(dateOfMondayTimeStamp).getFullYear()
        let realStartDateMonth = new Date(dateOfMondayTimeStamp).getMonth() + 1
        let realStartDateDate = new Date(dateOfMondayTimeStamp).getDate()
        startWeekDate = realStartDateYear + '-' + realStartDateMonth + '-' + realStartDateDate
      }

      // 如果结束月份最后一天是星期日
      if(endMonthWeekOfLastDate == 0) {
        endWeekDate = eDate + '-' + endMonthDateCount
      }else{
        //取截止日期最近的周日的日期
        let dateOfSundayTimeStamp = new Date(eDate+'-'+endMonthDateCount).getTime() + ( 7 - endMonthWeekOfLastDate)*24*60*60*1000
        let realEndDateYear = new Date(dateOfSundayTimeStamp).getFullYear()
        let realEndDateMonth = new Date(dateOfSundayTimeStamp).getMonth() + 1
        let realEndDateDate = new Date(dateOfSundayTimeStamp).getDate()
        endWeekDate = realEndDateYear + '-' + realEndDateMonth + '-' + realEndDateDate
      }
      console.log('real 开始结束日期：'+ startWeekDate + '~' + endWeekDate)
      let oneWeekTimeStamp = 7*24*60*60*1000
      let oneDateTimeStamp = 1*24*60*60*1000
      let diffTimeStamp = new Date(endWeekDate).getTime() - new Date(startWeekDate).getTime()
      const weekCount = Math.ceil(diffTimeStamp / oneWeekTimeStamp) //两个日期之间的周数
      console.log('共周数：'+ weekCount)
      let weekDateArr = []
      let startDate = startWeekDate //开始日期
      for(let i = 1; i<=weekCount; i++){
        let endTimeStamps = new Date(startDate).getTime() + 6*24*60*60*1000
        let shortstart = this.formatTimeStamp(startDate, 'MM月dd日')
        let shortend = this.formatTimeStamp(endTimeStamps, 'MM月dd日')
        let fullstart = this.formatTimeStamp(startDate, 'yyyy-MM-dd')
        let fullend = this.formatTimeStamp(endTimeStamps, 'yyyy-MM-dd')
        let startyear = this.formatTimeStamp(startDate, 'yyyy')
        let startMonth = this.formatTimeStamp(startDate, 'MM')
        let endyear = this.formatTimeStamp(endTimeStamps, 'yyyy')
        let endMonth = this.formatTimeStamp(endTimeStamps, 'MM')
        let weekDateItem = {
          name: shortstart + '~' + shortend,
          shortstart,
          shortend,
          fullstart,
          fullend,
          startyear,
          startMonth,
          endyear,
          endMonth,
        }
        weekDateArr.push(weekDateItem)
        startDate = endTimeStamps + oneDateTimeStamp
      }

      console.log(weekDateArr)
      return weekDateArr
    },

    init() {
      this.renderMonths()
      this.renderWeekDate()
      this.$nextTick(()=>{
        console.log('monthListElem height',this.monthListElem.offsetHeight)
        console.log('dateListElem height',this.dateListElem.offsetHeight)
        this.dateListElem.scrollTop = 20000
        this.dateListElem.addEventListener('scroll', function(ev){
          console.log(this.scrollTop)
        })
      })
    }
  },
  created() {
  },
  mounted() {
    this.monthListElem = this.$refs['monthList']
    this.dateListElem = this.$refs['dateList']
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
    .year{
      color: #3F3F3F;
      font-family:PingFangSC-Semibold,PingFang SC;
      height: 40px;
      text-align: right;
      line-height: 40px;
      padding-right: 20px;
    }
    .months{
      >li{
        height: 40px;
        line-height: 40px;
        padding-right: 20px;
        text-align: right;
        color: #8A9199;
        background-color: #F8F8F8;
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
    .date-list{
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
      }
    }
  }
}
</style>
