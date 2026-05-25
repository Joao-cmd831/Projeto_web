DROP DATABASE IF EXISTS autocar_db;
CREATE DATABASE autocar_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE autocar_db;

-- Tabelas
CREATE TABLE usuarios (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    senha         VARCHAR(255) NOT NULL,
    telefone      VARCHAR(20),
    cpf           VARCHAR(14) UNIQUE,
    endereco      VARCHAR(255),
    cidade        VARCHAR(100),
    estado        VARCHAR(2),
    cep           VARCHAR(10),
    role          ENUM('USUARIO','ADMIN') NOT NULL DEFAULT 'USUARIO',
    ativo         TINYINT(1) NOT NULL DEFAULT 1,
    criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE produtos (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(200) NOT NULL,
    descricao      TEXT,
    preco          DECIMAL(10,2) NOT NULL,
    estoque        INT NOT NULL DEFAULT 0,
    imagem_url     VARCHAR(500),
    marca          VARCHAR(100),
    modelo         VARCHAR(100),
    ano_compativel VARCHAR(50),
    categoria_id   BIGINT,
    ativo          TINYINT(1) NOT NULL DEFAULT 1,
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE carrinhos (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id    BIGINT NOT NULL UNIQUE,
    atualizado_em DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE carrinho_itens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    carrinho_id BIGINT NOT NULL,
    produto_id  BIGINT NOT NULL,
    quantidade  INT NOT NULL DEFAULT 1,
    FOREIGN KEY (carrinho_id) REFERENCES carrinhos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id)  REFERENCES produtos(id)  ON DELETE CASCADE,
    UNIQUE KEY uq_carrinho_produto (carrinho_id, produto_id)
);

CREATE TABLE pedidos (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id       BIGINT NOT NULL,
    total            DECIMAL(10,2) NOT NULL,
    status           ENUM('PENDENTE','PAGO','ENVIADO','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    endereco_entrega VARCHAR(255),
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE pedido_itens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id  BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    preco_unit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id)  REFERENCES pedidos(id)  ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- Categorias
INSERT INTO categorias (nome, slug) VALUES
('Freios',      'freios'),
('Motor',       'motor'),
('Suspensão',   'suspensao'),
('Elétrica',    'eletrica'),
('Filtros',     'filtros'),
('Transmissão', 'transmissao'),
('Escapamento', 'escapamento'),
('Carroceria',  'carroceria');

-- Admin  (senha: admin123)
INSERT INTO usuarios (nome, email, senha, role, ativo) VALUES
('Administrador', 'admin@autocar.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
 'ADMIN', 1);

-- Produtos com URLs limpas (sem base64)
INSERT INTO produtos (nome, descricao, preco, estoque, marca, modelo, ano_compativel, categoria_id, imagem_url) VALUES
('Pastilha de Freio Dianteira',
 'Pastilha cerâmica de alta performance para freios a disco dianteiros',
 89.90, 45, 'Bosch', 'BP876', '2015-2023', 1,
 'https://static.autopecasmarques.com.br/public/marquesautopecas/imagens/produtos/par-disco-de-freio-traseiro-fremax-clio-megane-sandero-rs-63456b4c4b9bf.jpg'),

('Kit Disco de Freio Traseiro',
 'Par de discos ventilados com acabamento termoresistente',
 245.00, 20, 'Brembo', 'UV3310', '2018-2023', 1,
 'https://agrosolo.fbitsstatic.net/img/p/oleo-lubrificante-do-motor-lubrax-essencial-sl-20w50-para-carros-1-litro-84522/279966-1.jpg'),

('Filtro de Óleo Motor',
 'Filtro de óleo de alta capacidade com anti-retorno',
 29.90, 80, 'Mann', 'W713', 'Universal', 5,
 'https://images.cws.digital/produtos/gg/61/75/filtro-de-oleo-5707561-1517238276277.jpg'),

('Correia Dentada + Tensor',
 'Kit completo correia dentada com tensor e correia auxiliar',
 199.90, 15, 'Gates', 'K015645', '2010-2020', 2,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDtenA9AQFHHASmNZjEjzaZ43iPNUHPxzq2w&s'),

('Amortecedor Dianteiro',
 'Amortecedor monotubo para eixo dianteiro, compatível com eixo Mcpherson',
 320.00, 10, 'Monroe', 'G8116', '2016-2023', 3,
 'https://cdn.awsli.com.br/2604/2604460/produto/225202908/19796-l4bmm4fijf.png'),

('Bateria 60Ah',
 'Bateria selada livre de manutenção com alto CCA para partida a frio',
 459.00, 12, 'Heliar', 'HF60', 'Universal', 4,
 'https://cdn.awsli.com.br/2500x2500/2583/2583239/produto/215633532b29d964503.jpg'),

('Filtro de Ar Esportivo',
 'Filtro de alto fluxo lavável e reutilizável, aumento de desempenho',
 79.90, 30, 'K&N', 'E-0644', 'Universal', 5,
 'https://31b93296e4855c6e.cdn.gocache.net/loja/imagens/full/filtro-de-ar-esportivo-race-chrome-black-race-rigido-rc040-oferta.png'),

('Vela de Ignição NGK',
 'Vela de ignição com ponta de irídio, melhor combustão e economia',
 45.00, 60, 'NGK', 'ILFR6T', '2012-2023', 2,
 'https://cdn.awsli.com.br/600x700/1945/1945025/produto/223860775/_vela-igni-o-cpr6ea-9-ngk-bacanautica-ielakhnb6k.png'),

('Rolamento de Roda Dianteiro',
 'Rolamento com flange integrado, alta durabilidade',
 135.00, 25, 'SKF', 'VKBA3632', '2014-2022', 3,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDQmX7cQC7YZTWCKz-Jf9m3DGC_9_7qkQw6g&s'),

('Escapamento Esportivo Traseiro',
 'Ponteira em inox 304 com redução de ruído e aumento de fluxo de gases',
 389.00, 8, 'Flowmaster', '817568', 'Universal', 7,
 'https://images.tcdn.com.br/img/img_prod/1026593/escapamento_esportivo_traseiro_gol_g5_g6_1_0_1295_1_d165d49449b9a0e75caa991ffa3c2c1d.jpg'),

('Bomba d''Água',
 'Bomba de arrefecimento com vedação aprimorada e rolamento reforçado',
 189.00, 18, 'GMB', 'GWF60A', '2010-2020', 2,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlAiTGKmG9wFCVsiD4SBOteFcLkwx2HuFuYA&s'),

('Alternador Remanufaturado',
 'Alternador 90A revisado, com garantia de 12 meses',
 520.00, 6, 'Bosch', 'AL0810X', '2008-2018', 4,
 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400');

-- Confirmação
SELECT 'Banco criado com sucesso!' AS status;
SELECT id, nome, email, role FROM usuarios;
SELECT id, nome, preco FROM produtos ORDER BY id;
