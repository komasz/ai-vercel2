FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . ./

ARG REACT_APP_SOCKET_URL=http://localhost:3000

RUN npm run build

FROM node:20-alpine AS dev

EXPOSE 3000
CMD ["npm", "start"]

FROM nginx:1.27.4 AS production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]