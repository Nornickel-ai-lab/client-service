# client-service

Фронт. Сейчас nginx-заглушка, дальше Vue + shadcn-vue.

## Разворот

Отдельно не поднимается — через compose в server-service:

```bash
cd ../server-service
task up
```

http://localhost:8080

## Локальная разработка

Когда появится Vite:

```bash
pnpm install
pnpm dev
```

Прокси `/api` → `http://localhost:8000` (см. vite.config).

## Сборка образа

```bash
docker build -t client-service .
```

Порт 80 внутри контейнера, снаружи 8080.
