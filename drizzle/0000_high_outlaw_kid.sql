CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`product_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`total_amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_reference_unique` ON `orders` (`reference`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`price` integer NOT NULL,
	`image` text DEFAULT '/images/bottle-placeholder.jpg' NOT NULL,
	`category` text NOT NULL,
	`scent_family` text NOT NULL,
	`top_notes` text NOT NULL,
	`heart_notes` text NOT NULL,
	`base_notes` text NOT NULL,
	`size` text DEFAULT '100ml' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);