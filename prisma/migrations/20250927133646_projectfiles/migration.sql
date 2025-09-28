/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `skills` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projects_title_key" ON "public"."projects"("title");

-- CreateIndex
CREATE UNIQUE INDEX "services_title_key" ON "public"."services"("title");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "public"."skills"("name");
