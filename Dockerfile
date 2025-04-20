FROM node:lts-alpine

COPY . /app/
WORKDIR /app
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
# This Dockerfile is for a Node.js service. It uses the official Node.js LTS Alpine image as the base image.