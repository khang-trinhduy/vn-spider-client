FROM node:12.16.2-alpine3.9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm install -g @angular/cli@8.3.25

# build source with docker environment
RUN ng build
# use this one instead if you want use production environment
# RUN ng build --prod

EXPOSE 5000

CMD ["npm", "start"]