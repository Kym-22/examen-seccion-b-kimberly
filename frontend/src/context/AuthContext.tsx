"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/entities/user.entity";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
 * Tiempo de inactividad para la demostración:
 * 30 segundos.
 *
 * En producción podría cambiarse, por ejemplo, a:
 * 15 * 60 * 1000 para 15 minutos.
 */
const INACTIVITY_TIMEOUT = 30 * 1000;

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const session = AuthService.getStoredSession();

    if (session) {
      setUser(session.user);
      setToken(session.token);
    }

    setLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<void> => {
    const session = await AuthService.login({
      username,
      password,
    });

    setUser(session.user);
    setToken(session.token);

    console.log("[AUTH] Sesión iniciada correctamente.");
  };

  const logout = useCallback(async (): Promise<void> => {
    const storedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken
            ? { Authorization: `Bearer ${storedToken}` }
            : {}),
        },
      });

      console.log(
        "[AUTH] Cierre de sesión sincronizado con el backend."
      );
    } catch (error) {
      console.error(
        "[AUTH] No se pudo notificar el cierre de sesión al backend:",
        error
      );
    } finally {
      AuthService.logout();
      setUser(null);
      setToken(null);

      console.log(
        "[AUTH] Sesión cerrada y almacenamiento local eliminado."
      );

      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const closeSessionForInactivity = (): void => {
      console.warn(
        "[SEGURIDAD] Sesión cerrada por 30 segundos de inactividad."
      );

      void logout();
    };

    const resetInactivityTimer = (): void => {
      clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(
        closeSessionForInactivity,
        INACTIVITY_TIMEOUT
      );
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(
        eventName,
        resetInactivityTimer,
        { passive: true }
      );
    });

    resetInactivityTimer();

    console.log(
      "[SEGURIDAD] Control de inactividad activado: 30 segundos."
    );

    return () => {
      clearTimeout(inactivityTimer);

      activityEvents.forEach((eventName) => {
        window.removeEventListener(
          eventName,
          resetInactivityTimer
        );
      });
    };
  }, [token, user, logout]);

  const isAdmin =
    !!user?.roles &&
    user.roles.includes("ROLE_ADMIN");

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe usarse dentro de un AuthProvider"
    );
  }

  return context;
};