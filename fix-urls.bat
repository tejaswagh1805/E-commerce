@echo off
echo Fixing all hardcoded localhost URLs...

cd /d "d:\mern_stack_project\customer-site\src\components"

echo Fixing Newsletter.js...
powershell -Command "(Get-Content Newsletter.js) -replace 'http://localhost:5000', '${API_URL}' | Set-Content Newsletter.js"
powershell -Command "(Get-Content Newsletter.js) -replace 'import React', 'import React from \"react\";^nimport { API_URL } from ''../config'';' | Set-Content Newsletter.js"

echo Fixing ProductReviews.js...
powershell -Command "(Get-Content ProductReviews.js) -replace 'http://localhost:5000', '${API_URL}' | Set-Content ProductReviews.js"

echo Fixing RecentlyViewed.js...
powershell -Command "(Get-Content RecentlyViewed.js) -replace 'http://localhost:5000', '${API_URL}' | Set-Content RecentlyViewed.js"

echo Fixing Recommendations.js...
powershell -Command "(Get-Content Recommendations.js) -replace 'http://localhost:5000', '${API_URL}' | Set-Content Recommendations.js"

echo Fixing CouponCode.js...
powershell -Command "(Get-Content CouponCode.js) -replace 'http://localhost:5000', '${API_URL}' | Set-Content CouponCode.js"

echo Done! All files fixed.
pause
