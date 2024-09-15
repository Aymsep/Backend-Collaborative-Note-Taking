FROM node:18

WORKDIR /app

COPY package*.json ./

# Ensure dependencies are installed in the container environment
RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
