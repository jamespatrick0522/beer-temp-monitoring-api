CREATE TABLE "beers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"min_temp_c" numeric(4, 1) NOT NULL,
	"max_temp_c" numeric(4, 1) NOT NULL,
	"image_url" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "beers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "temperature_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"beer_id" uuid NOT NULL,
	"temperature_c" numeric(4, 1) NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "temperature_readings" ADD CONSTRAINT "temperature_readings_beer_id_beers_id_fk" FOREIGN KEY ("beer_id") REFERENCES "public"."beers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "temperature_readings_beer_recorded_idx" ON "temperature_readings" USING btree ("beer_id","recorded_at");