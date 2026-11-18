import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  parseUserProfile,
  serializeUserProfile,
  validateUserProfile,
} from "./userProfile.ts";

test("validateUserProfile should reject an empty name and an empty email", () => {
  const result = validateUserProfile("   ", "");
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.equal(result.errors.email, "Informe o seu email.");
});

test("validateUserProfile should reject a name that is too short", () => {
  const result = validateUserProfile("A", "ana@mail.com");
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.equal(result.errors.email, undefined);
});

test("validateUserProfile should reject a name that is too long", () => {
  const result = validateUserProfile("a".repeat(MAX_NAME_LENGTH + 1), "ana@mail.com");
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
});

test("validateUserProfile should reject an email without domain", () => {
  const result = validateUserProfile("Ana", "ana@mail");
  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, "Email inválido.");
});

test("validateUserProfile should reject an email that is too long", () => {
  const result = validateUserProfile("Ana", `${"a".repeat(MAX_EMAIL_LENGTH)}@mail.com`);
  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, "Email inválido.");
});

test("validateUserProfile should normalize spaces in the name and lowercase the email", () => {
  const result = validateUserProfile("  Ana   Maria ", " Ana@Mail.COM ");
  assert.deepEqual(result, { isValid: true, profile: { name: "Ana Maria", email: "ana@mail.com" } });
});

test("parseUserProfile should return null when there is no stored value", () => {
  assert.equal(parseUserProfile(null), null);
  assert.equal(parseUserProfile(""), null);
});

test("parseUserProfile should return null when the stored value is not JSON", () => {
  assert.equal(parseUserProfile("not-json"), null);
});

test("parseUserProfile should return null when the stored JSON is not an object", () => {
  assert.equal(parseUserProfile("42"), null);
  assert.equal(parseUserProfile("null"), null);
});

test("parseUserProfile should return null when fields are missing or have the wrong type", () => {
  assert.equal(parseUserProfile('{"name":"Ana"}'), null);
  assert.equal(parseUserProfile('{"name":1,"email":"ana@mail.com"}'), null);
});

test("parseUserProfile should return null when the stored profile is invalid", () => {
  assert.equal(parseUserProfile('{"name":"Ana","email":"invalid"}'), null);
});

test("parseUserProfile should read back a serialized profile and drop extra fields", () => {
  const serialized = serializeUserProfile({ name: "Ana", email: "ana@mail.com" });
  assert.deepEqual(parseUserProfile(serialized), { name: "Ana", email: "ana@mail.com" });
  assert.deepEqual(parseUserProfile('{"name":"Ana","email":"ana@mail.com","isAdmin":true}'), {
    name: "Ana",
    email: "ana@mail.com",
  });
});
