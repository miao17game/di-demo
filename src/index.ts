import { A } from "./classes";
import { container } from "./entry";

const a = container.get(A);
console.log(a.ad);
console.log(a.b.bd);
console.log(a.g.e.ed);
