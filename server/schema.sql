CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) NOT NULL,
  discounted_price DECIMAL(10, 2) NOT NULL,
  is_discounted BOOLEAN DEFAULT TRUE
);


CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    publish_date TIMESTAMP
);
