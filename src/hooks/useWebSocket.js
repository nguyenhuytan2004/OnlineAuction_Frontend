import { useEffect, useRef, useState, useCallback } from "react";
import websocketService from "../services/websocketService";
import authService from "../services/authService";

export const useWebSocket = (
    productId,
    handleBidUpdate,
    handleAuctionExtended,
) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        const handleConnect = () => {
            setConnected(true);
            setError(null);
            reconnectAttempts.current = 0;

            if (productId) {
                // Subscribe to bid updates
                websocketService.subscribeToBids(productId, (data) => {
                    handleBidUpdate?.(data);
                });

                // Subscribe to auction extensions
                websocketService.subscribeToAuctionExtension(
                    productId,
                    (data) => {
                        handleAuctionExtended?.(data);
                    },
                );
            }
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
            if (productId) {
                websocketService.unsubscribeFromProduct(productId);
            }
        };
    }, [productId, handleBidUpdate, handleAuctionExtended]);

    const placeBid = useCallback(
        (maxAutoPrice) => {
            if (!connected) {
                throw new Error("WebSocket chưa kết nối");
            }

            console.log("Placing bid:", { productId, maxAutoPrice });

            const bidderId = authService.getCurrentUser().userId;
            websocketService.placeBid(productId, {
                productId,
                bidderId,
                maxAutoPrice,
            });
        },
        [connected, productId],
    );

    return { connected, error, placeBid };
};
