# YouTube Speed Customizer

[Русский](#русский) | [English](#english)

---

## English

A Manifest V3 Chrome Extension designed to adjust and persist video playback speed on YouTube.

### Features
* **Granular Control:** Responsive slider for fine-tuning speed between 0.25x and 5.0x.
* **Custom Speed Limits:** Set custom playback rates up to 16.0x (the HTML5 maximum) via manual input.
* **Quick Presets:** Instant standard buttons (1.0x, 1.25x, 1.5x, 1.75x, 2.0x, 2.5x, 3.0x, 4.0x).
* **Auto-Apply:** Persist and enforce your chosen speed automatically across newly loaded videos.
* **Premium Design:** Modern dark-themed user interface with sleek glassmorphism effects and micro-animations.

### Installation (Local Dev)
1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`
3. In the top-right corner, toggle **Developer mode** to ON.
4. In the top-left corner, click **Load unpacked** (Загрузить распакованное расширение).
5. Select this project folder.

### Project Structure
* `manifest.json` — Extension configuration file (Manifest V3).
* `content.js` — Script injected into YouTube tabs to adjust and enforce video rates.
* `popup.html`, `popup.css`, `popup.js` — User interface control files.
* `CHROMEWEBSTORE.md` — Metadata documentation for Chrome Web Store listing.

---

## Русский

Chrome-расширение (Manifest V3) для точной регулировки и автоматического сохранения скорости воспроизведения видео на YouTube.

### Основные возможности
* **Точная настройка:** Удобный ползунок для плавной регулировки скорости от 0.25x до 5.0x.
* **Экстремальная скорость:** Текстовое поле ввода для установки кастомной скорости до 16.0x (технический максимум HTML5-плеера).
* **Готовые пресеты:** Кнопки быстрого выбора стандартных скоростей (1.0x, 1.25x, 1.5x, 1.75x, 2.0x, 2.5x, 3.0x, 4.0x).
* **Автоприменение:** Автоматическое применение выбранной скорости к новым видеороликам и плейлистам.
* **Премиальный дизайн:** Современный темный интерфейс с эффектом стеклянного размытия (glassmorphism) и анимациями.

### Установка (Локально)
1. Скачайте или клонируйте данный репозиторий.
2. Откройте Google Chrome и перейдите на страницу расширений: `chrome://extensions/`
3. В правом верхнем углу включите переключатель **«Режим разработчика»** (Developer mode).
4. В левом верхнем углу нажмите кнопку **«Загрузить распакованное расширение»** (Load unpacked).
5. Выберите папку с проектом.

### Структура проекта
* `manifest.json` — Файл конфигурации расширения (Manifest V3).
* `content.js` — Скрипт, внедряемый на страницы YouTube для изменения скорости видео.
* `popup.html`, `popup.css`, `popup.js` — Файлы всплывающего окна управления скоростью.
* `CHROMEWEBSTORE.md` — Подготовленная информация и описания для публикации в Chrome Web Store.

---

