import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import { required, email, min } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import firebase from "firebase";
export default (app) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("unique", async (value) => {
    const querySnapshot = await firebase
      .firestore()
      .collection("users")
      .where("username", "==", value)
      .get();
    return querySnapshot.empty;
  });
  configure({
    generateMessage: localize("en", {
      messages: {
        required: "{field} is required",
        email: "{field} must be a valid email",
        min: "{field} must be 0:{min} characters long",
        unique: "{field} is already taken",
      },
    }),
  });
  app.component("VeeForm", Form);
  app.component("VeeField", Field);
  app.component("VeeErrorMessage", ErrorMessage);
};
