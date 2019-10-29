// 防抖
export function debounce(fn, wait, options) {
  let timer = null
  let canRun = true
  return function() {
    let context = this
    let args = arguments
    if(timer) {
      clearTimeout(timer)
    }
    if(options && options.immediate){
      timer = setTimeout(() => {
        canRun = true
      }, wait)  
      canRun && fn.apply(context, args)
      canRun = !canRun
    }else{
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }
}


//节流
export function throttle(fn, wait) {
  let previous = 0
  return function(){
    let now = Date.now()
    let context = this;
    let args = arguments;
    if(now - previous > wait){
      fn.apply(context, args)
      previous = now
    }
  }
}