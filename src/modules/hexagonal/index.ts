import {
  HexagonalAdapter,
  HexagonalAdapterBuilder,
  HexagonalContext,
  HexagonalPort,
} from "./types";

export function createPort<TAdapter, TName extends string = string>(
  name: TName,
): HexagonalPort<TName, TAdapter> {
  return { name } as HexagonalPort<TName, TAdapter>;
}

export function createAdapter<TPort extends HexagonalPort>(
  _port: TPort, // unused - just for type inference
  builder: HexagonalAdapterBuilder<TPort>,
): HexagonalAdapterBuilder<TPort> {
  return builder;
}

export function createContext(): HexagonalContext {
  const bindingMap: Record<string, HexagonalAdapter<HexagonalPort>> = {};

  function getAdapter<TPort extends HexagonalPort>(port: TPort) {
    const mapping = bindingMap[port.name];
    if (!mapping)
      throw new Error(
        `Adapter not found for port '${port.name}'. Did you forget to bind it?`,
      );
    return mapping as HexagonalAdapter<typeof port>;
  }

  return {
    getAdapter,
    bindAdapter: (port, adapterBuilder) => {
      bindingMap[port.name] = adapterBuilder({ getAdapter });
    },
  };
}
