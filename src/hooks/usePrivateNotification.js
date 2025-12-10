import { useEffect } from "react";
import websocketService from "../services/websocketService";

export const usePrivateNotification = (
    connected,
    userId,
    handleBlockedNotification,
) => {
    useEffect(() => {
        if (connected) {
            websocketService.subscribeToBlockedNotification(userId, (data) => {
                handleBlockedNotification?.(data);
            });
        }
    }, [connected, userId, handleBlockedNotification]);
};
