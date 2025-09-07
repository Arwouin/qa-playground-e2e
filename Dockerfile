FROM mcr.microsoft.com/playwright:v1.54.2-jammy

WORKDIR /app
COPY package*.json ./

RUN npm ci 

COPY . .

RUN npx playwright install -with-deps

RUN ls -R

CMD ["npx", "playwright", "test", "--reporter=html"]