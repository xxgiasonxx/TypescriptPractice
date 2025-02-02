import request from "supertest";
import { beforeEach } from "node:test";
import app from "../../app";
import { createTypeormConnection } from "../../data-source";
// jest.useFakeTimers()


//初始化
const TestUser = {
    "UserName": "testingUser",
    "password": "testingUser",
    "email": "testingUser@example.com"
}
const RegisterUser = {
    UserName: "test2",
    email: "test2@gmail.com",
    password: "test2"
}

let connection, server, port = 5000;

beforeAll(async () => {
    connection = await createTypeormConnection();
    await connection.runMigrations()
    server = app.listen(port)
});

//測試 "/register" 註冊使用者
describe('UserController -> RegisterUser', () => {
    //正確註冊
    it('Register correctly', async () => {
        const res = await request(app).post('/register').send(TestUser)
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User created successfully");
    });
    //重複註冊
    it('Duplicate registration', async () => {
        const res = await request(app).post('/register').send(TestUser)
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });
    //錯誤註冊
    it('Missing password', async () => {
        const res = await request(app).post('/register').send({
            UserName: "test2",
            email: "test2@gmail.com",
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.issues[0]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["password"],
            message: 'Required'
        });
        expect(res.body.name).toBe('ZodError');
    });
    it('Missing email', async () => {
        const res = await request(app).post('/register').send({
            UserName: "test2",
            password: "test2",
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.issues[0]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["email"],
            message: 'Required'
        });
        expect(res.body.name).toBe('ZodError');
    });
    it('Missing UserName', async () => {
        const res = await request(app).post('/register').send({
            password: "test2",
            email: "test2@gmail.com",
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.issues[0]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["UserName"],
            message: 'Required'
        });
        expect(res.body.name).toBe('ZodError');
    });
    it('Missing UserName password email', async () => {
        const res = await request(app).post('/register').send({})
        expect(res.statusCode).toBe(400);
        expect(res.body.issues[0]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["UserName"],
            message: 'Required'
        });
        expect(res.body.issues[1]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["password"],
            message: 'Required'
        });
        expect(res.body.issues[2]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["email"],
            message: 'Required'
        });
        expect(res.body.name).toBe('ZodError');
    });
});

//測試 "/login" 登入使用者
describe('UserController -> LoginUser', () => {
    //正確登入
    it('Register correctly', async () => {
        const { ["UserName"]: removedKey, ...LoginUserValue } = TestUser;
        const res = await request(app).post('/login').send(LoginUserValue)
        expect(res.statusCode).toBe(200);
        expect(res.body.token !== undefined).toBe(true);
        expect(typeof res.body.token).toBe("string");
    });
    //錯誤登入
    it('Incorrect email', async () => {
        const { ["UserName"]: removedKey, ...LoginUserValue } = TestUser;
        LoginUserValue.email = "testtest@gmail.com";
        const res = await request(app).post('/login').send(LoginUserValue)
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid email or password");
    });
    it('Incorrect password', async () => {
        const { ["UserName"]: removedKey, ...LoginUserValue } = TestUser;
        LoginUserValue.password = "123";
        const res = await request(app).post('/login').send(LoginUserValue)
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid email or password");
    });
    it('Missing email and password', async () => {
        const res = await request(app).post('/login').send({})
        expect(res.statusCode).toBe(400);
        expect(res.body.issues[0]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["password"],
            message: 'Required'
        });
        expect(res.body.issues[1]).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ["email"],
            message: 'Required'
        });
        expect(res.body.name).toBe("ZodError");
    });
});

//測試 "/userinfo" 取得使用者資訊
describe('UserController -> GetUserInfo', () => {
    //正確取得
    it('Get correctly', async () => {
        const { ["UserName"]: removedKey, ...LoginUserValue } = TestUser;
        const res = await request(app).post('/login').send(LoginUserValue)
        const token = res.body.token;
        const res2 = await request(app).get('/userinfo').set('Authorization', `Bearer ${token}`)
        expect(res2.statusCode).toBe(200);
        expect(res2.body.UserName).toBe(TestUser.UserName);
        expect(res2.body.email).toBe(TestUser.email);
    });
    //錯誤取得
    it('Incorrect token', async () => {
        const res = await request(app).get('/userinfo').set('Authorization', `Bearer 123`)
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Invalid Token");
    });
    it('Missing token', async () => {
        const res = await request(app).get('/userinfo')
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Access denied");
    });
    it('Incorrect token', async () => {
        const res = await request(app).get('/userinfo').set('Authorization', `123`)
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Access denied");
    });
});