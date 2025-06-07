import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { requireAdmin } from "~/services/auth/session";
import {
  getAllEntranceExamsWithDetails,
  getEntranceExamStats,
  type EntranceExamWithDetails,
  type ExamQuestionWithDetails,
  type ExamAnswerDetails,
} from "~/services/database/entrance-exams";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  FileText,
  ArrowLeft,
  X,
  ChevronUp,
  MoveUp,
  MoveDown,
  Video,
  Album,
  NotepadText,
  Apple,
  AlertCircle,
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
import { FileUpload } from "~/components/ui/FileUpload";

type LoaderData = {
  exams: Awaited<ReturnType<typeof getAllEntranceExamsWithDetails>>;
  stats: Awaited<ReturnType<typeof getEntranceExamStats>>;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);

  const [exams, stats] = await Promise.all([
    getAllEntranceExamsWithDetails(),
    getEntranceExamStats(),
  ]);

  return json<LoaderData>({
    exams,
    stats,
  });
};

export default function EntranceExamsManagementPage() {
  const { exams, stats } = useLoaderData<LoaderData>();
  const [expandedExams, setExpandedExams] = useState<Set<string>>(new Set());

  // Dialog 狀態
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingExam, setEditingExam] = useState<{
    id: string;
    title: string;
    year: number;
    subject: string;
    type: string;
    description?: string | null;
  } | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{
    id: string;
    title: string;
    fileType: string;
    fileUrl?: string | null;
    downloadFilename?: string | null;
    questionType: string;
    examId: string;
  } | null>(null);
  const [editingAnswer, setEditingAnswer] = useState<{
    id: string;
    title: string;
    fileType: string;
    videoId?: string | null;
    duration?: number | null;
    fileUrl?: string | null;
    questionId: string;
  } | null>(null);

  // 刪除相關狀態
  const [deleteItem, setDeleteItem] = useState<{
    type: "exam" | "question" | "answer";
    id: string;
    name: string;
  } | null>(null);

  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");

  // Fetchers
  const examFetcher = useFetcher();
  const questionFetcher = useFetcher();
  const answerFetcher = useFetcher();
  const reorderFetcher = useFetcher();

  // 錯誤狀態管理
  const [questionError, setQuestionError] = useState<string>("");

  // 監聽 questionFetcher 的響應來處理錯誤
  useEffect(() => {
    if (questionFetcher.data) {
      const data = questionFetcher.data as unknown as {
        error?: string;
        success?: boolean;
      };
      if (data.error) {
        setQuestionError(data.error);
      } else if (data.success) {
        setQuestionError("");
        setIsQuestionDialogOpen(false);
        setEditingQuestion(null);
      }
    }
  }, [questionFetcher.data]);

  // 清除錯誤當對話框關閉時
  useEffect(() => {
    if (!isQuestionDialogOpen) {
      setQuestionError("");
    }
  }, [isQuestionDialogOpen]);

  const toggleExam = (examId: string) => {
    const newExpanded = new Set(expandedExams);
    if (newExpanded.has(examId)) {
      newExpanded.delete(examId);
    } else {
      newExpanded.add(examId);
    }
    setExpandedExams(newExpanded);
  };

  // 排序相關函數
  const handleReorderExams = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const updates = exams.map((exam, index) => {
      let newOrder = exam.order;

      if (fromIndex < toIndex) {
        if (index === fromIndex) {
          newOrder = exams[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = exams[index - 1].order;
        }
      } else {
        if (index === fromIndex) {
          newOrder = exams[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = exams[index + 1].order;
        }
      }

      return { id: exam.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/entrance-exams",
    });
  };

  const handleReorderQuestions = (
    examId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    const updates = exam.questions.map((question, index) => {
      let newOrder = question.order;

      if (fromIndex < toIndex) {
        if (index === fromIndex) {
          newOrder = exam.questions[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = exam.questions[index - 1].order;
        }
      } else {
        if (index === fromIndex) {
          newOrder = exam.questions[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = exam.questions[index + 1].order;
        }
      }

      return { id: question.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/exam-questions",
    });
  };

  const handleReorderAnswers = (
    questionId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromIndex === toIndex) return;

    const exam = exams.find((e) =>
      e.questions.some((q) => q.id === questionId)
    );
    const question = exam?.questions.find((q) => q.id === questionId);
    if (!question) return;

    const updates = question.answers.map((answer, index) => {
      let newOrder = answer.order;

      if (fromIndex < toIndex) {
        if (index === fromIndex) {
          newOrder = question.answers[toIndex].order;
        } else if (index > fromIndex && index <= toIndex) {
          newOrder = question.answers[index - 1].order;
        }
      } else {
        if (index === fromIndex) {
          newOrder = question.answers[toIndex].order;
        } else if (index >= toIndex && index < fromIndex) {
          newOrder = question.answers[index + 1].order;
        }
      }

      return { id: answer.id, order: newOrder };
    });

    const formData = new FormData();
    formData.append("intent", "reorder");
    formData.append("updates", JSON.stringify(updates));

    reorderFetcher.submit(formData, {
      method: "PATCH",
      action: "/api/exam-answers",
    });
  };

  // Exam 操作
  const handleCreateExam = () => {
    setEditingExam(null);
    setIsExamDialogOpen(true);
  };

  const handleEditExam = (exam: {
    id: string;
    title: string;
    year: number;
    subject: string;
    type: string;
    description?: string | null;
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
        action: "/api/entrance-exams",
      });
    } else {
      formData.append("intent", "create");
      examFetcher.submit(formData, {
        method: "POST",
        action: "/api/entrance-exams",
      });
    }

    setIsExamDialogOpen(false);
    setEditingExam(null);
  };

  const handleDeleteExam = (examId: string, examTitle: string) => {
    setDeleteItem({
      type: "exam",
      id: examId,
      name: examTitle,
    });
    setIsDeleteDialogOpen(true);
  };

  // Question 操作
  const handleCreateQuestion = (examId: string) => {
    setSelectedExamId(examId);
    setEditingQuestion(null);
    setIsQuestionDialogOpen(true);
  };

  const handleEditQuestion = (question: {
    id: string;
    title: string;
    fileType: string;
    fileUrl?: string | null;
    downloadFilename?: string | null;
    questionType: string;
    examId: string;
  }) => {
    setEditingQuestion(question);
    setIsQuestionDialogOpen(true);
  };

  const handleQuestionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // 清除之前的錯誤
    setQuestionError("");

    if (editingQuestion) {
      formData.append("intent", "update");
      formData.append("id", editingQuestion.id);

      // 使用 useFetcher 但確保正確的 encType
      questionFetcher.submit(formData, {
        method: "PATCH",
        action: "/api/exam-questions",
        encType: "multipart/form-data",
      });
    } else {
      formData.append("intent", "create");
      formData.append("examId", selectedExamId);

      // 使用 useFetcher 但確保正確的 encType
      questionFetcher.submit(formData, {
        method: "POST",
        action: "/api/exam-questions",
        encType: "multipart/form-data",
      });
    }

    // 不再自動關閉對話框，讓 useEffect 處理
  };

  const handleDeleteQuestion = (questionId: string, questionTitle: string) => {
    setDeleteItem({
      type: "question",
      id: questionId,
      name: questionTitle,
    });
    setIsDeleteDialogOpen(true);
  };

  // Answer 操作
  const handleCreateAnswer = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setEditingAnswer(null);
    setIsAnswerDialogOpen(true);
  };

  const handleEditAnswer = (answer: {
    id: string;
    title: string;
    fileType: string;
    videoId?: string | null;
    duration?: number | null;
    fileUrl?: string | null;
    questionId: string;
  }) => {
    setEditingAnswer(answer);
    setIsAnswerDialogOpen(true);
  };

  const handleAnswerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingAnswer) {
      formData.append("intent", "update");
      formData.append("id", editingAnswer.id);
      answerFetcher.submit(formData, {
        method: "PATCH",
        action: "/api/exam-answers",
      });
    } else {
      formData.append("intent", "create");
      formData.append("questionId", selectedQuestionId);
      answerFetcher.submit(formData, {
        method: "POST",
        action: "/api/exam-answers",
      });
    }

    setIsAnswerDialogOpen(false);
    setEditingAnswer(null);
  };

  const handleDeleteAnswer = (answerId: string, answerTitle: string) => {
    setDeleteItem({
      type: "answer",
      id: answerId,
      name: answerTitle,
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
      case "exam":
        examFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/entrance-exams",
        });
        break;
      case "question":
        questionFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/exam-questions",
        });
        break;
      case "answer":
        answerFetcher.submit(formData, {
          method: "DELETE",
          action: "/api/exam-answers",
        });
        break;
    }

    setIsDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const getDeleteMessage = () => {
    if (!deleteItem) return "";

    switch (deleteItem.type) {
      case "exam":
        return "確定要刪除此入學考試嗎？這將會刪除所有相關的題目和答案。";
      case "question":
        return "確定要刪除此題目嗎？這將會刪除所有相關的答案。";
      case "answer":
        return "確定要刪除此答案嗎？";
      default:
        return "確定要刪除此項目嗎？";
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "single-choice":
        return "單選題";
      case "multiple-choice":
        return "多選題";
      case "fill-in":
        return "填充題";
      default:
        return type;
    }
  };

  // Question Dialog content with file upload
  const questionDialogContent = (
    <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? "編輯題目" : "新增題目"}</DialogTitle>
          <DialogDescription>
            {editingQuestion
              ? "修改題目的基本資訊和檔案"
              : "在考試中建立一個新的題目，請上傳題目檔案"}
          </DialogDescription>
        </DialogHeader>

        <questionFetcher.Form
          onSubmit={handleQuestionSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label
              htmlFor="question-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              題目標題 *
            </label>
            <Input
              id="question-title"
              name="title"
              placeholder="輸入題目標題"
              defaultValue={editingQuestion?.title || ""}
              required
            />
          </div>

          <div>
            <label
              htmlFor="question-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              題目類型 *
            </label>
            <select
              id="question-type"
              name="questionType"
              className="h-12 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              defaultValue={editingQuestion?.questionType || ""}
              required
            >
              <option value="">選擇題目類型</option>
              <option value="single-choice">單選題</option>
              <option value="multiple-choice">多選題</option>
              <option value="fill-in">填充題</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="question-file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              題目檔案 *
            </label>
            <div id="question-file-upload">
              <FileUpload
                name="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                maxSize={10}
                onFileSelect={() => {}}
                currentFile={
                  editingQuestion?.fileUrl
                    ? {
                        name: editingQuestion.downloadFilename || "檔案",
                        url: editingQuestion.fileUrl,
                        type: editingQuestion.fileType,
                      }
                    : null
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {editingQuestion
                ? "上傳新檔案將替換現有檔案"
                : "請上傳題目檔案（必填）"}
            </p>
          </div>

          {/* 錯誤訊息顯示 */}
          {questionError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{questionError}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsQuestionDialogOpen(false);
              }}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={questionFetcher.state === "submitting"}
            >
              {questionFetcher.state === "submitting"
                ? "處理中..."
                : editingQuestion
                ? "更新"
                : "建立"}
            </Button>
          </DialogFooter>
        </questionFetcher.Form>
      </DialogContent>
    </Dialog>
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          歷屆聯考題管理
        </h1>
        <p className="text-gray-600">管理歷年學測、指考等聯考題庫和解答</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <Album className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">考試總數</p>
              <p className="text-2xl font-bold text-gray-900">{stats.exams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <NotepadText className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">題目檔案總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.questions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <Apple className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">解答檔案總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.answers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 考試列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">考試列表</h2>
          <Button onClick={handleCreateExam}>
            <Plus className="w-4 h-4" />
            新增考試
          </Button>
        </div>

        <div className="divide-y divide-gray-300">
          {exams.map((exam: EntranceExamWithDetails, examIndex: number) => {
            const isExpanded = expandedExams.has(exam.id);
            const totalAnswers = exam.questions.reduce(
              (sum: number, question: ExamQuestionWithDetails) =>
                sum + question.answers.length,
              0
            );

            return (
              <div key={exam.id} className="p-6">
                {/* 考試標題行 */}
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleExam(exam.id)}
                      className="flex items-center space-x-2 hover:bg-gray-200 rounded-lg p-2 -m-2 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="shrink-0 w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="shrink-0 w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exam.title}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          {exam.year} 年 • {exam.subject} • {exam.type} 卷
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        {exam.questions.length} 題目 • {totalAnswers} 解答
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* 排序按鈕 */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          handleReorderExams(examIndex, examIndex - 1)
                        }
                        disabled={
                          examIndex === 0 ||
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
                          handleReorderExams(examIndex, examIndex + 1)
                        }
                        disabled={
                          examIndex === exams.length - 1 ||
                          reorderFetcher.state === "submitting"
                        }
                        title="下移"
                      >
                        <MoveDown className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleEditExam({
                            id: exam.id,
                            title: exam.title,
                            year: exam.year,
                            subject: exam.subject,
                            type: exam.type,
                            description: exam.description,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 展開的題目內容 */}
                {isExpanded && (
                  <div className="mt-6 ml-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-700">
                        題目列表
                      </h4>
                      <Button onClick={() => handleCreateQuestion(exam.id)}>
                        <Plus className="w-3 h-3" />
                        新增題目
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {exam.questions.map(
                        (
                          question: ExamQuestionWithDetails,
                          questionIndex: number
                        ) => (
                          <div
                            key={question.id}
                            className="bg-gray-100 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {question.title}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {getQuestionTypeLabel(question.questionType)}{" "}
                                  • {question.answers.length} 解答
                                  {question.fileUrl && <span> • 有檔案</span>}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {/* 題目排序按鈕 */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleReorderQuestions(
                                      exam.id,
                                      questionIndex,
                                      questionIndex - 1
                                    )
                                  }
                                  disabled={
                                    questionIndex === 0 ||
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
                                    handleReorderQuestions(
                                      exam.id,
                                      questionIndex,
                                      questionIndex + 1
                                    )
                                  }
                                  disabled={
                                    questionIndex ===
                                      exam.questions.length - 1 ||
                                    reorderFetcher.state === "submitting"
                                  }
                                  title="下移"
                                >
                                  <ChevronDown className="size-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleEditQuestion({
                                      id: question.id,
                                      title: question.title,
                                      fileType: question.fileType,
                                      fileUrl: question.fileUrl,
                                      downloadFilename:
                                        question.downloadFilename,
                                      questionType: question.questionType,
                                      examId: exam.id,
                                    })
                                  }
                                  variant="outline"
                                  size="icon"
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteQuestion(
                                      question.id,
                                      question.title
                                    )
                                  }
                                  variant="outline"
                                  size="icon"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>

                            {/* 解答列表 */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h6 className="text-sm font-medium text-gray-700">
                                  解答
                                </h6>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCreateAnswer(question.id)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                  新增解答
                                </Button>
                              </div>

                              {question.answers.map(
                                (
                                  answer: ExamAnswerDetails,
                                  answerIndex: number
                                ) => (
                                  <div
                                    key={answer.id}
                                    className="flex items-center justify-between text-sm bg-white rounded p-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="p-2 bg-brand-100 rounded-md flex items-center justify-center">
                                        {answer.fileType === "video" ? (
                                          <Video className="size-4 text-brand-600" />
                                        ) : (
                                          <FileText className="size-4 text-brand-600" />
                                        )}
                                      </div>
                                      <span className="text-gray-700">
                                        {answer.title}
                                      </span>
                                      {answer.duration && (
                                        <span className="text-gray-500">
                                          ({Math.floor(answer.duration / 60)}:
                                          {(answer.duration % 60)
                                            .toString()
                                            .padStart(2, "0")}
                                          )
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      {/* 解答排序按鈕 */}
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleReorderAnswers(
                                            question.id,
                                            answerIndex,
                                            answerIndex - 1
                                          )
                                        }
                                        disabled={
                                          answerIndex === 0 ||
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
                                          handleReorderAnswers(
                                            question.id,
                                            answerIndex,
                                            answerIndex + 1
                                          )
                                        }
                                        disabled={
                                          answerIndex ===
                                            question.answers.length - 1 ||
                                          reorderFetcher.state === "submitting"
                                        }
                                        title="下移"
                                        className="text-gray-500"
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleEditAnswer({
                                            id: answer.id,
                                            title: answer.title,
                                            fileType: answer.fileType,
                                            videoId: answer.videoId,
                                            duration: answer.duration,
                                            fileUrl: answer.fileUrl,
                                            questionId: question.id,
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
                                          handleDeleteAnswer(
                                            answer.id,
                                            answer.title
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

      {/* Exam Dialog */}
      <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingExam ? "編輯考試" : "新增考試"}</DialogTitle>
            <DialogDescription>
              {editingExam
                ? "修改考試的基本資訊"
                : "建立一個新的入學考試，您稍後可以在其中添加題目和解答"}
            </DialogDescription>
          </DialogHeader>

          <examFetcher.Form onSubmit={handleExamSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="exam-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                考試標題 *
              </label>
              <Input
                id="exam-title"
                name="title"
                placeholder="輸入考試標題"
                defaultValue={editingExam?.title || ""}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="exam-year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  年份 *
                </label>
                <Input
                  id="exam-year"
                  name="year"
                  type="number"
                  placeholder="例如：114"
                  defaultValue={editingExam?.year || ""}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="exam-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  類型 *
                </label>
                <Input
                  id="exam-type"
                  name="type"
                  placeholder="例如：A、B"
                  defaultValue={editingExam?.type || ""}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="exam-subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                科目 *
              </label>
              <Input
                id="exam-subject"
                name="subject"
                placeholder="例如：數學"
                defaultValue={editingExam?.subject || ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="exam-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                描述
              </label>
              <Input
                id="exam-description"
                name="description"
                placeholder="輸入考試描述（可選）"
                defaultValue={editingExam?.description || ""}
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

      {/* Question Dialog */}
      {questionDialogContent}

      {/* Answer Dialog */}
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingAnswer ? "編輯解答" : "新增解答"}</DialogTitle>
            <DialogDescription>
              {editingAnswer ? "修改解答的基本資訊" : "為題目建立一個新的解答"}
            </DialogDescription>
          </DialogHeader>

          <answerFetcher.Form
            onSubmit={handleAnswerSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="answer-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                解答標題 *
              </label>
              <Input
                id="answer-title"
                name="title"
                placeholder="輸入解答標題"
                defaultValue={editingAnswer?.title || ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="answer-file-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                檔案類型 *
              </label>
              <select
                id="answer-file-type"
                name="fileType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                defaultValue={editingAnswer?.fileType || ""}
                required
              >
                <option value="">選擇檔案類型</option>
                <option value="video">影片</option>
                <option value="pdf">PDF</option>
                <option value="image">圖片</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="answer-video-id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  影片 ID
                </label>
                <Input
                  id="answer-video-id"
                  name="videoId"
                  placeholder="輸入影片 ID（如果是影片）"
                  defaultValue={editingAnswer?.videoId || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="answer-duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  時長（秒）
                </label>
                <Input
                  id="answer-duration"
                  name="duration"
                  type="number"
                  placeholder="輸入影片時長"
                  defaultValue={editingAnswer?.duration || ""}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="answer-file-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                檔案 URL
              </label>
              <Input
                id="answer-file-url"
                name="fileUrl"
                placeholder="輸入檔案 URL（可選）"
                defaultValue={editingAnswer?.fileUrl || ""}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAnswerDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={answerFetcher.state === "submitting"}
              >
                {answerFetcher.state === "submitting"
                  ? "處理中..."
                  : editingAnswer
                  ? "更新"
                  : "建立"}
              </Button>
            </DialogFooter>
          </answerFetcher.Form>

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
        <AlertDialogContent className="bg-white">
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
                examFetcher.state === "submitting" ||
                questionFetcher.state === "submitting" ||
                answerFetcher.state === "submitting"
              }
            >
              {examFetcher.state === "submitting" ||
              questionFetcher.state === "submitting" ||
              answerFetcher.state === "submitting"
                ? "刪除中..."
                : "確認刪除"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
