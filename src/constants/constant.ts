export const HTTP_RESPONSE_STATUS = {
    NOT_FOUND : 404,
    CREATED : 201,
    BAD_REQUEST: 400,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
}

// TODO(thais): Investigar enum para HTTPStatusCode comportamiento en TS

export const APP_ERROR_MESSAGE = {
    serverError: "Something went wrong, try again later",
    userAuthenticated: "User Authenticated successfully",
    userDoesNotExist: "User does not exist",
    gameDoesNotExist: "Game does not exist",
}