FROM node:6.9.2
EXPOSE 3001
COPY package*.json ./
COPY /app /app
RUN npm install
CMD ["npm", "start"]