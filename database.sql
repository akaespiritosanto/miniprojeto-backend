CREATE DATABASE mini_projeto;

CREATE TABLE mini_projeto.product(
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(30) NOT NULL,
    department VARCHAR(50) NOT NULL,
    review INT NULL,
    description VARCHAR(3000) NOT NULL,
    weight INT NOT NULL,
    price INT NOT NULL,
    created TIME NULL,
    comment VARCHAR(3000) NULL
);

INSERT INTO mini_projeto.product (id, name, barcode, department, review, description, weight, price, created, comment)
VALUES (1, 'Smartphone XYZ', '123456789012', 'Eletrônicos', 4, 'Smartphone avançado com tela de 6.5 polegadas, 128GB de armazenamento e câmera tripla.', 180, 899, '09:30:00', '{"user":"João", "comment":"Bom produto, mas a bateria poderia durar mais."}'),
    (2, 'Notebook ABC', '987654321098', 'Eletrônicos', 5, 'Notebook potente com processador i7, 16GB RAM e SSD de 512GB.', 2200, 1499, '10:15:00', '{"user":"Maria", "comment":"Performance excelente, superou minhas expectativas!"}'),
    (3, 'Garrafa Térmica', '456123789045', 'Casa e Cozinha', 3, 'Garrafa térmica de aço inoxidável com capacidade para 500ml.', 350, 29, '11:20:00', NULL),
    (4, 'Fones de Ouvido Bluetooth', '789012345678', 'Eletrônicos', 4, 'Fones sem fio com cancelamento de ruído e bateria de longa duração.', 150, 129, '14:45:00', '{"user":"Carlos", "comment":"Ótimo som, muito confortáveis."}'),
    (5, 'Livro - Aventuras SQL', '321654987012', 'Livros', 5, 'Guia completo para dominar consultas SQL e otimização de bancos de dados.', 500, 45, '16:00:00', NULL);
    
USE mini_projeto;
SELECT * FROM product