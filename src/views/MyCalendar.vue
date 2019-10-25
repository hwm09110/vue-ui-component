<template>
    <Calendar2 ref="calendar"></Calendar2>
</template>


<script>
import Calendar2 from "@c/Calendar2"
export default {
    name: "MyCalendar",
    components:{
        Calendar2
    },
    methods:{
    },
    mounted() {
      console.log(this.$refs['calendar'])
    }
}
</script>
