<template>
  <Canvas :size="size" :vm="vm" />

  <div id="overlay">
    <div id="overlay-left">
      <Terminal
        :vm="vm"
        :prompt="prompt"
        @on-compile="onCompile"
        @on-step="onStep"
        @on-continue="onContinue"
      />
      <Examples @set-prompt="(newPrompt) => (this.prompt = newPrompt)" />
    </div>
    <Machine :vm="vm" />
  </div>
</template>

<script lang="ts">
import Canvas from "./components/Canvas.vue";
import Examples from "./components/Examples.vue";
import Machine from "./components/Machine.vue";
import Terminal from "./components/Terminal.vue";
import type { Vm } from "./vm";

interface Size {
  width: number;
  height: number;
}

export default {
  name: "App",
  components: {
    Canvas,
    Examples,
    Machine,
    Terminal,
  },
  methods: {
    onCompile() {
      this.worker.postMessage({ type: "Compile", source: this.prompt });
    },

    onStep() {
      this.worker.postMessage({ type: "Step" });
    },

    onContinue() {
      this.worker.postMessage({ type: "Continue" });
    },
  },
  mounted() {
    this.worker.addEventListener("message", (event) => {
      this.vm = event.data;
      this.vm.environment.history.reverse();
    });

    window.addEventListener("resize", () => {
      this.size = { width: window.innerWidth, height: window.innerHeight };
    });
  },
  data() {
    return {
      worker: new Worker("worker.js"),
      size: { width: window.innerWidth, height: window.innerHeight } as Size,
      vm: {
        stack: [],
        instructions: [],
        scopes: [],
        environment: {
          history: [],
          objects: [],
          turtle: { x: 0, y: 0, direction: 0 },
        },
        programCounter: 0,
      } as Vm,
      prompt: "",
    };
  },
};
</script>

<style>
:root {
  --primary-color: rgb(248, 248, 242);
  --primary-background-color: rgb(37, 36, 36);
  --monospace-font: 12px "Fira Code", monospace;
}

* {
  box-sizing: border-box;
}

body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: "Raleway", -apple-system, system, sans-serif;
}

button {
  color: var(--primary-background-color);
  background-color: #cfcfcf;
  border-radius: 5px;
  border-style: none;
  padding: 5px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in;
}
button:hover {
  background-color: #efefef;
  transition: background-color 0.2s ease-in;
}
</style>

<style>
main {
  width: 100%;
  height: 100%;
  position: relative;
}

#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 4fr 9fr 3fr;
  grid-template-areas: "overlay-left . vm";
}

#overlay-left {
  grid-area: overlay-left;
  display: grid;
  grid-template-rows: 5fr auto;
  grid-template-areas: "terminal" "examples";
  overflow-y: auto;
  box-shadow: 5px 5px 5px 0 rgb(201, 199, 199);
}
</style>
