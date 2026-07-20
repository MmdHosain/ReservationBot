import { describe, it, expect, beforeEach } from "vitest";
import { getSession, setSession, updateSession, clearSession } from "./session.ts";

describe("Instagram Memory Session Manager", () => {
  const mockId = "user_12345";

  beforeEach(() => {
    // Ensure clean state before each test
    clearSession(mockId);
  });

  it("returns a default empty session for a new user", () => {
    const session = getSession(mockId);
    expect(session).toEqual({ state: {} });
  });

  it("sets and retrieves a session correctly", () => {
    setSession(mockId, { step: "onboarding", state: { count: 1 } });
    const session = getSession(mockId);
    expect(session.step).toBe("onboarding");
    expect(session.state?.count).toBe(1);
  });

  it("updates an existing session, merging properties", () => {
    setSession(mockId, { step: "step1", state: { active: true } });
    updateSession(mockId, { step: "step2", state: { newFlag: true } });
    
    const session = getSession(mockId);
    expect(session.step).toBe("step2"); // Overridden
    expect(session.state?.active).toBe(true); // Maintained
    expect(session.state?.newFlag).toBe(true); // Added
  });

  it("clears a session successfully", () => {
    setSession(mockId, { step: "done" });
    clearSession(mockId);
    
    const session = getSession(mockId);
    expect(session.step).toBeUndefined(); // Should be back to default empty session
    expect(session).toEqual({ state: {} });
  });
});
