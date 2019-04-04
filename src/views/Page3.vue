<template>
    <HtTree :id="2" @test="handleTest"/>
</template>


<script>
import HtTree from "@c/HtTree"
export default {
    name: "Page2",
    components:{
        HtTree
    },
    methods:{
        handleTest() {
            console.log('test')
        },
    }
}
</script>
