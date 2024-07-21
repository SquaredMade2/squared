FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install typescript@4.8.4

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]