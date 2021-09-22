FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
CMD ["pm2-runtime", "start", "bin/www"]