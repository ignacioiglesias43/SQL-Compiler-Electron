<template>
  <codemirror ref="cmEditor" v-model="value" :options="cmOptions" />
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { codemirror } from "vue-codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-dark.css";
import "codemirror/mode/sql/sql";
export default {
  name: "InputCode",
  data: () => ({
    height: "300",
    cmOptions: {
      tabSize: 4,
      mode: "sql",
      theme: "base16-dark",
      lineNumbers: true,
      line: true,
    },
  }),
  components: {
    codemirror,
  },
  computed: {
    ...mapState("inputCode", ["sampleText"]),
    value: {
      get() {
        return this.sampleText;
      },
      set(newText) {
        this.SET_SAMPLE_TEXT(newText);
      },
    },
  },
  methods: {
    ...mapMutations("inputCode", ["SET_SAMPLE_TEXT"]),
  },
};
</script>
