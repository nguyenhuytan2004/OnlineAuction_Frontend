import { useEffect, useCallback } from "react";
import websocketService from "../services/websocketService";
import authService from "../services/authService";

export const useQnA = (
    productId,
    sellerId,
    handleNewQuestion,
    handleNewAnswer,
) => {
    // Subscribe to questions when product loads
    useEffect(() => {
        if (websocketService.isConnected() && productId) {
            websocketService.subscribeToQuestions(productId, (data) => {
                handleNewQuestion?.(data);
            });
        }
    }, [productId, handleNewQuestion]);

    // Ask a question
    const askQuestion = useCallback(
        (userId, productId, questionText) => {
            if (!websocketService.isConnected()) {
                throw new Error("WebSocket chưa kết nối");
            }

            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                throw new Error("Vui lòng đăng nhập để đặt câu hỏi");
            }

            if (userId === sellerId) {
                throw new Error(
                    "Người bán không thể đặt câu hỏi cho chính mình",
                );
            }

            websocketService.askQuestion(userId, productId, questionText);
        },
        [sellerId],
    );

    // Answer a question (only seller can answer)
    const answerQuestion = useCallback(
        (userId, productId, questionId, answerText) => {
            if (!websocketService.isConnected()) {
                throw new Error("WebSocket chưa kết nối");
            }

            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                throw new Error("Vui lòng đăng nhập để trả lời");
            }

            if (currentUser.userId !== sellerId) {
                throw new Error("Chỉ người bán mới có thể trả lời câu hỏi");
            }

            websocketService.answerQuestion(
                userId,
                productId,
                questionId,
                answerText,
            );
        },
        [sellerId],
    );

    // Subscribe to answers for a specific question
    const subscribeToAnswers = useCallback(
        (questionId) => {
            if (!websocketService.isConnected()) {
                console.warn("WebSocket not connected");
                return;
            }

            websocketService.subscribeToAnswers(
                productId,
                questionId,
                (data) => {
                    handleNewAnswer?.(data, questionId);
                },
            );
        },
        [productId, handleNewAnswer],
    );

    return {
        askQuestion,
        answerQuestion,
        subscribeToAnswers,
    };
};
