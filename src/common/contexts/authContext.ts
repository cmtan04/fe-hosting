import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  signIn as signInApi,
  signUp as signUpApi,
} from "../../api/configs/auth.config";
import { getUserPRofile } from "../../api/configs/user.config";
import type {
  SignInPayloadDto,
  SignInResponseDto,
  SignUpPayloadDto,
  SignUpResponseDto,
} from "../../api/dtos/auth.dto";
import type { UserProfileResponseDto } from "../../api/dtos/user.dto";

const TOKEN_STORAGE_KEY = "token";
const ROLE_STORAGE_KEY = "userRole";

interface AuthContextType {
  token: string | null;
  user: UserProfileResponseDto | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: SignInPayloadDto) => Promise<SignInResponseDto>;
  signUp: (payload: SignUpPayloadDto) => Promise<SignUpResponseDto>;
  signOut: () => void;
  setUser: (user: UserProfileResponseDto | null) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState<UserProfileResponseDto | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const applyAuthenticatedState = useCallback(
    (nextToken: string, nextUser: UserProfileResponseDto | null) => {
      setToken(nextToken);
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);

      if (nextUser?.role) {
        localStorage.setItem(ROLE_STORAGE_KEY, nextUser.role);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
      }

      setCurrentUser(nextUser);
    },
    [],
  );

  const setUser = useCallback((nextUser: UserProfileResponseDto | null) => {
    setCurrentUser(nextUser);
    if (nextUser?.role) {
      localStorage.setItem(ROLE_STORAGE_KEY, nextUser.role);
      return;
    }
    localStorage.removeItem(ROLE_STORAGE_KEY);
  }, []);

  const signOut = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setCurrentUser(null);
  }, []);

  const fetchAndApplyUserProfile = useCallback(
    async (nextToken: string) => {
      const profile = await getUserPRofile();
      applyAuthenticatedState(nextToken, profile);
    },
    [applyAuthenticatedState],
  );

  const checkAuthStatus = useCallback(async () => {
    const currentToken = getStoredToken();

    if (!currentToken) {
      signOut();
      return;
    }

    setIsLoading(true);
    try {
      await fetchAndApplyUserProfile(currentToken);
    } catch {
      signOut();
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndApplyUserProfile, signOut]);

  const signIn = useCallback(
    async (payload: SignInPayloadDto) => {
      setIsLoading(true);
      try {
        const response = await signInApi(payload);
        applyAuthenticatedState(response.access_token, null);
        await fetchAndApplyUserProfile(response.access_token);
        return response;
      } catch (error) {
        signOut();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [applyAuthenticatedState, fetchAndApplyUserProfile, signOut],
  );

  const signUp = useCallback(async (payload: SignUpPayloadDto) => {
    setIsLoading(true);
    try {
      const response = await signUpApi(payload);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  const userRole = useMemo(
    () => currentUser?.role ?? localStorage.getItem(ROLE_STORAGE_KEY),
    [currentUser?.role],
  );

  const isAuthenticated = Boolean(token);

  const contextValue = useMemo(
    () => ({
      token,
      user: currentUser,
      userRole,
      isAuthenticated,
      isLoading,
      signIn,
      signUp,
      signOut,
      setUser,
      checkAuthStatus,
    }),
    [
      token,
      currentUser,
      userRole,
      isAuthenticated,
      isLoading,
      signIn,
      signUp,
      signOut,
      setUser,
      checkAuthStatus,
    ],
  );

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children,
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
