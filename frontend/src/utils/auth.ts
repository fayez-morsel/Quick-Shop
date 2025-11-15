import type { UserRole } from "../types";

const ACCOUNTS_KEY = "qs-user-accounts";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export type StoredAccount = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const isValidRole = (value: string): value is UserRole =>
  value === "buyer" || value === "seller";

const safeParseAccounts = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is StoredAccount =>
          typeof item === "object" &&
          item !== null &&
          typeof item.email === "string" &&
          typeof item.password === "string" &&
          typeof item.role === "string" &&
          isValidRole(item.role) &&
          typeof item.name === "string"
      );
    }
  } catch (error) {
    console.error("Failed to parse stored accounts", error);
  }
  return [] as StoredAccount[];
};

export const getStoredAccounts = (): StoredAccount[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) {
    return [];
  }
  return safeParseAccounts(raw);
};

export const setStoredAccounts = (accounts: StoredAccount[]) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const addAccount = (account: StoredAccount) => {
  const normalizedEmail = normalizeEmail(account.email);
  const nextAccount = { ...account, email: normalizedEmail };
  const existingAccounts = getStoredAccounts().filter(
    (stored) =>
      stored.email !== normalizedEmail || stored.role !== nextAccount.role
  );
  existingAccounts.push(nextAccount);
  setStoredAccounts(existingAccounts);
};

export const getAccountByEmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  return getStoredAccounts().find((account) => account.email === normalizedEmail);
};

export const getAccountByEmailAndRole = (email: string, role: UserRole) => {
  const normalizedEmail = normalizeEmail(email);
  return getStoredAccounts().find(
    (account) => account.email === normalizedEmail && account.role === role
  );
};
