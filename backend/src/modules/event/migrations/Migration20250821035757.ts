import { Migration } from '@mikro-orm/migrations';

export class Migration20250821035757 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "events" ("id" varchar not null, "title" varchar not null, "description" text not null, "bbq_region" varchar not null, "event_date" timestamptz not null, "duration_hours" int not null, "location" varchar not null, "base_price" int not null, "max_capacity" int not null, "current_bookings" int not null default 0, "status" varchar not null default 'active', "image_url" varchar null, "hero_image_url" varchar null, "content" jsonb not null, "registration_deadline" timestamptz null, "cancellation_deadline" timestamptz null, "is_active" boolean not null default true, "venue_address" varchar null, "contact_email" varchar null, "contact_phone" varchar null, "special_instructions" text null, "slug" varchar null, "ticket_variant_id" varchar null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "events_pkey" primary key ("id"));`);
    this.addSql(`create index if not exists "events_status_index" on "events" ("status");`);
    this.addSql(`create index if not exists "events_bbq_region_index" on "events" ("bbq_region");`);
    this.addSql(`create index if not exists "events_event_date_index" on "events" ("event_date");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "events" cascade;`);
  }

}
