import { memo } from "react";

const UserProfile = memo(({ session }: { session: any }) => {
  return (
    <div className="mb-6 mt-2 flex items-center px-2">
      <div className="relative w-10 h-10 mr-3">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="Profile"
            className="rounded-full w-10 h-10 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="rounded-full w-10 h-10 bg-orange-500/20 flex items-center justify-center text-orange-500">
            {session.user?.name?.charAt(0) || "U"}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white truncate max-w-[140px]">
          {session.user?.name || "Пользователь"}
        </span>
        <span className="text-xs text-zinc-400 truncate max-w-[140px]">
          {session.user?.email || ""}
        </span>
      </div>
    </div>
  );
});

UserProfile.displayName = "UserProfile";

export default UserProfile;
