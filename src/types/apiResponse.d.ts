

///////////// Steam API /////////////////
export interface ApiResponse<Data = object> {
    data: Data
}


export interface ApiError {
    error: string,
    status: number
}

