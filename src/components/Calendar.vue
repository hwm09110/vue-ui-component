<template>
  <div class="calendar-wrap">
    <div class="header">
      <div class="left">
        <span class="prev-month" @click="handlePrevMonth"><</span>
      </div>
      <div class="middle">
        <span class="now-month">{{switchYear}}年{{switchMonth}}月</span>
      </div>
      <div class="right">
        <span class="prev-month" @click="handleNextMonth" v-show="canUseFutureMonth">></span>
      </div>
    </div>
    <div class="weeks">
      <span v-for="(week, index) of weeks" :key="index">{{week}}</span>
    </div>
    <div class="days">
      <div class="day-item prev-month-day" v-for="(dayItem) of prevMonthDays" :key="dayItem.key" @click="handleDayClick(dayItem)">
        <span class="number">{{dayItem.day}}</span>
      </div>
      <div :class="['day-item', {'curDate': dayItem.curDate},{'checked': dayItem.checked}, {'disabled': dayItem.disabled}]"  v-for="(dayItem) of curMonthDays" :key="dayItem.key" @click="handleDayClick(dayItem)">
        <span class="number">{{dayItem.day}}</span>
      </div>
      <div class="day-item next-month-day" v-for="(dayItem) of nextMonthDays" :key="dayItem.key" @click="handleDayClick(dayItem)">
        <span class="number">{{dayItem.day}}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Calendar",
  data() {
    return {
      daysCount:42, //总展示天数
      weeks:['日','一','二','三','四','五','六',],
      //当前月份日期
      curMonthDays: [], 
      //当前月份的前一个月日期
      prevMonthDays: [], 
      //当前月份的下一个月日期
      nextMonthDays: [], 
      switchYear:new Date().getFullYear(), //当前切换到的年
      switchMonth:(new Date().getMonth() + 1), //当前切换到的月

      // 当前日期
      curYear: new Date().getFullYear(),
      curMonth: (new Date().getMonth() + 1),
      curDate: new Date().getDate(),

      //带标记日期
      markDate:[],

      //是否可以操作当前月份的下个月
      canUseFutureMonth: false,

      //当天之后日期禁用
      disabledCurDateNext: true,

    }
  },
  watch: {
    switchYear(newVal) {
      this.canUseFutureMonth = this.curYear >= newVal 
    },
    switchMonth(newVal) {
      if(this.switchYear == this.curYear){
        this.canUseFutureMonth = this.curMonth > newVal
      }
    }
  },
  methods: {

    formatNum(num) {
      return num < 10 ? `0${num}` : num
    },

    //获取上一个月
    getPrevYearAndMonth(nowYear, nowMonth) {
      let prevMonth = nowMonth - 1 > 0 ? (nowMonth - 1) : 12
      let prevYear = prevMonth == 12 ? (nowYear - 1) : nowYear
      return {prevYear, prevMonth}
    },

    //获取下一个月
    getNextYearAndMonth(nowYear, nowMonth) {
      let nextMonth = +nowMonth + 1 <= 12 ? (+nowMonth + 1) : 1
      let nextYear = nextMonth == 1 ? (nowYear + 1) : nowYear
      return {nextYear, nextMonth}
    },

    //切换上个月
    handlePrevMonth() {
      let { prevYear, prevMonth } = this.getPrevYearAndMonth(this.switchYear, this.switchMonth)

      this.switchYear = prevYear
      this.switchMonth = this.formatNum(prevMonth)
      this.renderDays(prevYear, prevMonth)
    },

    //切换下个月
    handleNextMonth() {
      let { nextYear, nextMonth} = this.getNextYearAndMonth(this.switchYear, this.switchMonth)

      this.switchYear = nextYear
      this.switchMonth = this.formatNum(nextMonth)
      this.renderDays(nextYear, nextMonth)
    },

    //点击选择日期（单选）
    handleDayClick(dayItem) {
      const { year, month, day } = dayItem
      console.log(`${year}-${month}-${day}`)
      
      //当前月份的日期单选
      if(dayItem.checked !== undefined && !dayItem.disabled){
        this.curMonthDays.forEach(item => {
          if(item.day == dayItem.day){
            item.checked = true
          }else{
            item.checked = false
          }
        })
      }
    },

    //获取某年某月有几天
    getMonthDayCount(year, month) {
      return new Date(year, month, 0).getDate()
    },

    //获取某年某月1号是星期几
    getWeekOfFistDate(year, month) {
      return new Date(`${year}-${month}-1`).getDay()
    },

    // 渲染日期
    renderDays(year,month) {
      let curDateWeek  = this.getWeekOfFistDate(year, month)
      console.log('当月1号星期几:'+this.weeks[curDateWeek] + ','+curDateWeek)

      let {prevYear, prevMonth} = this.getPrevYearAndMonth(year, month)
      let {nextYear, nextMonth} = this.getNextYearAndMonth(year, month)

      let curMonthLen = this.getMonthDayCount(year, month)
      let prevMonthLen = this.getMonthDayCount(prevYear, prevMonth)
      let nextMonthLen = this.getMonthDayCount(nextYear, nextMonth)
      console.log('当前月有几天：'+curMonthLen)
      console.log('上个月有几天：'+prevMonthLen)
      console.log('下个月有几天：'+nextMonthLen)
      
      let curMonthNumber = Array.from({length: curMonthLen}, (i,n) =>  n + 1)
      let prevMonthNumber = Array.from({length: prevMonthLen}, (i,n) =>  n + 1)
      let nextMonthNumber = Array.from({length: nextMonthLen}, (i,n) =>  n + 1)
      console.log('当前月日期：'+curMonthNumber)
      console.log('上个月日期：'+prevMonthNumber)
      console.log('下个月日期：'+nextMonthNumber)

      this.curMonthDays = curMonthNumber.map(item=>{
        return {
          year,
          month,
          day: item,
          key:`cur${item}`,
          checked: false,
          curDate: this.curYear == year && this.curMonth == month && item == this.curDate ? true : false,
          disabled: this.curYear == year && this.curMonth == month && this.disabledCurDateNext && item > this.curDate
        }
      })
      
      this.prevMonthDays = curDateWeek > 0 ? prevMonthNumber.slice(-curDateWeek).map(item=>{
        return {
          year: prevYear,
          month: prevMonth,
          day: item,
          key:`prev${item}`
        }
      }) : []

      this.nextMonthDays = nextMonthNumber.slice(0, this.daysCount - curMonthLen - curDateWeek).map(item=>{
        return {
          year: nextYear,
          month: nextMonth,
          day: item,
          key:`next${item}`
        }
      })
      console.log('渲染prev:',this.prevMonthDays)
      console.log('渲染cur:',this.curMonthDays)
      console.log('渲染next:',this.nextMonthDays)
    },

    init() {
      this.renderDays(this.curYear, this.curMonth)
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.calendar-wrap{
  border:1px solid #ddd;
  font-size: 14px;
  text-align: center;
  .header{
    display: flex;
    height: 35px;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    .left{
      width: 15%;
    }
    .middle{
      width: 70%;
      text-align: center;
    }
    .right{
      width: 15%;
    }
  }
  .weeks{
    display: flex;
    height: 30px;
    align-items: center;
    >span{
      width: calc(100%/7);
      text-align: center;
      font-weight: bold;
    }
  }
  .days{
    display: flex;
    flex-wrap: wrap;
    .day-item{
      width: calc(100%/7);
      height: 35px;
      line-height: 35px;
      color: #000;
      &.prev-month-day,
      &.next-month-day,
      &.disabled{
        color: #999;
      }
      &.checked,
      &.curDate{
        .number{
          display: inline-block;
          color: #fff;
          background-color: #47AEFE;
          font-weight: 500;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 100%;
        }
      }
    }
  }
}
</style>

