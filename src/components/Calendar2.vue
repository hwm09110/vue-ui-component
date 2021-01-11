<template>
  <div class="calendar-wrap">
    <div class="header">
      <div class="choosed-date">
        <span class="prev-month" @click="handlePrevMonth"></span>
        <span class="now-month">{{ switchYear }}年{{ switchMonth }}月</span>
        <span
          class="next-month"
          @click="handleNextMonth"
          v-show="canUseFutureMonth"
        ></span>
      </div>
    </div>
    <div class="weeks">
      <span v-for="(week, index) of weeks" :key="index">{{ week }}</span>
    </div>
    <div class="days">
      <div
        class="day-item prev-month-day"
        v-for="dayItem of prevMonthDays"
        :key="dayItem.key"
        @click="handleDayClick(dayItem)"
      >
        <span v-show="showNoCurMonthDate" class="number">{{
          dayItem.day
        }}</span>
      </div>
      <div
        :class="[
          'day-item',
          { checked: dayItem.checked },
          { disabled: dayItem.disabled },
          { usableDate: dayItem.useable },
        ]"
        v-for="dayItem of curMonthDays"
        :key="dayItem.key"
        @click="handleDayClick(dayItem)"
      >
        <span class="number">{{ dayItem.day }}</span>
      </div>
      <div
        v-show="showNoCurMonthDate"
        class="day-item next-month-day"
        v-for="dayItem of nextMonthDays"
        :key="dayItem.key"
        @click="handleDayClick(dayItem)"
      >
        <span class="number">{{ dayItem.day }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    return {
      daysCount: 42, //总展示天数
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      //当前月份日期
      curMonthDays: [],
      //当前月份的前一个月日期
      prevMonthDays: [],
      //当前月份的下一个月日期
      nextMonthDays: [],
      switchYear: new Date().getFullYear(), //当前切换到的年
      switchMonth: new Date().getMonth() + 1, //当前切换到的月

      // 当前日期
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      curDate: new Date().getDate(),

      // 最多可以选择7天
      dateLimit: 7,

      //选中的日期数组，默认最近7天
      checkedDates: [],

      //推荐可选的日期
      usableDates: [],

      //是否可以操作当前月份的下个月
      canUseFutureMonth: true,

      //当天之后日期禁用
      disabledCurDateNext: true,

      //是否显示上下月分的部分日期
      showNoCurMonthDate: false,
    };
  },
  watch: {
    switchYear(newVal) {
      // this.canUseFutureMonth = this.curYear >= newVal
    },
    switchMonth(newVal) {
      if (this.switchYear == this.curYear) {
        // this.canUseFutureMonth = this.curMonth > newVal
      }
    },
  },
  methods: {
    formatNum(num) {
      return num < 10 ? `0${num}` : num;
    },

    formatTimeStamp(timeStamp) {
      let oDate = new Date(timeStamp);
      let year = oDate.getFullYear();
      let month = oDate.getMonth() + 1;
      let date = oDate.getDate();
      return `${year}-${this.formatNum(month)}-${this.formatNum(date)}`;
    },

    //获取最近7天
    getRecentlySevendays() {
      let days = [];
      let oneDayMillisecond = 86400000; //一天毫秒数
      let oDate = new Date();
      let nowTimeStamp = oDate.getTime();

      for (let i = 0; i < this.dateLimit; i++) {
        days.push(this.formatTimeStamp(nowTimeStamp - oneDayMillisecond * i));
      }
      console.log(days);
      return days;
    },

    //生成两个起止日期之间的日期数组
    generateRangeDate(bdate, edate) {
      let oneDayMillisecond = 86400000; //一天毫秒数
      let diffMillisecond =
        new Date(bdate).getTime() - new Date(edate).getTime();
      let diffDays = Math.floor(Math.abs(diffMillisecond / oneDayMillisecond));
      let startDate = diffMillisecond > 0 ? new Date(edate) : new Date(bdate);
      let start_y = startDate.getFullYear();
      let start_m = startDate.getMonth() + 1;
      let start_d = startDate.getDate();
      let date_arr = [];

      while (diffDays > 0) {
        date_arr.push();
      }
    },

    // 生成点击日期两边可待选择的日期
    generateUsableDate(referDate) {
      let oneDayMillisecond = 86400000; //一天毫秒数
      let prevDateMillisecond =
        new Date(referDate).getTime() - oneDayMillisecond;
      let nextDateMillisecond =
        new Date(referDate).getTime() + oneDayMillisecond;

      let prevDate = this.formatTimeStamp(prevDateMillisecond);
      let nextDate =
        nextDateMillisecond >= new Date().getTime()
          ? ""
          : this.formatTimeStamp(nextDateMillisecond); //排除当前日期之后的

      let usableDates = [];

      console.log("待选prevDate", prevDate);
      console.log("待选nextDate", nextDate);
      console.log("已选好日期", this.checkedDates);

      //如果已经选择了7天
      if (this.checkedDates.length >= this.dateLimit) {
        return usableDates;
      }
      //不在已经选中的日期中
      if (nextDate && !this.checkDateIsExist(nextDate, this.checkedDates)) {
        usableDates.push(nextDate);
      }
      if (prevDate && !this.checkDateIsExist(prevDate, this.checkedDates)) {
        usableDates.push(prevDate);
      }

      return usableDates;
    },

    // 判断dateArr中是否有date
    checkDateIsExist(date, dateArr) {
      return dateArr.some((dateItem) => {
        return new Date(date).getTime() == new Date(dateItem).getTime();
      });
    },

    //判断两个日期是否相同
    isSameDate(date1, date2) {
      return new Date(date1).getTime() == new Date(date2).getTime();
    },

    //点击选择日期（单选）
    handleDayClick(dayItem) {
      const { year, month, day } = dayItem;
      let nowClickDateStr = `${year}-${this.formatNum(month)}-${this.formatNum(
        day
      )}`;
      console.log("当前点击日期", nowClickDateStr);

      //点击当前月份的日期
      if (dayItem.checked !== undefined && !dayItem.disabled) {
        //如果已经选好了7天，先清空，再存当前点击的
        if (this.checkedDates.length == this.dateLimit) {
          this.checkedDates = [nowClickDateStr];
        } else {
          this.checkedDates.push(nowClickDateStr);
        }

        //如果已经选择好了 7 天
        if (this.checkedDates.length >= this.dateLimit) {
          this.usableDates = [];
        } else {
          //如果已存在推荐可选日期，但点击的日期不是推荐日期，则从新生成推荐日期
          if (
            this.usableDates.length > 0 &&
            !this.checkDateIsExist(nowClickDateStr, this.usableDates)
          ) {
            this.usableDates = [];
            this.checkedDates = [nowClickDateStr];
            this.usableDates.push(...this.generateUsableDate(nowClickDateStr)); //找到推荐可选日期
          } else {
            this.usableDates.push(...this.generateUsableDate(nowClickDateStr)); //找到推荐可选日期
            // 当前点击的日期已经推荐可选列表里面，则剔除
            if (this.checkDateIsExist(nowClickDateStr, this.usableDates)) {
              this.usableDates = this.usableDates.filter(
                (usableDate) => !this.isSameDate(usableDate, nowClickDateStr)
              );
            }
          }
        }
        console.log("找到推荐可选日期", this.usableDates);

        this.renderDays(this.switchYear, this.switchMonth * 1); //重新渲染全部日期
      }
    },

    //获取上一个月
    getPrevYearAndMonth(nowYear, nowMonth) {
      let prevMonth = nowMonth - 1 > 0 ? nowMonth - 1 : 12;
      let prevYear = prevMonth == 12 ? nowYear - 1 : nowYear;
      return { prevYear, prevMonth };
    },

    //获取下一个月
    getNextYearAndMonth(nowYear, nowMonth) {
      let nextMonth = +nowMonth + 1 <= 12 ? +nowMonth + 1 : 1;
      let nextYear = nextMonth == 1 ? nowYear + 1 : nowYear;
      return { nextYear, nextMonth };
    },

    //切换上个月
    handlePrevMonth() {
      let { prevYear, prevMonth } = this.getPrevYearAndMonth(
        this.switchYear,
        this.switchMonth
      );

      this.switchYear = prevYear;
      this.switchMonth = this.formatNum(prevMonth);
      this.renderDays(prevYear, prevMonth);
    },

    //切换下个月
    handleNextMonth() {
      let { nextYear, nextMonth } = this.getNextYearAndMonth(
        this.switchYear,
        this.switchMonth
      );

      this.switchYear = nextYear;
      this.switchMonth = this.formatNum(nextMonth);
      this.renderDays(nextYear, nextMonth);
    },

    //获取某年某月有几天
    getMonthDayCount(year, month) {
      return new Date(year, month, 0).getDate();
    },

    //获取某年某月1号是星期几
    getWeekOfFistDate(year, month) {
      return new Date(`${year}/${month}/1`).getDay();
    },

    // 渲染日期
    renderDays(year, month) {
      let curDateWeek = this.getWeekOfFistDate(year, month);
      console.log(
        "当月1号星期几:" + this.weeks[curDateWeek] + "," + curDateWeek
      );

      let { prevYear, prevMonth } = this.getPrevYearAndMonth(year, month);
      let { nextYear, nextMonth } = this.getNextYearAndMonth(year, month);

      let curMonthLen = this.getMonthDayCount(year, month);
      let prevMonthLen = this.getMonthDayCount(prevYear, prevMonth);
      let nextMonthLen = this.getMonthDayCount(nextYear, nextMonth);
      console.log("当前月有几天：" + curMonthLen);
      console.log("上个月有几天：" + prevMonthLen);
      console.log("下个月有几天：" + nextMonthLen);

      let curMonthNumber = Array.from({ length: curMonthLen }, (i, n) => n + 1);
      let prevMonthNumber = Array.from(
        { length: prevMonthLen },
        (i, n) => n + 1
      );
      let nextMonthNumber = Array.from(
        { length: nextMonthLen },
        (i, n) => n + 1
      );
      console.log("当前月日期：" + curMonthNumber);
      console.log("上个月日期：" + prevMonthNumber);
      console.log("下个月日期：" + nextMonthNumber);

      this.curMonthDays = curMonthNumber.map((item) => {
        let isDisabled = false;
        if (this.disabledCurDateNext) {
          if (
            this.curYear == year &&
            this.curMonth == month &&
            item > this.curDate
          ) {
            isDisabled = true;
          } else if (this.curYear == year && this.curMonth < month) {
            isDisabled = true;
          } else if (this.curYear < year) {
            isDisabled = true;
          }
        }

        return {
          year,
          month,
          day: item,
          key: `cur${item}`,
          checked: false,
          useable: false, //推荐可选日期
          curDate:
            this.curYear == year &&
            this.curMonth == month &&
            item == this.curDate
              ? true
              : false,
          disabled: isDisabled,
        };
      });

      this.prevMonthDays =
        curDateWeek > 0
          ? prevMonthNumber.slice(-curDateWeek).map((item) => {
              return {
                year: prevYear,
                month: prevMonth,
                day: item,
                key: `prev${item}`,
              };
            })
          : [];

      this.nextMonthDays = nextMonthNumber
        .slice(0, this.daysCount - curMonthLen - curDateWeek)
        .map((item) => {
          return {
            year: nextYear,
            month: nextMonth,
            day: item,
            key: `next${item}`,
          };
        });

      // 根据 checkedDates 选中日期
      this.curMonthDays.forEach((item) => {
        let curDate = `${item.year}-${this.formatNum(
          item.month
        )}-${this.formatNum(item.day)}`;
        this.checkedDates.forEach((checkedDate) => {
          if (new Date(curDate).getTime() === new Date(checkedDate).getTime()) {
            item.checked = true;
          }
        });
      });

      //根据 usableDates 推荐可选日期
      this.curMonthDays.forEach((item) => {
        let curDate = `${item.year}-${this.formatNum(
          item.month
        )}-${this.formatNum(item.day)}`;
        this.usableDates.forEach((date) => {
          if (new Date(curDate).getTime() === new Date(date).getTime()) {
            item.useable = true;
          }
        });
      });

      console.log("渲染cur:", this.curMonthDays);
      console.log("渲染prev:", this.prevMonthDays);
      console.log("渲染next:", this.nextMonthDays);
    },

    init() {
      this.checkedDates = this.getRecentlySevendays();
      this.renderDays(this.curYear, this.curMonth);
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.calendar-wrap {
  border: 1px solid #ddd;
  font-size: 14px;
  text-align: center;
  .header {
    height: 45px;
    font-weight: bold;
    border-bottom: 1px solid #dddddd;
    .choosed-date {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .now-month {
        margin: 0 30px;
        font-size: 16px;
      }
      .prev-month {
        display: inline-block;
        width: 0;
        height: 0;
        border: 8px solid;
        border-color: transparent #47aefe transparent transparent;
      }
      .next-month {
        display: inline-block;
        width: 0;
        height: 0;
        border: 8px solid;
        border-color: transparent transparent transparent #47aefe;
      }
    }
  }
  .weeks {
    display: flex;
    height: 30px;
    align-items: center;
    > span {
      width: calc(100% / 7);
      text-align: center;
      font-weight: bold;
    }
  }
  .days {
    display: flex;
    flex-wrap: wrap;
    .day-item {
      width: calc(100% / 7);
      height: 35px;
      line-height: 35px;
      color: #3f3f3f;
      &.prev-month-day,
      &.next-month-day,
      &.disabled {
        color: #abb1b8;
      }
      &.checked,
      &.curDate {
        .number {
          display: inline-block;
          color: #fff;
          background: linear-gradient(
            311deg,
            rgba(71, 174, 254, 1) 0%,
            rgba(71, 209, 254, 1) 100%
          );
          font-weight: 500;
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 100%;
        }
      }
      &.usableDate {
        .number {
          display: inline-block;
          color: #3f3f3f;
          background-color: rgba(71, 209, 254, 0.5);
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
