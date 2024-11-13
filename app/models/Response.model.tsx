interface CustomError {
    message: string;
    details?: any;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: CustomError;
}

interface DispenseResponse {
    statusCode: number,
    body: JSON
}