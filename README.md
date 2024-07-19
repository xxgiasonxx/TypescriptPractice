# 使用工具 TypeORM / Express / TypeScript / PostgresSQL 簡單 API

## 需要工具

- [Node v20+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## 運行

- Clone github 倉庫：\
`git clone https://github.com/xxgiasonxx/TypescriptPractice.git`

- 進到 TypescriptPractice 資料夾中: \
`cd TypescriptPractice`

- 運行 `docker compose up -d` 創建 API image 以及 Postgres資料庫 and API container

## package.json Script

- 路徑+資料夾名稱+檔名 `src/migration/{NewFileName}`

- `npm run migration:generate 路徑+資料夾名稱+檔名` 自動產生Migration

- `npm run migration:create 路徑+資料夾名稱+檔名` 產生空白的migration

- `npm run migration:show` 查看已有的migration

- `npm run migration:revert` 復原

- `npm run migration:run` 讓migration運作

- `npm run dev` 開發者模式 用 nodemon運作

- `npm run build` 建置到 dist 資料夾中

- `npm run start` run dist index.js

## Environment

```
DB_HOST=localhost                                   #database host
DB_PORT=5432                                        #database port
DB_USERNAME=postgres                                #database username
DB_PASSWORD=123456                                  #database password
DB_DATABASE=postgres                                #database name
JWT_SECRET_KEY=sGnspIm9StP6VAFr9ZFVMTfEKizVb0xE     #database jwt 密鑰
API_PORT=5000                                       #api port
```

## 檔案

```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── package-lock.json
├── package.json
├── src
│   ├── controller
│   │   └── user.controller.ts
│   ├── data-source.ts
│   ├── entity
│   │   └── User.ts
│   ├── index.ts
│   ├── migration
│   │   ├── 1721031253680-migration_1.ts
│   │   ├── 1721031605718-migration_2.ts
│   │   └── 1721124544799-migration_3.ts
│   └── routes
│       ├── All.routes.ts
│       └── user.routes.ts
└── tsconfig.json
```

## API

### 註冊

`http://localhost:3000/register`\
Method: POST
>註冊使用者json:
>
>```
>{
>  "password": "12345678",
>  "email": "John@gmail.com",
>  "username": "john"
>}
>```
>
>回傳json:
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
>```
>{
>    token: JWT token
>}
>```


`http://localhost:3000/userinfo`\
Method: POST
>Bearer Token: 
>```
>JWT token
>```
>回傳json:
>```
>{
>  "email": "John@gmail.com",
>  "username": "john"
>}
>```