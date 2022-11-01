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
