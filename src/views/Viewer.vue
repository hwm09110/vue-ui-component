<template>
  <div class="stage-box">
    <div id="square" class="img-box"></div>
  </div>
</template>


<script>
import PinchZoom from 'pinch-zoom-js'
export default {
  name: "Viewer",
  data() {
    return {
      hammerInstance: null
    }
  },
  methods:{
  },
  mounted() {
    this.$nextTick(() => {
      let square = document.querySelector('#square');
      let options = {
        // draggableUnzoomed: false,
        verticalPadding: 20,
        horizontalPadding: 20,
        minZoom: 0.5,
      };
      setTimeout(()=>{
        let pz = new PinchZoom(square, options);
      }, 4000);
    });
  }

}
</script>

<style lang="scss" scoped>
.stage-box{
  width: 100vw;
  height: 100vh;
  background-color: #f1f1f1;
  border: 1px solid #dcdcdc;
  .img-box{
    background: blue;
    width: 150px;
    height: 150px;
    // transition: transform 300ms ease-out;
  }
}
</style>

