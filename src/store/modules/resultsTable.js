export default {
  namespaced: true,
  state: {
    headers: [],
    resultsTableData: [],
  },
  mutations: {
    SET_RESULTS_TABLE_DATA(state, payload) {
      state.resultsTableData = payload;
    },
    SET_HEADERS(state, payload) {
      state.headers = payload;
    },
  },
};
