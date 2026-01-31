import { Link } from "react-router";
import { Lock } from "~/components/icons/Lock";
import { SvgProps } from "~/components/icons/types";
import { Permission, hasPathPermission } from "~/data/permission";

type SidebarItemProps = {
  icon: React.ComponentType<SvgProps>;
  label: string;
  link: string;
  isActive: boolean;
  userPermissions: Permission;
};

function SidebarItem({
  icon: Icon,
  label,
  link,
  isActive,
  userPermissions,
}: SidebarItemProps) {
  const canAccess = hasPathPermission(userPermissions, link);
  const isLocked = !canAccess;

  return (
    <Link
      to={link}
      data-active={isActive}
      className="text-sm flex px-3 py-2 group data-[active=true]:bg-gray-200 rounded-md items-center hover:bg-gray-100 transition-colors"
      prefetch="intent"
    >
      <div className="flex-1 flex items-center space-x-2">
        <Icon className="size-5 text-gray-500 group-data-[active=true]:text-brand-600 group-hover:text-brand-600 group-data-[active=true]:scale-110 group-hover:scale-110 transition-all" />
        <div className="font-medium text-gray-700 group-data-[active=true]:text-gray-900 group-hover:text-gray-700 transition-colors">
          {label}
        </div>
      </div>
      {isLocked && <Lock className="size-4 text-[#FBBF24]" />}
    </Link>
  );
}

export { SidebarItem };
