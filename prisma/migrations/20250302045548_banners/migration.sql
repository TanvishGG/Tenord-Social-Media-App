-- CreateTable
CREATE TABLE "Banner" (
    "banner_hash" TEXT NOT NULL,
    "banner" BYTEA NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("banner_hash")
);
