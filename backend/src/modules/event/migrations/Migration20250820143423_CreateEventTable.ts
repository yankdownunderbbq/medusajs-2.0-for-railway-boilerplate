import { Migration } from '@mikro-orm/migrations';

export class CreateEventTable extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id" VARCHAR PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) UNIQUE,
        "description" TEXT NOT NULL,
        "event_date" TIMESTAMPTZ NOT NULL,
        "location" VARCHAR(500) NOT NULL,
        "venue_address" VARCHAR(500),
        "base_price" INTEGER NOT NULL DEFAULT 0,
        "max_capacity" INTEGER NOT NULL DEFAULT 0,
        "current_bookings" INTEGER DEFAULT 0,
        "status" VARCHAR(50) DEFAULT 'active',
        "is_active" BOOLEAN DEFAULT true,
        "bbq_region" VARCHAR(100) NOT NULL,
        "duration_hours" INTEGER DEFAULT 3,
        "image_url" VARCHAR(255),
        "hero_image_url" VARCHAR(255),
        "contact_email" VARCHAR(255),
        "contact_phone" VARCHAR(50),
        "special_instructions" TEXT,
        "content" JSONB DEFAULT '{}',
        "registration_deadline" TIMESTAMPTZ,
        "cancellation_deadline" TIMESTAMPTZ,
        "metadata" JSONB,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS "idx_events_status" ON "events"("status");
      CREATE INDEX IF NOT EXISTS "idx_events_event_date" ON "events"("event_date");
      CREATE INDEX IF NOT EXISTS "idx_events_bbq_region" ON "events"("bbq_region");
      CREATE INDEX IF NOT EXISTS "idx_events_slug" ON "events"("slug");
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "events";');
  }
}