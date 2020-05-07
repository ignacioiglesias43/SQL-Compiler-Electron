export default {
  namespaced: true,
  state: {
    sampleText: `CREATE TABLE DEPARTAMENTOS(
D# CHAR(2) NOT NULL,
DNOMBRE CHAR(6) NOT NULL,
CONSTRAINT PK_DEPARTAMENTOS PRIMARY KEY (D#));`,
  },
  mutations: {
    SET_SAMPLE_TEXT(state, payload) {
      state.sampleText = payload;
    },
  },
};
