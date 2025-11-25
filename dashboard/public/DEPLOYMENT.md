# InterviewPrep Pro - Deployment Guide

## Quick Start

1. **Extract the zip file**
   ```bash
   unzip interviewprep-pro.zip
   cd interviewprep-pro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   
   If you don't have pnpm installed:
   ```bash
   npm install -g pnpm
   ```

3. **Build for production**
   ```bash
   pnpm run build
   ```

4. **Preview the build locally**
   ```bash
   pnpm run preview
   ```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Point to the `dist` folder

### Option 3: Static Hosting (Nginx, Apache, etc.)
1. Copy the contents of the `dist` folder to your web server's root directory
2. Configure your server to serve `index.html` for all routes (SPA routing)

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 4: Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t interviewprep-pro .
docker run -p 80:80 interviewprep-pro
```

## Environment Variables
No environment variables are required for basic deployment. The application runs entirely on the client side.

## System Requirements
- Node.js 18+ or compatible runtime
- pnpm (or npm/yarn)
- Modern web browser with JavaScript enabled

## Support
For issues or questions, please refer to the project documentation or create an issue in the repository.