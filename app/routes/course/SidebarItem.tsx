import { SvgProps } from "~/components/icons/types";

type SidebarItemProps = {
  icon: React.ComponentType<SvgProps>;
  label: string;
  link: string;
  isActive: boolean;
};

function SidebarItem({ icon: Icon, label, link, isActive }: SidebarItemProps) {
  return (
    <a
      href={link}
      data-active={isActive}
      className="flex px-3 py-2 space-x-2 group data-[active=true]:bg-brand-50 rounded-md items-center hover:bg-brand-50 transition-colors"
    >
      <Icon className="size-5 text-gray-400 group-data-[active=true]:text-brand-500 group-hover:text-brand-500 transition-colors" />
      <div className="font-medium text-gray-500 group-data-[active=true]:text-gray-700 group-hover:text-gray-700 -translate-px">
        {label}
      </div>
    </a>
  );
}

export { SidebarItem };
