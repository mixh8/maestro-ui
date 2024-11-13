interface NotificationProps {
    message: string;
}

export default function Notification({ message }: NotificationProps) {
    return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
            {message}
        </div>
    );
}
