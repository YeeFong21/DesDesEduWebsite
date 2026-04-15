@echo off
cd /d "C:\Users\User\Documents\Claude\Projects\my-counseling-site"
del /f ".git\index.lock" 2>nul
git add -A
git commit -m "add global interactive animated background - floating blobs, mouse tracking, scroll parallax"
git push origin main
echo.
echo Done! Check Vercel for deployment.
pause
