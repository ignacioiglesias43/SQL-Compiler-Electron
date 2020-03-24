export default {
  namespaced: true,
  state: {
    sampleText: `SELECT ANOMBRE, CALIFICACION, TURNO FROM ALUMNOS, INSCRITOS, MATERIAS,
CARRERAS WHERE MNOMBRE = 'LENAUT2' AND TURNO = 'TM' AND CNOMBRE = 'ISC'
AND SEMESTRE = '2017II' AND CALIFICACION >= 70`
  },
  mutations: {
    SET_SAMPLE_TEXT(state, payload) {
      state.sampleText = payload;
    }
  }
};
