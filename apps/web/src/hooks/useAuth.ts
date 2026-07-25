import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const rawUser = useAuthStore((state) => state.user);
  
  const user: any = rawUser ? {
    ...rawUser,
    user_metadata: {
      first_name: rawUser.name?.split(' ')[0] || rawUser.name,
      full_name: rawUser.name,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || "U")}`
    }
  } : null;

  return { session: user ? { user } : null, user, loading: false };
}
