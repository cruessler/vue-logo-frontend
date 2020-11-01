type Binding = null | string;

type Variables = Record<string, Binding>;

type Scope =
  | { type: "Root"; variables: Variables }
  | { type: "Local"; address: number; variables: Variables }
  | { type: "Template"; current: Binding; rest: string }
  | { type: "Loop"; current: number };

type Entry =
  | { type: "Input"; input: string }
  | { type: "Output"; output: string }
  | { type: "Error"; error: string };

interface Turtle {
  x: number;
  y: number;
  direction: number;
}

interface Vec2 {
  x: number;
  y: number;
}

export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface Line {
  type: "Line";
  start: Vec2;
  end: Vec2;
  color: Color;
}

interface Environment {
  history: Entry[];
  objects: Line[];
  turtle: Turtle;
}

export interface Vm {
  environment: Environment;
  stack: string[];
  instructions: string[];
  scopes: Scope[];
  programCounter: number;
}
