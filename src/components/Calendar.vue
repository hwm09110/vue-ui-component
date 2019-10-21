<template>
  <div class="calendar-wrap">
    <div class="header">
      <div class="left">
        <span class="prev-month" @click="handlePrevMonth"><</span>
      </div>
      <div class="middle">
        <span class="now-month">{{curYear}}年{{curMonth}}月</span>
      </div>
      <div class="right">
        <span class="prev-month" @click="handleNextMonth">></span>
      </div>
    </div>
    <div class="weeks">
      <span v-for="(week, index) of weeks" :key="index">{{week}}</span>
    </div>
    <div class="days">
      <div class="day-item prev-month-day" v-for="(dayItem, index) of prevMonthDays" :key="index">{{dayItem}}</div>
      <div class="day-item" v-for="(dayItem, index) of curMonthDays" :key="index">{{dayItem}}</div>
      <div class="day-item next-month-day" v-for="(dayItem, index) of nextMonthDays" :key="index">{{dayItem}}</div>
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
      curYear: new Date().getFullYear(),
      curMonth: (new Date().getMonth() + 1),
    }
  },
  methods: {

    //切换上个月
    handlePrevMonth() {
      let prevMonth = this.curMonth - 1 > 0 ? (this.curMonth - 1) : 12
      let prevYear = prevMonth == 12 ? (this.curYear - 1) : this.curYear

      this.curYear = prevYear
      this.curMonth = prevMonth
      this.renderDays(prevYear, prevMonth)
    },

    //切换下个月
    handleNextMonth() {},

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
      console.log('当月1号星期几:'+curDateWeek)

      let curMonthLen = this.getMonthDayCount(year, month)
      let prevMonthLen = this.getMonthDayCount(year, month -1)
      let nextMonthLen = this.getMonthDayCount(year, month + 1)
      console.log('当前月有几天：'+curMonthLen)
      console.log('上个月有几天：'+prevMonthLen)
      console.log('下个月有几天：'+nextMonthLen)
      
      let curMonthNumber = Array.from({length: curMonthLen}, (i,n) =>  n + 1)
      let prevMonthNumber = Array.from({length: prevMonthLen}, (i,n) =>  n + 1)
      let nextMonthNumber = Array.from({length: nextMonthLen}, (i,n) =>  n + 1)
      console.log('当前月日期：'+curMonthNumber)
      console.log('上个月日期：'+prevMonthNumber)
      console.log('下个月日期：'+nextMonthNumber)

      this.curMonthDays = curMonthNumber
      this.prevMonthDays = prevMonthNumber.slice(-curDateWeek)
      this.nextMonthDays = nextMonthNumber.slice(0, this.daysCount - curMonthLen - curDateWeek)
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
    }
  }
}
</style>

