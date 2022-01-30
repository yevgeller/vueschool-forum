import { defineRule } from "vee-validate";

export default () => {
  defineRule("required", (value) => {
    if (value && value.trim()) return true;
    return "This is required";
  });
};
