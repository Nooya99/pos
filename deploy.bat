@echo off
echo ==============================================
echo   Deploying changes to Git and Vercel...
echo ==============================================

git add .
set /p commit_msg="Masukkan pesan commit (tekan Enter untuk default 'deploy update'): "
if "%commit_msg%"=="" set commit_msg=deploy update

git commit -m "%commit_msg%"
git push origin main

echo.
echo ==============================================
echo   Berhasil dipush ke Git!
echo   Vercel sedang memproses deployment otomatis.
echo ==============================================
pause
