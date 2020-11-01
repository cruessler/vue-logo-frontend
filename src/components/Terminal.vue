<template>
  <div id="terminal">
    <div id="history">
      <ul id="entries">
        <template v-for="(entry, i) in vm.environment.history">
          <li v-if="entry.type === 'Input'" :key="`Input@${i}`" class="input">
            {{ entry.input }}
          </li>
          <li
            v-else-if="entry.type === 'Output'"
            :key="`Output@${i}`"
            class="output"
          >
            {{ entry.output }}
          </li>
          <li
            v-else-if="entry.type === 'Error'"
            :key="`Error@${i}`"
            class="error"
          >
            {{ entry.error }}
          </li>
        </template>
      </ul>
      <textarea id="prompt" :value="prompt" />
    </div>
    <div id="controls">
      <button @click="$emit('on-compile')">Compile</button>
      <button @click="$emit('on-step')">Step</button>
      <button @click="$emit('on-continue')">Continue</button>
    </div>
  </div>
</template>

<script lang="ts">
import type { Vm } from "../vm";

export default {
  name: "Machine",
  props: ["vm", "prompt", "setPrompt"],
};
</script>

<style scoped>
#terminal {
  grid-area: terminal;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-areas: "history" "controls";
  overflow-y: auto;
  color: var(--primary-color);
  background-color: var(--primary-background-color);
}

#history {
  display: grid;
  grid-template-rows: 5fr 1fr;
  grid-template-areas: "entries" "prompt";
  overflow-y: auto;
}

#entries {
  grid-area: entries;
  margin: 0;
  padding: 0;
  font: var(--monospace-font);
  overflow-y: auto;
}

#prompt {
  grid-area: prompt;
  width: 100%;
  font: var(--monospace-font);
  background-color: #312f2f;
  border-style: none;
  color: #eaeaf0;
}

#controls {
  grid-area: controls;
  padding: 10px;
  display: flex;
}

button:first-child {
  margin-left: auto;
}
button {
  margin-left: 10px;
}

li {
  white-space: pre-wrap;
}
li.input {
  color: rgba(247, 248, 242, 0.7);
}
li.input:before {
  content: "> ";
}
li.error {
  color: rgb(248, 80, 80);
}
li.error:before {
  content: "! ";
}
</style>
