FROM node:19 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:19 as runner
WORKDIR /app
# Copy the build output from the builder stage. We don't need the source and test files
COPY --from=builder /app/dist ./
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
EXPOSE 8000
CMD ["node", "index.js"]
