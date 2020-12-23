DROP DATABASE IF EXITS `groupomania`;
CREATE DATABASE `groupomania`;
USE `groupomania`;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` text NOT NULL,
  `photo` text,
  `isAdmin` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

--
-- Table structure for table `Discussion`
--

DROP TABLE IF EXISTS `Discussion`;

CREATE TABLE `Discussion` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `title` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_id_discussion` (`user_id`),
  CONSTRAINT `fk_user_id_discussion` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;

CREATE TABLE `Message` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `discussion_id` smallint unsigned NOT NULL,
  `text_message` text NOT NULL,
  `file` text,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_discussion_id_message` (`discussion_id`),
  KEY `fk_user_id_message` (`user_id`),
  CONSTRAINT `fk_discussion_id_message` FOREIGN KEY (`discussion_id`) REFERENCES `Discussion` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_id_message` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;

--
-- Table structure for table `Liked`
--

DROP TABLE IF EXISTS `Liked`;

CREATE TABLE `Liked` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `message_id` smallint unsigned NOT NULL,
  `liked_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_message_id_liked` (`message_id`),
  KEY `fk_user_id_liked` (`user_id`),
  CONSTRAINT `fk_message_id_liked` FOREIGN KEY (`message_id`) REFERENCES `Message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id_liked` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;

CREATE TABLE `Comment` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint unsigned NOT NULL,
  `message_id` smallint unsigned NOT NULL,
  `text_comment` text NOT NULL,
  `date_comment` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_message_id_comment` (`message_id`),
  KEY `fk_user_id_comment` (`user_id`),
  CONSTRAINT `fk_message_id_comment` FOREIGN KEY (`message_id`) REFERENCES `Message` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_id_comment` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
