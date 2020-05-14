export default {
  namespaced: true,
  state: {
    sampleText: ``,
  },
  mutations: {
    SET_SAMPLE_TEXT(state, payload) {
      state.sampleText = payload;
    },
  },
};
