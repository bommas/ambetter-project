# Deployment Guide - Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Already installed (`vercel`)
3. **Environment Variables**: You'll need:
   - `ELASTIC_ENDPOINT`: Your Elasticsearch serverless endpoint
   - `ELASTIC_API_KEY`: Your Elasticsearch API key
   - `OPENAI_API_KEY`: Your OpenAI API key (optional, falls back to mock)
   - `RABBITMQ_URL`: RabbitMQ URL (optional for analytics)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy to Preview**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Link to existing project or create new one
   - Set project name: `ambetter-health-search`

3. **Add Environment Variables**:
   ```bash
   vercel env add ELASTIC_ENDPOINT
   vercel env add ELASTIC_API_KEY
   vercel env add OPENAI_API_KEY
   vercel env add RABBITMQ_URL
   ```
   - Choose: Production, Preview, Development (or all)
   - Paste the values when prompted

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import in Vercel Dashboard**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables in Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add each variable:
     - `ELASTIC_ENDPOINT`
     - `ELASTIC_API_KEY`
     - `OPENAI_API_KEY`
     - `RABBITMQ_URL` (optional)

4. **Deploy**: Click "Deploy"

## Current Configuration

### Environment Variables Needed

```bash
# Elasticsearch (REQUIRED)
ELASTIC_ENDPOINT=https://your-deployment.es.us-central1.gcp.cloud.es.io
ELASTIC_API_KEY=your-api-key-here

# OpenAI (OPTIONAL - will use mock summaries if not provided)
OPENAI_API_KEY=sk-proj-your-key-here

# RabbitMQ (OPTIONAL - for analytics)
RABBITMQ_URL=amqp://your-rabbitmq-url:5672
```

### Vercel Project Settings

- **Framework**: Next.js 14
- **Node.js Version**: 18.x (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Region**: Washington, D.C., USA (iad1)

## Post-Deployment

### Verify Deployment

1. **Check Health Endpoint**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Test Search**:
   - Visit: `https://your-app.vercel.app`
   - Try searching for "preventive care"
   - Verify AI summary appears

3. **Check Logs**:
   ```bash
   vercel logs
   ```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Troubleshooting

### Build Fails

- Check build logs: `vercel logs`
- Verify all dependencies are in `package.json`
- Ensure TypeScript errors are fixed: `npm run build` locally

### Environment Variables Not Loading

- Verify variables are set in Vercel dashboard
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Elasticsearch Connection Issues

- Verify `ELASTIC_ENDPOINT` includes `https://`
- Check API key has correct permissions
- Test connection locally first

### OpenAI API Issues

- Application will fall back to mock summaries if key is missing
- Verify API key starts with `sk-proj-` or `sk-`
- Check OpenAI account has credits

## Monitoring

### Vercel Analytics

- Enable in Project Settings → Analytics
- View real-time metrics in dashboard

### Error Tracking

- Check Function logs in Vercel dashboard
- Set up error monitoring (Sentry, etc.) if needed

## Rollback

If deployment has issues:

```bash
vercel rollback
```

Or select a previous deployment in the Vercel dashboard.

## Local Development with Vercel Environment

Pull environment variables from Vercel:

```bash
vercel env pull .env.local
```

This creates a local `.env.local` file with your Vercel environment variables.

## Notes

- **Serverless Functions**: API routes run as serverless functions (10s timeout on free tier, 60s on Pro)
- **Cold Starts**: First request may be slower due to function initialization
- **Rate Limits**: Consider implementing rate limiting for production use
- **CORS**: Configure if needed for external API access
- **Security**: Never commit `.env.local` or expose API keys in client-side code

