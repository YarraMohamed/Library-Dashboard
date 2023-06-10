-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2023 at 09:27 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookchapters`
--

CREATE TABLE `bookchapters` (
  `book_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookchapters`
--

INSERT INTO `bookchapters` (`book_id`, `id`, `title`, `description`) VALUES
(23, 10, 'Chapter 1', 'Description for Chapter 1'),
(23, 11, 'Chapter 14', 'description for chapter 14'),
(24, 12, 'Chapter 4', 'Description for chapter 4\n'),
(24, 13, 'Chapter 9', 'Description for Chapter 9'),
(24, 14, 'Chapter 11', 'Description for Chapter 11'),
(25, 15, 'Chapter 20', 'Description for Chapter 20'),
(29, 17, 'Chapter 4', 'Chapter 4 Description'),
(30, 18, 'chapter 40', 'description for chapter 40'),
(34, 19, 'chapter Aya ', 'description description\n');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `author` varchar(255) NOT NULL,
  `field` varchar(255) NOT NULL,
  `puplication_date` varchar(255) NOT NULL,
  `PDF_File` varchar(255) NOT NULL,
  `img_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `name`, `description`, `author`, `field`, `puplication_date`, `PDF_File`, `img_url`) VALUES
(23, 'The Psychology of money', 'this is a Description of this book', 'author', 'filed', '3 June 2013', '1683575879093.pdf', '1683575879006.jpg'),
(24, 'The book of art', 'Get your mind to abstract art', 'Regina Phalange', 'filed', '10 May 2018', '1683578339849.pdf', '1683578339845.jpg'),
(25, 'My book cover', 'Secrets in a silicon valley startup', 'book puplisher', 'science', '9 October 2001', '1683578424610.pdf', '1683578424530.jpg'),
(26, 'Book Booth', 'Description Description Description', 'Author', 'Filed', '5 July 2003', '1683578520471.pdf', '1683578520471.jpg'),
(29, 'Normal People', 'Description for Normal People book', 'Author', 'Science', '8 May 2019', '1683589209090.pdf', '1683589209089.jpg'),
(30, 'The Mind Of A Leader', 'The Mind Of A Leader Description', 'Author', 'filed', '8 July 2020', '1683589296246.pdf', '1683589296245.jpg'),
(31, 'Back to school', 'description for back to school', 'author', 'school', '9 April 2019', '1683592359359.pdf', '1683592570353.avif'),
(32, 'A Milion to one', 'Book Description Book Description', 'Author', 'Filed', '1 January 2019', '1683592550119.pdf', '1683592550119.jpg'),
(34, 'Aya ', 'krfgjithltrjhkljykljkl;yklhkjh', 'author', 'filed', '5 May 2019', '1683637621501.pdf', '1683637621500.avif');

-- --------------------------------------------------------

--
-- Table structure for table `userbookrequest`
--

CREATE TABLE `userbookrequest` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `book_id` int(11) NOT NULL,
  `book_name` varchar(255) NOT NULL,
  `request` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userbookrequest`
--

INSERT INTO `userbookrequest` (`id`, `user_id`, `user_name`, `book_id`, `book_name`, `request`) VALUES
(26, 26, 'Ahmed Mohamed', 26, 'Book Booth', 'accepted'),
(27, 26, 'Ahmed Mohamed', 24, 'The book of art', 'pending'),
(28, 27, 'Amira Ahmed', 23, 'The Psychology of money', 'pending'),
(30, 26, 'Ahmed Mohamed', 26, 'Book Booth', 'accepted'),
(34, 32, 'Aya Aya Aya Aya', 25, 'My book cover', 'accepted');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `status` enum('active','in-active','','') NOT NULL DEFAULT 'active',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 reader , 1 admin',
  `tokens` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `status`, `type`, `tokens`) VALUES
(1, 'Admin Admin', 'Admin@gmail.com', '$2b$10$PKJWj0ddcuv/h6Se6koJ2eNcpwRNpLH0MVx3KWfdCIwNdI36rcEuC', '015358662', 'active', 1, '09197d10b5bd383aeb48fff7370533ef'),
(26, 'Ahmed Mohamed', 'Ahmed@gmail.com', '$2b$10$ukhxemFNAs0QzIoXEdrglevZqw4R3qDoW2OKMIXmbqW1.M1MtfNdG', '0147558688', 'in-active', 0, '26b02f9e521273b8f20121d034420e1b'),
(27, 'Amira Ahmed', 'amira@gmail.com', '$2b$10$wQOsiT7CD9nAFc9BPh/XXe757kW6D7utz3Q5aiQhfc/Km/4Xx28ue', '0183765635', 'in-active', 0, '50178f42ae7d831e08bafe8885982987'),
(28, 'Mohamed Ahmed', 'Mohamed@gmail.com', '$2b$10$qQj.Z/EKox3GPkOYOWWlW.9qlQeY1CIjCLnHWEtvncXjHEdOy4TZa', '0128364', 'in-active', 0, '64aa5f4576da61f6010a32f0f96b5d1c'),
(31, 'Sara Omar', 'sara@gmail.com', '$2b$10$kkHkmWsdv51duXKJ57RInOJ.dtyPeHZe3YUYAITGolvA56FQEhhky', '019475866', 'in-active', 0, 'dad469ce6aabe62cd00b23ee09424b3e'),
(32, 'Aya Aya Aya Aya', 'Aya@gmail.com', '$2b$10$st2RAt2fRIkvkiO8ImFxU.jgRNevEtT2Aph43h8/lLKHh/Y4x2G02', '01736475685', 'in-active', 0, '733b85e46b000fbd8e186d90767befd0');

-- --------------------------------------------------------

--
-- Table structure for table `usersearch`
--

CREATE TABLE `usersearch` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `search` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usersearch`
--

INSERT INTO `usersearch` (`id`, `user_id`, `search`) VALUES
(33, 26, 'description'),
(34, 26, '20'),
(35, 26, 'book 6'),
(36, 27, 'My'),
(37, 27, 'cover'),
(39, 27, 'book 16'),
(40, 27, 'money'),
(41, 26, 'art'),
(42, 26, 'booth'),
(45, 31, 'art'),
(46, 32, 'art');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookchapters`
--
ALTER TABLE `bookchapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userbookrequest`
--
ALTER TABLE `userbookrequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `user_constr_id` (`user_id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usersearch`
--
ALTER TABLE `usersearch`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_constr_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookchapters`
--
ALTER TABLE `bookchapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `userbookrequest`
--
ALTER TABLE `userbookrequest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `usersearch`
--
ALTER TABLE `usersearch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookchapters`
--
ALTER TABLE `bookchapters`
  ADD CONSTRAINT `book_id` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userbookrequest`
--
ALTER TABLE `userbookrequest`
  ADD CONSTRAINT `book_constr_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userbookrequest_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usersearch`
--
ALTER TABLE `usersearch`
  ADD CONSTRAINT `user_constr_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
