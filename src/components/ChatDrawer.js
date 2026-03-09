import { useState } from "react";
import api from "../api/axiosConfig";
import "../style/ChatDrawer.css"; // 아래 CSS 참고
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ChatDrawer() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([
        { role: "ai", text: "안녕하세요! 당신의 문화 가이드 듀듀입니다. 무엇을 도와드릴까요? 🎬" }
    ]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = { role: "user", text: message };
        setChatLog((prev) => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const res = await api.post(`/chat/ask?userId=${user.id}`, { message });

            // 💡 AI 응답 파싱 시도
            try {
                const data = JSON.parse(res.data.answer);
                setChatLog((prev) => [...prev, { role: "ai", text: data.message, items: data.items }]);
            } catch (e) {
                // JSON이 아닐 경우 일반 텍스트로 처리
                setChatLog((prev) => [...prev, { role: "ai", text: res.data.answer }]);
            }
        } catch (err) {
            setChatLog((prev) => [...prev, { role: "ai", text: "연결 실패 😢" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 챗봇 열기 버튼 */}
            <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✖" : "🤖"}
            </button>

            {/* 채팅 창 */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">듀듀(DDU) 전문가</div>
                    <div className="chat-messages">
                        {chatLog.map((log, idx) => (
                            <div key={idx} className={`chat-bubble-container ${log.role}`}>
                                <div className={`chat-bubble ${log.role}`}>                                    {log.text}
                                    {/* 💡 AI 추천 카드가 있다면 렌더링 */}
                                    {log.items && (
                                        <div className="chat-card-list">
                                            {log.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="chat-item-card"
                                                    onClick={() => navigate(`/items/${item.id}`)} // 👈 경로에 맞게 수정
                                                >
                                                    <div className="card-title">{item.title}</div>
                                                    <div className="card-genre">{item.genre}</div>
                                                    <div className="card-reason">{item.reason}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="궁금한 걸 물어보세요..."
                        />
                        <button onClick={handleSend}>전송</button>
                    </div>
                </div>
            )}
        </>
    );
}