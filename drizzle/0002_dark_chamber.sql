ALTER TABLE `matches` ADD `notified_reminder` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `matches` ADD `notified_start` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `matches` ADD `notified_end` integer DEFAULT false NOT NULL;