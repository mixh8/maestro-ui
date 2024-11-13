'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Import XMarkIcon
import { useState, useEffect } from 'react';
import { addToPlaylist, getSearchResults, getSuggestions } from '../services/YoutubeService';
import PlaylistCheckboxes from './playlists';
import { getPlaylists } from '../services/RekordboxService';
import Notification from './Notification';
import SearchResults from './SearchResults';
import { VideoResult } from '../models/VideoResult.model';

interface SearchProps {
    placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number | null>(null);
    const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
    const [playlists, setPlaylists] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // State to track selected playlists
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);


    // State to track the downloaded video
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadedVideo, setDownloadedVideo] = useState<VideoResult | null>(null);

    // Function to handle downloading a video
    const handleDownload = (video: VideoResult) => {
        setDownloadedVideo(video);
        setIsDownloading(true);

        addToPlaylist(video.url, selectedPlaylists[0]).then(
            (response) => {
                if (response.success) {
                    console.log(response.data);
                } else {
                    console.error(response.error!.message);
                }
            },
            (error) => {
                console.error(error);
            }
        )
    };

    useEffect(() => {
        getPlaylists().then(
            (response) => {
                if (response.success) {
                    console.log(response.data);
                    setPlaylists(response.data!);
                } else {
                    console.log(response.error!.message);
                }
            }, (error) => {
                console.log(error);
            }
        )
    }, [])

    // Function to update selected playlists
    const handleSelectedPlaylistsChange = (selected: string[]) => {
        setSelectedPlaylists(selected);
    };

    const updateSuggestions = async () => {
        if (hasSearched || loading) {
            return;
        }
        const response = await getSuggestions(query)
            .then((response) => {
                if (response.success) {
                    setSuggestions(response.data!);
                } else {
                    console.error(response.error!.message);
                }
            },
                (error: Error) => {
                    console.log(error);
                });
    }

    useEffect(() => {
        setHasSearched(false);
        if (query === '' || query.length < 3) {
            setSuggestions([]);
        } else {
            updateSuggestions();
        }
    }, [query]);

    function handleSearch() {
        if (query === '') {
            return;
        }
        setLoading(true);
        setSuggestions([])
        setHasSearched(true);
        getSearchResults(query).then(
            (response) => {
                if (response.success) {
                    console.log(response.data);
                    setSearchResults(response.data!);
                    setLoading(false);
                } else {
                    console.error(response.error!.message);
                    setLoading(false);
                }
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );
    }

    function handleSuggestionClick(suggestion: string) {
        setQuery(suggestion);
        handleSearch();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            setSuggestions([])
            handleSearch();
        } else if (e.key === 'ArrowDown') {
            setSelectedSuggestionIndex((prev) =>
                prev === null ? 0 : Math.min(suggestions.length - 1, (prev + 1))
            );
        } else if (e.key === 'ArrowUp') {
            setSelectedSuggestionIndex((prev) =>
                prev === null ? 0 : Math.max(0, (prev - 1))
            );
        } else if (e.key === 'Escape') {
            setSuggestions([]);
        }
    }

    function clearSearch() {
        setQuery('');
        setSuggestions([]);
    }

    return (
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex relative flex flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <div className="relative w-full">
                <input
                    id="search"
                    className="peer h-[50px] block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-10 text-sm placeholder:text-gray-500 focus:outline-none"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                {query && (
                    <XMarkIcon
                        className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={clearSearch}
                    />
                )}
            </div>
            {suggestions.length > 0 && !loading && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            className={`px-4 py-2 cursor-pointer ${index === selectedSuggestionIndex ? 'bg-gray-100' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            {!loading && searchResults.length > 0 &&
                <div className='absolute top-[100px] right-[0px]'>
                    <h1 className='font-bold'>Select Playlists</h1>
                    <PlaylistCheckboxes
                        playlists={playlists}
                        onSelectionChange={handleSelectedPlaylistsChange}
                    />
                </div>
            }
            {loading &&
                <div className="absolute top-[100px] left-[0px] w-[55%]">
                    <p>Loading...🌀</p>
                </div>
            }
            {!loading &&
                <div className="absolute top-[100px] left-[0px] w-[60%]">
                    <SearchResults results={searchResults} onDownload={handleDownload} />
                </div>
            }
            {isDownloading && downloadedVideo && (
                <Notification message={`Downloading ${downloadedVideo.title} by ${downloadedVideo.channel}`} />
            )}
        </div>
    );
}
