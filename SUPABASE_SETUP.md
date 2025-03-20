# Supabase Database Setup Guide

This document explains how to set up the Supabase database for the Voluntify application.

## Required Tables

The application uses two main tables:

1. **seekers** - For job seekers/volunteers
2. **listings** - For employer job postings

## Setup Steps

### 1. Log in to Supabase Dashboard

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Log in with your credentials
3. Select your project (the one with URL: https://atbnhtvwlzbbssbtsgkk.supabase.co)

### 2. Create the Tables

#### Seekers Table

1. Navigate to **Table Editor** in the Supabase Dashboard
2. Click **New Table**
3. Set table name to `seekers`
4. Add the following columns:

| Column Name | Type | Default Value | Primary | Notes |
|-------------|------|---------------|---------|-------|
| id | uuid | `uuid_generate_v4()` | ✅ | Primary Key |
| created_at | timestamp with timezone | `now()` | | |
| name | text | | | |
| email | text | | | |
| phone | text | | | |
| description | text | | | |
| location | text | | | |
| skills | text | | | |
| interests | text | | | |
| experience | text | | | |
| availability | text | | | |

5. Click **Save** to create the table

#### Listings Table

1. Click **New Table**
2. Set table name to `listings`
3. Add the following columns:

| Column Name | Type | Default Value | Primary | Notes |
|-------------|------|---------------|---------|-------|
| id | uuid | `uuid_generate_v4()` | ✅ | Primary Key |
| created_at | timestamp with timezone | `now()` | | |
| company | text | | | |
| position | text | | | |
| description | text | | | |
| requirements | text | | | |
| location | text | | | |
| offer_type | text | | | |
| duration | text | | | |
| compensation | text | | | |
| contact_email | text | | | |
| contact_phone | text | | | |

4. Click **Save** to create the table

### 3. Set Up Row Level Security (RLS)

For this demo application, we'll set up simple RLS policies to allow inserting data without authentication:

1. Navigate to **Authentication > Policies** in the Supabase Dashboard
2. Find the `seekers` table and click **New Policy**
3. Choose **Insert** as the operation
4. Set policy name to `Allow public inserts`
5. For the USING expression, enter: `true`
6. Click **Save Policy**

7. Repeat the same steps for the `listings` table

### 4. Test the Setup

Once you've created the tables and set the policies, try submitting a job application or job posting in the application to verify everything works correctly.

## Embedding Tables Setup for Semantic Matching

To enable the semantic matching feature, we need to create additional tables to store embeddings. Run the following SQL in the Supabase SQL Editor:

```sql
-- Create a table for storing seeker embeddings
CREATE TABLE seeker_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seeker_id UUID REFERENCES seekers(id) ON DELETE CASCADE,
  embedding VECTOR(1536),  -- OpenAI embeddings are 1536 dimensions
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seeker_id)
);

-- Create a table for storing listing embeddings
CREATE TABLE listing_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  embedding VECTOR(1536),  -- OpenAI embeddings are 1536 dimensions
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id)
);

-- Create indexes for faster similarity search
CREATE INDEX ON seeker_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON listing_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

**Important:** The vector extension must be enabled in your Supabase project. If it's not enabled, contact Supabase support to enable it.

## Embedding Search Functions

If you want to perform vector searches directly in the database, you can create functions:

```sql
-- Function to find matching listings for a seeker
CREATE OR REPLACE FUNCTION match_listings_for_seeker(seeker_id UUID, match_threshold FLOAT DEFAULT 0.5, match_limit INT DEFAULT 20)
RETURNS TABLE (
  listing_id UUID,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    le.listing_id,
    1 - (se.embedding <=> le.embedding) as similarity
  FROM
    seeker_embeddings se,
    listing_embeddings le
  WHERE
    se.seeker_id = match_listings_for_seeker.seeker_id
    AND (1 - (se.embedding <=> le.embedding)) > match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to find matching seekers for a listing
CREATE OR REPLACE FUNCTION match_seekers_for_listing(listing_id UUID, match_threshold FLOAT DEFAULT 0.5, match_limit INT DEFAULT 20)
RETURNS TABLE (
  seeker_id UUID,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.seeker_id,
    1 - (le.embedding <=> se.embedding) as similarity
  FROM
    listing_embeddings le,
    seeker_embeddings se
  WHERE
    le.listing_id = match_seekers_for_listing.listing_id
    AND (1 - (le.embedding <=> se.embedding)) > match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_limit;
END;
$$ LANGUAGE plpgsql;
```

These functions can be used to perform matching directly in Supabase, which is more efficient for large datasets.

## Notes

- In a production environment, you would want more restrictive RLS policies
- You might want to add unique constraints or validation for fields like email
- Consider adding indexes for frequently queried columns 