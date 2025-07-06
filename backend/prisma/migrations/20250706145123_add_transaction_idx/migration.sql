-- CreateIndex
CREATE INDEX "transaction_userId_type_date_category_idx" ON "transaction"("userId", "type", "date", "category");
