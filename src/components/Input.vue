<template>
  <div class="ht-input">
    <input
      ref="input"
      :type="type"
      :value="currentValue"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>
<script>
import Emitter from "@/mixins/emitter.js";
export default {
  name: "Input",
  mixins: [Emitter],
  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
  watch: {
    value(value) {
      this.currentValue = value;
    },
  },
  data() {
    return {
      currentValue: this.value,
      id: this.label,
    };
  },
  mounted() {
    if (this.$parent.labelFor) {
      this.$refs.input.id = this.$parent.labelFor;
    }
  },
  methods: {
    handleInput(e) {
      const value = e.target.value;
      this.currentValue = value;
      this.$emit("input", value);
      this.dispatch("FormItem", "form-change", value);
    },
    handleBlur() {
      this.dispatch("FormItem", "form-blur", this.currentValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.ht-input {
  display: inline-block;
  > input {
    height: 30px;
    min-width: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding-left: 10px;
    outline: none;
  }
}
</style>
