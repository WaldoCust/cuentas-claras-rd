import { redirect } from 'next/navigation';
import { getUserRole } from './get-user-role';
import { hasPermission } from './permissions';

/**
 * Enforcement utility for server-side authorization.
 * If the user doesn't have the permission, it redirects or throws.
 * @param {string} permission - The permission to check
 * @param {object} options - Options (redirectUrl, throwOnly)
 */
export const requirePermission = async (permission, options = {}) => {
  const role = await getUserRole();
  const allowed = hasPermission(role, permission);

  if (!allowed) {
    if (options.throwOnly) {
      throw new Error('Unauthorized: Permission Denied');
    }
    
    // Redirect to dashboard with unauthorized flag
    redirect('/dashboard?unauthorized=true');
  }

  return { role, allowed };
};

/**
 * Specifically requires a role (e.g., admin).
 */
export const requireRole = async (targetRole) => {
  const role = await getUserRole();
  
  if (role !== targetRole && role !== 'admin') {
     redirect('/dashboard?unauthorized=true');
  }
  
  return role;
};
