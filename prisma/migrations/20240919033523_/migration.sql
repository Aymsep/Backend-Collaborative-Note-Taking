/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `note_shares` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "note_shares" DROP CONSTRAINT "note_shares_noteId_fkey";

-- DropForeignKey
ALTER TABLE "note_shares" DROP CONSTRAINT "note_shares_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "note_shares";

-- CreateTable
CREATE TABLE "NoteShare" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "noteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoteShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NoteShare_userId_noteId_idx" ON "NoteShare"("userId", "noteId");

-- AddForeignKey
ALTER TABLE "NoteShare" ADD CONSTRAINT "NoteShare_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteShare" ADD CONSTRAINT "NoteShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
