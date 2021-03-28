echo off
REM UPDATE VERSION FILES
start /WAIT /B "." node.exe prebuild.js

REM COPY FILES FROM CONFIGS AND MIGRATIONS TO BIN
xcopy /S /Y "./server/configs" "./server/bin/configs"
xcopy /S /Y "./server/migrations" "./server/bin/migrations"

echo ----
echo DONE!
echo All that you need to do now is:
echo   * git push all content do master
echo   * run 'git subtree push --prefix server heroku master'
echo   * run 'react-native start' to build bundle
echo   * run 'cd android' and cd 'gradlew clean'
echo   * run 'gradlew assembleRelease
echo   * PROFIT!