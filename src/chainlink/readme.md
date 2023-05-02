


```
CREATE TABLE IF NOT EXISTS `prices`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `token_name` VARCHAR(20) NOT NULL,
   `round_id` VARCHAR(50) NOT NULL,
   `answer` VARCHAR(50) NOT NULL,
   `started_at` VARCHAR(50) NOT NULL,
   `updated_at` VARCHAR(50) NOT NULL,
   `answered_in_round` VARCHAR(50) NOT NULL,
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```