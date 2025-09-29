# frontend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# 先复制依赖文件并安装依赖
COPY package.json yarn.lock ./
RUN yarn install

# 再复制源码
COPY . .

EXPOSE 3000

CMD ["yarn", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
