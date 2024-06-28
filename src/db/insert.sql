-- Insert roles
INSERT INTO roles(name) VALUES('ADMIN');
INSERT INTO roles(name) VALUES('SOCIO');
-- Insert admin user
INSERT INTO users(email, password, role_id) VALUES ('admin@mail.com', '$2a$10$WHA7Rwnti3PLuYZlaxY/zORWt0awaMWoxaKv0pFphGntI3oLDqXU2', 1);