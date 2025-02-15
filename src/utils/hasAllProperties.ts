import { UserCredential } from "@models/UserCredential.model";

export function hasAllProperties(obj: any): obj is UserCredential {
  const expectedKeys = ["email", "password"];
  const objKeys = Object.keys(obj);
  return expectedKeys.every((key) => objKeys.includes(key));
}
