import type { ActionFunctionArgs } from "react-router";
import { prisma } from "~/services/database/prisma.server";
import { getCustomerData } from "~/services/customer-session.server";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Get customer data from session (not using context since API routes don't go through middleware)
  const customerData = await getCustomerData({
    slug: DEFAULT_APP_SLUG,
    request,
  });

  if (!customerData) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lessonId } = body;

    if (!lessonId || typeof lessonId !== "string") {
      return Response.json({ error: "Invalid lessonId" }, { status: 400 });
    }

    // Verify the lesson exists
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Upsert progress record (idempotent)
    const progress = await prisma.customerLessonProgress.upsert({
      where: {
        customerId_lessonId: {
          customerId: customerData.customerId,
          lessonId: lessonId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        customerId: customerData.customerId,
        lessonId: lessonId,
        completedAt: new Date(),
      },
    });

    return Response.json({ success: true, progress });
  } catch (error) {
    console.error("Error marking lesson progress:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
