export type HexagonalPort<
  TPortName extends string = string,
  TAdapter = unknown,
> = {
  name: TPortName;
  _adapter: TAdapter;
};

export type HexagonalAdapter<TPort extends HexagonalPort> = TPort["_adapter"];

export type HexagonalAdapterBuilder<
  TDependency extends HexagonalPort,
  TPort extends HexagonalPort,
> = (
  ...rest: TDependency["name"] extends never
    ? []
    : [HexagonalContext<TDependency["name"], TDependency | HexagonalPort>]
) => HexagonalAdapter<TPort>;

export type HexagonalContext<
  TPortName extends string,
  TPort extends HexagonalPort<TPortName>,
> = {
  getAdapter: <TName extends TPortName>(
    portName: TName,
  ) => HexagonalAdapter<Extract<TPort, { name: TName }>>;
};
