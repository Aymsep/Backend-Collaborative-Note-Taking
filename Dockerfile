FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Apply Prisma migrations
CMD [ "sh", "-c", "npx prisma migrate dev && npm run dev:docker" ]
