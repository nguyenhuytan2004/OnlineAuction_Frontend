import { useEffect } from "react";
import websocketService from "../services/websocketService";

export const useAuction = (
    productId,
    connected,
    handleAuctionUpdate,
    handleAuctionExtended,
    handleAuctionEnd,
) => {
    useEffect(() => {
        if (productId && connected) {
            // console.log(
            //     "Subscribing to auction updates for product:",
            //     productId,
            // );

            // Subscribe to bid updates
            websocketService.subscribeToBids(productId, (data) => {
                handleAuctionUpdate?.(data);
            });

            // Subscribe to auction extensions
            websocketService.subscribeToAuctionExtension(productId, (data) => {
                handleAuctionExtended?.(data);
            });

            // Subscribe to auction end
            websocketService.subscribeToAuctionEnd(productId, (data) => {
                handleAuctionEnd?.(data);
            });
        }
    }, [
        connected,
        productId,
        handleAuctionUpdate,
        handleAuctionExtended,
        handleAuctionEnd,
    ]);
};
