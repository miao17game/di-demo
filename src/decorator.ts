import "reflect-metadata";
import { InjectType } from "./di";

export function Injectable(type = InjectType.Transient) {
  return function (target: any) {
    Reflect.defineMetadata("di::inject-type", type, target);
  };
}

@Injectable()
class B {}

@Injectable()
export class A {
  constructor(private b: B) {}
}

console.log(Reflect.getMetadata("di::inject-type", A));
console.log(Reflect.getMetadata("design:paramtypes", A));
