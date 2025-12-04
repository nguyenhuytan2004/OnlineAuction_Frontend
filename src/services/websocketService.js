import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { TOKEN_DEV } from "../constants/api";

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
        this.connected = false;
    }

    connect(handleConnect, handleError) {
        if (this.connected) {
            console.log("WebSocket already connected");
            handleConnect?.();
            return;
        }

        // Khởi tạo SockJS (KHÔNG truyền headers vào đây)
        const socket = new SockJS("http://localhost:8080/ws/bid", null, {
            onOpen: () => {
                console.log("SockJS connection opened");
            },
            onClose: () => {
                console.log("SockJS connection closed");
            },
            onError: (error) => {
                console.error("SockJS error:", error);
            },
        });

        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log("WebSocket connected");
                this.connected = true;
                handleConnect?.();
            },
            onDisconnect: () => {
                console.log("WebSocket disconnected");
                this.connected = false;
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame);
                handleError?.(frame);
            },
        });

        // Bạn không cần truyền headers vào activate() nữa nếu đã khai báo ở trên.
        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.subscriptions.forEach((sub) => sub.unsubscribe());
            this.subscriptions.clear();
            this.client.deactivate();
            this.connected = false;
        }
    }

    // Subscribe to bid updates for a specific product
    subscribeToBids(productId, handleBidUpdate) {
        if (!this.connected || !this.client) {
            console.error("WebSocket not connected");
            return null;
        }

        console.log("Subscribing to bids for product:", productId);
        const destination = `/topic/product/${productId}/place-bid`;
        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const data = JSON.parse(message.body);
                console.log("Received bid message:", data);
                handleBidUpdate(data);
            } catch (error) {
                console.error("Error parsing bid message:", error);
            }
        });

        this.subscriptions.set(`bids-${productId}`, subscription);
        return subscription;
    }

    // Subscribe to auction extension notifications
    subscribeToAuctionExtension(productId, handleAuctionExtended) {
        if (!this.connected || !this.client) {
            console.error("WebSocket not connected");
            return null;
        }

        const destination = `/topic/product/${productId}/auction-extended`;
        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const newEndTime = JSON.parse(message.body);
                handleAuctionExtended(newEndTime);
            } catch (error) {
                console.error("Error parsing extension message:", error);
            }
        });

        this.subscriptions.set(`extension-${productId}`, subscription);
        return subscription;
    }

    // Place a bid
    placeBid(productId, bidData) {
        if (!this.connected || !this.client) {
            throw new Error("WebSocket chưa kết nối");
        }

        console.log("Send bid data to server:", bidData);
        this.client.publish({
            destination: `/app/product/${productId}/place-bid`,
            body: JSON.stringify(bidData),
        });
    }

    // Unsubscribe from a specific product
    unsubscribeFromProduct(productId) {
        const bidsSub = this.subscriptions.get(`bids-${productId}`);
        const extensionSub = this.subscriptions.get(`extension-${productId}`);

        if (bidsSub) {
            bidsSub.unsubscribe();
            this.subscriptions.delete(`bids-${productId}`);
        }

        if (extensionSub) {
            extensionSub.unsubscribe();
            this.subscriptions.delete(`extension-${productId}`);
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new WebSocketService();
