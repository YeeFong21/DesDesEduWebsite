@echo off
cd /d "C:\Users\User\Documents\Claude\Projects\my-counseling-site"
del /f ".git\index.lock" 2>nul
git add -A
git status
git commit -m "perf: fix laggy animations - static blur, RAF throttle, remove filter:blur from reveals, reduce particles"
git push origin main
echo.
echo Done! Vercel will deploy automatically.
pause
