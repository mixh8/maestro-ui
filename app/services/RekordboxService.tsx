export function getPlaylists(): Promise<ApiResponse<Array<string>>> {
    return fetch('http://127.0.0.1:5000/playlists',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
        }
    ).then(
        (response) => {
            return response.json()
                .then(
                    (data) => {
                        console.log(data);
                        return {
                            success: true,
                            data: data
                        }
                    }
                )
        },
        (error) => {
            console.error(error);
            return {
                success: false,
                error: {
                    message: error
                }
            }
        }
    )
}

