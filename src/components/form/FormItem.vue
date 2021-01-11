<template>
  <div class="ht-form-item">
    <label
      :for="labeFor"
      v-if="label"
      :class="{ 'label-require': isRequired }"
      >{{ label }}</label
    >
    <slot></slot>
    <div class="error-msg" v-show="showError">{{ errorMsg }}</div>
  </div>
</template>

<script>
import emitter from "@/mixins/emitter.js";
import AsyncValidator from "async-validator";
export default {
  name: "FormItem",
  mixins: [emitter],
  inject: ["form"],
  props: {
    label: {
      type: String,
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      labeFor: `input_${Date.now()}`,
      isRequired: false, //是否必填
      showError: false, //显示错误提示
      errorMsg: "", //错误提示
      initValue: "", //初始值
    };
  },
  computed: {
    fieldValue() {
      return this.form.model[this.prop];
    },
  },
  mounted() {
    if (this.prop) {
      this.dispatch("Form", "formItemAdd", this);
      this.setRules();
      this.initValue = this.fieldValue;
    }
  },
  beforeDestroy() {
    // 组件销毁时，从from组件缓存移除
    this.dispatch("Form", "formItemRemove", this);
  },
  methods: {
    // 注册触发规则校验
    setRules() {
      let rules = this.getRules();
      if (rules.length) {
        rules.forEach((rule) => {
          if (rule.required !== undefined) this.isRequired = rule.required;
        });
      }
      this.$on("form-blur", this.onFieldBlur);
      this.$on("form-change", this.onFieldChange);
    },
    // 获取该表单项的校验规则
    getRules() {
      let formRules = this.form.rules;
      formRules = formRules ? formRules[this.prop] : [];
      return formRules;
    },
    // 过滤出符合要求的 rule 规则
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules.filter(
        (rule) => !rule.trigger || rule.trigger.indexOf(trigger) !== -1
      );
    },
    // 校验方法
    validate(trigger, cb) {
      let rules = this.getFilteredRule(trigger);
      if (!rules || rules.length === 0) return true;
      // 使用 async-validator 表单异步校验的库
      const validator = new AsyncValidator({ [this.prop]: rules });
      let model = { [this.prop]: this.fieldValue };
      validator.validate(model, { firstFields: true }, (errors) => {
        this.showError = errors ? true : false;
        this.errorMsg = errors ? errors[0].message : "";
        if (cb) cb(this.errorMsg);
      });
    },
    resetField() {
      this.errorMsg = "";
      this.form.model[this.prop] = this.initialValue;
    },
    onFieldBlur() {
      this.validate("blur");
    },
    onFieldChange() {
      this.validate("change");
    },
  },
};
</script>

<style lang="scss" scoped>
.ht-form-item {
  margin-bottom: 20px;
}
.label-require {
  &::before {
    content: "*";
    color: #ff0000;
  }
}
.error-msg {
  padding: 10px;
  color: #ff0000;
}
</style>
