<template>
  <div>
    <ht-form ref="form" :model="formModel" :rules="formRules" class="form-box">
      <ht-form-item prop="name" label="姓名：">
        <ht-input v-model="formModel.name"></ht-input>
      </ht-form-item>
      <ht-form-item prop="age" label="年龄：">
        <ht-input v-model="formModel.age"></ht-input>
      </ht-form-item>
    </ht-form>
    <div class="operate">
      <button class="btn" @click="handleConfirm">确定</button>
      <button class="btn" @click="handleCancel">取消</button>
    </div>
  </div>
</template>

<script>
import Form from "@/components/form/Form";
import FormItem from "@/components/form/FormItem";
import Input from "@/components/Input";

export default {
  name: "ShowForm",
  components: {
    "ht-form": Form,
    "ht-form-item": FormItem,
    "ht-input": Input,
  },
  data() {
    return {
      formModel: {
        name: "张三",
        age: 20,
      },
      formRules: {
        name: [
          {
            type: "string",
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
        age: [
          {
            type: "number",
            required: true,
            message: "年龄不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    console.log("表单实例", this.$refs["form"]);
  },
  methods: {
    handleConfirm() {},
    handleCancel() {},
  },
};
</script>

<style lang="scss" scoped>
.form-box {
  padding: 20px;
  border: 1px solid #ddd;
  width: 500px;
  margin: 30px auto;
}
.operate {
  margin-top: 20px;
  .btn {
    width: 120px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 0 10px;
    text-align: center;
  }
}
</style>
