import { FooterSection } from "~/components/layout/FooterSection";

export function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-brand-600">
          {children}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
