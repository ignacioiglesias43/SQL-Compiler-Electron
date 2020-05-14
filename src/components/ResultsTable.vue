<template>
  <v-container fluid>
    <v-data-table
      :headers="headerText"
      :items="data"
      hide-default-footer
      disable-pagination
    >
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "ResultsTable",
  computed: {
    ...mapState("resultsTable", ["resultsTableData", "headers"]),
    ...mapMutations("resultsTable", ["SET_RESULTS_TABLE_DATA", "SET_HEADERS"]),
    data: {
      get() {
        return this.resultsTableData;
      },
      set(newData) {
        this.SET_RESULTS_TABLE_DATA(newData);
      },
    },
    headerText: {
      get() {
        return this.headers;
      },
      set(newData) {
        this.SET_HEADERS(newData);
      },
    },
  },
};
</script>
