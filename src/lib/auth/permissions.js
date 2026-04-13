/**
 * Permission Map for CuentasClarasRD
 * Defines what each role is capable of doing.
 */
export const ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // Clients
  'client:create': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'client:update': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'client:archive': [ROLES.ADMIN],
  
  // Invoices
  'invoice:create': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'invoice:sign': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'invoice:void': [ROLES.ADMIN],
  
  // Purchases (606)
  'purchase:create': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'purchase:export': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'purchase:delete': [ROLES.ADMIN],
  
  // Sales (607)
  'sale:create': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'sale:export': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'sale:void': [ROLES.ADMIN],
  
  // Settings
  'settings:manage': [ROLES.ADMIN],
  'settings:view': [ROLES.ADMIN, ROLES.ACCOUNTANT],
  'certificate:manage': [ROLES.ADMIN]
};

/**
 * Checks if a role has a specific permission.
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;
  if (role === ROLES.ADMIN) return true; // Admins can do everything
  
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(role);
};
