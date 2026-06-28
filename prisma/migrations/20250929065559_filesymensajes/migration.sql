-- CreateEnum
CREATE TYPE "public"."MessageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."contact_messages" ADD COLUMN     "respondedAt" TIMESTAMP(3),
ADD COLUMN     "response" TEXT,
ADD COLUMN     "status" "public"."MessageStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."blog_files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "displayName" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "category" "public"."FileCategory" NOT NULL DEFAULT 'OTHER',
    "isDownloadable" BOOLEAN NOT NULL DEFAULT true,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blogPostId" TEXT NOT NULL,

    CONSTRAINT "blog_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_analytics" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "referer" TEXT,
    "country" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_views" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_views" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "blogPostId" TEXT,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_projectId_key" ON "public"."favorites"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_blogPostId_key" ON "public"."favorites"("userId", "blogPostId");

-- AddForeignKey
ALTER TABLE "public"."blog_files" ADD CONSTRAINT "blog_files_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_views" ADD CONSTRAINT "project_views_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_views" ADD CONSTRAINT "blog_views_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
