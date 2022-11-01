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
import { InjectType, Container, ScopedContainer } from "./di";

export const container = new Container();

container.register(AData, []);
container.register(BData, []);
container.register(CData, []);
container.register(DData, []);
container.register(EData, []);
container.register(FData, []);
container.register(GData, []);
container.register(HData, []);
container.register(E, [EData]);
container.register(H, [HData]);
container.register(G, [E, H, GData]);
container.register(D, [DData]);
container.register(F, [FData]);
container.register(B, [D, F, BData]);
container.register(C, [G, B, H, CData]);
container.register(A, [B, C, G, AData]);
container.build();
