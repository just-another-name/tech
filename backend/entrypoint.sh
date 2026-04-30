#!/bin/sh
set -e

cd /var/www

if [ ! -d "vendor" ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

php artisan key:generate --no-interaction --force

php artisan migrate --force --no-interaction

if [ "$(php artisan tinker --execute='echo App\Models\Article::count();' 2>/dev/null)" = "0" ]; then
    php artisan db:seed --force --no-interaction
fi

exec php-fpm
