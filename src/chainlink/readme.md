


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
alter table `prices` Add phrase varchar(50) not null AFTER round_id;
alter table `prices` Add agg_round_id varchar(50) not null AFTER phrase;


CREATE TABLE IF NOT EXISTS `period`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `token_name` VARCHAR(20) NOT NULL,
   `period` VARCHAR(20) NOT NULL,
   `o` double NOT NULL,
   `c` double NOT NULL,
   `h` double NOT NULL,
   `l` double NOT NULL,
   `t` VARCHAR(30) NOT NULL,
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```


```
pm2 start npm --name ingroup -- start
```