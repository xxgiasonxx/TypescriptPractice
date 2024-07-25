import { Body, Controller, Get, Middlewares, Post, Route, Request, Response, Security, Tags, SuccessResponse, Example } from "tsoa";
import { UserLoginBody, UserRegisterBody, UserService } from "../services/User.service";


@Route("")
export class UserController extends Controller {

  /**
   * Register a new user
   * @param requestBody
   * @returns
   * @throws
   * 201 User created successfully
   * 400 User already exists
   * 500 Internal server error
   * @summary Register a new user
   * @tags User
   * @operationId RegisterUser
   * @consumes application/json
   * @produces application/json
   * @requestBody {"content":{"application/json":{"schema":{"$ref":"#/definitions/UserRegisterBody"}}},"required":true}
   */
  @Tags("User")
  @Post("register")
  @SuccessResponse<{}>(201, "User created successfully")
  @Example<{ message: string }>({ message: "User created successfully" })
  @Response<{ message: string }>(400, "User already exists")
  @Response<{ message: string }>(500, "Internal server error")
  public async RegisterUser(@Body() requestBody: UserRegisterBody): Promise<{ message: string }> {
    const res = await new UserService().RegisterUser(requestBody);
    this.setStatus(res.status);
    return { message: res.body.message };
  }

  /**
   * Login a user
   * @param requestBody
   * @returns
   * @throws
   * 200 User logged in successfully
   * 400 Invalid email or password
   * 500 Internal server error
   * @summary Login a user
   * @tags User
   * @operationId LoginUser
   * @consumes application/json
   * @produces application/json
   * @requestBody {"content":{"application/json":{"schema":{"$ref":"#/definitions/UserLoginBody"}}},"required":true}
   */
  @Tags("User")
  @Post("login")
  @SuccessResponse<{ token: string }>(200, "User logged in successfully")
  @Example<{ email: string, password: string }>({ email: "John@gmail.com", password: "password" })
  @Response<{ message: string }>(400, "Invalid email or password")
  @Response<{ message: string }>(500, "Internal server error")
  public async LoginUser(@Body() requestBody: UserLoginBody): Promise<{ message?: string, token?: string }> {
    const res = await new UserService().LoginUser(requestBody)
    this.setStatus(res.status);
    return { message: res.body.message, token: res.body.token }
  }

  /**
   * Get user information
   * @param req
   * @returns
   * @throws
   * 200 User found
   * 400 User not found
   * 401 Unauthorized
   * 500 Internal server error
   * @security jwt
   * @summary Get user information
   * @tags User
   * @operationId GetUserInfo
   * @consumes application/json
   * @produces application/json
   * @requestBody {"content":{"application/json":{"schema":{"$ref":"#/definitions/UserLoginBody"}}},"required":true}
   * @securityDefinitions jwt
   * @securityScheme jwt {"type":"http","scheme":"bearer","bearerFormat":"JWT"}
    */
  @Tags("User")
  @Get("userinfo")
  @SuccessResponse<{}>(200, "User found")
  @Example<{ UserName: string, email: string }>({ UserName: "John", email: "John@gmail.com" })
  @Response<{ message: string }>(401, "Unauthorized")
  @Response<{ message: string }>(400, "User not found")
  @Response<{ message: string }>(500, "Internal server error")
  @Security("jwt")
  public async GetUserInfo(@Request() req: any):
    Promise<{ message?: string } | { UserName: string, email: string }> {
    const res = await new UserService().GetUserInfo(req);
    this.setStatus(res.status);
    return res.body.message ? { message: res.body.message } : res.body.user!;
  }
}
