import { test } from "node:test";
import assert from "node:assert/strict";
import { arrangeByIds, shuffleIds } from "./deckOrder.ts";

function sequenceRandom(values) {
  let position = 0;
  return () => values[position++ % values.length];
}

test("shuffleIds should return an empty list when there are no ids", () => {
  assert.deepEqual(shuffleIds([]), []);
});

test("shuffleIds should keep a single id untouched", () => {
  assert.deepEqual(shuffleIds(["a"]), ["a"]);
});

test("shuffleIds should not mutate the original list", () => {
  const ids = ["a", "b", "c"];
  shuffleIds(ids, sequenceRandom([0]));
  assert.deepEqual(ids, ["a", "b", "c"]);
});

test("shuffleIds should apply the Fisher-Yates swaps from the random source", () => {
  assert.deepEqual(shuffleIds(["a", "b", "c", "d"], sequenceRandom([0])), ["b", "c", "d", "a"]);
});

test("shuffleIds should keep the order when random always picks the last position", () => {
  assert.deepEqual(shuffleIds(["a", "b", "c"], sequenceRandom([0.999])), ["a", "b", "c"]);
});

test("shuffleIds should keep every id exactly once", () => {
  const ids = Array.from({ length: 50 }, (_, index) => `card-${index}`);
  assert.deepEqual([...shuffleIds(ids)].sort(), [...ids].sort());
});

test("arrangeByIds should skip ids whose item no longer exists", () => {
  const items = [{ id: "a" }, { id: "c" }];
  assert.deepEqual(arrangeByIds(items, ["c", "b", "a"]), [{ id: "c" }, { id: "a" }]);
});

test("arrangeByIds should append items that are missing from the order at the end", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "new" }];
  assert.deepEqual(arrangeByIds(items, ["b", "a"]), [{ id: "b" }, { id: "a" }, { id: "new" }]);
});

test("arrangeByIds should follow the given order and return the current item data", () => {
  const items = [
    { id: "a", question: "edited" },
    { id: "b", question: "b" },
  ];
  assert.deepEqual(arrangeByIds(items, ["b", "a"]), [
    { id: "b", question: "b" },
    { id: "a", question: "edited" },
  ]);
});
