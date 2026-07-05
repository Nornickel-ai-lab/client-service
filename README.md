# client-service
! РЕКОМЕНДУЕТСЯ ЗАПУСКАТЬ МЕТОДОМ ЧЕРЕЗ ОСНОВНУЮ ИНСТРУКЦИЮ
UI (Vue 3). Развёртывание через **server-service**:

```bash
cd ../server-service
cp .env.example .env
chmod +x deploy.sh && ./deploy.sh
```

http://localhost:8080 · вход http://localhost:8081/login

Локальная разработка без Docker:

```bash
npm install && npm run dev
```

http://localhost:5173
