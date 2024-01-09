-- CreateTable
CREATE TABLE "SessionQuestion" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionQuestion_id_key" ON "SessionQuestion"("id");

-- AddForeignKey
ALTER TABLE "SessionQuestion" ADD CONSTRAINT "SessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionQuestion" ADD CONSTRAINT "SessionQuestion_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionQuestion" ADD CONSTRAINT "SessionQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
