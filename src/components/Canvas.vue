<template>
  <div>
    <svg :viewBox="viewBox">
      <template v-for="(object, i) in vm.environment.objects">
        <polyline
          v-if="object.type === 'Line'"
          :key="i"
          fill="none"
          :stroke="getRgba(object.color)"
          :points="`${object.start.x},${object.start.y} ${object.end.x},${object.end.y}`"
        />
      </template>
      <polygon id="turtle" :points="turtlePoints" />
    </svg>
  </div>
</template>

<script lang="ts">
import type { Vm, Color } from "../vm";
import { mat4, vec3 } from "gl-matrix";

interface Size {
  width: number;
  height: number;
}

export default {
  name: "Canvas",
  props: ["size", "vm"],
  computed: {
    viewBox() {
      const { width, height }: Size = this.size;

      return [
        -Math.round(width / 2),
        -Math.round(height / 2),
        width,
        height,
      ].join(" ");
    },
    turtlePoints() {
      const { x, y, direction } = this.vm.environment.turtle;

      const point1 = vec3.fromValues(-15, 0, 0);
      const point2 = vec3.fromValues(15, 0, 0);
      const point3 = vec3.fromValues(0, -30, 0);

      const points = [point1, point2, point3];

      let transform: mat4 = mat4.create();

      mat4.fromTranslation(transform, vec3.fromValues(x, y, 0));
      mat4.rotate(transform, transform, direction, vec3.fromValues(0, 0, 1));
      mat4.translate(transform, transform, vec3.fromValues(0, 1, 0));

      const transformedPoints = points.map((point) =>
        vec3.transformMat4(point, point, transform)
      );

      return transformedPoints.map(([x, y]) => `${x},${y}`).join(" ");
    },
  },
  methods: {
    getRgba({ red, green, blue, alpha }: Color) {
      return `rgba(${red * 255.0}, ${green * 255.0}, ${
        blue * 255.0
      }, ${alpha})`;
    },
  },
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}

#turtle {
  fill: none;
  stroke: black;
}
</style>
