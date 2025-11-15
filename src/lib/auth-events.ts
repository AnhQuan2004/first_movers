const AUTH_CHANGE_EVENT = "fm-auth-change";

export const emitAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const subscribeToAuthChange = (listener: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(AUTH_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
  };
};

export const getIsAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return sessionStorage.getItem("userEmail") !== null;
};

