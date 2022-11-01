import "reflect-metadata";
import { Container, injectable } from "inversify";

@injectable()
export class AData {
  public data = "a";
}
@injectable()
export class BData {
  public data = "b";
}
@injectable()
export class CData {
  public data = "c";
}
@injectable()
export class DData {
  public data = "d";
}
@injectable()
export class EData {
  public data = "e";
}
@injectable()
export class FData {
  public data = "f";
}
@injectable()
export class GData {
  public data = "g";
}
@injectable()
export class HData {
  public data = "h";
}

@injectable()
export class E {
  constructor(public ed: EData) {}
}
@injectable()
export class H {
  constructor(public hd: HData) {}
}
@injectable()
export class G {
  constructor(public e: E, public h: H, public gd: GData) {}
}

@injectable()
export class D {
  constructor(public dd: DData) {}
}
@injectable()
export class F {
  constructor(public fd: FData) {}
}
@injectable()
export class B {
  constructor(public d: D, public f: F, public bd: BData) {}
}

@injectable()
export class C {
  constructor(public g: G, public b: B, public h: H, public cd: CData) {}
}

@injectable()
export class A {
  constructor(public b: B, public c: C, public g: G, public ad: AData) {}
}

const container = new Container();
container.bind(AData).to(AData);
container.bind(BData).to(BData);
container.bind(CData).to(CData);
container.bind(DData).to(DData);
container.bind(EData).to(EData);
container.bind(FData).to(FData);
container.bind(GData).to(GData);
container.bind(HData).to(HData);
container.bind(A).to(A);
container.bind(B).to(B);
container.bind(C).to(C);
container.bind(D).to(D);
container.bind(E).to(E);
container.bind(F).to(F);
container.bind(G).to(G);
container.bind(H).to(H);

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
