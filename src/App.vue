<template>
  <v-app>
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
      <v-btn icon @click="compile">
        <v-icon>mdi-play</v-icon>
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
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  components: {
    InputCode,
    ErrorTable,
  },
  computed: {
    ...mapState("inputCode", ["sampleText"]),
    ...mapState("errorTable", ["errorTableData"]),
    value() {
      return this.sampleText;
    },
  },
  methods: {
    ...mapMutations("errorTable", ["SET_ERROR_TABLE_DATA"]),
    compile(event) {
      event.preventDefault();
      const result = Parser.algorithm(Scanner.scan(this.value));
      this.SET_ERROR_TABLE_DATA(result);
    },
  },
};
</script>
