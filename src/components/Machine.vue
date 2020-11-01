<template>
  <div id="machine">
    <div id="stack">
      <h2>Stack</h2>
      <ul>
        <li v-for="entry in vm.stack" :key="entry">{{ entry }}</li>
      </ul>
    </div>

    <div id="scopes">
      <h2>Scopes</h2>
      <ul>
        <template v-for="scope in vm.scopes">
          <li v-if="scope.type === 'Root'" :key="scope.type">
            <h3>Root</h3>
            <table>
              <tr v-for="(name, binding) in scope.variables" :key="name">
                <td>{{ name }}</td>
                <td>{{ binding ?? "_" }}</td>
              </tr>
            </table>
          </li>
          <li
            v-else-if="scope.type === 'Local'"
            :key="`Local@${scope.address}`"
          >
            <h3>Local@{{ scope.address }}</h3>
            <table>
              <tr v-for="(name, binding) in scope.variables" :key="name">
                <td>{{ name }}</td>
                <td>{{ binding ?? "_" }}</td>
              </tr>
            </table>
          </li>
          <li
            v-else-if="scope.type === 'Template'"
            :key="`Template@${scope.current}`"
          >
            <h3>Template</h3>
            <table>
              <tr>
                <td>current</td>
                <td>{{ scope.current ?? "_" }}</td>
              </tr>
              <tr>
                <td>rest</td>
                <td>{{ scope.rest }}</td>
              </tr>
            </table>
          </li>
          <li v-else-if="scope.type === 'Loop'" :key="`Loop@${scope.current}`">
            <h3>Loop@{{ scope.current }}</h3>
          </li>
        </template>
      </ul>
    </div>

    <div id="instructions">
      <h2>Instructions</h2>
      <h3>Next</h3>
      <table>
        <tr class="current">
          <td>{{ vm.programCounter }}</td>
          <td>{{ currentInstruction }}</td>
        </tr>
      </table>
      <table id="program">
        <template v-for="(instruction, i) in vm.instructions">
          <tr
            v-if="i === vm.programCounter"
            :key="`current@${i}`"
            class="current"
          >
            <td>{{ i }}</td>
            <td>{{ instruction }}</td>
          </tr>
          <tr v-else :key="i">
            <td>{{ i }}</td>
            <td>{{ instruction }}</td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import type { Vm } from "../vm";

export default {
  name: "Machine",
  props: ["vm"],
  computed: {
    currentInstruction() {
      return this.vm.instructions[this.vm.programCounter] ?? "none";
    },
  },
};
</script>

<style scoped>
h2 {
  margin: 0;
}

ul {
  font: var(--monospace-font);
  padding: 0;
  list-style: none;
}

li {
  padding: 0.2em 0;
}

table {
  font: var(--monospace-font);
}

tr.current {
  color: rgb(18, 18, 18);
  background-color: var(--primary-color);
}

#machine {
  grid-area: vm;
  padding: 1em;
  overflow-y: auto;
  color: var(--primary-color);
  background-color: var(--primary-background-color);
  box-shadow: -5px 5px 5px 0 rgb(201, 199, 199);
}

#program {
  overflow-y: auto;
}
</style>
