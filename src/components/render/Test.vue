<script>
export default {
    name: "Test",
    props: {
      message: {
        type: String,
        default: "",
      }
    },
    methods:{
      handleToast(msg) {
        this.$toast(msg || "toast")
      },
    },
    render(h) {
      let newMsg = this.message + 'new';
      return (
        <div id="content" onClick={ ()=>{ this.handleToast(newMsg) } }>{ newMsg }<span></span></div>
      )
    }
}
</script>
