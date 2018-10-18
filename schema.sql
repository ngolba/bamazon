-- drop database if exists bamazon;

-- create database bamazon;

use bamazon;

-- create table products (
--     item_id int not null auto_increment,
--     product_name varchar(100) null,
--     department_name varchar(100) null,
--     price decimal (10, 2) null,
--     stock_quantity int (10),
--     primary key (item_id)
-- );

select * from bamazon.products;

-- Mock Data -- 
-- insert into products (product_name, department_name, price, stock_quantity) 
-- values ('Playing Cards', 'Toys', 9.95, 5), ('T-Shirt', 'Clothing', 18.00, 3), ('Headphones', 'Electronics', 30.00, 15), ('Slow Cooker', 'Kitchen', 70, 4), ('Compression Socks', 'Clothing', 14.95, 8),
--     ('Action Figure', 'Toys', 14.84, 2), ('Bartender Kit', 'Kitchen', 44.95, 1), ('Game Console', 'Electronics', 480.95, 10), ('DVD', 'Media', 23.85, 50), ('Sunglasses', 'Clothing', 29.99, 8)