import type { Prisma } from "../generated/prisma/client.js";

export type CourseWithPrerequisites = Prisma.CourseGetPayload<{
  include: {
    requiredPrerequisites: {
      include: { prerequisiteCourse: true };
    };
  };
}>;