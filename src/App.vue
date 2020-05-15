<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-app-bar app color="secondary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Compiler Logo"
          class="shrink mr-2"
          contain
          src="../src/assets/logo.png"
          transition="scale-transition"
          width="200"
        />
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="compile" :disabled="showRun">
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn icon @click="deleteText">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <Input-Code />
      <Results-Table v-if="showResults" />
      <Error-Table v-if="showTable" />
    </v-content>
  </v-app>
</template>
<script>
import InputCode from "./components/InputCode";
import ErrorTable from "./components/ErrorTable";
import ResultsTable from "./components/ResultsTable";
import Scanner from "../src/compiler/scanner";
import Parser from "../src/compiler/parser";
import * as Connection from "./compiler/utils/connection";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "App",
  data: () => ({
    showResults: false,
    showTable: false,
    cn: Connection.connection,
  }),
  components: {
    InputCode,
    ErrorTable,
    ResultsTable,
  },
  computed: {
    ...mapState("inputCode", ["sampleText"]),
    ...mapState("errorTable", ["errorTableData"]),
    ...mapState("resultsTable", ["resultsTableData"]),
    value: {
      get() {
        return this.sampleText;
      },
      set(newText) {
        this.SET_SAMPLE_TEXT(newText);
      },
    },
    showRun() {
      return this.sampleText.length <= 0;
    },
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  methods: {
    ...mapMutations("errorTable", ["SET_ERROR_TABLE_DATA"]),
    ...mapMutations("inputCode", ["SET_SAMPLE_TEXT"]),
    ...mapMutations("resultsTable", ["SET_RESULTS_TABLE_DATA", "SET_HEADERS"]),
    ...mapActions("resultsTable", ["setHeaders", "setResults"]),
    compile(event) {
      event.preventDefault();
      const scan = Scanner.scan(this.value);
      const result = Parser.algorithm(scan);
      this.SET_ERROR_TABLE_DATA([]);
      this.SET_ERROR_TABLE_DATA(result);
      this.showTable = true;
      if (result[2].code === 300) {
        this.showResults = true;
        let columnas = [];
        let filas = [];
        this.cn.query(this.value, (err, rows, fields) => {
          if (err) throw err;
          if (rows.length > 0) {
            fields.forEach((field) => {
              columnas.push({ text: field.name, value: field.name });
            });
            rows.forEach((row) => {
              let contCol = 0;
              let obj = {};
              columnas.forEach((columna) => {
                if (contCol < fields.length) {
                  obj[`${columna.value}`] = `${row[columna.value]}`;
                } else {
                  obj = {};
                  contCol = 0;
                }
                contCol === fields.length - 1 && filas.push(obj);
                contCol++;
              });
            });
            this.SET_HEADERS(columnas);
            this.SET_RESULTS_TABLE_DATA(filas);
          }
        });
      } else {
        this.showResults = false;
      }
    },
    deleteText(event) {
      event.preventDefault();
      this.SET_ERROR_TABLE_DATA([]);
      this.SET_SAMPLE_TEXT("");
      this.SET_HEADERS([]);
      this.SET_RESULTS_TABLE_DATA([]);
      this.showTable = false;
      this.showResults = false;
    },
  },
};
</script>
