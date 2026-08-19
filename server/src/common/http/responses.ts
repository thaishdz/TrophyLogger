export function createApiResponse(
    success: boolean,
    status: number,
    message = 'Success',
    data: any,
    request?: { type: string; url: string }
) {
    return {
        success,
        status,
        message,
        data,
        request
    };
}
