import { Link } from "react-router";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import { cn } from "~/utils/style";
import Icon from "~/components/ui/icon";
import { IconSvgElement } from "@hugeicons/react";

type SidebarItemProps = {
  icon: IconSvgElement;
  label: string;
  link: string;
  isActive: boolean;
};

function SidebarItem({
  icon,
  label,
  link,
  isActive,
}: SidebarItemProps) {
  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={label}
      className={cn(
        "relative group/item transition-all duration-200",
        isActive && "bg-brand-50 hover:bg-brand-100",
        !isActive && "hover:bg-brand-100/50"
      )}
    >
      <Link to={link} prefetch="intent" className="flex items-center gap-2.5 w-full">
        <Icon icon={icon} className={cn('size-5', isActive
          ? "text-brand-600 scale-110"
          : "text-gray-500 group-hover/item:text-brand-500 group-hover/item:scale-105")} />
        <span
          className={cn(
            "flex-1 font-medium transition-colors duration-200",
            isActive
              ? "text-gray-900"
              : "text-gray-700 group-hover/item:text-gray-900"
          )}
        >
          {label}
        </span>
      </Link>
    </SidebarMenuButton>
  );
}

export { SidebarItem };
