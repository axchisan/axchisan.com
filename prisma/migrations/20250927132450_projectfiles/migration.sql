-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'VISITOR');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."SettingType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'IMAGE');

-- CreateEnum
CREATE TYPE "public"."FileCategory" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'EXECUTABLE', 'MOBILE_APP', 'ARCHIVE', 'SOURCE_CODE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'VISITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "avatar" TEXT,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 5,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "features" TEXT[],
    "price" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "content" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "technologies" TEXT[],
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "downloadUrl" TEXT,
    "category" TEXT,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'COMPLETED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "readTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "blogPostId" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "blogPostId" TEXT,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "public"."SettingType" NOT NULL DEFAULT 'TEXT',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "displayName" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "category" "public"."FileCategory" NOT NULL DEFAULT 'OTHER',
    "platform" TEXT,
    "version" TEXT,
    "isDownloadable" BOOLEAN NOT NULL DEFAULT true,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_projectId_key" ON "public"."likes"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_blogPostId_key" ON "public"."likes"("userId", "blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "public"."site_settings"("key");

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_messages" ADD CONSTRAINT "contact_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_files" ADD CONSTRAINT "project_files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
