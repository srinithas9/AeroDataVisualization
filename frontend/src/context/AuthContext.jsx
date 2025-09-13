import React, { createContext, useContext, useEffect, useState } from "react";
import { parseJwt } from "../utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // load saved values from localStorage (if any)
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const storedRoleType = localStorage.getItem("role_type");
  const storedPrivileges = localStorage.getItem("privileges");

  const [token, setToken] = useState(storedToken || null);
  const [user, setUser] = useState(() => (storedToken ? parseJwt(storedToken) : null));
  const [role, setRole] = useState(storedRole || null);
  const [roleType, setRoleType] = useState(storedRoleType ? Number(storedRoleType) : null);
  const [privileges, setPrivileges] = useState(storedPrivileges ? JSON.parse(storedPrivileges) : []);

  // whenever token changes, update user from token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const parsed = parseJwt(token);
      setUser(parsed);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // whenever role/roleType/privileges change, sync to localStorage
  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  useEffect(() => {
    if (roleType !== null && roleType !== undefined) localStorage.setItem("role_type", String(roleType));
    else localStorage.removeItem("role_type");
  }, [roleType]);

  useEffect(() => {
    if (privileges && privileges.length) localStorage.setItem("privileges", JSON.stringify(privileges));
    else localStorage.removeItem("privileges");
  }, [privileges]);

  // Primary login API used by the app:
  // Pass login response object (so we can store token + role metadata)
  function loginWithResponse(loginResponse = {}) {
    // loginResponse may have: access_token, role, role_type, privileges
    if (loginResponse.access_token) {
      setToken(loginResponse.access_token);
    }
    // prefer explicit role from response over token payload
    if (loginResponse.role) setRole(loginResponse.role);
    if (loginResponse.role_type !== undefined && loginResponse.role_type !== null) setRoleType(loginResponse.role_type);
    if (loginResponse.privileges) setPrivileges(loginResponse.privileges);
  }

  function logout() {
    setToken(null);
    setRole(null);
    setRoleType(null);
    setPrivileges([]);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("role_type");
    localStorage.removeItem("privileges");
  }

  return (
    <AuthContext.Provider value={{ token, user, role, roleType, privileges, loginWithResponse, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
