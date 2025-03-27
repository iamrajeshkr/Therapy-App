@echo off
echo Running Git commands to push to GitHub...

rem Add all files
git add .

rem Commit changes
git commit -m "Initial commit for version1.1 of Therapy Application"

rem Push to GitHub
git push -u origin version1.1

echo Done! 