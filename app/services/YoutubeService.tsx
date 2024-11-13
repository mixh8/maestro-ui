import { VideoResult } from "../models/VideoResult.model";

export function getSuggestions(query: string): Promise<ApiResponse<Array<string>>> {
    return fetch('http://127.0.0.1:5000/autocomplete',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify({ query: query })
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

export function getSearchResults(query: string): Promise<ApiResponse<Array<VideoResult>>> {
    return fetch('http://127.0.0.1:5000/search',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify({ query: query })
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

export function addToPlaylist(songUrl: string, playlistName: string): Promise<ApiResponse<Boolean>> {
    return fetch('http://127.0.0.1:5000/download',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify({ url: songUrl, playlist: playlistName })
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



