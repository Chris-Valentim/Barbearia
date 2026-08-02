-- CreateTable
CREATE TABLE "profissional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "assessment" REAL NOT NULL,
    "assessmentAmount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "servico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "slotsAmount" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "emailClient" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "professionalId" INTEGER NOT NULL,
    CONSTRAINT "schedules_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "profissional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SchedulingToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SchedulingToService_A_fkey" FOREIGN KEY ("A") REFERENCES "schedules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SchedulingToService_B_fkey" FOREIGN KEY ("B") REFERENCES "servico" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "profissional_name_key" ON "profissional"("name");

-- CreateIndex
CREATE UNIQUE INDEX "servico_name_key" ON "servico"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SchedulingToService_AB_unique" ON "_SchedulingToService"("A", "B");

-- CreateIndex
CREATE INDEX "_SchedulingToService_B_index" ON "_SchedulingToService"("B");
