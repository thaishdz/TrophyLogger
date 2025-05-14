export const HTTP_RESPONSE_STATUS = {
    NOT_FOUND : 404,
    CREATED : 201,
    BAD_REQUEST: 400,
    OK: 200,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
}

// TODO(thais): Investigar enum para HTTPStatusCode comportamiento en TS

export const APP_ERROR_MESSAGE = {
    SERVER_ERROR: "Something went wrong, try again later",
    USER_AUTHENTICATED: "User Authenticated successfully",
    USER_DOES_NOT_EXIST: "User does not exist",
    GAME_DOES_NOT_EXIST: "Game does not exist",
}