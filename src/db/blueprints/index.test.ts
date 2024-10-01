import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { dbPort } from "~/db/port";
import { createContext } from "~/modules/hexagonal";
import { blueprints } from ".";

const context = createContext([[dbPort, drizzleDbAdapter]]);

it("can run all blueprints sequentially without errors", async () => {
  await expect(
    (async () => {
      for (const blueprint of Object.values(blueprints)) {
        await blueprint(context);
      }
    })(),
  ).resolves.not.toThrow();
});

it("can run all blueprints in parallel without errors", async () => {
  await expect(
    Promise.all(Object.values(blueprints).map((blueprint) => blueprint(context))),
  ).resolves.not.toThrow();
});

it("can run all blueprints sequentially in a random order without errors", async () => {
  const blueprintsArray = Object.values(blueprints);
  const shuffledBlueprints = blueprintsArray.sort(() => Math.random() - 0.5);

  await expect(
    (async () => {
      for (const blueprint of shuffledBlueprints) {
        await blueprint(context);
      }
    })(),
  ).resolves.not.toThrow();
});

it("can run all blueprints in parallel in a random order without errors", async () => {
  const blueprintsArray = Object.values(blueprints);
  const shuffledBlueprints = blueprintsArray.sort(() => Math.random() - 0.5);

  await expect(
    Promise.all(shuffledBlueprints.map((blueprint) => blueprint(context))),
  ).resolves.not.toThrow();
});
