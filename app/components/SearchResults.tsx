import { VideoResult } from "../models/VideoResult.model";
import { ArrowDownTrayIcon} from '@heroicons/react/24/outline'; // Import DownloadIcon

interface SearchResultsProps {
    results: VideoResult[];
    onDownload: (video: VideoResult) => void;
}

export default function SearchResults({ results, onDownload }: SearchResultsProps) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {results.map((result, idx) => (
                <div key={idx} className="flex items-center border border-white border-2 p-4 rounded-md">
                    <img
                        src={result.thumbnail_url}
                        alt={result.title}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{result.title}</h3>
                        <p className="text-sm text-gray-500">{result.channel}</p>
                    </div>
                    <ArrowDownTrayIcon
                        onClick={() => onDownload(result)}
                        className="h-6 w-6 text-black cursor-pointer hover:text-blue-600"
                    />
                </div>
            ))}
        </div>
    );
}
