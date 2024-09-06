import { withTestContext } from "~/app/context/test-context";
import { blueprints } from ".";

it(
  "can run all blueprints sequentially without errors",
  withTestContext(async (context) => {
    expect(async () => {
      for (const blueprint of Object.values(blueprints)) {
        await blueprint(context);
      }
    }).not.toThrow();
  }),
);

it(
  "can run all blueprints in parallel without errors",
  withTestContext(async (context) => {
    expect(async () => {
      await Promise.all(
        Object.values(blueprints).map((blueprint) => blueprint(context)),
      );
    }).not.toThrow();
  }),
);

it(
  "can run all blueprints sequentially in a random order without errors",
  withTestContext(async (context) => {
    const blueprintsArray = Object.values(blueprints);
    const shuffledBlueprints = blueprintsArray.sort(() => Math.random() - 0.5);

    expect(async () => {
      for (const blueprint of shuffledBlueprints) {
        await blueprint(context);
      }
    }).not.toThrow();
  }),
);

it(
  "can run all blueprints in parallel in a random order without errors",
  withTestContext(async (context) => {
    const blueprintsArray = Object.values(blueprints);
    const shuffledBlueprints = blueprintsArray.sort(() => Math.random() - 0.5);

    expect(async () => {
      await Promise.all(
        shuffledBlueprints.map((blueprint) => blueprint(context)),
      );
    }).not.toThrow();
  }),
);
