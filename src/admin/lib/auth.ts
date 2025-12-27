/**
 * ADMIN AUTHENTICATION
 * Handles login, session, and permissions
 */

export type UserRole = 'owner' | 'client';

export interface AdminUser {
  id: string;
  username: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

// Session storage key
const SESSION_KEY = 'autopilot_admin_session';
const ATTEMPTS_KEY = 'autopilot_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Owner credentials from ENV
const OWNER_USERNAME = import.meta.env.VITE_OWNER_USERNAME || 'admin';
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD || 'autopilot2025';

/**
 * Attempt to login with credentials
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  const { username, password } = credentials;

  // Check lockout
  const attempts = getLoginAttempts();
  if (attempts.count >= MAX_ATTEMPTS) {
    const timeSinceLast = Date.now() - attempts.lastAttempt;
    if (timeSinceLast < LOCKOUT_TIME) {
      const remainingMinutes = Math.ceil((LOCKOUT_TIME - timeSinceLast) / 60000);
      return {
        success: false,
        error: `חשבון נחסם. נסה שוב בעוד ${remainingMinutes} דקות.`,
      };
    } else {
      // Reset after lockout period
      resetLoginAttempts();
    }
  }

  // Check owner credentials
  if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
    const user: AdminUser = {
      id: 'owner-1',
      username: OWNER_USERNAME,
      role: 'owner',
    };

    // Save session
    saveSession(user);
    resetLoginAttempts();

    return { success: true, user };
  }

  // TODO: Check client credentials from Supabase
  // For now, allow test client login
  if (username === 'client' && password === 'client123') {
    const user: AdminUser = {
      id: 'client-1',
      username: 'client',
      role: 'client',
      storeId: 'store-1',
      storeName: 'SparkGear',
    };

    saveSession(user);
    resetLoginAttempts();

    return { success: true, user };
  }

  // Invalid credentials
  recordLoginAttempt();
  const currentAttempts = getLoginAttempts();
  const remainingAttempts = MAX_ATTEMPTS - currentAttempts.count;

  return {
    success: false,
    error:
      remainingAttempts > 0
        ? `שם משתמש או סיסמה שגויים. נותרו ${remainingAttempts} ניסיונות.`
        : 'חשבון נחסם עקב ניסיונות כושלים רבים מדי.',
  };
}

/**
 * Logout and clear session
 */
export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get current session
 */
export function getSession(): AdminUser | null {
  try {
    // Check session storage first (temporary)
    let sessionData = sessionStorage.getItem(SESSION_KEY);
    
    // Check local storage (remember me)
    if (!sessionData) {
      sessionData = localStorage.getItem(SESSION_KEY);
    }

    if (sessionData) {
      return JSON.parse(sessionData);
    }
  } catch (error) {
    console.error('Error reading session:', error);
  }

  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Check if user is owner
 */
export function isOwner(): boolean {
  const session = getSession();
  return session?.role === 'owner';
}

/**
 * Check if user is client
 */
export function isClient(): boolean {
  const session = getSession();
  return session?.role === 'client';
}

// Helper functions

function saveSession(user: AdminUser, rememberMe = false): void {
  const sessionData = JSON.stringify(user);
  
  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, sessionData);
  } else {
    sessionStorage.setItem(SESSION_KEY, sessionData);
  }
}

interface LoginAttempts {
  count: number;
  lastAttempt: number;
}

function getLoginAttempts(): LoginAttempts {
  try {
    const data = sessionStorage.getItem(ATTEMPTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading login attempts:', error);
  }
  return { count: 0, lastAttempt: 0 };
}

function recordLoginAttempt(): void {
  const attempts = getLoginAttempts();
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

function resetLoginAttempts(): void {
  sessionStorage.removeItem(ATTEMPTS_KEY);
}

