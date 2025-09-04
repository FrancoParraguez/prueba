
```
plate-verification-system
├─ backend
│  ├─ .env
│  ├─ combined.log
│  ├─ database
│  │  └─ init.sql
│  ├─ Dockerfile
│  ├─ error.log
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ scripts
│  │  └─ init-db.js
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.ts
│  │  ├─ controllers
│  │  │  ├─ authController.ts
│  │  │  ├─ plateController.ts
│  │  │  └─ recognitionController.ts
│  │  ├─ middleware
│  │  │  ├─ auth.ts
│  │  │  ├─ upload.ts
│  │  │  └─ validation.ts
│  │  ├─ models
│  │  │  ├─ Plate.ts
│  │  │  ├─ User.ts
│  │  │  └─ Verification.ts
│  │  ├─ routes
│  │  │  ├─ auth.ts
│  │  │  ├─ plates.ts
│  │  │  └─ recognition.ts
│  │  ├─ server.ts
│  │  └─ utils
│  │     ├─ helpers.ts
│  │     ├─ logger.ts
│  │     └─ plateRecognizer.ts
│  └─ tsconfig.json
├─ docker-compose.yml
├─ frontend
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  └─ index.html
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ components
│  │  │  ├─ camera
│  │  │  │  ├─ CameraCapture.tsx
│  │  │  │  └─ CameraControls.tsx
│  │  │  ├─ common
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ LoadingSpinner.tsx
│  │  │  │  └─ Notification.tsx
│  │  │  ├─ plates
│  │  │  │  ├─ PlateForm.tsx
│  │  │  │  ├─ PlateItem.tsx
│  │  │  │  └─ PlateList.tsx
│  │  │  └─ verification
│  │  │     ├─ VerificationHistory.tsx
│  │  │     └─ VerificationResult.tsx
│  │  ├─ context
│  │  │  └─ AuthContext.tsx
│  │  ├─ hooks
│  │  │  ├─ useApi.ts
│  │  │  └─ useAuth.ts
│  │  ├─ index.tsx
│  │  ├─ pages
│  │  │  ├─ Admin.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ History.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ Login.tsx
│  │  │  └─ Register.tsx
│  │  ├─ services
│  │  │  ├─ api.ts
│  │  │  ├─ auth.ts
│  │  │  └─ plateService.ts
│  │  └─ styles
│  │     ├─ components.css
│  │     └─ index.css
│  └─ tailwind.config.js
└─ README.md

```
```
plate-verification-system
├─ backend
│  ├─ .dockerignore
│  ├─ database
│  │  └─ init.sql
│  ├─ Dockerfile
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ scripts
│  │  └─ init-db.js
│  ├─ src
│  │  ├─ config
│  │  │  └─ database.ts
│  │  ├─ controllers
│  │  │  ├─ authController.ts
│  │  │  ├─ plateController.ts
│  │  │  └─ recognitionController.ts
│  │  ├─ middleware
│  │  │  ├─ auth.ts
│  │  │  ├─ upload.ts
│  │  │  └─ validation.ts
│  │  ├─ models
│  │  │  ├─ Plate.ts
│  │  │  ├─ User.ts
│  │  │  └─ Verification.ts
│  │  ├─ routes
│  │  │  ├─ auth.ts
│  │  │  ├─ plates.ts
│  │  │  └─ recognition.ts
│  │  ├─ server.ts
│  │  └─ utils
│  │     ├─ helpers.ts
│  │     ├─ logger.ts
│  │     └─ plateRecognizer.ts
│  └─ tsconfig.json
├─ docker-compose.yml
├─ frontend
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.cjs
│  ├─ public
│  │  ├─ favicon.ico
│  │  └─ index.html
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ components
│  │  │  ├─ camera
│  │  │  │  ├─ CameraCapture.tsx
│  │  │  │  └─ CameraControls.tsx
│  │  │  ├─ common
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ LoadingSpinner.tsx
│  │  │  │  └─ Notification.tsx
│  │  │  ├─ plates
│  │  │  │  ├─ PlateForm.tsx
│  │  │  │  ├─ PlateItem.tsx
│  │  │  │  └─ PlateList.tsx
│  │  │  └─ verification
│  │  │     ├─ VerificationHistory.tsx
│  │  │     └─ VerificationResult.tsx
│  │  ├─ context
│  │  │  └─ AuthContext.tsx
│  │  ├─ hooks
│  │  │  ├─ useApi.ts
│  │  │  └─ useAuth.ts
│  │  ├─ index.tsx
│  │  ├─ pages
│  │  │  ├─ Admin.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ History.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ Login.tsx
│  │  │  └─ Register.tsx
│  │  ├─ services
│  │  │  ├─ api.ts
│  │  │  ├─ auth.ts
│  │  │  └─ plateService.ts
│  │  ├─ styles
│  │  │  ├─ components.css
│  │  │  └─ index.css
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  └─ vite.config.ts
└─ README.md

```