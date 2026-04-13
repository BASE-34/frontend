FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV MOCK_PORT=4000
EXPOSE 4000

CMD ["npx", "tsx", "index.ts"]
