FROM php:8.4

# GD (with JPEG and WebP) is used to shrink and re-encode uploaded images.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libjpeg62-turbo-dev libpng-dev libwebp-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype \
    && docker-php-ext-install pdo_mysql gd \
    && rm -rf /var/lib/apt/lists/*

# Allow uploads up to the 2 MB the app validates, plus form overhead.
RUN printf "upload_max_filesize=4M\npost_max_size=8M\n" > /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www
