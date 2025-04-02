-- CreateTable
CREATE TABLE "VisitorLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "visitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Post" ("content", "createdAt", "id", "published", "tags", "title", "updatedAt") SELECT "content", "createdAt", "id", "published", "tags", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
