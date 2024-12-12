# Gunakan base image node versi LTS
FROM node:latest

# Tentukan direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari proyek ke dalam container
COPY . .

# Tentukan port aplikasi (sesuaikan dengan port aplikasi Node.js kamu)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "dev"]
