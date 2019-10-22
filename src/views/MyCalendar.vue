<template>
    <Calendar ref="calendar"></Calendar>
</template>


<script>
import Calendar from "@c/Calendar"
export default {
    name: "MyCalendar",
    components:{
        Calendar
    },
    methods:{
    },
    mounted() {
      console.log(this.$refs['calendar'])
    }
}
</script>
