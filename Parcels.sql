CREATE TABLE IF NOT EXISTS `Parcels` (
  `S_poscode` varchar(30),
  `D_postcode` varchar(30),
  `Weight` FLOAT(3, 1),
  `Rec_name` varchar(255),
  `Full_address` text,
  `sender_username` varchar(255),
  `date_added` datetime,
  `Status` varchar(255),
  `Tracking_id` varchar(255) PRIMARY KEY,
  `Signature_image` varchar(255),
  `Date_delivered` datetime,
  `lat` float(10,6),
  `lng` float(10,6)
);
