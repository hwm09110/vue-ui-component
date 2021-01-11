<template>
  <transition name="fade">
    <div class="message" v-show="show">
      {{message}}
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ""
    }
  },
}
</script>

<style lang="scss" scoped>
  .message{
    font-size: 14px;
    line-height: 2;
    color: #fff;
    padding: 2px 10px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translateX(-50%);
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity .3s
  }
  .fade-enter,
  .fade-leave-to{
    opacity: 0
  }
</style>
