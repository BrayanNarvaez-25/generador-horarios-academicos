-- DropForeignKey
ALTER TABLE "prerequisites" DROP CONSTRAINT "prerequisites_course_id_fkey";

-- DropForeignKey
ALTER TABLE "prerequisites" DROP CONSTRAINT "prerequisites_prerequisite_course_id_fkey";

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_prerequisite_course_id_fkey" FOREIGN KEY ("prerequisite_course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
