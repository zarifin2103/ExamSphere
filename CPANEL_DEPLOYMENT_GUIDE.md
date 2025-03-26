# ExamSphere cPanel Deployment Guide

This guide will help you deploy your ExamSphere application to a cPanel hosting environment.

## Prerequisites

- cPanel hosting account with:
  - File Manager access
  - FTP access (optional but recommended for large uploads)

## Deployment Steps

### 1. Prepare your build files

The application has already been built with the command `npm run build`. The output is in the `dist` directory.

### 2. Upload files to cPanel

**Option A: Using File Manager**

1. Log in to your cPanel account
2. Navigate to File Manager
3. Go to your website's public directory (usually `public_html` or a subdomain folder)
4. Upload all files from the `dist` directory to this location

**Option B: Using FTP (recommended for large uploads)**

1. Use an FTP client like FileZilla
2. Connect to your hosting using the FTP credentials from cPanel
3. Navigate to your website's public directory
4. Upload all files from the `dist` directory to this location

### 3. Verify .htaccess configuration

The `.htaccess` file has been included in the build and should be uploaded to the root of your website directory. This file handles:
- URL rewrites for the SPA routing
- Cache control
- Compression settings

If you encounter 404 errors when navigating to routes directly, ensure the `.htaccess` file was properly uploaded.

### 4. Test your deployment

Visit your website URL to ensure everything is working correctly.

## Troubleshooting

### 404 Errors on Page Refresh or Direct URL Access

If you encounter 404 errors when directly accessing URLs or refreshing pages:

1. Verify the `.htaccess` file is present in your root directory
2. Check if mod_rewrite is enabled on your server
3. Contact your hosting provider to ensure mod_rewrite is supported and enabled

### Missing Assets

If images, CSS, or JavaScript files are not loading:

1. Check browser console for path errors
2. Ensure all files from the `dist` directory were uploaded
3. Verify file permissions (should be 644 for files and 755 for directories)

### White Screen or JavaScript Errors

1. Check browser console for specific errors
2. Ensure all build files were uploaded correctly
3. Clear browser cache and try again

## Additional Notes

- This application is configured with a relative base path (`./`) which should work in most cPanel environments
- If hosting in a subdirectory, no additional configuration should be needed
- For custom domains or subdirectories, you may need to adjust the base path in `vite.config.ts` and rebuild
