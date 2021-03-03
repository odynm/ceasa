copy migrations/ and configs/ to bin/

run:
git subtree push --prefix server heroku master

app:
cd android
gradlew assembleRelease
