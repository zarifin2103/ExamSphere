# ExamSphere cPanel Node.js Deployment Guide

This guide provides step-by-step instructions for deploying your ExamSphere application to cPanel using the Node.js application feature.

## Preparation

1. Make sure you have built your application:
   ```
   npm run build
   ```

2. The build output is in the `dist` directory
3. We've created a `server.js` file to serve your application
4. We've added a `start` script to your package.json

## Deployment Steps

### 1. Upload Your Files to cPanel

1. Log in to your cPanel account
2. Use File Manager or FTP to upload your entire project directory (including node_modules, dist, server.js, and package.json) to:
   ```
   public_html/ujianonline
   ```

### 2. Set Up Node.js App in cPanel

1. In cPanel, navigate to **Software** > **Setup Node.js App**
2. Configure the application with these settings:
   - **Node.js version**: Select the latest available version (14.x or higher)
   - **Application mode**: Production
   - **Application root**: `public_html/ujianonline`
   - **Application URL**: `ujianonline`
   - **Application startup file**: `server.js` (NOT index.html)
   - **Environment variables**: Add `NODE_ENV=production`
   - **Passenger log file**: Leave as default

3. Click **Create** or **Save**

### 3. Verify Dependencies

1. In cPanel, navigate to your Node.js application
2. Click on the **Run NPM Install** button to ensure all dependencies are installed

### 4. Restart Your Application

1. After setup, click on the **Restart** button for your Node.js application
2. Wait a few moments for the application to start

## Troubleshooting

### Blank White Screen

If you're seeing a blank white screen:

1. Check the application logs in cPanel (Node.js App > View Log)
2. Ensure you specified `server.js` as the startup file, not `index.html`
3. Make sure the `dist` directory contains all your built files
4. Verify that the server.js file is properly configured to serve from the dist directory

### 404 Errors

If you're getting 404 errors:

1. Check that the server.js file is correctly set up to handle SPA routing
2. Ensure all paths in the application are relative (using ./ instead of /)
3. Verify the application URL is correctly set in cPanel

### Application Won't Start

If the application fails to start:

1. Check if all dependencies are installed (Run NPM Install)
2. Verify Node.js version compatibility
3. Check for syntax errors in server.js
4. Look at the application logs for specific error messages

## Important Notes

1. Your application is now running as a Node.js application, not a static website
2. Any changes to your code will require rebuilding and restarting the application
3. The server.js file is responsible for serving your built files from the dist directory
4. Make sure your application's base URL is configured correctly in vite.config.ts
