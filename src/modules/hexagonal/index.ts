import {
  HexagonalAdapter,
  HexagonalAdapterBuilder,
  HexagonalContext,
  HexagonalPort,
} from "./types";

/**
 * Create a hexagonal port.
 * @example
 * const helloPort = createPort<{ sayHello: () => void }, "hello">("hello");
 *
 * @example
 * const worldPort = createPort<{ sayWorld: () => void }, "world">("world");
 *
 * @example
 * const helloWorldPort = createPort<{ sayHelloWorld: () => void }, "helloWorld">("helloWorld");
 */
export function createPort<TAdapter, TName extends string>(
  name: TName,
): HexagonalPort<TName, TAdapter> {
  return { name } as HexagonalPort<TName, TAdapter>;
}

/**
 * Create a hexagonal adapter.
 * @example
 * const helloAdapter = createAdapter(helloPort, [], () => ({
 *   sayHello: () => { console.log("Hello") }
 * }));
 *
 * @example
 * const worldAdapter = createAdapter(worldPort, [], () => ({
 *   sayWorld: () => { console.log("World") }
 * }));
 *
 * @example
 * const helloWorldAdapter = createAdapter(helloWorldPort, [helloPort, worldPort], (context) => ({
 *   sayHelloWorld: () => {
 *     context.getAdapter("hello").sayHello();
 *     context.getAdapter("world").sayWorld();
 *   }
 * }));
 */
export function createAdapter<
  TDependencyName extends string,
  TDependency extends HexagonalPort<TDependencyName>,
  TPortName extends string,
  TPort extends HexagonalPort<TPortName>,
>(
  _port: TPort, // unused - just for type inference
  _dependencies: TDependency[], // unused - just for type inference
  builder: HexagonalAdapterBuilder<TDependency, TPort>,
): HexagonalAdapterBuilder<TDependency, TPort> {
  return builder;
}

/**
 * Create a hexagonal context.
 *
 * @example
 * const context = createContext([
 *   [helloPort, helloAdapter],
 *   [worldPort, worldAdapter],
 *   [helloWorldPort, helloWorldAdapter],
 * ]);
 */
export function createContext<
  TPorts extends HexagonalPort[],
  TDependencies extends HexagonalPort[] | never = never,
>(bindings: {
  [Index in keyof TPorts]: [
    TPorts[Index],
    HexagonalAdapterBuilder<TDependencies[number], TPorts[Index]>,
  ];
}): HexagonalContext<TPorts[number]["name"], TPorts[number]> {
  const bindingMap: Record<
    string,
    HexagonalAdapterBuilder<TDependencies[number], TPorts[number]>
  > = Object.fromEntries(bindings.map(([port, adapterBuilder]) => [port.name, adapterBuilder]));

  function getAdapter<TName extends TPorts[number]["name"]>(
    portName: TName,
  ): HexagonalAdapter<Extract<TPorts[number], { name: TName }>> {
    const mapping = bindingMap[portName];
    if (!mapping)
      throw new Error(`Adapter not found for port '${portName}'. Did you forget to bind it?`);
    // @ts-expect-error - don't know whether the mapping requires a context or not
    return mapping({ getAdapter });
  }

  return { getAdapter };
}
