import { createContext, useState } from "react";

// ─────────────────────────────────────────────────────────────
// ✅ AvailabilityContext
// Think of this as a WiFi router — broadcasts availability
// to ANY component that wants to tune in
// ─────────────────────────────────────────────────────────────

export const AvailabilityContext = createContext();

export const AvailabilityProvider = ({ children }) => {
  // ✅ true  = Open to Work (green badge)
  // ✅ false = Not Available (red badge)
  // Change this one value to update your status everywhere
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <AvailabilityContext.Provider value={{ isAvailable, setIsAvailable }}>
      {children}
    </AvailabilityContext.Provider>
  );
};