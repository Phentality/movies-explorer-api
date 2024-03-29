# Movies Explorer (бэкенд-часть)
Репозиторий для бэкенд-части приложения с API-сервером. <br>
Приложение Movies Explorer - сервис, в котором можно найти фильмы по запросу и сохранить в личном кабинете.<br>
Это дипломный проект Яндекс.Практикума по специальности "Веб-разработчик".

### 🗂️ Структура приложения
Полностью приложение состоит из двух частей:

1. Movies Explorer (бэкенд-часть) ⬅ этот репозиторий
2. [Movies Explorer (фронтенд-часть)](https://github.com/Phentality/movies-explorer-frontend)
   
### 💻 Демо
API-сервер доступен по адресу: https://api.phental.nomoredomainsrocks.ru

### 🔗 API 

#### Регистрация пользователя
  POST /signup - создаёт пользователя с переданными в теле email, password и name

#### Аутентификация
POST /signin - проверяет переданные в теле почту и пароль и возвращает JWT-токен

#### Информация о пользователе
GET /users/me - возвращает информацию о пользователе (email и имя)<br>
PATCH /users/me - обновляет информацию о пользователе (email и имя)

#### Фильмы
GET /movies - возвращает все сохранённые текущим пользователем фильмы<br>
POST /movies - создаёт фильм с переданными в теле country, director, duration, year, description, image, trailerLink, cardId, nameRU, nameEN и created_at, isSaved<br>
DELETE /movies/_id - удаляет сохранённый фильм по id

### ⚔️ Защита роутов авторизацией
Доступ к роутам /users и /movies закрыт без JWT-токен. <br>
Токен должен содержаться в cookie каждого запроса к защищенным роутам.

### 📋 Функциональность
- работа с базой данной приложения через роуты
- регистрация и аутентификация пользователя
- часть роутов защищена авторизацией через JWT-токен
- валидация данных в запросе до передачи контроллеру и перед записью в базу данных
- сбор логов сервера в формате JSON (запросы и ошибки)
- централизованный обработчик ошибок
- хранение пароля пользователя в виде хэша с солью
- поддержка работы с доступом по https
- безопасное хранение на сервере ключа для генерации JWT-токенов
- обеспечение безопасности заголовков запросов
- конфигурация и константы приложения в отдельных файлах
- ограничение числа запросов с одного IP

### 🛠 Стек технологий
- сервер на Ubuntu в Яндекс.Облаке
- ssh-ключи для доступа к серверу
- API-сервер на Node.js + express.js
- база данных на MongoDB + Mongoose
- обновление кода на сервере через Git
- менеджер процессов на сервере pm2
- раздача фронтенда через nginx
- обратный прокси-сервер на nginx
  
## Установка и запуск

Для запуска проекта в своей среде разработке следуйте следующим инструкциям:

Клонируйте репозиторий
```
git clone https://github.com/Phentality/movies-explorer-api.git
```
Установите пакеты NPM
```
npm install
```
Запустить сервер
```
npm run dev
```

### 💥 Статус разработки
✅ Завершена
