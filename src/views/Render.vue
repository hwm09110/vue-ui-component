<template>
  <div>
    <Test :message="message"></Test>
  </div>
</template>


<script>
import Test from '@c/render/Test'
export default {
    name: "Render",
    components: {
      Test
    },
    data() {
      return {
        message: "哈哈哈"
      }
    },
    methods:{
      handleToast() {
        this.$toast("toast")
      },
    },
}
</script>
