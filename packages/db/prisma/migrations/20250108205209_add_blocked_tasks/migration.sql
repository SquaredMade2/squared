-- CreateTable
CREATE TABLE "_BlockedTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlockedTasks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BlockedTasks_B_index" ON "_BlockedTasks"("B");

-- AddForeignKey
ALTER TABLE "_BlockedTasks" ADD CONSTRAINT "_BlockedTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedTasks" ADD CONSTRAINT "_BlockedTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
