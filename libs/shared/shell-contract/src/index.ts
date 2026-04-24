export interface RemoteAppDefinition {
  name: string;
  routePath: string;
  remoteEntry: string;
  exposedModule: string;
  displayName: string;
  requiredPermissions?: string[];
}

export interface RemoteAppNavItem {
  label: string;
  routePath: string;
  icon: string;
  requiredPermissions?: string[];
}

