export default {
  methods: {
    dispatch(componentName, eventName, params) {
      parent = this.$parent || this.$root;
      name = parent.$options.name;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    }
  }
}
