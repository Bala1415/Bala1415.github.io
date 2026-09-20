# Netlify Deployment Guide

## Prerequisites

- [Netlify Account](https://www.netlify.com/) (free)
- [Gmail App Password](#generating-gmail-app-password)
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (optional, for local testing)

## Step 1: Generating Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security** from the left menu
3. Under "Signing in to Google," select **2-Step Verification** (you must have this enabled)
4. At the bottom, select **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)**
7. Enter a name like "Portfolio Contact Form"
8. Click **Generate**
9. **Copy the 16-character password** (remove spaces if any)
10. Store it securely - you won't be able to see it again

## Step 2: Connect to Netlify

### Option A: Deploy via GitHub (Recommended)

1. Push your portfolio to GitHub:

   ```bash
   git add .
   git commit -m "Add Netlify Functions for contact form"
   git push origin main
   ```

2. Go to [Netlify](https://app.netlify.com/)
3. Click **Add new site** → **Import an existing project**
4. Choose **GitHub** and authorize Netlify
5. Select your portfolio repository
6. **Build settings:**
   - Build command: `echo 'Static site'`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
7. Click **Deploy site**

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:

   ```bash
   netlify login
   ```

3. Initialize site:

   ```bash
   netlify init
   ```

4. Follow the prompts and deploy:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables

1. In your Netlify dashboard, go to your site
2. Navigate to **Site configuration** → **Environment variables**
3. Click **Add a variable** and add the following:

   **Variable 1:**

   - Key: `GMAIL_USER`
   - Value: `aubalavignesh1010@gmail.com`

   **Variable 2: **

   - Key: `GMAIL_APP_PASSWORD`
   - Value: Your 16-character app password (e.g., `abcdabcdabcdabcd`)

4. Click **Save**
5. **Important:** Redeploy your site after adding environment variables:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

## Step 4: Test Your Contact Form

1. Visit your deployed site (e.g., `https://your-site-name.netlify.app`)
2. Navigate to the Contact section
3. Fill out and submit the form
4. You should see a success message
5. Check your Gmail inbox for the email

## Local Testing (Optional)

If you want to test locally before deploying:

1. Create a `.env` file in your project root:

   ```env
   GMAIL_USER=aubalavignesh1010@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run Netlify Dev server:

   ```bash
   netlify dev
   ```

4. Open `http://localhost:8888` in your browser
5. Test the contact form

## Troubleshooting

### Form submission fails

**Check:**

- Environment variables are set correctly in Netlify
- Gmail app password is correct (16 characters, no spaces)
- You redeployed after adding environment variables
- Check Netlify Functions logs in dashboard → Functions tab

### Email not received

**Check:**

- Spam/junk folder
- Gmail app password is valid
- 2-Step Verification is enabled on your Google account
- Function logs for errors

### 404 Error on form submission

- Ensure `netlify.toml` is in the root of your project
- Verify the form submits to `/.netlify/functions/sendEmail`
- Redeploy your site

### View Function Logs

1. Go to Netlify dashboard
2. Select your site
3. Navigate to **Functions** tab
4. Click on `sendEmail` function
5. View logs to see errors

## Custom Domain (Optional)

1. In Netlify dashboard, go to **Site configuration** → **Domain management**
2. Click **Add custom domain**
3. Follow the instructions to configure your domain's DNS
4. Netlify will automatically provision SSL certificate

## Security Notes

- ✅ Never commit `.env` file to Git
- ✅ Environment variables are encrypted in Netlify
- ✅ Use Gmail app password, not your actual account password
- ✅ The app password only works for this specific application

## Support

If you encounter issues:

- Check [Netlify Functions documentation](https://docs.netlify.com/functions/overview/)
- Review [Nodemailer Gmail setup](https://nodemailer.com/usage/using-gmail/)
- Check Netlify community forums

---

**Your site is now live with a fully functional contact form! 🎉**
