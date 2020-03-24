export default {
  namespaced: true,
  state: {
    errorTableData: []
  },
  mutations: {
    SET_ERROR_TABLE_DATA(state, payload) {
      state.errorTableData = payload;
    }
  }
};
