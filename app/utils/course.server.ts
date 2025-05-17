import { Chapter, Lesson, LESSONS } from "~/data/course";

type ChaptersMap = Record<string, Chapter>;
type LessonsMap = Record<
  string,
  Lesson & {
    chaptersMap: ChaptersMap;
  }
>;

const lessonsMap = LESSONS.reduce<LessonsMap>((acc, cur) => {
  acc[cur.slug] = {
    ...cur,
    chaptersMap: cur.chapters.reduce<ChaptersMap>((cacc, ccur) => {
      cacc[ccur.slug] = ccur;
      return cacc;
    }, {}),
  };
  return acc;
}, {});

function getSyllabus() {
  return LESSONS.map((lesson) => {
    const chapterDurationMap = {} as Record<string, number>;
    let totalDuration = 0;
    let examCount = 0;

    lesson.chapters.forEach((chapter) => {
      const teachingTotalDuration = chapter.teachings.reduce<number>(
        (acc, cur) => acc + cur.duration,
        0
      );
      const examTotalDuration = chapter.exams.reduce<number>(
        (acc, cur) => acc + cur.duration,
        0
      );
      const chapterDuration = teachingTotalDuration + examTotalDuration;

      chapterDurationMap[chapter.slug] = chapterDuration;
      totalDuration += chapterDuration;
      examCount += chapter.exams.length;
    });

    return {
      name: lesson.name,
      description: lesson.description,
      slug: lesson.slug,
      totalDuration,
      examCount,
      chapters: lesson.chapters.map((chapter) => {
        return {
          name: chapter.name,
          duration: chapterDurationMap[chapter.slug],
          slug: chapter.slug,
          examCount: chapter.exams.length,
        };
      }),
    };
  });
}

function getLesson({ lessonSlug }: { lessonSlug: string }) {
  return lessonsMap[lessonSlug];
}

function getChapter({
  lessonSlug,
  chapterSlug,
}: {
  lessonSlug: string;
  chapterSlug: string;
}) {
  const lesson = lessonsMap[lessonSlug];
  const chapter = lessonsMap[lessonSlug].chaptersMap[chapterSlug];

  const index = lesson.chapters.findIndex((c) => c.slug === chapterSlug);
  const nextChapter =
    index + 1 < lesson.chapters.length ? lesson.chapters[index + 1] : null;

  return {
    lessonMeta: {
      name: lesson.name,
      slug: lesson.slug,
      chapters: lesson.chapters.map((c) => ({
        name: c.name,
        slug: c.slug,
      })),
    },
    ...chapter,
    nextChapter,
  };
}

export { getSyllabus, getLesson, getChapter };
