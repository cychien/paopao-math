import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/utils/style";

function CallToActionSection() {
  return (
    <section className="bg-bg-brand-section py-24">
      <div className="container mx-auto flex flex-col lg:items-center">
        <h3 className="font-semibold text-text-primary-on-brand text-4xl leading-[44px]">
          立即加入總複習班，享限時優惠價
        </h3>
        <p className="mt-5 text-xl text-text-tertiary-on-brand">
          馬上開始系統複習，持續獲得練習題，穩步提升應考實力！
        </p>
        <div className="mt-8">
          <Link
            to="/purchase"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full bg-bg-brand-secondary text-text-primary hover:enabled:bg-bg-brand-secondary-hover lg:w-auto"
            )}
          >
            立即購買
          </Link>
        </div>
      </div>
    </section>
  );
}

export { CallToActionSection };
