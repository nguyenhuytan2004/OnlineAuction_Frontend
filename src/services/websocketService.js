import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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

    isConnected() {
        return this.connected;
    }

    // Subscribe to bid updates for a specific product
    subscribeToBids(productId, handleAuctionUpdate) {
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
                handleAuctionUpdate(data);
            } catch (error) {
                console.error("Error parsing bid message:", error);
            }
        });

        this.subscriptions.set(`bids-${productId}`, subscription);
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

    // Subscribe to auction end notifications
    subscribeToAuctionEnd(productId, handleAuctionEnd) {
        if (!this.connected || !this.client) {
            console.error("WebSocket not connected");
            return null;
        }

        const destination = `/topic/product/${productId}/auction-end`;
        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const data = message.body;
                handleAuctionEnd(data);
            } catch (error) {
                console.error("Error parsing auction end message:", error);
            }
        });

        this.subscriptions.set(`auctionEnd-${productId}`, subscription);
        return subscription;
    }

    // Subscribe to questions for a specific product
    subscribeToQuestions(productId, handleNewQuestion) {
        if (!this.connected || !this.client) {
            console.error("WebSocket not connected");
            return null;
        }

        const destination = `/topic/products/${productId}/questions`;
        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const data = JSON.parse(message.body);
                console.log("Received question:", data);
                handleNewQuestion(data);
            } catch (error) {
                console.error("Error parsing question message:", error);
            }
        });

        this.subscriptions.set(`questions-${productId}`, subscription);
        return subscription;
    }

    // Ask a question
    askQuestion(userId, productId, questionText) {
        if (!this.connected || !this.client) {
            throw new Error("WebSocket chưa kết nối");
        }

        console.log("Sending question:", { userId, productId, questionText });
        this.client.publish({
            destination: `/app/products/${productId}/questions`,
            body: JSON.stringify({ userId, productId, questionText }),
        });
    }

    // Subscribe to answers for a specific question
    subscribeToAnswers(productId, questionId, handleNewAnswer) {
        if (!this.connected || !this.client) {
            console.error("WebSocket not connected");
            return null;
        }

        const destination = `/topic/products/${productId}/questions/${questionId}/answers`;
        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const data = JSON.parse(message.body);
                console.log("Received answer:", data);
                handleNewAnswer(data, questionId);
            } catch (error) {
                console.error("Error parsing answer message:", error);
            }
        });

        this.subscriptions.set(`answers-${questionId}`, subscription);
        return subscription;
    }

    // Answer a question
    answerQuestion(userId, productId, questionId, answerText) {
        if (!this.connected || !this.client) {
            throw new Error("WebSocket chưa kết nối");
        }

        console.log("Sending answer:", {
            userId,
            productId,
            questionId,
            answerText,
        });
        this.client.publish({
            destination: `/app/products/${productId}/questions/${questionId}/answers`,
            body: JSON.stringify({ userId, productId, questionId, answerText }),
        });
    }

    // Unsubscribe from a specific product
    unsubscribeFromProduct(productId) {
        const bidsSub = this.subscriptions.get(`bids-${productId}`);
        const extensionSub = this.subscriptions.get(`extension-${productId}`);
        const auctionEndSub = this.subscriptions.get(`auctionEnd-${productId}`);
        const questionsSub = this.subscriptions.get(`questions-${productId}`);

        if (bidsSub) {
            bidsSub.unsubscribe();
            this.subscriptions.delete(`bids-${productId}`);
        }

        if (extensionSub) {
            extensionSub.unsubscribe();
            this.subscriptions.delete(`extension-${productId}`);
        }

        if (auctionEndSub) {
            auctionEndSub.unsubscribe();
            this.subscriptions.delete(`auctionEnd-${productId}`);
        }

        if (questionsSub) {
            questionsSub.unsubscribe();
            this.subscriptions.delete(`questions-${productId}`);
        }

        // Unsubscribe from all answers for this product
        for (const key of this.subscriptions.keys()) {
            if (key.startsWith(`answers`)) {
                const sub = this.subscriptions.get(key);
                sub.unsubscribe();
                this.subscriptions.delete(key);
            }
        }
    }
}

export default new WebSocketService();
