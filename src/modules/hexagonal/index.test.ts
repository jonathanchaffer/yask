import { createAdapter, createContext, createPort } from ".";

describe("createPort", () => {
  it("creates a hexagonal port", () => {
    const dummyPort = createPort("dummy");
    expect(dummyPort).toEqual({ name: "dummy" });
  });
});

describe("createAdapter", () => {
  it("creates a hexagonal adapter builder for a given port", () => {
    const dummyPort = createPort("dummy");

    const myAdapter = createAdapter(dummyPort, [], () => {});
    expect(myAdapter).toBeInstanceOf(Function);
  });
  it("requires adapter to match the port's adapter type", () => {
    const dummyPort = createPort<{ foo: () => string }, "dummy">("dummy");

    // don't expect type error
    createAdapter(dummyPort, [], () => ({ foo: () => "bar" }));

    // @ts-expect-error - missing foo method
    createAdapter(dummyPort, [], () => ({ bar: () => "baz" }));
  });
});

describe("createContext", () => {
  it("can create an empty hexagonal context", () => {
    const context = createContext([]);
    expect(context).toEqual({
      getAdapter: expect.any(Function),
    });
  });
  it("can bind an adapter to a port and get it from the context", () => {
    const fooPort = createPort<{ foo: () => string }, "foo">("foo");
    const fooAdapter = createAdapter(fooPort, [], () => ({ foo: () => "bar" }));

    const context = createContext([[fooPort, fooAdapter]]);

    const adapter = context.getAdapter("foo");
    expect(adapter).toEqual({ foo: expect.any(Function) });
  });
  it("throws an error when trying to get an unbound adapter", () => {
    const fooPort = createPort<{ foo: () => string }, "foo">("foo");
    const _fooAdapter = createAdapter(fooPort, [], () => ({
      foo: () => "bar",
    }));

    const context = createContext([]);

    // @ts-expect-error - foo is not bound
    expect(() => context.getAdapter("foo")).toThrowError(
      "Adapter not found for port 'foo'. Did you forget to bind it?",
    );
  });
  it("can call a function from a bound adapter", () => {
    const fooPort = createPort<{ foo: () => string }, "foo">("foo");
    const fooAdapter = createAdapter(fooPort, [], () => ({ foo: () => "bar" }));

    const context = createContext([[fooPort, fooAdapter]]);

    const adapter = context.getAdapter("foo");
    expect(adapter.foo()).toBe("bar");
  });
  it("throws an error when trying to call a function on an adapter that is bound to an incompatible port", () => {
    const fooPort = createPort<{ foo: () => string }, "foo">("foo");
    const barPort = createPort<{ bar: () => string }, "bar">("bar");
    const barAdapter = createAdapter(barPort, [], () => ({ bar: () => "baz" }));

    const context = createContext([[fooPort, barAdapter]]);

    expect(() => context.getAdapter("foo").foo()).toThrowError(
      "context.getAdapter(...).foo is not a function",
    );
  });
  it("can create adapters that depend on other adapters", () => {
    const helloPort = createPort<{ sayHello: () => string }, "hello">("hello");
    const helloAdapter = createAdapter(helloPort, [], () => ({
      sayHello: () => "Hello",
    }));

    const worldPort = createPort<{ sayWorld: () => string }, "world">("world");
    const worldAdapter = createAdapter(worldPort, [], () => ({
      sayWorld: () => "World",
    }));

    const helloWorldPort = createPort<
      { sayHelloWorld: () => string },
      "helloWorld"
    >("helloWorld");
    const helloWorldAdapter = createAdapter(
      helloWorldPort,
      [helloPort, worldPort],
      (context) => ({
        sayHelloWorld: () =>
          `${context.getAdapter("hello").sayHello()} ${context.getAdapter("world").sayWorld()}`,
      }),
    );

    const context = createContext([
      [helloPort, helloAdapter],
      [worldPort, worldAdapter],
      [helloWorldPort, helloWorldAdapter],
    ]);

    const adapter = context.getAdapter("helloWorld");
    expect(adapter.sayHelloWorld()).toBe("Hello World");
  });
  it("throws an error when adapter dependencies are not bound to the context", () => {
    const helloPort = createPort<{ sayHello: () => string }, "hello">("hello");
    const helloAdapter = createAdapter(helloPort, [], () => ({
      sayHello: () => "Hello",
    }));

    const worldPort = createPort<{ sayWorld: () => string }, "world">("world");
    const _worldAdapter = createAdapter(worldPort, [], () => ({
      sayWorld: () => "World",
    }));

    const helloWorldPort = createPort<
      { sayHelloWorld: () => string },
      "helloWorld"
    >("helloWorld");
    const helloWorldAdapter = createAdapter(
      helloWorldPort,
      [helloPort, worldPort],
      (context) => ({
        sayHelloWorld: () =>
          `${context.getAdapter("hello").sayHello()} ${context.getAdapter("world").sayWorld()}`,
      }),
    );

    const context = createContext([
      [helloPort, helloAdapter],
      [helloWorldPort, helloWorldAdapter],
    ]);

    const adapter = context.getAdapter("helloWorld");
    expect(() => adapter.sayHelloWorld()).toThrowError(
      "Adapter not found for port 'world'. Did you forget to bind it?",
    );
  });
});
