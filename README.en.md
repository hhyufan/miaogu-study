# miaogu-study

This is a frontend project developed with the Vue 3 framework, supporting TypeScript, internationalization (i18n), mock data services, and theme switching.

## Project Features
- Built with Vue 3 + TypeScript + Vite
- Supports internationalization (Chinese and English)
- Integrated Pinia for state management
- Supports theme switching (dark/light mode)
- Uses Vue Router for routing management
- Integrated mock data service for easier development and testing
- Supports unit testing (Vitest) and end-to-end testing (Playwright)

## Recommended Development Environment
- IDE: VS Code
- Browser: Latest version of Chrome/Firefox/Edge

## Project Structure Overview
- `src/main.ts`: Project entry file
- `src/router/index.ts`: Routing configuration
- `src/stores/`: Pinia store modules (counter, user info, theme, language, etc.)
- `src/components/`: Vue components
- `src/views/`: Page view components
- `src/api/`: Encapsulated network requests
- `src/mock/`: Mock data service
- `src/i18n/`: Internationalization support
- `src/assets/`: Static resource files
- `public/`: Public resources (e.g., images, icons, etc.)

## Installation and Running

### Install Dependencies
```bash
npm install
```

### Development Mode (with Hot Module Replacement)
```bash
npm run dev
```

### Build Production Version
```bash
npm run build
```

### Start Local Server to Run Production Version
```bash
npm run preview
```

## Testing

### Unit Tests
```bash
npm run test:unit
```

### End-to-End Tests
```bash
npm run test:e2e
```

#### Common Testing Commands
- Run all end-to-end tests:
  ```bash
  npm run test:e2e
  ```
- Run tests only in Chromium browser:
  ```bash
  npm run test:e2e:chromium
  ```
- Run tests for a specific file:
  ```bash
  npm run test:e2e -- -g "filename"
  ```
- Run tests in debug mode:
  ```bash
  npm run test:e2e:debug
  ```

### Linting and Formatting
```bash
npm run lint
```

## Other Tools
- Prettier: Code formatting configuration
- ESLint: Code style enforcement
- Vitest: Unit testing framework
- Playwright: End-to-end testing framework

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.