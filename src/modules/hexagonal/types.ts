export type HexagonalPort<TName extends string = string, TAdapter = unknown> = {
  name: TName;
  _adapter: TAdapter;
};

export type HexagonalAdapter<TPort extends HexagonalPort> = TPort["_adapter"];

export type HexagonalAdapterBuilder<TPort extends HexagonalPort> = (
  ctx: MinimalHexagonalContext,
) => HexagonalAdapter<TPort>;

type MinimalHexagonalContext = {
  getAdapter: <TPort extends HexagonalPort>(
    port: TPort,
  ) => HexagonalAdapter<TPort>;
};

export type HexagonalContext = MinimalHexagonalContext & {
  bindAdapter: <TPort extends HexagonalPort>(
    port: TPort,
    adapterBuilder: HexagonalAdapterBuilder<TPort>,
  ) => void;
};
