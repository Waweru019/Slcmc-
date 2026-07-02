-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: alumniportal
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academicrecord`
--

DROP TABLE IF EXISTS `academicrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academicrecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `programme_name` varchar(150) DEFAULT NULL,
  `year_joined` date DEFAULT NULL,
  `cohort_name` varchar(100) DEFAULT NULL,
  `graduation_year` year DEFAULT NULL,
  `reg_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `academicrecord_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academicrecord`
--

LOCK TABLES `academicrecord` WRITE;
/*!40000 ALTER TABLE `academicrecord` DISABLE KEYS */;
INSERT INTO `academicrecord` VALUES (8,13,'Diploma in Perioperative Theatre Technology','2026-06-12','ccppt',2027,'B141/24809/2022'),(9,16,'Diploma in Perioperative Theatre Technology','2026-06-16','DPPt',2034,'ppt/20223'),(10,17,'eee','2026-06-17','D57',2034,'45777'),(11,19,'Diploma in Perioperative Theatre Technology','2026-06-19','ccppt',2024,'bhu8');
/*!40000 ALTER TABLE `academicrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumni_messages`
--

DROP TABLE IF EXISTS `alumni_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumni_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message_text` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `file_path` varchar(255) DEFAULT NULL,
  `message_type` enum('text','image','document') DEFAULT 'text',
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `alumni_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alumni_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumni_messages`
--

LOCK TABLES `alumni_messages` WRITE;
/*!40000 ALTER TABLE `alumni_messages` DISABLE KEYS */;
INSERT INTO `alumni_messages` VALUES (43,13,19,'hello',1,'2026-06-25 05:59:45',NULL,'text'),(46,13,19,'😂😂😂🌝',1,'2026-06-25 06:03:08',NULL,'text'),(47,13,19,'Rada boys🥵😂',1,'2026-06-25 06:03:23',NULL,'text'),(48,13,19,'🤭🌹🥰🥰',1,'2026-06-25 06:03:52',NULL,'text'),(49,13,19,'😂🌝🌝🥵',1,'2026-06-25 07:03:14',NULL,'text'),(50,13,19,'🌝😂😂🥰',1,'2026-06-25 07:03:50',NULL,'text'),(51,13,19,'🤭🥲🥲🧐',1,'2026-06-25 07:04:11',NULL,'text'),(53,13,19,'',1,'2026-06-25 08:58:34','uploads/attachments/1782377914_1782359929625.jpg','image'),(54,19,13,'Received',1,'2026-06-25 09:02:03',NULL,'text'),(55,19,13,'Hello',1,'2026-06-25 09:02:55',NULL,'text'),(56,19,13,'🤭🥰🥰',1,'2026-06-25 09:03:22',NULL,'text'),(57,13,19,'',0,'2026-06-26 05:47:05','uploads/attachments/1782452825_op.jfif','document'),(58,13,19,'',0,'2026-06-26 05:47:31','uploads/attachments/1782452851_alumni portal.pdf','document'),(60,13,19,'',0,'2026-06-26 05:57:43','uploads/attachments/1782453463_1782359929625.jpg','image'),(62,13,19,'Yty',0,'2026-06-26 05:59:28',NULL,'text'),(63,13,19,'',0,'2026-06-26 06:08:21','uploads/attachments/1782454101_L6.pdf','document'),(64,13,26,'am good bosisiee',0,'2026-06-26 16:43:01',NULL,'text'),(74,13,19,'woza',0,'2026-06-29 05:50:36',NULL,'text'),(78,13,20,'buda',0,'2026-06-29 06:11:18',NULL,'text'),(79,13,19,'hhh',0,'2026-06-29 07:08:16',NULL,'text'),(80,13,19,'Hgy',0,'2026-06-29 07:09:46',NULL,'text'),(81,13,16,'Ghju',0,'2026-06-29 07:11:04',NULL,'text'),(82,13,16,'',0,'2026-06-29 07:11:40','uploads/attachments/1782717100_Screenshot_20260629-110050.png','image'),(83,13,26,'Hhhf',0,'2026-06-29 07:12:10',NULL,'text'),(88,13,22,'Mwanake',0,'2026-06-29 08:00:27',NULL,'text'),(92,13,26,'Haloo',0,'2026-06-29 09:38:21',NULL,'text'),(93,13,26,'',0,'2026-06-29 09:38:43','uploads/attachments/1782725923_1782701858_op.jfif.jpg','image'),(95,13,17,'Kiongos',0,'2026-06-29 09:46:43',NULL,'text'),(96,13,17,'',0,'2026-06-29 09:47:02','uploads/attachments/1782726422_1782701858_op.jfif.jpg','image'),(98,13,17,'Haloo',0,'2026-06-29 09:50:26',NULL,'text'),(100,13,20,'woza',0,'2026-06-30 09:05:53',NULL,'text'),(101,13,20,'',0,'2026-06-30 09:06:17','uploads/attachments/1782810377_passport (5).jpeg','image');
/*!40000 ALTER TABLE `alumni_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `audience` varchar(50) DEFAULT 'All',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'helllo','fgfhhfgfh','All',1,'2026-06-17 08:57:00'),(2,'ffggg','hhhhhhgghjh','All',1,'2026-06-17 09:11:29'),(3,'gggg','gggg','All',1,'2026-06-19 03:46:16'),(4,'Reconnection Message','Life after graduation takes you to new places, but your connection to [College Name] remains an important part of our community. We love sharing what is happening on campus and hearing about your journey since leaving.You are a vital part of our legacy. As our network spans across the globe, we want to ensure you stay in the loop with institutional updates, exclusive alumni benefits, and opportunities to connect with former classmates.Please take a moment to update your contact information on our [Alumni Update Portal] so we can continue to celebrate your personal and professional milestones.Warmly','All',1,'2026-06-19 04:33:49'),(5,'hhh','hh','All',1,'2026-06-24 07:15:40'),(6,'wozaa','oops','All',1,'2026-07-01 01:40:30');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action_string` varchar(255) NOT NULL,
  `target_details` varchar(255) DEFAULT NULL,
  `performed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (2,20,'Revoked Alumni Account Access','Name: Dan Waweru, Email: wawerumwangidan@gmail.com','2026-06-18 04:54:06'),(3,20,'Approved & Verified Alumni Account','Name: maina, Email: wawerumwangidan5@gmail.com','2026-06-18 05:00:08'),(4,20,'Revoked Alumni Account Access','Name: Shiko, Email: kimothopurity45@gmail.com','2026-06-18 05:11:17'),(6,20,'Approved & Verified Alumni Account','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-18 09:18:31'),(7,20,'Revoked Alumni Account Access','Name: yoze, Email: raila@gmail.com','2026-06-18 15:34:08'),(9,20,'Revoked Alumni Account Access','Name: maina, Email: wawerumwangidan5@gmail.com','2026-06-22 08:36:47'),(10,20,'Approved & Verified Alumni Account','Name: Shiko, Email: kimothopurity45@gmail.com','2026-06-23 02:34:13'),(11,20,'Created New Account profile (admin)','Name: mwas , Email: mwas@dan.com','2026-06-23 03:55:39'),(12,20,'Approved & Verified Alumni Account','Name: yoze, Email: mwas@gmail.com','2026-06-23 03:56:20'),(13,20,'Revoked Alumni Account Access','Name: yoze, Email: mwas@gmail.com','2026-06-23 03:56:35'),(14,20,'Approved & Verified Alumni Account','Name: yoze, Email: mwas@gmail.com','2026-06-23 04:22:45'),(15,20,'Approved & Verified Alumni Account','Name: maina, Email: wawerumwangidan5@gmail.com','2026-06-23 04:22:58'),(16,20,'Approved & Verified Alumni Account','Name: yoze2, Email: raila1@gmail.com','2026-06-23 04:26:27'),(17,20,'Approved & Verified Alumni Account','Name: DanZ, Email: wawerumwangidanR@gmail.com','2026-06-23 04:26:30'),(18,20,'Revoked Alumni Account Access','Name: Nambichwa, Email: kimothopurity85@gmail.com','2026-06-23 04:33:03'),(19,20,'Revoked Alumni Account Access','Name: yoze, Email: mwas@gmail.com','2026-06-23 04:33:30'),(20,20,'Approved & Verified Alumni Account','Name: yoze, Email: mwas@gmail.com','2026-06-23 04:46:08'),(21,20,'Approved & Verified Alumni Account','Name: Nambichwa, Email: kimothopurity85@gmail.com','2026-06-23 04:46:13'),(22,20,'Revoked Alumni Account Access','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-23 04:53:31'),(23,20,'Revoked Alumni Account Access','Name: Shiko, Email: kimothopurity45@gmail.com','2026-06-23 04:53:35'),(24,20,'Revoked Alumni Account Access','Name: yoze, Email: mwas@gmail.com','2026-06-23 04:53:39'),(25,20,'Revoked Alumni Account Access','Name: maina, Email: wawerumwangidan5@gmail.com','2026-06-23 04:53:43'),(26,20,'Approved & Verified Alumni Account','Name: maina, Email: wawerumwangidan5@gmail.com','2026-06-23 05:26:42'),(27,20,'Approved & Verified Alumni Account','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-23 07:14:17'),(28,20,'Revoked Alumni Account Access','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-23 07:19:14'),(29,20,'Approved & Verified Alumni Account','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-23 07:47:42'),(30,20,'Approved & Verified Alumni Account','Name: Shiko, Email: kimothopurity45@gmail.com','2026-06-23 07:47:46'),(31,20,'Approved & Verified Alumni Account','Name: yoze, Email: mwas@gmail.com','2026-06-23 07:47:52'),(32,20,'Revoked Alumni Account Access','Name: Shiko, Email: kimothopurity45@gmail.com','2026-06-23 08:22:08'),(33,20,'Revoked Alumni Account Access','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-23 08:22:47'),(34,20,'Approved & Verified Alumni Account','Name: Shiko, Email: shiko45@gmail.com','2026-06-23 08:48:20'),(35,20,'Approved & Verified Alumni Account','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-25 07:23:40'),(36,20,'Created New Account profile (admin)','Name: moks , Email: moks@dan.com','2026-06-26 15:14:40'),(37,20,'Revoked Alumni Account Access','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-29 01:54:53'),(38,20,'Approved & Verified Alumni Account','Name: Dan Waweru, Email: danneice25@gmail.com','2026-06-29 01:54:59'),(39,20,'Approved & Verified Alumni Account','Name: Nambichwa, Email: kimothopurity85@gmail.com','2026-06-30 09:24:44'),(40,20,'Created New Account profile (Guest)','Name: Danilo , Email: gust@gmail.com','2026-07-01 02:45:03'),(41,30,'Revoked Alumni Account Access','Name: Dan Waweru, Email: danneice25@gmail.com','2026-07-01 03:20:50'),(42,20,'Permanently Deleted User Account Profile','Name: Dan Waweru, Email: danneice25@gmail.com','2026-07-01 04:03:48'),(43,20,'Permanently Deleted User Account Profile','Name: Dan Waweru, Email: wawerumwang2idan@gmail.com','2026-07-01 04:04:16');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cohort`
--

DROP TABLE IF EXISTS `cohort`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cohort` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programme_id` int NOT NULL,
  `cohort` varchar(300) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `programme_id` (`programme_id`),
  CONSTRAINT `cohort_ibfk_1` FOREIGN KEY (`programme_id`) REFERENCES `programmes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cohort`
--

LOCK TABLES `cohort` WRITE;
/*!40000 ALTER TABLE `cohort` DISABLE KEYS */;
INSERT INTO `cohort` VALUES (2,2,'DPPt'),(3,2,'d57'),(4,3,'ccppt'),(5,4,'ppt'),(6,5,'677');
/*!40000 ALTER TABLE `cohort` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currentemployment`
--

