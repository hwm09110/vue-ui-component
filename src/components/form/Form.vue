<template>
  <div class="form-wrap">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      formItems: [],
    };
  },
  props: {
    model: {
      type: Object,
    },
    rules: {
      type: Object,
    },
  },
  provide() {
    return { form: this };
  },
  created() {
    this.$on("formItemAdd", (formItem) => {
      if (formItem) {
        this.formItems.push(formItem);
      }
    });
    this.$on("formItemRemove", (formItem) => {
      if (formItem) {
        this.formItems.splice(this.formItems.indexOf(formItem), 1);
      }
    });
  },
  methods: {
    resetFields() {
      this.formItems.forEach((field) => field.resetField());
    },
    validate(cb) {
      return new Promise((resolve) => {
        let valid = true,
          count = 0;
        this.formItems.forEach((field) => {
          field.validate("", (error) => {
            if (error) valid = false;
            if (++count === this.fields.length) {
              resolve(valid);
              if (typeof cb === "function") cb(valid);
            }
          });
        });
      });
    },
  },
};
</script>
