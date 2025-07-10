import { useUser } from '@clerk/clerk-react';

interface UserRoleHookResult {
  role: string | null;
  isLoading: boolean;
}

export const useClerkUserRole = (): UserRoleHookResult => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return { role: null, isLoading: true };
  }

  if (!user) {
    return { role: null, isLoading: false }; // User not found, but loading is complete
  }

  // Assuming 'role' is stored in publicMetadata
  const role = (user.publicMetadata?.role as string) || null;

  return { role, isLoading: false };
};
