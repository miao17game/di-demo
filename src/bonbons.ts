import "reflect-metadata";
import { DIContainer, InjectScope } from "@bonbons/di";

export class AData {
  public data = "a";
}
export class BData {
  public data = "b";
}
export class CData {
  public data = "c";
}
export class DData {
  public data = "d";
}
export class EData {
  public data = "e";
}
export class FData {
  public data = "f";
}
export class GData {
  public data = "g";
}
export class HData {
  public data = "h";
}

export class E {
  constructor(public ed: EData) {}
}
export class H {
  constructor(public hd: HData) {}
}
export class G {
  constructor(public e: E, public h: H, public gd: GData) {}
}

export class D {
  constructor(public dd: DData) {}
}
export class F {
  constructor(public fd: FData) {}
}
export class B {
  constructor(public d: D, public f: F, public bd: BData) {}
}

export class C {
  constructor(public g: G, public b: B, public h: H, public cd: CData) {}
}

export class A {
  constructor(public b: B, public c: C, public g: G, public ad: AData) {}
}

const container = new DIContainer();
container.register({ token: AData, imp: AData, scope: InjectScope.New });
container.register({ token: BData, imp: BData, scope: InjectScope.New });
container.register({ token: CData, imp: CData, scope: InjectScope.New });
container.register({ token: DData, imp: DData, scope: InjectScope.New });
container.register({ token: EData, imp: EData, scope: InjectScope.New });
container.register({ token: FData, imp: FData, scope: InjectScope.New });
container.register({ token: GData, imp: GData, scope: InjectScope.New });
container.register({ token: HData, imp: HData, scope: InjectScope.New });
container.register({
  token: A,
  imp: A,
  scope: InjectScope.New,
  depts: [B, C, G, AData],
});
container.register({
  token: B,
  imp: B,
  scope: InjectScope.New,
  depts: [D, F, BData],
});
container.register({
  token: C,
  imp: C,
  scope: InjectScope.New,
  depts: [G, B, H, CData],
});
container.register({
  token: D,
  imp: D,
  scope: InjectScope.New,
  depts: [DData],
});
container.register({
  token: E,
  imp: E,
  scope: InjectScope.New,
  depts: [EData],
});
container.register({
  token: F,
  imp: F,
  scope: InjectScope.New,
  depts: [FData],
});
container.register({
  token: G,
  imp: G,
  scope: InjectScope.New,
  depts: [E, H, GData],
});
container.register({
  token: H,
  imp: H,
  scope: InjectScope.New,
  depts: [HData],
});

container.complete();

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
