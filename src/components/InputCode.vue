<template>
  <v-container fluid>
    <v-textarea :height="height" filled no-resize outlined :value="value" />
  </v-container>
</template>

<script>
export default {
  name: "InputCode",
  data: () => ({
    value: `SELECT ANOMBRE, CALIFICACION, TURNO FROM ALUMNOS, INSCRITOS, MATERIAS,
CARRERAS WHERE MNOMBRE = 'LENAUT2' AND TURNO = 'TM' AND CNOMBRE='ISC'
AND SEMESTRE='2017II' AND CALIFICACION >=70`,
    height: "300"
  })
};
</script>
