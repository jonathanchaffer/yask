import { createAdapter, createContext, createPort } from ".";

describe("createPort", () => {
  it("creates a hexagonal port", () => {
    const myPort = createPort("my port");
    expect(myPort).toEqual({ name: "my port" });
  });
});

describe("createAdapter", () => {
  it("creates a hexagonal adapter builder for a given port", () => {
    const myPort = createPort("my port");

    const myAdapter = createAdapter(myPort, () => {});
    expect(myAdapter).toBeInstanceOf(Function);
  });
  it("requires adapter to match the port's adapter type", () => {
    const myPort = createPort<{ foo: () => string }>("my port");

    // don't expect type error
    createAdapter(myPort, () => ({
      foo: () => "bar",
    }));

    // @ts-expect-error - missing foo method
    createAdapter(myPort, () => ({
      bar: () => "baz",
    }));
  });
});

describe("createContext", () => {
  it("creates an empty hexagonal context", () => {
    const context = createContext();
    expect(context).toEqual({
      getAdapter: expect.any(Function),
      bindAdapter: expect.any(Function),
    });
  });
  it("throws an error when trying to get an unbound adapter", () => {
    const myPort = createPort("my port");

    const context = createContext();
    expect(() => context.getAdapter(myPort)).toThrowError(
      `Adapter not found for port 'my port'. Did you forget to bind it?`,
    );
  });
  it("can bind an adapter to a port", () => {
    const myPort = createPort<{
      foo: () => string;
    }>("my port");

    const context = createContext();
    context.bindAdapter(myPort, () => ({
      foo: () => "bar",
    }));

    const adapter = context.getAdapter(myPort);
    expect(adapter).toEqual({ foo: expect.any(Function) });
  });
  it("can call a bound adapter", () => {
    const myPort = createPort<{
      foo: () => string;
    }>("my port");

    const context = createContext();
    context.bindAdapter(myPort, () => ({
      foo: () => "bar",
    }));

    const adapter = context.getAdapter(myPort);
    expect(adapter.foo()).toBe("bar");
  });
  it("can create adapters that depend on other adapters", () => {
    const fooPort = createPort<{ foo: () => string }>("foo");
    const barPort = createPort<{ bar: () => string }>("bar");

    const context = createContext();
    context.bindAdapter(fooPort, () => ({
      foo: () => "foo",
    }));
    context.bindAdapter(barPort, (context) => ({
      bar: () => context.getAdapter(fooPort).foo(),
    }));

    const barAdapter = context.getAdapter(barPort);
    expect(barAdapter.bar()).toBe("foo");
  });
  it("throws an error when an adapter depends on an unbound adapter", () => {
    const fooPort = createPort<{ foo: () => string }>("foo");
    const barPort = createPort<{ bar: () => string }>("bar");

    const context = createContext();
    context.bindAdapter(barPort, (context) => ({
      bar: () => context.getAdapter(fooPort).foo(),
    }));

    expect(() => context.getAdapter(barPort).bar()).toThrowError(
      `Adapter not found for port 'foo'. Did you forget to bind it?`,
    );
  });
});
