# 🧪 Unit Testing Guide

This project uses **Vitest** as the core unit testing framework. It is fast, native to ESM, and highly compatible with TypeScript.

## 🚀 How to Run the Tests

### 1. Run Once (Standard)
To execute all test suites and view the results in the terminal, run:
```bash
npm run test
```
*Use this for CI/CD pipelines or before committing code.*

### 2. Watch Mode (Development)
To run tests in watch mode (tests will automatically re-run whenever you save a file), run:
```bash
npm run test:watch
```
*Use this while you are actively developing and writing new features.*

### 3. Run inside Docker
If you are purely working inside Docker and don't have Node installed locally, you can run the tests through the Docker container:
```bash
docker-compose exec app npm run test
```

---

## 📂 Where to Add New Tests

To keep the project organized, always add test files directly next to the file they are testing. Name them with the `.test.ts` extension.

- Example: If you are testing `src/core/utils/booking.ts`, the test file should be `src/core/utils/booking.test.ts`.

### Currently Tested Features:
1. **V1 Booking Utility** (`Telegram/src/core/utils/booking.test.ts`)
2. **Date Formatting** (`Telegram/src/core/utils/date.test.ts`)
3. **V2 Multi-Tenant Booking Engine** (`Telegram/src/core/utils/booking_v2.test.ts`)
4. **Instagram Session Store** (`Instagram/src/core/session.test.ts`)

---

## 📝 How to Write a Basic Test

Vitest syntax is almost identical to Jest.

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "./myFile.ts";

describe("myFunction()", () => {
  it("should return true when X is passed", () => {
    const result = myFunction("X");
    expect(result).toBe(true);
  });
});
```
