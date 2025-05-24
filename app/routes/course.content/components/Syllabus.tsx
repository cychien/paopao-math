import format from "format-duration";

type SyllabusProps = {
  lessonSlug: string;
  chapters: Array<{
    name: string;
    duration: number;
    slug: string;
    examCount: number;
  }>;
};

function Syllabus({ lessonSlug, chapters }: SyllabusProps) {
  return (
    <div className="border border-gray-200 rounded-md flex-1 overflow-hidden">
      {chapters.map((chapter) => (
        <a
          key={chapter.slug}
          href={`/course/content/${lessonSlug}/${chapter.slug}`}
          className="px-4 py-3 text-sm flex justify-between [&:not(:last-child)]:border-b border-gray-200 hover:bg-gray-100 transition-colors gap-1"
        >
          <div className="text-gray-700 font-medium">{chapter.name}</div>
          <div className="flex items-center text-gray-500 space-x-1.5 shrink-0">
            <span>{chapter.examCount} 例題</span>
            <div className="size-[3px] bg-gray-200 rounded-full" />
            <span>{format(chapter.duration * 1000)}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

export { Syllabus };