DROP TABLE IF EXISTS `currentemployment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currentemployment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `employer_name` varchar(150) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT NULL,
  `work_county` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `currentemployment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currentemployment`
--

LOCK TABLES `currentemployment` WRITE;
/*!40000 ALTER TABLE `currentemployment` DISABLE KEYS */;
INSERT INTO `currentemployment` VALUES (8,13,'Nyeri Hospital ','Nurse Assistant','Full Time','Nakuru','2026-06-26'),(9,16,'mwea hospital','Doctor','Full Time','Uasin Gishu','2026-06-17'),(10,17,'dggd','ss','Full Time','Mombasa','2026-06-11'),(11,19,'hhhh','kk','Locum','Kiambu','2026-06-03');
/*!40000 ALTER TABLE `currentemployment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employmenthistory`
--

DROP TABLE IF EXISTS `employmenthistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employmenthistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `employer_name` varchar(150) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `employmenthistory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employmenthistory`
--

LOCK TABLES `employmenthistory` WRITE;
/*!40000 ALTER TABLE `employmenthistory` DISABLE KEYS */;
INSERT INTO `employmenthistory` VALUES (13,13,'Nyeri Hospital','Nurse','2026-06-19','2026-06-19');
/*!40000 ALTER TABLE `employmenthistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `furthereducation`
--

DROP TABLE IF EXISTS `furthereducation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `furthereducation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `institution` varchar(150) DEFAULT NULL,
  `field_of_study` varchar(150) DEFAULT NULL,
  `year_completed` year DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `furthereducation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `furthereducation`
--

LOCK TABLES `furthereducation` WRITE;
/*!40000 ALTER TABLE `furthereducation` DISABLE KEYS */;
INSERT INTO `furthereducation` VALUES (2,17,'kiri','gy',2026),(3,13,'','',0000);
/*!40000 ALTER TABLE `furthereducation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `alt_text` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (2,'best ideas and inspiration for Nurse pictures at work aesthetic','Residential plot survey in Chaka','uploads/media/1782194212_6a3a2024016e4.jfif','2026-06-23 05:56:52'),(3,'Graduation','issurance of land tittle deed in chaka,Nyeri County','uploads/media/1782194226_6a3a203213b09.jfif','2026-06-23 05:57:06'),(5,'best ideas and inspiration for Nurse pictures at work aesthetic','best ideas and inspiration for Nurse pictures at work aesthetic','uploads/media/1782195031_6a3a23571f4a7.jfif','2026-06-23 06:10:31'),(6,'Qatar Oppourtinities','Qatar Oppourtinities','uploads/media/1782195252_6a3a2434b9e30.jfif','2026-06-23 06:14:12'),(7,'Qatar Oppourtinities','Qatar Oppourtinities','uploads/media/1782195266_6a3a244287964.jfif','2026-06-23 06:14:26'),(8,'Qatar Oppourtinities','Qatar Oppourtinities','uploads/media/1782195296_6a3a24602087e.jfif','2026-06-23 06:14:56');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(150) NOT NULL,
  `token` varchar(64) NOT NULL,
  `status` enum('Active','Used','Expired') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES (5,16,'raila@gmail.com','T4V8RT','Active','2026-06-18 08:53:48','2026-06-18 16:53:48'),(6,16,'raila@gmail.com','YRMU64','Active','2026-06-18 08:53:48','2026-06-18 16:53:48'),(7,16,'raila@gmail.com','ZZFX6F','Active','2026-06-18 08:53:49','2026-06-18 16:53:49');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privacysettings`
--

DROP TABLE IF EXISTS `privacysettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privacysettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `show_email` tinyint(1) DEFAULT '1',
  `show_phone` tinyint(1) DEFAULT '0',
  `show_employment` tinyint(1) DEFAULT '1',
  `show_education` tinyint(1) DEFAULT '1',
  `show_membership` tinyint(1) DEFAULT '0',
  `show_social` tinyint(1) DEFAULT '0',
  `show_contact` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `privacysettings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privacysettings`
--

LOCK TABLES `privacysettings` WRITE;
/*!40000 ALTER TABLE `privacysettings` DISABLE KEYS */;
INSERT INTO `privacysettings` VALUES (2,13,1,0,1,1,1,0,1),(3,19,1,0,1,1,0,0,0),(4,18,1,1,1,1,1,0,1),(5,18,1,1,1,1,1,0,1);
/*!40000 ALTER TABLE `privacysettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professionalmembership`
--

DROP TABLE IF EXISTS `professionalmembership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professionalmembership` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `organization` varchar(150) DEFAULT NULL,
  `membership_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `professionalmembership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professionalmembership`
--

LOCK TABLES `professionalmembership` WRITE;
/*!40000 ALTER TABLE `professionalmembership` DISABLE KEYS */;
INSERT INTO `professionalmembership` VALUES (2,13,'Ncck kanya','2345879');
/*!40000 ALTER TABLE `professionalmembership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programmes`
--

DROP TABLE IF EXISTS `programmes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programmes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programme` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programmes`
--

LOCK TABLES `programmes` WRITE;
/*!40000 ALTER TABLE `programmes` DISABLE KEYS */;
INSERT INTO `programmes` VALUES (2,'Diploma in Clinical Medicine and Surgery'),(3,'Diploma in Community Health Nursing'),(4,'Diploma in Perioperative Theatre Technology'),(5,'ggt');
/*!40000 ALTER TABLE `programmes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialcontact`
--

DROP TABLE IF EXISTS `socialcontact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialcontact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `linkedin` varchar(150) DEFAULT NULL,
  `physical_address` varchar(255) DEFAULT NULL,
  `home_county` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `socialcontact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialcontact`
--

LOCK TABLES `socialcontact` WRITE;
/*!40000 ALTER TABLE `socialcontact` DISABLE KEYS */;
INSERT INTO `socialcontact` VALUES (2,13,'https://purity','19 Narumoru','Kisumu');
/*!40000 ALTER TABLE `socialcontact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `First_name` varchar(100) DEFAULT NULL,
  `Dob` date DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone_number` varchar(15) DEFAULT NULL,
  `id_no` varchar(20) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Graduation_class` varchar(10) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `verified_at` timestamp NULL DEFAULT NULL,
  `Role` varchar(20) NOT NULL DEFAULT 'alumni',
  `requires_password_change` tinyint(1) NOT NULL DEFAULT '0',
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `last_seen` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `id_no` (`id_no`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (13,'Waweru Dan Mwangi','2026-06-11','Female','shiko45@gmail.com','0743537728','345678','uploads/passport (5).jpeg','$2y$10$5kqwecbrKVucjA.ipzTG4.aEOateP1efQbydTG1rMLE2MjwnhLoMO','2029','Verified','2026-06-23 08:48:20','alumni',0,NULL,NULL,'2026-07-01 06:38:34'),(16,'John Mburu','2026-06-16','Male','mwas@gmail.com','+2542937748590',NULL,'uploads/IMG_20230915_105528.jpg','$2y$10$XNwIMjS5Z9ltv0wUvV4L5uaAmGMGcI8FUmapA9bozXHSpoyB/..xC','1999','Verified','2026-06-23 07:47:52','alumni',0,'ZZFX6F','2026-06-18 12:53:49','2026-07-01 08:54:58'),(17,'maina','2026-06-04','Female','wawerumwangidan5@gmail.com','+254758079624','6778','uploads/default.jfif','$2y$10$4N0QSaO1hpDBE4Gi3/kPvut9.ldKYtaoadmvSYNwP9T1mymTIctsC','2027','Verified','2026-06-23 05:26:42','alumni',0,NULL,NULL,'2026-06-29 03:29:01'),(18,'Nambichwa','2026-06-16','female','kimothopurity85@gmail.com','0816637376','12345678',NULL,'$2y$10$OGahlJ7QbG39oxUyFK1DXu7eU.fdx9zAxl0ADoEveOm5ZEDls4VQG','2025','Verified','2026-06-30 09:24:44','alumni',0,NULL,NULL,'2026-06-30 09:24:44'),(19,'Eunice','2026-06-16','male','kimothopurity47@gmail.com','789008765',NULL,'uploads/1782359941727.jpg','$2y$10$9Umnb/jbgxF866PL1p8J9eCiNV0sq1JmDNcOmby5AUAwsfi2TahS2','2017','Verified','2026-06-18 04:35:14','alumni',0,NULL,NULL,'2026-06-29 09:29:28'),(20,'Dan',NULL,NULL,'dan@slcmc.com',NULL,NULL,NULL,'$2y$10$iCF/VNVjZsbCX.txT3MfoO.1k4zXmfzIafAMTpkWSDZYTH2indC3K',NULL,'Verified',NULL,'admin',0,NULL,NULL,'2026-07-01 08:51:46'),(21,'Shiko',NULL,NULL,'shiko@slcmc.com',NULL,NULL,NULL,'$2y$10$TA6SbYPIXvhJp4UlmNbxOOz69MrE08hKwS/OLtI8MeH/c7dYwKBKy',NULL,'Verified',NULL,'admin',0,NULL,NULL,'2026-06-29 03:29:01'),(22,'yoze2','2026-06-22','male','raila1@gmail.com','+2542937748590','2345',NULL,'$2y$10$YHRVCsQSatiG1MJEQWOVQeAIIUO62O5/wROOvr7jMXob8VmqeYrBG','2026','Verified','2026-06-23 04:26:25','alumni',0,NULL,NULL,'2026-06-29 03:29:01'),(25,'DanZ','2026-06-24','male','wawerumwangidanR@gmail.com','+254758079624','45676',NULL,'$2y$10$q4EasqhNheeRexYXNGCjt..WyqGfnJ2cm3smHwfxD7Pa8TnIEH5le','2001','Verified','2026-06-23 04:26:29','alumni',0,NULL,NULL,'2026-06-29 03:29:01'),(26,'mwas',NULL,NULL,'mwas@dan.com',NULL,NULL,NULL,'$2y$10$taR0Q3oMNph/iv7qfOsq4eLdGyZhswCdfPX4jqPM4E3IOi1oJhJhG',NULL,'Verified',NULL,'admin',0,NULL,NULL,'2026-06-29 03:29:01'),(27,'Purity','2026-06-24','male','kimothopurity45@gmail.com','07643554545',NULL,NULL,'$2y$10$Lct86UxF1uwEKiguguKZAOqzzuC6x/.zJC/cbR02P0DobsT6NPsIC','2025','pending',NULL,'alumni',0,NULL,NULL,'2026-06-29 03:29:01'),(28,'moks',NULL,NULL,'moks@dan.com',NULL,NULL,NULL,'$2y$10$zcfE76KeY6TRZ9MrKkArLuMKMEB0f8gFa.3A1gX2woC5UxJE8vdkS',NULL,'Verified',NULL,'admin',0,NULL,NULL,'2026-06-29 03:29:01'),(30,'Danilo',NULL,NULL,'gust@gmail.com',NULL,NULL,NULL,'$2y$10$tqnBFh3M2K/o5z8rZIyNCOqx0591fLhELK1HsatyI662UXAInVT5e',NULL,'Pending',NULL,'Guest',0,NULL,NULL,'2026-07-01 08:50:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-01 16:54:00
