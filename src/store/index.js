import { createStore } from "vuex";
import actions from "@/store/actions";
import getters from "@/store/getters";
import mutations from "@/store/mutations";
export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
    unsubscribes: [],
    authUserUnsubscribe: null,
  },
  actions,
  getters,
  mutations,
});
