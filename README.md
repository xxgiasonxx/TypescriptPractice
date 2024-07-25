# 使用工具 TypeORM / Express / TypeScript / PostgresSQL / Jest / ts-rest / zod 簡單 API

## 需要工具

- [Node v20+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)
- [ts-rest](https://ts-rest.com/)

## 運行

- Clone github 倉庫：\
`git clone https://github.com/xxgiasonxx/TypescriptPractice.git`

- 進到 TypescriptPractice 資料夾中: \
`cd TypescriptPractice`

- 運行 `docker compose up -d` 創建 API image 以及 Postgres資料庫 and API container

## package.json Script

- 路徑+資料夾名稱+檔名 `src/migration/{NewFileName}`

- `pnpm run migration:generate 路徑+資料夾名稱+檔名` 自動產生Migration

- `pnpm run migration:create 路徑+資料夾名稱+檔名` 產生空白的migration

- `pnpm run migration:show` 查看已有的migration

- `pnpm run migration:revert` 復原

- `pnpm run migration:run` 讓migration運作

- `pnpm run dev` 開發者模式 用 nodemon運作

- `pnpm run build` 建置到 dist 資料夾中

- `pnpm run start` run dist index.js

- `pnpm run test` run jest

- `pnpm run test:watch` run jest watch mode

## Environment

```
DB_HOST=localhost                                   #database host
DB_PORT=5432                                        #database port
DB_TEST_PORT=5444                                   #database test port
DB_USERNAME=postgres                                #database username
DB_PASSWORD=123456                                  #database password
DB_DATABASE=postgres                                #database name
JWT_SECRET_KEY=sGnspIm9StP6VAFr9ZFVMTfEKizVb0xE     #database jwt 密鑰
API_PORT=3000                                       #api port
NODE_ENV=development                                #development || production || test
```

## 檔案

```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── jest.config.js
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── __tests__
│   │   └── controller
│   │       └── user.controller.spec.ts
│   ├── app.ts
│   ├── contract
│   │   └── contract.ts
│   ├── controller
│   │   └── user.controller.ts
│   ├── data-source.ts
│   ├── entities
│   │   └── User.entity.ts
│   ├── index.ts
│   ├── migration
│   │   └── 1721729805902-migration_1.ts
│   └── routes
│       ├── All.routes.ts
│       └── user.routes.ts
└── tsconfig.json
```

## API

### openapi

### <http://localhost:3000/api-docs>

### 註冊

`http://localhost:3000/register`\
Method: POST
>註冊使用者json:
>
>```
>{
>  "password": "12345678",
>  "email": "John@gmail.com",
>  "username": "John"
>}
>```
>
>回傳json:
>
>```
>{
>    message: "User created successfully"
>}
>```

`http://localhost:3000/login`\
Method: POST
>登入使用者:
>
>```
>{
>  "password": "12345678",
>  "email": "John@gmail.com",
>}
>```
>
>回傳json:
>
>```
>{
>    token: JWT token
>}
>```

`http://localhost:3000/userinfo`\
Method: POST
>Bearer Token:
>
>```
>JWT token
>```
>
>回傳json:
>
>```
>{
>  "email": "John@gmail.com",
>  "username": "john"
>}
>```

## 小問題

- ts-rest 的 openapi doc 沒辦法開單獨的 Auth baerer token 不知道為什麼
