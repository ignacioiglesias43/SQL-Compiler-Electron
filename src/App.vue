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
      <v-btn icon><v-icon>mdi-play</v-icon></v-btn>
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
export default {
  name: "App",

  components: {
    InputCode,
    ErrorTable
  },

  data: () => ({
    //
  })
};
</script>
