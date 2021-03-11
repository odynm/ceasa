copy migrations/ and configs/ to bin/

run:
git subtree push --prefix server heroku master

app:
cd android
gradlew assembleRelease


To test app with mobile:
Same network
>npx iisexpress-proxy 10000 to 10001

