# 🚀 NeuraLearn Deployment Guide

Complete step-by-step guide to deploy NeuraLearn to Vercel with Neon PostgreSQL.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Vercel account (free tier)
- [ ] Neon DB account (free tier)
- [ ] Node.js 18+ installed locally

## Part 1: Database Setup (Neon DB)

### Step 1: Create Neon Database

1. Visit https://neon.tech and sign up/login
2. Click "Create a project"
3. Enter project details:
   - **Name**: neuralearn-db
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (recommended)
4. Click "Create project"

### Step 2: Get Connection String

1. In your Neon dashboard, navigate to your project
2. Click on "Connection Details"
3. Copy the connection string (format: `postgresql://user:password@host/database`)
4. **Important**: Add `?sslmode=require` to the end
5. Final format: `postgresql://user:password@host/database?sslmode=require`

Example:
```
postgresql://neondb_owner:npg_AbC123XyZ@ep-cool-cloud-12345.us-east-2.aws.neon.tech/neuralearn?sslmode=require
```

### Step 3: Configure Database Access

1. In Neon dashboard, go to "Settings" > "IP Allow"
2. Add `0.0.0.0/0` to allow Vercel access (or use Neon's connection pooler)
3. Save changes

## Part 2: GitHub Repository Setup

### Step 1: Initialize Git Repository

```bash
cd neuralearn
git init
git add .
git commit -m "Initial commit: NeuraLearn platform"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `neuralearn`
3. Description: "AI-powered personalized learning platform for CSE students"
4. Choose "Public" or "Private"
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/neuralearn.git
git branch -M main
git push -u origin main
```

## Part 3: Vercel Deployment

### Step 1: Import Project to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." > "Project"
3. Find your `neuralearn` repository
4. Click "Import"

### Step 2: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (leave as default)
**Build Command**: `prisma generate && next build` (auto-set)
**Output Directory**: `.next` (auto-set)

### Step 3: Configure Environment Variables

Click "Environment Variables" and add these:

**1. DATABASE_URL**
- Key: `DATABASE_URL`
- Value: Your Neon connection string (from Part 1, Step 2)
- Environment: Production, Preview, Development

**2. NEXTAUTH_SECRET**
- Key: `NEXTAUTH_SECRET`
- Value: Generate using: `openssl rand -base64 32`
- Environment: Production, Preview, Development

**3. NEXTAUTH_URL**
- Key: `NEXTAUTH_URL`
- Value: `https://your-project-name.vercel.app` (will update after first deploy)
- Environment: Production

Example values:
```
DATABASE_URL=postgresql://neondb_owner:npg_123@ep-cool-cloud.us-east-2.aws.neon.tech/neuralearn?sslmode=require
NEXTAUTH_SECRET=generated-secret-here-min-32-characters-long
NEXTAUTH_URL=https://neuralearn.vercel.app
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Note your deployment URL (e.g., `https://neuralearn-xyz.vercel.app`)

### Step 5: Update NEXTAUTH_URL

1. Go to Vercel dashboard > Your Project > Settings > Environment Variables
2. Find `NEXTAUTH_URL`
3. Update value to your actual Vercel URL
4. Click "Save"
5. Redeploy: Go to "Deployments" > Latest deployment > Three dots > "Redeploy"

## Part 4: Database Migration & Seeding

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull production environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### Method 2: Using Prisma Studio

```bash
# Set production database URL
export DATABASE_URL="your-production-neon-url"

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### Method 3: Manual via Neon Console

1. Go to Neon dashboard
2. Click "SQL Editor"
3. Copy contents from `prisma/schema.prisma` and create tables manually
4. Run seed queries manually (not recommended for complex seeds)

## Part 5: Post-Deployment Verification

### Step 1: Test Application

1. Visit your Vercel URL
2. Click "Register" and create a test account
3. Login with demo accounts:
   - Student: `student@demo.com` / `password123`
   - Instructor: `instructor@demo.com` / `password123`
   - Admin: `admin@demo.com` / `password123`

### Step 2: Verify Features

Test these key features:
- [ ] User registration works
- [ ] Login authentication works
- [ ] Dashboard displays correctly
- [ ] Quizzes list loads
- [ ] Can take a quiz
- [ ] Quiz results show properly
- [ ] Weak area analysis displays
- [ ] Recommendations appear

### Step 3: Check Logs

1. Go to Vercel Dashboard > Your Project > Logs
2. Look for any errors or warnings
3. Check function execution times

## Part 6: Custom Domain (Optional)

### Step 1: Add Custom Domain

1. Go to Vercel Dashboard > Your Project > Settings > Domains
2. Enter your domain (e.g., `neuralearn.com`)
3. Click "Add"

### Step 2: Configure DNS

Follow Vercel's instructions to add DNS records:
- **Type**: A Record
- **Name**: @ (or subdomain)
- **Value**: `76.76.21.21`

Or for CNAME:
- **Type**: CNAME
- **Name**: www
- **Value**: `cname.vercel-dns.com`

### Step 3: Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://neuralearn.com
```

## Part 7: Monitoring & Maintenance

### Enable Analytics

1. Go to Vercel Dashboard > Your Project > Analytics
2. Enable Web Analytics
3. View real-time performance metrics

### Set Up Logs

1. Go to Vercel Dashboard > Your Project > Logs
2. Monitor API routes and function executions
3. Set up log drains for persistent storage (optional)

### Database Monitoring

1. Go to Neon Dashboard > Your Project
2. Monitor:
   - Connection count
   - Query performance
   - Storage usage
3. Set up alerts for high usage

## Part 8: Continuous Deployment

### Automatic Deployments

Every push to `main` branch triggers automatic deployment:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically deploys
```

### Preview Deployments

Pull requests automatically create preview deployments:

1. Create a new branch
2. Make changes
3. Push and create PR
4. Vercel creates preview URL
5. Test before merging

## Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
1. Ensure all dependencies in package.json
2. Check for TypeScript errors
3. Verify Prisma schema is valid
```

### Issue: Database Connection Fails

**Solution:**
```bash
# Verify connection string format
# Must include ?sslmode=require
# Check Neon DB is accessible
# Verify IP allowlist in Neon
```

### Issue: Authentication Not Working

**Solution:**
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches deployment URL
# Clear cookies and try again
# Check browser console for errors
```

### Issue: "Module not found" Errors

**Solution:**
```bash
# Redeploy with cleared cache
# Go to Deployments > Three dots > Redeploy
# Check "Clear build cache"
```

## Performance Optimization

### 1. Enable Caching

Add these headers in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
```

### 2. Database Connection Pooling

Use Neon's connection pooler for better performance:
- In Neon dashboard, enable connection pooling
- Use pooled connection string for production

### 3. Optimize Images

Next.js automatically optimizes images. Use the Image component:
```javascript
import Image from 'next/image'
```

## Security Checklist

- [ ] Environment variables properly set
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Database credentials secured
- [ ] No sensitive data in git repository
- [ ] .gitignore includes .env files
- [ ] CORS configured properly
- [ ] Rate limiting considered for API routes

## Cost Estimation

**Free Tier Limits:**
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Neon**: 10 projects, 0.5GB storage per database
- **Estimated Monthly Cost**: $0 (on free tiers)

**Scaling Considerations:**
- Monitor usage in both dashboards
- Upgrade when approaching limits
- Vercel Pro: $20/month
- Neon Pro: Starts at $19/month

## Success Criteria

Your deployment is successful when:
- ✅ Application accessible at Vercel URL
- ✅ All pages load without errors
- ✅ Authentication working
- ✅ Database queries executing
- ✅ Demo accounts accessible
- ✅ Quizzes can be taken and submitted
- ✅ Dashboard analytics display correctly

## Next Steps

1. Add more quizzes and questions
2. Enhance recommendation algorithm
3. Add more analytics features
4. Implement email notifications
5. Add social authentication (Google, GitHub)
6. Create instructor dashboard
7. Add admin panel

---

**Need Help?**
- Check Vercel documentation: https://vercel.com/docs
- Neon documentation: https://neon.tech/docs
- Next.js documentation: https://nextjs.org/docs
- Create an issue in the repository

**🎉 Congratulations! Your NeuraLearn platform is now live!**
