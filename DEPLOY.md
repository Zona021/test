# Деплой на GitHub Pages

## Что было исправлено:

1. ✅ Добавлен `base: './'` в `vite.config.js` для относительных путей
2. ✅ Создан файл `.nojekyll` в корне репозитория
3. ✅ Создан файл `404.html` для SPA routing
4. ✅ Добавлен скрипт для обработки SPA routing в `index.html`
5. ✅ Исправлен путь к `main.tsx` в `index.html`

## Инструкция по деплою:

### Вариант 1: Автоматический деплой через GitHub Actions

1. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

2. Отправьте изменения на GitHub:
```bash
git add .
git commit -m "Fix: configure for GitHub Pages deployment"
git push
```

3. В настройках репозитория:
   - Перейдите в Settings → Pages
   - В разделе "Build and deployment" выберите "GitHub Actions"
   - Дождитесь завершения деплоя (1-2 минуты)

### Вариант 2: Ручной деплой через ветку gh-pages

1. Соберите проект:
```bash
npm run build
```

2. Создайте ветку gh-pages и отправьте содержимое папки dist:
```bash
git checkout --orphan gh-pages
git rm -rf .
git checkout main -- dist/
mv dist/* .
rm -rf dist
touch .nojekyll
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

3. В настройках репозитория:
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите ветку "gh-pages"
   - Нажмите "Save"

## Проверка:

После деплоя сайт будет доступен по адресу:
`https://<username>.github.io/<repository-name>/`

## Решение проблем:

Если сайт всё ещё не работает:

1. **Очистите кэш браузера** (Ctrl+Shift+Delete)
2. **Откройте в режиме инкогнито**
3. **Проверьте консоль браузера** (F12) на наличие ошибок
4. **Убедитесь, что деплой завершён** в разделе Actions
5. **Проверьте настройки GitHub Pages** в Settings → Pages

## Полезные команды:

```bash
# Локальный запуск для тестирования
npm run dev

# Сборка для продакшена
npm run build

# Проверка сборки локально
npm run preview
```
