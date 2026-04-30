# Блог с комментариями

Простое веб-приложение блога с REST API на Laravel и SPA на React, упакованное в Docker.

## Стек технологий

- **Backend**: Laravel 10, PHP 8.2
- **Database**: MySQL 8.0
- **Web-сервер**: Nginx (Alpine)
- **Frontend**: React 18 + Vite + React Router v6

## Архитектура

```
docker-compose.yml
├── app       — PHP-FPM контейнер с Laravel (порт 9000, внутренний)
├── db        — MySQL 8.0 (внутренний)
├── nginx     — Nginx reverse-proxy → http://localhost:8080
└── frontend  — Node.js + Vite dev-server → http://localhost:5173
```

## Быстрый старт

### Требования

- Docker Desktop (или Docker Engine + Docker Compose)

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd tech
```

### 2. Запустить контейнеры

```bash
docker compose up --build -d
```

При первом запуске контейнер `app` автоматически:

- Генерирует `APP_KEY`
- Выполняет миграции (`php artisan migrate`)
- Запускает сидер с тестовыми данными (`php artisan db:seed`)

### 3. Открыть приложение

| Сервис      | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:5173     |
| Backend API | http://localhost:8080/api |

---

## Ручные команды

Если нужно выполнить миграции или сидер вручную:

```bash
# Миграции
docker compose exec app php artisan migrate

# Сидер (заполнение тестовыми данными)
docker compose exec app php artisan db:seed

# Миграции + сидер вместе (пересоздать с нуля)
docker compose exec app php artisan migrate:fresh --seed
```

### Сброс и перезапуск

```bash
# Остановить и удалить контейнеры + volumes (БД будет очищена)
docker compose down -v

# Пересобрать и запустить заново
docker compose up --build -d
```


# Изменения

## Создание поста и работа комментариев

### 1. Добавлен отсутствующий route для добавления поста.

### 2. Исправлена опечатка в названии поля при валидации в контроллере `Comment`.

### 3. В модель `Comment` в fillable добавлено поле `article_id`. Из-за его отсутствия была невозможна запись в базу.

## Список постов и посты с комментариями

### 1. Исправлена ошибка с middleware, из-за которой для всех запросов возвращалось `{"status": "ok"}`.

### 2. Исправлены опечатки comment-comments в React, из-за чего не отображались комментарии.

## Сортировка постов

### 1. Добавлена возможность сортировки поста по id и заголовку. По умолчанию посты сортируются по created_at, как и раньше.

