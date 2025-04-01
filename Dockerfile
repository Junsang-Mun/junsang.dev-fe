FROM node:23-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5173

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && npm run preview; else npm run dev -- --host; fi"]
