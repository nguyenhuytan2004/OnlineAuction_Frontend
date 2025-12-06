import { useEffect, useRef, useState } from "react";
import websocketService from "../services/websocketService";

export const useWebSocket = () => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        const handleConnect = () => {
            setConnected(true);
            setError(null);
            reconnectAttempts.current = 0;
        };

        const handleError = () => {
            setError("Không thể kết nối WebSocket");
            setConnected(false);

            // Retry connection
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current++;
                setTimeout(() => {
                    websocketService.connect(handleConnect, handleError);
                }, 3000);
            }
        };

        // Connect WebSocket
        if (!websocketService.isConnected()) {
            websocketService.connect(handleConnect, handleError);
        } else {
            handleConnect();
        }

        // Cleanup
        return () => {
            // WebSocket connection stays alive until app closes
        };
    }, []);

    return { connected, error };
};
