# Migration Scripts

## Product Migration

Migrates products and collections from static data files to Supabase database.

### Prerequisites

1. Set up your `.env.local` file with Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. Install dependencies:
```bash
npm install tsx dotenv
```

### Usage

Run the migration script:
```bash
npx tsx scripts/migrate-products.ts
```

### What it does

- Creates collections from `src/data/collections.ts`
- Creates products from `src/data/products.ts`
- Creates product variants for each product
- Skips duplicates (based on slug)
- Sets default stock quantity to 100 for all variants

### Notes

- The script uses the service role key for full database access
- Products are matched by slug - existing products won't be overwritten
- Collections are matched by slug - existing collections won't be overwritten
- If a collection doesn't exist, products will be created without a collection_id




