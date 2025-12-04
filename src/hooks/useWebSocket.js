import { useEffect, useRef, useState, useCallback } from "react";
import websocketService from "../services/websocketService";

export const useWebSocket = (productId, onBidUpdate, onAuctionExtended) => {
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
                    onBidUpdate?.(data);
                });

                // Subscribe to auction extensions
                websocketService.subscribeToAuctionExtension(
                    productId,
                    (data) => {
                        onAuctionExtended?.(data);
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
    }, [productId, onBidUpdate, onAuctionExtended]);

    const placeBid = useCallback(
        (maxAutoPrice) => {
            if (!connected) {
                throw new Error("WebSocket chưa kết nối");
            }

            console.log("Placing bid:", { productId, maxAutoPrice });
            // For demo purposes, using a fixed bidderId
            // Random số nguyên từ 1 đến 7 trừ số 2
            do {
                var bidderId = Math.floor(Math.random() * 7) + 1;
            } while (bidderId === 2);

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
