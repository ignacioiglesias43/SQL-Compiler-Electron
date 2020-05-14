<template>
  <v-container fluid>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Tipo</th>
            <th class="text-left">Código</th>
            <th class="text-left">Valor</th>
            <th class="text-left">Línea</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="error in errors" :key="errors.indexOf(error)">
            <td>{{ error.type }}</td>
            <td>{{ error.code }}</td>
            <td>{{ error.value }}</td>
            <td>{{ error.line }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "ErrorTable",
  computed: {
    ...mapState("errorTable", ["errorTableData"]),
    ...mapMutations("errorTable", ["SET_ERROR_TABLE_DATA"]),
    errors: {
      get() {
        return this.errorTableData;
      },
      set(error) {
        this.SET_ERROR_TABLE_DATA(error);
      },
    },
  },
};
</script>
