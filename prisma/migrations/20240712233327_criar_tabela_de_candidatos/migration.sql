-- CreateTable
CREATE TABLE `candidatos` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `rg` VARCHAR(191) NULL,
    `orgao_emissor` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `nota_fiscal` VARCHAR(191) NOT NULL,
    `origem` VARCHAR(191) NOT NULL,
    `data_compra` DATETIME(3) NULL,
    `numero_sorteado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
