@echo off
cd /d "C:\Users\User\Documents\Claude\Projects\my-counseling-site"
del /f ".git\index.lock" 2>nul
git add -A
git commit -m "add scroll reveal animations - word-by-word, FadeUp, SlideIn, ScalePop, stagger"
git push origin main
echo.
echo Done! Check Vercel for deployment.
pause
