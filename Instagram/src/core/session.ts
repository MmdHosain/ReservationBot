// Instagram/src/core/session.ts

export interface IGSessionData {
  step?: string;
  state?: Record<string, any>;
}

// In-memory session store mapped by Instagram ID
// Note: For multi-instance deployments, this should be replaced with Redis.
const sessions = new Map<string, IGSessionData>();

export const getSession = (igId: string): IGSessionData => {
  if (!sessions.has(igId)) {
    sessions.set(igId, { state: {} });
  }
  return sessions.get(igId)!;
};

export const setSession = (igId: string, data: IGSessionData) => {
  sessions.set(igId, data);
};

export const updateSession = (igId: string, data: Partial<IGSessionData>) => {
  const current = getSession(igId);
  sessions.set(igId, {
    ...current,
    ...data,
    state: { ...current.state, ...data.state }
  });
};

export const clearSession = (igId: string) => {
  sessions.delete(igId);
};
