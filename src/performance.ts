import {
  A,
  AData,
  B,
  BData,
  C,
  CData,
  D,
  DData,
  E,
  EData,
  F,
  FData,
  G,
  GData,
  H,
  HData,
} from "./classes";
import { container } from "./entry";

const COUNT = 10000;

const start1 = Date.now();
for (let index = 0; index < COUNT; index++) {
  new A(
    new B(new D(new DData()), new F(new FData()), new BData()),
    new C(
      new G(new E(new EData()), new H(new HData()), new GData()),
      new B(new D(new DData()), new F(new FData()), new BData()),
      new H(new HData()),
      new CData()
    ),
    new G(new E(new EData()), new H(new HData()), new GData()),
    new AData()
  );
}
console.log("normal cost ==> " + (Date.now() - start1));

const start2 = Date.now();
for (let index = 0; index < COUNT; index++) {
  container.get(A);
}
console.log("di     cost ==> " + (Date.now() - start2));
