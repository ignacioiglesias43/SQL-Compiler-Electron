<template>
  <v-container fluid>
    <v-textarea :height="height" filled no-resize outlined v-model="value" />
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "InputCode",
  data: () => ({
    height: "300"
  }),
  computed: {
    ...mapState("inputCode", ["sampleText"]),
    value: {
      get() {
        return this.sampleText;
      },
      set(newText) {
        this.SET_SAMPLE_TEXT(newText);
      }
    }
  },
  methods: {
    ...mapMutations("inputCode", ["SET_SAMPLE_TEXT"])
  }
};
</script>
