import { ChevronRight } from "lucide-react";

import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSub,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "~/components/ui/collapsible";
import { FreePreviewBadge } from "~/components/course/identity-badge";
import { InternalLink } from "~/components/course/internal-link";

type Module = {
  id: string;
  order: number;
  slug: string;
  title: string;
  summary: string | null;
  isPublic: boolean;
  lessons: Array<{
    id: string;
    order: number;
    slug: string;
    title: string;
    summary: string | null;
    durationSec: number | null;
    isPublic: boolean;
  }>;
};

function Sidebar({
  modules,
  canAccessPrivate,
}: {
  modules: Module[];
  canAccessPrivate: boolean;
}) {
  return (
    <SidebarPrimitive>
      <SidebarContent>
        <CustomSidebarGroup>
          <SidebarMenu className="gap-2">
            {modules.map((module) =>
              module.lessons.length > 0 ? (
                <Collapsible
                  key={module.id}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <CustomSidebarGroupMenuButton asChild>
                        <div className="flex h-auto justify-between font-semibold">
                          <span className="flex gap-1">{module.title}</span>
                          <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      </CustomSidebarGroupMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CustomSidebarMenuSub>
                        {module.lessons.map((lesson) => (
                          <SidebarMenuSubItem key={lesson.id}>
                            <CustomSidebarMenuSubButton asChild>
                              <InternalLink
                                to={`/course/${module.slug}/${lesson.slug}`}
                                className="font-medium"
                              >
                                {lesson.title}
                                {(module.isPublic || lesson.isPublic) &&
                                  !canAccessPrivate && <FreePreviewBadge />}
                              </InternalLink>
                            </CustomSidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </CustomSidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={module.id}>
                  <CustomSidebarGroupMenuButton asChild>
                    <span>{module.title}</span>
                  </CustomSidebarGroupMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </CustomSidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  );
}

function CustomSidebarMenuSub(
  props: React.ComponentProps<typeof SidebarMenuSub>,
) {
  return <SidebarMenuSub {...props} className="mt-1 mr-0 gap-0 pr-0" />;
}

function CustomSidebarGroup(props: React.ComponentProps<typeof SidebarGroup>) {
  return <SidebarGroup {...props} className="px-3 py-4" />;
}

function CustomSidebarGroupMenuButton(
  props: React.ComponentProps<typeof SidebarMenuButton>,
) {
  return (
    <SidebarMenuButton
      {...props}
      className="h-9 cursor-pointer text-sm font-medium text-gray-950 select-none hover:bg-gray-200/60 data-[state=open]:hover:bg-gray-200/60"
    />
  );
}

function CustomSidebarMenuSubButton(
  props: React.ComponentProps<typeof SidebarMenuButton>,
) {
  return (
    <SidebarMenuButton
      {...props}
      className="h-auto text-gray-500 select-none hover:bg-gray-200/60 hover:text-gray-950"
    />
  );
}

export { Sidebar };
