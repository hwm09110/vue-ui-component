import Toast from './Toast.vue'

const HtToast = {
  install(Vue){
    const duration = 2000 //显示时长
    const animTime = 300

    function msg(msgContent) {
      const ToastConstructor = Vue.extend(Toast)
      let toast = new ToastConstructor()
      let vm = toast.$mount()
      let el = vm.$el
      document.body.appendChild(el) //把生成的提示的dom插入body中
      
      console.log('toast', toast)
      console.log('vm', vm)

      toast.message = msgContent
      vm.show = true
      let timer1 = setTimeout(() => {
        vm.show = false
        clearTimeout(timer1)
        let timer2 = setTimeout(() => {
          clearTimeout(timer2)
          document.body.removeChild(el)
  
          toast.$destroy()
          toast = null //设置为null，好让js垃圾回收算法回收，释放内存
        },animTime)
      },duration)
    }

    Vue.prototype.$toast = msg
  }
}

export default HtToast