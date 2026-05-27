"use server";

import { prisma } from "@/lib/prisma";

export async function saveProgress(unitId: string, score: number, totalQ: number) {
  await prisma.progress.create({
    data: {
      unitId,
      score,
      totalQ,
      completed: score / totalQ >= 0.5,
      completedAt: score / totalQ >= 0.5 ? new Date() : null,
    },
  });
}
