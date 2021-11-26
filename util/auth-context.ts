import { createContext, useContext } from 'react';

// create type definition for auth context
// so that the defined properties can be passed to context provider
export type AuthContext = {
  hasAuth: boolean;
  updateAuthStatus: () => void;
  userId: number;
  profileId: number;
  firstName: string;
};

export const authContext = createContext<AuthContext>({
  hasAuth: false,
  updateAuthStatus: () => {},
  profileId: 0,
  userId: 0,
  firstName: '',
});

export function useAuthContext() {
  return useContext(authContext);
}
