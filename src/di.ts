export interface IConstructor<T> {
  new (...args: any[]): T;
}

export interface IContainer {
  /** 注册依赖和实现 */
  register<T, V>(
    token: IConstructor<T>,
    depts: IConstructor<unknown>[],
    imp?: IConstructor<V>
  ): void;
  /** 注册完成后，执行依赖图的构建 */
  build(): void;
  /** 获取依赖项的实例 */
  get<T>(token: IConstructor<T>): T;
}

interface IPayload<T = unknown> {
  token: IConstructor<T>;
  depts: IConstructor<unknown>[];
  imp?: IConstructor<T>;
  factory?: (opts?: Record<string, any>) => T;
}

class Graph<T> {
  vertices: Set<T> = new Set();
  adjList: Map<T, Set<T>> = new Map();

  addEdge(from: T, to: T) {
    this.vertices.add(from);
    this.vertices.add(to);
    if (!this.adjList.get(from)) {
      this.adjList.set(from, new Set());
    }
    this.adjList.get(from)!.add(to);
  }
}

export class Container implements IContainer {
  protected map: Map<IConstructor<unknown>, IPayload> = new Map();
  protected graph = new Graph<IConstructor<unknown>>();

  public register<T, V>(
    token: IConstructor<T>,
    depts: IConstructor<unknown>[],
    imp?: IConstructor<V>
  ): void {
    for (const iterator of depts) {
      this.graph.addEdge(iterator, token);
    }
    this.map.set(token, { token, depts, imp });
  }

  protected invokeFactory(payload: IPayload, opts?: Record<string, any>) {
    return payload.factory?.(opts);
  }

  /** 设置当前依赖项的工厂方法 */
  protected setfactory(token: IConstructor<unknown>) {
    const define = this.map.get(token);
    if (!define) return;
    const ctor = define.imp ?? token;
    const payloads = define.depts.map((i) => this.map.get(i)!);
    define.factory = (opts) => {
      // 递归调用二级依赖的工厂方法创建依赖项
      const depts = payloads.map((i) => this.invokeFactory(i, opts));
      // 优先使用子类实现
      return new ctor(...depts);
    };
  }

  public build(): void {
    const roots: IConstructor<unknown>[] = [];
    for (const iterator of this.graph.vertices) {
      if (this.graph.adjList.has(iterator)) continue;
      this.graph.vertices.delete(iterator);
      roots.push(iterator);
    }
    while (true) {
      if (this.graph.adjList.size === 0) {
        if (this.graph.vertices.size === 0) break;
        throw new Error("CycleError");
      }
      const items = Array.from(this.graph.adjList.values());
      const processed: IConstructor<unknown>[] = [];
      for (const iterator of this.graph.adjList) {
        if (items.every((i) => !i.has(iterator[0]))) {
          this.setfactory(iterator[0]);
          processed.push(iterator[0]);
        }
      }
      for (const iterator of processed) {
        this.graph.adjList.delete(iterator);
        this.graph.vertices.delete(iterator);
      }
    }
    for (const iterator of roots) {
      this.setfactory(iterator);
    }
  }

  public get<T>(token: IConstructor<T>): T {
    return this.invokeFactory(this.map.get(token)!) as T;
  }
}

export enum InjectType {
  Transient,
  Scope,
  Singleton,
}

const $$global = Symbol.for("di::global-scope");

export class ScopedContainer extends Container {
  protected types: Map<IConstructor<any>, InjectType> = new Map();
  protected scopes: Map<symbol, Map<IConstructor<any>, any>> = new Map();

  constructor() {
    super();
    this.scopes.set($$global, new Map());
  }

  protected invokeFactory(payload: IPayload, opts: Record<string, any> = {}) {
    const itype = this.types.get(payload.token)!;
    // 瞬时值模式
    if (itype === InjectType.Transient) {
      return super.invokeFactory(payload);
    }
    // 单例模式
    if (itype === InjectType.Singleton) {
      const current = this.scopes.get($$global)!;
      let found = current.get(payload.token);
      // 如果从未解析过，则进行缓存
      if (!found) {
        current.set(
          payload.token,
          // 把opts参数透传下去，保证整条链路上都在scope范围内解析
          (found = super.invokeFactory(payload, { ...opts, scope: $$global }))
        );
      }
      return found;
    }
    // 其余场景尝试进行 范围模式 的解析
    // 没有提供正确的范围
    if (!opts.scope) {
      return super.invokeFactory(payload);
    }
    const $scope = Symbol.for(opts.scope);
    const current = this.scopes.get($scope);
    // 不存在的范围
    if (!current) {
      return super.invokeFactory(payload);
    }
    let found = current.get(payload.token);
    // 如果范围内没有解析过，则进行缓存
    if (!found) {
      current.set(
        payload.token,
        // 把opts参数透传下去，保证整条链路上都在scope范围内解析
        (found = super.invokeFactory(payload, opts))
      );
    }
    return found;
  }

  public register<T, V>(
    token: IConstructor<T>,
    depts: IConstructor<unknown>[],
    imp?: IConstructor<V>,
    // 登记的时候提供依赖解析的范围模式
    scope: InjectType = InjectType.Transient
  ): void {
    this.types.set(token, scope);
    return super.register(token, depts, imp);
  }

  public get<T>(token: IConstructor<T>, scope?: string): T {
    return this.invokeFactory(this.map.get(token)!, { scope }) as T;
  }

  public createScope(scope: string) {
    this.scopes.set(Symbol.for(scope), new Map());
  }

  public disposeScope(scope: string) {
    this.scopes.delete(Symbol.for(scope));
  }
}
