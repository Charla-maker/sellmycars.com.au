# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: sellmycars-cms
   - **Database Password**: (save this - you'll need it!)
   - **Region**: Choose closest to Sydney (ap-southeast-1 or ap-southeast-2)
5. Click "Create new project" (takes ~2 minutes)

## 2. Get Database Connection String

1. In Supabase Dashboard, go to **Settings** > **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with the password you set in step 1
6. Update `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

## 3. Get Supabase API Keys

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy the following and add to `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

## 4. Run Database Migrations

Once your `.env` is configured:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed database with admin user
npm run seed
```

## 5. Set Up Storage Bucket (for media uploads)

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name: `media`
4. Public bucket: **Yes**
5. Click **Create bucket**

## 6. Storage Policies (Security)

Run this SQL in Supabase SQL Editor:

```sql
-- Allow public read access to media bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');
```

## 7. First Login

After seeding, you can log in with:
- **Email**: admin@sellmycars.com.au
- **Password**: Admin123! (change this immediately after first login)

## Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL is correct
- Ensure password doesn't contain special characters that need URL encoding
- Verify your IP isn't blocked (Supabase allows all IPs by default)

### "Prisma Client not generated"
Run: `npx prisma generate`

### "Table already exists"
If you've run migrations before, use: `npx prisma migrate reset` (warning: deletes all data)

## Production Checklist

Before going live:
- [ ] Change admin password
- [ ] Update NEXTAUTH_SECRET to a strong random string
- [ ] Set up email provider (SendGrid/Mailgun)
- [ ] Configure storage bucket CORS if needed
- [ ] Set up Supabase backups
- [ ] Review RLS policies
