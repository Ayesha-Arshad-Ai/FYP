import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa';
import { useToken } from '../context/TokenContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Chatbot = () => {
  const { token, user } = useToken();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessageChat, setErrorMessageChat] = useState('');
  const bottomRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login');
    else fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_URL}/chat/users/${token}`);
      if (!res.ok) throw new Error('Could not load chats.');
      setUsers(await res.json());
    } catch (err) {
      console.error(err);
      setErrorMessageChat('Failed to load chat list.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async (otherId) => {
    setLoadingMsgs(true);
    setErrorMessageChat('');
    try {
      const res = await fetch(`${API_URL}/chat/${otherId}/${token}/messages`);
      if (!res.ok) throw new Error('Could not load messages.');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessageChat('Failed to fetch messages.');
    } finally {
      setLoadingMsgs(false);
    }
  };

  const selectUser = (u) => {
    setSelectedUser(u);
    setMessages([]);
    fetchMessages(u.id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setErrorMessageChat('');
    if (!text.trim() || !selectedUser) return;

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          other_id: selectedUser.id,
          text: text.trim(),
        }),
      });

      if (res.status === 400) {
        const errData = await res.json();
        if (errData.cyberbullying) {
          setErrorMessageChat(
            `⚠️ Cyberbullying detected (${errData.bullying_type}). Suggestion: ${errData.suggestion}`
          );
        } else {
          setErrorMessageChat(errData.detail || 'Invalid request.');
        }
      } else if (!res.ok) {
        setErrorMessageChat('Server error. Please try again.');
      } else {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setText('');
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
      setErrorMessageChat('Network error. Please check your connection.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white border-r overflow-y-auto">
          <h2 className="px-4 py-3 text-xl font-semibold text-[#0f172a]">Chats</h2>
          {loadingUsers ? (
            <div className="flex justify-center py-6">
              <FaSpinner className="animate-spin text-2xl text-gray-500" />
            </div>
          ) : (
            users.map((u) => (
              <button
                key={u.id}
                onClick={() => selectUser(u)}
                className={`w-full flex items-center px-4 py-3 hover:bg-gray-100 focus:outline-none ${
                  selectedUser?.id === u.id ? 'bg-gray-100' : ''
                }`}
              >
                {u.profile_pic ? (
                  <img src={`../assests/profile_images/${u.profile_pic}`} alt="" className="w-10 h-10 rounded-full mr-3" />
                ) : (
                  <FaUser className="w-10 h-10 text-gray-400 mr-3" />
                )}
                <div className="text-left">
                  <p className="font-medium text-gray-800">{u.name || u.username}</p>
                  <p className="text-sm text-gray-500">@{u.username}</p>
                </div>
              </button>
            ))
          )}
        </aside>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center px-6 py-4 bg-white border-b">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-600 mr-4 hover:text-gray-800 focus:outline-none"
                >
                  &larr;
                </button>
                {selectedUser.profile_pic ? (
                  <img
                    src={`../assests/profile_images/${selectedUser.profile_pic}`}
                    alt=""
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <FaUser className="w-10 h-10 text-gray-400 mr-3" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedUser.name || selectedUser.username}
                  </p>
                  <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMsgs ? (
                  <div className="flex justify-center py-6">
                    <FaSpinner className="animate-spin text-2xl text-gray-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-400">No messages yet.</p>
                ) : (
                  messages.map((m) => {
                    const isMine = m.sender?.id === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-xs">
                          <p
                            className={`mb-1 text-sm font-medium ${
                              isMine ? 'text-blue-600 text-right' : 'text-gray-700'
                            }`}
                          >
                            {isMine ? user.name : m.sender?.name}
                          </p>
                          <div className="flex items-end">
                            {!isMine && (
                              m.sender?.profile_pic ? (
                                <img

                                  src={`../assests/profile_images/${m.sender.profile_pic}`}
                                  alt=""
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                              ) : (
                                <FaUser className="w-8 h-8 text-gray-400 mr-2" />
                              )
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg break-words ${
                                isMine
                                  ? 'bg-blue-600 text-white ml-2 rounded-br-none'
                                  : 'bg-gray-200 text-gray-800 mr-2 rounded-bl-none'
                              }`}
                            >
                              <ReactMarkdown
                                components={{
                                  code({ inline, className, children, ...props }) {
                                    return inline ? (
                                      <code className="bg-gray-300 rounded px-1" {...props}>
                                        {children}
                                      </code>
                                    ) : (
                                      <SyntaxHighlighter
                                        style={docco}
                                        language={(className || '').replace('language-', '')}
                                        PreTag="div"
                                      >
                                        {String(children)}
                                      </SyntaxHighlighter>
                                    );
                                  },
                                }}
                              >
                                {m.text}
                              </ReactMarkdown>
                              <p className="mt-1 text-xs text-right text-gray-500">
                                {new Date(m.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            {isMine && (
                              user?.profile_pic ? (
                                <img

                                  src={`../assests/profile_images/${user.profile_pic}`}
                                  alt=""
                                  className="w-8 h-8 rounded-full ml-2"
                                />
                              ) : (
                                <FaRobot className="w-8 h-8 text-gray-400 ml-2" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Error Banner */}
              {errorMessageChat && (
                <div className="bg-red-500 text-white px-6 py-3">
                  {errorMessageChat}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center px-6 py-4 bg-white border-t"
              >
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00f7ff] mr-4"
                  placeholder="Type a message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="p-3 rounded-full bg-[#00f7ff] hover:bg-[#00e7ee] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                >
                  {sending ? (
                    <FaSpinner className="animate-spin text-white text-xl" />
                  ) : (
                    <FaRobot className="text-white text-xl" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat from the sidebar.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
