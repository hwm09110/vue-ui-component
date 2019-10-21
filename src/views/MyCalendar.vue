<template>
    <Calendar></Calendar>
</template>


<script>
import Calendar from "@c/Calendar"
export default {
    name: "MyCalendar",
    components:{
        Calendar
    },
    methods:{
        handleTest() {
            console.log('test')
        },
    }
}
</script>
