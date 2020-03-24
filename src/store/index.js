import Vue from "vue";
import Vuex from "vuex";
import inputCode from "./modules/inputCode";
import errorTable from "./modules/errorTable";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { inputCode, errorTable }
});
