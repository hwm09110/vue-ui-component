<template>
  <div style="padding-top:50px; ">
    <Calendar2 ref="calendar"></Calendar2>
    <ChooseWeekDate style="border-top:1px solid #dcdcdc;" />
    <ChooseMonth style="border-top:1px solid #dcdcdc; margin-top:20px;" />
  </div>
</template>

<script>
import Calendar2 from "@c/Calendar2";
import ChooseWeekDate from "@c/ChooseWeekDate";
import ChooseMonth from "@c/ChooseMonth";
export default {
  name: "MyCalendar",
  components: {
    Calendar2,
    ChooseWeekDate,
    ChooseMonth,
  },
  methods: {},
  mounted() {
    console.log(this.$refs["calendar"]);
  },
};
</script>
