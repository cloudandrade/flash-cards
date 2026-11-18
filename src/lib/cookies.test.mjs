import { test } from "node:test";
import assert from "node:assert/strict";
import { readCookie, serializeCookie } from "./cookies.ts";

const options = { maxAgeSeconds: 3600, isSecure: false };

test("readCookie should return null when the cookie header is empty", () => {
  assert.equal(readCookie("", "flashcards_user"), null);
});

test("readCookie should return null when the cookie is missing", () => {
  assert.equal(readCookie("theme=dark; lang=pt", "flashcards_user"), null);
});

test("readCookie should not match a cookie whose name only starts with the requested name", () => {
  assert.equal(readCookie("flashcards_user_old=x", "flashcards_user"), null);
});

test("readCookie should return null when the value has a malformed encoding", () => {
  assert.equal(readCookie("flashcards_user=%E0%A4%A", "flashcards_user"), null);
});

test("readCookie should decode the value of the requested cookie", () => {
  const header = "theme=dark; flashcards_user=%7B%22name%22%3A%22Ana%22%7D";
  assert.equal(readCookie(header, "flashcards_user"), '{"name":"Ana"}');
});

test("serializeCookie should encode the value and set path, max-age and same-site", () => {
  assert.equal(
    serializeCookie("flashcards_user", "a b;c", options),
    "flashcards_user=a%20b%3Bc; Path=/; Max-Age=3600; SameSite=Lax",
  );
});

test("serializeCookie should add Secure when requested", () => {
  assert.match(serializeCookie("consent", "accepted", { ...options, isSecure: true }), /; Secure$/);
});

test("readCookie should read back what serializeCookie wrote", () => {
  const pair = serializeCookie("flashcards_user", '{"email":"ana@mail.com"}', options).split(";")[0];
  assert.equal(readCookie(pair, "flashcards_user"), '{"email":"ana@mail.com"}');
});
