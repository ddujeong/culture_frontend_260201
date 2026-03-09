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
    const handleWatched = async (itemId, itemTitle) => {
        const confirmMsg = `"${itemTitle}" 이거 봤어! 다른 거 추천해줘.`;

        // 1. 채팅창에 사용자가 말한 것처럼 표시
        setChatLog((prev) => [...prev, { role: "user", text: confirmMsg }]);
        setLoading(true);

        try {
            // 2. 서버로 요청 보낼 때 '본 아이템의 ID'를 명시적으로 같이 보냄 (중요!)
            const res = await api.post(`/chat/ask?userId=${user.id}`, {
                message: confirmMsg,
                viewedItemId: itemId  // 👈 서버가 바로 알 수 있게 ID를 직접 넘김
            });

            const data = JSON.parse(res.data.answer);
            setChatLog((prev) => [...prev, { role: "ai", text: data.message, items: data.items }]);
        } catch (err) {
            console.error(err);
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
                                    {/* ChatDrawer.js 수정 부분 */}
                                    {log.items && (
                                        <div className="chat-card-list">
                                            {log.items.map((item) => (
                                                <div key={item.id} className="chat-item-card">
                                                    <div onClick={() => navigate(`/items/${item.id}`)}>
                                                        <div className="card-title">{item.title}</div>
                                                        <div className="card-genre">{item.genre}</div>
                                                        <div className="card-reason">{item.reason}</div>
                                                    </div>

                                                    {/* 💡 '봤어요' 버튼 추가 */}
                                                    <button
                                                        className="watched-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 카드 클릭(이동) 방지
                                                            handleWatched(item.id, item.title);
                                                        }}
                                                    >
                                                        ✅ 봤어요
                                                    </button>
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