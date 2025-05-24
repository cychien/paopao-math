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
      className="text-sm flex px-3 py-2 group data-[active=true]:bg-gray-100 rounded-md items-center hover:bg-gray-100 transition-colors"
    >
      <div className="flex-1 flex items-center space-x-2">
        <Icon className="size-5 text-gray-400 group-data-[active=true]:text-brand-500 group-hover:text-brand-500 group-data-[active=true]:scale-110 group-hover:scale-110 transition-all" />
        <div className="font-medium text-gray-500 group-data-[active=true]:text-gray-700 group-hover:text-gray-700 transition-colors">
          {label}
        </div>
      </div>
    </a>
  );
}

export { SidebarItem };
