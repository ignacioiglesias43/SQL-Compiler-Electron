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
      <Error-Table />
    </v-content>
  </v-app>
</template>
<script>
import InputCode from "./components/InputCode";
import ErrorTable from "./components/ErrorTable";
import Scanner from "../src/compiler/scanner";
import Parser from "../src/compiler/parser";
import Semantic from "../src/compiler/semantic.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  data: () => ({
    showTable: false,
  }),
  components: {
    InputCode,
    ErrorTable,
  },
  computed: {
    ...mapState("inputCode", ["sampleText"]),
    ...mapState("errorTable", ["errorTableData"]),
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
    compile(event) {
      event.preventDefault();
      const scan = Scanner.scan(this.value);
      const result = Parser.algorithm(scan);
      const sm = Semantic.fillTables(scan.tokens);
      console.log(scan.tokens);
      console.log(sm);
      this.SET_ERROR_TABLE_DATA(result);
    },
    deleteText(event) {
      event.preventDefault();
      this.SET_SAMPLE_TEXT("");
    },
  },
};
</script>
