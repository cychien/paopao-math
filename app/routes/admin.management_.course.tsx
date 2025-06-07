import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { requireAdmin } from "~/services/auth/session";
import {
  getAllLessonsWithDetails,
  getCourseStats,
  type LessonWithDetails,
  type ChapterWithDetails,
  type TeachingDetails,
  type ExamDetails,
} from "~/services/database/course";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  ArrowLeft,
  TableOfContents,
  BarChart3,
  BookA,
  X,
  ChevronUp,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/Dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
} from "~/components/ui/AlertDialog";

type LoaderData = {
  lessons: Awaited<ReturnType<typeof getAllLessonsWithDetails>>;
  stats: Awaited<ReturnType<typeof getCourseStats>>;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);

  const [lessons, stats] = await Promise.all([
    getAllLessonsWithDetails(),
    getCourseStats(),
  ]);

  return json<LoaderData>({
    lessons,
    stats,
  });
};

export default function CourseManagementPage() {
  const { lessons, stats } = useLoaderData<LoaderData>();
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );

  // Dialog 狀態
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isTeachingDialogOpen, setIsTeachingDialogOpen] = useState(false);
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingLesson, setEditingLesson] = useState<{
    id: string;
    name: string;
    description?: string | null;
  } | null>(null);
  const [editingChapter, setEditingChapter] = useState<{
    id: string;
    name: string;
    slug: string;
  } | null>(null);
  const [editingTeaching, setEditingTeaching] = useState<{
    id: string;
    videoId: string;
    duration: number;
    chapterId: string;
  } | null>(null);
  const [editingExam, setEditingExam] = useState<{
    id: string;
    videoId: string;
    duration: number;
    chapterId: string;
  } | null>(null);

  // 刪除相關狀態
  const [deleteItem, setDeleteItem] = useState<{
    type: "lesson" | "chapter" | "teaching" | "exam";
    id: string;
    name: string;
  } | null>(null);

  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  // Fetchers
  const lessonFetcher = useFetcher();
  const chapterFetcher = useFetcher();
  const teachingFetcher = useFetcher();
  const examFetcher = useFetcher();
  const reorderFetcher = useFetcher();

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  // 排序相關函數
  const handleReorderLessons = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const updates = lessons.map((lesson, index) => {
      let newOrder = lesson.order;

      if (fromIndex < toIndex) {
        // 向下移動
        if (index === fromIndex) {
          newOrder = lessons[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = lessons[index - 1].order;
        }
      } else {
        // 向上移動
        if (index === fromIndex) {
          newOrder = lessons[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = lessons[index + 1].order;
        }
      }

      return { id: lesson.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/lessons",
    });
  };

  const handleReorderChapters = (
    lessonId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const updates = lesson.chapters.map((chapter, index) => {
      let newOrder = chapter.order;

      if (fromIndex < toIndex) {
        // 向下移動
        if (index === fromIndex) {
          newOrder = lesson.chapters[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = lesson.chapters[index - 1].order;
        }
      } else {
        // 向上移動
        if (index === fromIndex) {
          newOrder = lesson.chapters[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = lesson.chapters[index + 1].order;
        }
      }

      return { id: chapter.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/chapters",
    });
  };

  const handleReorderTeachings = (
    chapterId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    const lesson = lessons.find((l) =>
      l.chapters.some((c) => c.id === chapterId)
    );
    const chapter = lesson?.chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    const updates = chapter.teachings.map((teaching, index) => {
      let newOrder = teaching.order;

      if (fromIndex < toIndex) {
        // 向下移動
        if (index === fromIndex) {
          newOrder = chapter.teachings[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = chapter.teachings[index - 1].order;
        }
      } else {
        // 向上移動
        if (index === fromIndex) {
          newOrder = chapter.teachings[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = chapter.teachings[index + 1].order;
        }
      }

      return { id: teaching.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/teachings",
    });
  };

  const handleReorderExams = (
    chapterId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    const lesson = lessons.find((l) =>
      l.chapters.some((c) => c.id === chapterId)
    );
    const chapter = lesson?.chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    const updates = chapter.exams.map((exam, index) => {
      let newOrder = exam.order;

      if (fromIndex < toIndex) {
        // 向下移動
        if (index === fromIndex) {
          newOrder = chapter.exams[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = chapter.exams[index - 1].order;
        }
      } else {
        // 向上移動
        if (index === fromIndex) {
          newOrder = chapter.exams[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = chapter.exams[index + 1].order;
        }
      }

      return { id: exam.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/exams",
    });
  };

  // Lesson 操作
  const handleCreateLesson = () => {
    setEditingLesson(null);
    setIsLessonDialogOpen(true);
  };

  const handleEditLesson = (lesson: {
    id: string;
    name: string;
    description?: string | null;
  }) => {
    setEditingLesson(lesson);
    setIsLessonDialogOpen(true);
  };

  const handleLessonSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingLesson) {
      formData.append("intent", "update");
      formData.append("id", editingLesson.id);
      lessonFetcher.submit(formData, {
        method: "PATCH",
        action: "/api/lessons",
      });
    } else {
      formData.append("intent", "create");
      lessonFetcher.submit(formData, {
        method: "POST",
        action: "/api/lessons",
      });
    }

    setIsLessonDialogOpen(false);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (lessonId: string, lessonName: string) => {
    setDeleteItem({
      type: "lesson",
      id: lessonId,
      name: lessonName,
    });
    setIsDeleteDialogOpen(true);
  };

  // Chapter 操作
  const handleCreateChapter = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setEditingChapter(null);
    setIsChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: {
    id: string;
    name: string;
    slug: string;
  }) => {
    setEditingChapter(chapter);
    setIsChapterDialogOpen(true);
  };

  const handleChapterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingChapter) {
      formData.append("intent", "update");
      formData.append("id", editingChapter.id);
      chapterFetcher.submit(formData, {
        method: "PATCH",
        action: "/api/chapters",
      });
    } else {
      formData.append("intent", "create");
      formData.append("lessonId", selectedLessonId);
      chapterFetcher.submit(formData, {
        method: "POST",
        action: "/api/chapters",
      });
    }

    setIsChapterDialogOpen(false);
    setEditingChapter(null);
  };

  const handleDeleteChapter = (chapterId: string, chapterName: string) => {
    setDeleteItem({
      type: "chapter",
      id: chapterId,
      name: chapterName,
    });
    setIsDeleteDialogOpen(true);
  };

  // Teaching 操作
  const handleCreateTeaching = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setEditingTeaching(null);
    setIsTeachingDialogOpen(true);
  };

  const handleEditTeaching = (teaching: {
    id: string;
    videoId: string;
    duration: number;
    chapterId: string;
  }) => {
    setEditingTeaching(teaching);
    setIsTeachingDialogOpen(true);
  };

  const handleTeachingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingTeaching) {
      formData.append("intent", "update");
      formData.append("id", editingTeaching.id);
      teachingFetcher.submit(formData, {
        method: "PATCH",
        action: "/api/teachings",
      });
    } else {
      formData.append("intent", "create");
      formData.append("chapterId", selectedChapterId);
      teachingFetcher.submit(formData, {
        method: "POST",
        action: "/api/teachings",
      });
    }

    setIsTeachingDialogOpen(false);
    setEditingTeaching(null);
  };

  const handleDeleteTeaching = (teachingId: string, teachingName: string) => {
    setDeleteItem({
      type: "teaching",
      id: teachingId,
      name: teachingName,
    });
    setIsDeleteDialogOpen(true);
  };

  // Exam 操作
  const handleCreateExam = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setEditingExam(null);
    setIsExamDialogOpen(true);
  };

  const handleEditExam = (exam: {
    id: string;
    videoId: string;
    duration: number;
    chapterId: string;
  }) => {
    setEditingExam(exam);
    setIsExamDialogOpen(true);
  };

  const handleExamSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingExam) {
      formData.append("intent", "update");
      formData.append("id", editingExam.id);
      examFetcher.submit(formData, {
        method: "PATCH",
        action: "/api/exams",
      });
    } else {
      formData.append("intent", "create");
      formData.append("chapterId", selectedChapterId);
      examFetcher.submit(formData, {
        method: "POST",
        action: "/api/exams",
      });
    }

    setIsExamDialogOpen(false);
    setEditingExam(null);
  };

  const handleDeleteExam = (examId: string, examName: string) => {
    setDeleteItem({
      type: "exam",
      id: examId,
      name: examName,
    });
    setIsDeleteDialogOpen(true);
  };

  // 統一刪除處理
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("id", deleteItem.id);

    switch (deleteItem.type) {
      case "lesson":
        lessonFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/lessons",
        });
        break;
      case "chapter":
        chapterFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/chapters",
        });
        break;
      case "teaching":
        teachingFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/teachings",
        });
        break;
      case "exam":
        examFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/exams",
        });
        break;
    }

    setIsDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const getDeleteMessage = () => {
    if (!deleteItem) return "";

    switch (deleteItem.type) {
      case "lesson":
        return "確定要刪除此課程嗎？這將會刪除所有相關的章節和內容。";
      case "chapter":
        return "確定要刪除此章節嗎？這將會刪除所有相關的觀念講解和突破關卡。";
      case "teaching":
        return "確定要刪除此觀念講解嗎？";
      case "exam":
        return "確定要刪除此突破關卡嗎？";
      default:
        return "確定要刪除此項目嗎？";
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* 返回按鈕和標題 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/admin/management"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回管理中心
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">課程管理</h1>
        <p className="text-gray-600">管理所有課程內容、章節和觀念講解</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <BookA className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">單元總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.lessons}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <TableOfContents className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">章節總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.chapters}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <BookOpen className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">觀念講解總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.teachings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">突破關卡總數</p>
              <p className="text-2xl font-bold text-gray-900">{stats.exams}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 課程列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">課程列表</h2>
          <Button onClick={handleCreateLesson}>
            <Plus className="w-4 h-4" />
            新增課程
          </Button>
        </div>

        <div className="divide-y divide-gray-300">
          {lessons.map((lesson: LessonWithDetails, lessonIndex: number) => {
            const isExpanded = expandedLessons.has(lesson.id);
            const totalTeachings = lesson.chapters.reduce(
              (sum: number, chapter: ChapterWithDetails) =>
                sum + chapter.teachings.length,
              0
            );
            const totalExams = lesson.chapters.reduce(
              (sum: number, chapter: ChapterWithDetails) =>
                sum + chapter.exams.length,
              0
            );
            const totalDuration = lesson.chapters.reduce(
              (sum: number, chapter: ChapterWithDetails) =>
                sum +
                chapter.teachings.reduce(
                  (chapterSum: number, teaching: TeachingDetails) =>
                    chapterSum + teaching.duration,
                  0
                ) +
                chapter.exams.reduce(
                  (chapterSum: number, exam: ExamDetails) =>
                    chapterSum + exam.duration,
                  0
                ),
              0
            );

            return (
              <div key={lesson.id} className="p-6">
                {/* 課程標題行 */}
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className="flex items-center space-x-2 hover:bg-gray-200 rounded-lg p-2 -m-2 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="shrink-0 w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="shrink-0 w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lesson.name}
                        </h3>
                        {lesson.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        {lesson.chapters.length} 章節 • {totalTeachings}{" "}
                        觀念講解 • {totalExams} 突破關卡
                      </div>
                      <div className="text-sm text-gray-500">
                        總時長: {Math.floor(totalDuration / 60)} 分鐘
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* 排序按鈕 */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          handleReorderLessons(lessonIndex, lessonIndex - 1)
                        }
                        disabled={
                          lessonIndex === 0 ||
                          reorderFetcher.state === "submitting"
                        }
                        title="上移"
                      >
                        <MoveUp className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          handleReorderLessons(lessonIndex, lessonIndex + 1)
                        }
                        disabled={
                          lessonIndex === lessons.length - 1 ||
                          reorderFetcher.state === "submitting"
                        }
                        title="下移"
                      >
                        <MoveDown className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleDeleteLesson(lesson.id, lesson.name)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 展開的章節內容 */}
                {isExpanded && (
                  <div className="mt-6 ml-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-700">
                        章節列表
                      </h4>
                      <Button onClick={() => handleCreateChapter(lesson.id)}>
                        <Plus className="w-3 h-3" />
                        新增章節
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {lesson.chapters.map(
                        (chapter: ChapterWithDetails, chapterIndex: number) => (
                          <div
                            key={chapter.id}
                            className="bg-gray-100 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {chapter.name}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {chapter.teachings.length} 觀念講解 •{" "}
                                  {chapter.exams.length} 突破關卡
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {/* 章節排序按鈕 */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleReorderChapters(
                                      lesson.id,
                                      chapterIndex,
                                      chapterIndex - 1
                                    )
                                  }
                                  disabled={
                                    chapterIndex === 0 ||
                                    reorderFetcher.state === "submitting"
                                  }
                                  title="上移"
                                >
                                  <ChevronUp className="size-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleReorderChapters(
                                      lesson.id,
                                      chapterIndex,
                                      chapterIndex + 1
                                    )
                                  }
                                  disabled={
                                    chapterIndex ===
                                      lesson.chapters.length - 1 ||
                                    reorderFetcher.state === "submitting"
                                  }
                                  title="下移"
                                >
                                  <ChevronDown className="size-4" />
                                </Button>
                                <Button
                                  onClick={() => handleEditChapter(chapter)}
                                  variant="outline"
                                  size="icon"
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteChapter(
                                      chapter.id,
                                      chapter.name
                                    )
                                  }
                                  variant="outline"
                                  size="icon"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>

                            {/* 觀念講解列表 */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h6 className="text-sm font-medium text-gray-700">
                                  觀念講解
                                </h6>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCreateTeaching(chapter.id)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                  新增觀念講解
                                </Button>
                              </div>

                              {chapter.teachings.map(
                                (
                                  teaching: TeachingDetails,
                                  teachingIndex: number
                                ) => (
                                  <div
                                    key={teaching.id}
                                    className="flex items-center justify-between text-sm bg-white rounded p-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="p-2 bg-brand-100 rounded-md flex items-center justify-center">
                                        <BookOpen className="size-4 text-brand-600" />
                                      </div>
                                      <span className="text-gray-700">
                                        觀念講解 {teachingIndex + 1} (ID:{" "}
                                        {teaching.videoId})
                                      </span>
                                      <span className="text-gray-500">
                                        ({Math.floor(teaching.duration / 60)}:
                                        {(teaching.duration % 60)
                                          .toString()
                                          .padStart(2, "0")}
                                        )
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      {/* 觀念講解排序按鈕 */}
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleReorderTeachings(
                                            chapter.id,
                                            teachingIndex,
                                            teachingIndex - 1
                                          )
                                        }
                                        disabled={
                                          teachingIndex === 0 ||
                                          reorderFetcher.state === "submitting"
                                        }
                                        title="上移"
                                        className="text-gray-500"
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleReorderTeachings(
                                            chapter.id,
                                            teachingIndex,
                                            teachingIndex + 1
                                          )
                                        }
                                        disabled={
                                          teachingIndex ===
                                            chapter.teachings.length - 1 ||
                                          reorderFetcher.state === "submitting"
                                        }
                                        title="下移"
                                        className="text-gray-500"
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleEditTeaching({
                                            id: teaching.id,
                                            videoId: teaching.videoId,
                                            duration: teaching.duration,
                                            chapterId: chapter.id,
                                          })
                                        }
                                        size="icon"
                                        variant="ghost"
                                        className="text-gray-500"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleDeleteTeaching(
                                            teaching.id,
                                            `觀念講解 ${teachingIndex + 1}`
                                          )
                                        }
                                        size="icon"
                                        variant="ghost"
                                        className="text-gray-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              )}

                              {/* 突破關卡列表 */}
                              <div className="flex items-center justify-between mt-4">
                                <h6 className="text-sm font-medium text-gray-700">
                                  突破關卡
                                </h6>
                                <Button
                                  size="sm"
                                  onClick={() => handleCreateExam(chapter.id)}
                                >
                                  <Plus className="w-3 h-3" />
                                  新增突破關卡
                                </Button>
                              </div>

                              {chapter.exams.map(
                                (exam: ExamDetails, examIndex: number) => (
                                  <div
                                    key={exam.id}
                                    className="flex items-center justify-between text-sm bg-white rounded p-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="p-2 bg-brand-100 rounded-md flex items-center justify-center">
                                        <BarChart3 className="size-4 text-brand-600" />
                                      </div>
                                      <span className="text-gray-700">
                                        突破關卡 {examIndex + 1} (ID:{" "}
                                        {exam.videoId})
                                      </span>
                                      <span className="text-gray-500">
                                        ({Math.floor(exam.duration / 60)}:
                                        {(exam.duration % 60)
                                          .toString()
                                          .padStart(2, "0")}
                                        )
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      {/* 突破關卡排序按鈕 */}
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleReorderExams(
                                            chapter.id,
                                            examIndex,
                                            examIndex - 1
                                          )
                                        }
                                        disabled={
                                          examIndex === 0 ||
                                          reorderFetcher.state === "submitting"
                                        }
                                        title="上移"
                                        className="text-gray-500"
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleReorderExams(
                                            chapter.id,
                                            examIndex,
                                            examIndex + 1
                                          )
                                        }
                                        disabled={
                                          examIndex ===
                                            chapter.exams.length - 1 ||
                                          reorderFetcher.state === "submitting"
                                        }
                                        title="下移"
                                        className="text-gray-500"
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleEditExam({
                                            id: exam.id,
                                            videoId: exam.videoId,
                                            duration: exam.duration,
                                            chapterId: chapter.id,
                                          })
                                        }
                                        size="icon"
                                        variant="ghost"
                                        className="text-gray-500"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleDeleteExam(
                                            exam.id,
                                            `突破關卡 ${examIndex + 1}`
                                          )
                                        }
                                        size="icon"
                                        variant="ghost"
                                        className="text-gray-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingLesson ? "編輯課程" : "新增課程"}</DialogTitle>
            <DialogDescription>
              {editingLesson
                ? "修改課程的基本資訊"
                : "建立一個新的課程，您稍後可以在其中添加章節和內容"}
            </DialogDescription>
          </DialogHeader>

          <lessonFetcher.Form
            onSubmit={handleLessonSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="lesson-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                課程名稱 *
              </label>
              <Input
                id="lesson-name"
                name="name"
                placeholder="輸入課程名稱"
                defaultValue={editingLesson?.name || ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lesson-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                課程描述
              </label>
              <Input
                id="lesson-description"
                name="description"
                placeholder="輸入課程描述（可選）"
                defaultValue={editingLesson?.description || ""}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLessonDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={lessonFetcher.state === "submitting"}
              >
                {lessonFetcher.state === "submitting"
                  ? "處理中..."
                  : editingLesson
                  ? "更新"
                  : "建立"}
              </Button>
            </DialogFooter>
          </lessonFetcher.Form>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Chapter Dialog */}
      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingChapter ? "編輯章節" : "新增章節"}
            </DialogTitle>
            <DialogDescription>
              {editingChapter
                ? "修改章節的基本資訊"
                : "在課程中建立一個新的章節"}
            </DialogDescription>
          </DialogHeader>

          <chapterFetcher.Form
            onSubmit={handleChapterSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="chapter-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                章節名稱 *
              </label>
              <Input
                id="chapter-name"
                name="name"
                placeholder="輸入章節名稱"
                defaultValue={editingChapter?.name || ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="chapter-slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Slug *
              </label>
              <Input
                id="chapter-slug"
                name="slug"
                placeholder="輸入 slug（用於 URL，例如：chapter-1）"
                defaultValue={editingChapter?.slug || ""}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Slug 用於網址路徑，建議使用英文和數字，以破折號分隔
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChapterDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={chapterFetcher.state === "submitting"}
              >
                {chapterFetcher.state === "submitting"
                  ? "處理中..."
                  : editingChapter
                  ? "更新"
                  : "建立"}
              </Button>
            </DialogFooter>
          </chapterFetcher.Form>
        </DialogContent>
      </Dialog>

      {/* Teaching Dialog */}
      <Dialog
        open={isTeachingDialogOpen}
        onOpenChange={setIsTeachingDialogOpen}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingTeaching ? "編輯觀念講解" : "新增觀念講解"}
            </DialogTitle>
            <DialogDescription>
              {editingTeaching
                ? "修改觀念講解的影片資訊"
                : "建立一個新的觀念講解影片"}
            </DialogDescription>
          </DialogHeader>

          <teachingFetcher.Form
            onSubmit={handleTeachingSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="teaching-video-id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                影片 ID *
              </label>
              <Input
                id="teaching-video-id"
                name="videoId"
                placeholder="輸入影片 ID"
                defaultValue={editingTeaching?.videoId || ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="teaching-duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                時長（秒）*
              </label>
              <Input
                id="teaching-duration"
                name="duration"
                type="number"
                placeholder="輸入影片時長（秒）"
                defaultValue={editingTeaching?.duration || ""}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTeachingDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={teachingFetcher.state === "submitting"}
              >
                {teachingFetcher.state === "submitting"
                  ? "處理中..."
                  : editingTeaching
                  ? "更新"
                  : "建立"}
              </Button>
            </DialogFooter>
          </teachingFetcher.Form>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Exam Dialog */}
      <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingExam ? "編輯突破關卡" : "新增突破關卡"}
            </DialogTitle>
            <DialogDescription>
              {editingExam
                ? "修改突破關卡的影片資訊"
                : "建立一個新的突破關卡影片"}
            </DialogDescription>
          </DialogHeader>

          <examFetcher.Form onSubmit={handleExamSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="exam-video-id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                影片 ID *
              </label>
              <Input
                id="exam-video-id"
                name="videoId"
                placeholder="輸入影片 ID"
                defaultValue={editingExam?.videoId || ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="exam-duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                時長（秒）*
              </label>
              <Input
                id="exam-duration"
                name="duration"
                type="number"
                placeholder="輸入影片時長（秒）"
                defaultValue={editingExam?.duration || ""}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExamDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={examFetcher.state === "submitting"}
              >
                {examFetcher.state === "submitting"
                  ? "處理中..."
                  : editingExam
                  ? "更新"
                  : "建立"}
              </Button>
            </DialogFooter>
          </examFetcher.Form>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteMessage()}
              <br />
              <span className="font-medium text-gray-900 mt-2 block">
                {deleteItem?.name}
              </span>
              <span className="text-sm mt-2 block">此操作無法復原。</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="destructive"
              disabled={
                lessonFetcher.state === "submitting" ||
                chapterFetcher.state === "submitting" ||
                teachingFetcher.state === "submitting" ||
                examFetcher.state === "submitting"
              }
            >
              {lessonFetcher.state === "submitting" ||
              chapterFetcher.state === "submitting" ||
              teachingFetcher.state === "submitting" ||
              examFetcher.state === "submitting"
                ? "刪除中..."
                : "確認刪除"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
