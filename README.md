# client-service

Vue чат. POST `/api/v1/query`.

## Разворот

```bash
cd ../server-service
cp .env.example .env
task up
```

http://localhost:8080

## Локально

```bash
npm install
npm run dev
```

http://localhost:5173  
прокси `/api` → `8000`

## Сборка

```bash
npm run build
docker build -t client-service .
```

## Состояния

Ответ ассистента: idle, process, loaded, error  
Поле ввода: idle, process
