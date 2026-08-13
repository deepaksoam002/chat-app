import { useState, useEffect } from "react";
import { socket } from "../../utils/socket";
import { axiosApi } from "../../utils/axios";
import { useAuth } from "../../utils/apiAuth";
import '../Chatspace/chatSpace.css';




function Main({ unreadMessages }) {

    const { user } = useAuth();

    const [message, setMessage] = useState('');
    const [allChats, setAllChats] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [contacts, setContacts] = useState([]);
    const [activeChat, setActiveChat] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [unreadChatCount, setUnreadChatCount] = useState({});

    /* STREAMING_CHUNK:Handling unread messages sync... */
    // Update unread messages
    useEffect(() => {
        const unreadCount = {};
        const unreadMessage = [];

        if (unreadMessages) {
            for (const [keys, value] of Object.entries(unreadMessages)) {
                unreadCount[keys] = value.length;
                unreadMessage.push(...value);
            }
            setUnreadChatCount(unreadCount);
            setAllChats((prevChats) => [...prevChats, ...unreadMessage]);
        }
    }, [unreadMessages]);

    /* STREAMING_CHUNK:Fetching user connections on load... */
    // Populate all connections on refresh
    useEffect(() => {
        let isMounted = true;
        setContacts([]);

        async function getAllConnection() {
            if (!user) return; // Wait for user data

            try {
                const response = await axiosApi.get("api/v1/users/connections");
                if (isMounted && response.data?.connections) {
                    const data = response.data.connections;
                    const connections = data.map((contact) => {
                        const username = contact.user.username !== user?.username ? contact.user.username : contact.connectedWith.username;
                        const email = contact.user.email !== user?.email ? contact.user.email : contact.connectedWith.email;
                        const contact_id = contact.user.email !== user?.email ? contact.user._id : contact.connectedWith._id;

                        return {
                            id: contact_id,
                            username: username,
                            email: email,
                            roomId: contact.roomID,
                            status: contact.status,
                        };
                    });
                    setContacts(connections);
                }
            } catch (error) {
                console.error("Error fetching connections:", error);
            }
        }

        getAllConnection();
        return () => { isMounted = false; };
    }, [user?.username, user?.email]);

    /* STREAMING_CHUNK:Setting up socket listeners... */
    // Handle incoming messages
    useEffect(() => {
        const handleReceivedMessages = (message) => {
            setAllChats((prevChats) => [...prevChats, message]);
        };

        socket.on("receive_message", handleReceivedMessages);
        return () => {
            socket.off("receive_message", handleReceivedMessages);
        };
    }, []);

    /* STREAMING_CHUNK:Defining event handlers... */
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleActiveChat = (contactUser) => {
        socket.emit("join_room", contactUser.roomId);
        setActiveChat(contactUser);

        setUnreadChatCount((prevCount) => {
            const updatedCount = { ...prevCount };
            delete updatedCount[contactUser.roomId];
            return updatedCount;
        });

        socket.emit("mask_as_read", contactUser);
    };

    function handleSendMessage() {
        if (!message.trim() || !activeChat || !user) return;

        const messageObject = {
            id: Date.now() + Math.random().toString(32).substr(2, 9),
            value: message,
            room: activeChat.roomId,
            from: user?.username,
            recipientId: activeChat.id,
            to: activeChat.username,
        };

        setAllChats((prevChats) => [...prevChats, messageObject]);
        socket.emit("sendMessagefromClient", messageObject);
        setMessage('');
    }


    async function searchForUser() {
        try {
             setErrorMessage(''); // Clear any previous error messages
            const existingContact = contacts.find(contact => contact.email === searchInput || contact.username === searchInput);

            if (existingContact) {

                existingContact.isAlreadyExisting = true; // Mark as existing contact
                setSearchUser(existingContact);
                setSearchInput('');
                return;

            } else {

                const response = await axiosApi.get(`api/v1/users/${searchInput}`);
                const userData = response.data;
                userData.isAlreadyExisting = false; // Mark as new contact
                setSearchUser(userData);
            }

        } catch (error) {
            setErrorMessage("User not found. Please check the email or username.");
        }
    }

    async function handleNewUser() {
        if (!user) return;

        try {

           if(searchUser.isAlreadyExisting) {
                handleActiveChat(searchUser);
                setShowAddUser(false);
                setSearchUser(null);
                return;

           }

            await axiosApi.post("/api/v1/users/new-connection", {
                currentUserId: user?.id,
                targetUserId: searchUser?.id
            });

            const newContact = {
                email: searchUser?.email,
                username: searchUser?.username,
                id: searchUser?.id,
                roomId: [user.id, searchUser?.id].sort().join("_"), // Dummy room generation fallback
                status: 'accepted' // Default status
            };

            setContacts([...contacts, newContact]);
            handleActiveChat(newContact);
            setShowAddUser(false);
            setSearchUser(null);
            
        } catch (error) {
            console.error("Failed to add connection", error);
        }
    }

    /* STREAMING_CHUNK:Filtering active chat messages... */
    // Dynamically filter messages for the active chat
    const activeConnectionChats = allChats.filter((msg) => {
        if (!activeChat) return false;
        return msg.to === activeChat.username || msg.from === activeChat.username;
    });

    /* STREAMING_CHUNK:Rendering Loading UI... */
    // Guard clause: Show loading if user data isn't ready
    if (!user) {
        return (
            <div className="main-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="empty-chat-state">
                    <h2 style={{ color: '#f8fafc' }}>Loading Workspace...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="main-layout">

            {/* Modal Overlay (Search User) */}
            {showAddUser && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3>Add New Connection</h3>
                            <button className="close-modal" onClick={() => setShowAddUser(false)}>✕</button>
                        </div>

                        <div className="search-field-group">
                            <input
                                type="text"
                                className="form-input"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Email or Username"
                            />
                            <button className="btn-primary" onClick={searchForUser}>Search</button>
                        </div>
                        <div className="error-message">{errorMessage}</div>

                        {searchUser && (
                            <div className="user-profile-card">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(searchUser?.username || 'User')}&background=6366f1&color=fff&size=128`}
                                    alt="Avatar"
                                    className="user-avatar-large"
                                />
                                <div className="user-details">
                                    <h4>{searchUser?.username}</h4>
                                    <p>{searchUser?.email}</p>
                                </div>
                                <button className="btn-primary-small" onClick={handleNewUser}>
                                    {searchUser.isAlreadyExisting ? 'Send Message...' : 'Add Contact'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Sidebar (Contacts) */}
            <aside className="sidebar-container glass-panel-dark">
                <div className="sidebar-header">
                    <h2>Chats</h2>
                    {/* Fixed Add Button using an inline SVG instead of a separate component */}
                    <button className="icon-btn" onClick={() => setShowAddUser(true)} title="Add Contact">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <div className="contact-list custom-scrollbar">
                    {contacts.length === 0 ? (
                        <div className="empty-state">No chats yet. Click the + to start.</div>
                    ) : (
                        contacts.map((contactObj) => (
                            <div
                                key={contactObj.id}
                                className={`contact-item ${activeChat?.id === contactObj.id ? 'active' : ''}`}
                                onClick={() => handleActiveChat(contactObj)}
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contactObj.username || 'User')}&background=random&color=fff`}
                                    alt="Avatar"
                                    className="user-avatar"
                                />
                                <div className="contact-info">
                                    <div className="contact-name-row">
                                        <span className="contact-name">{contactObj.username}</span>
                                        {unreadChatCount[contactObj.roomId] > 0 && (
                                            <span className="unread-badge">{unreadChatCount[contactObj.roomId]}</span>
                                        )}
                                    </div>
                                    <span className="contact-preview">Click to view messages</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-area">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.username || 'User')}&background=random&color=fff`}
                                    alt="Avatar"
                                    className="user-avatar"
                                    style={{ width: '36px', height: '36px' }}
                                />
                                <div>
                                    <h3 className="chat-header-name">{activeChat.username}</h3>
                                    <span className="status-indicator">
                                        <span className="status-dot online"></span> Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="message-list custom-scrollbar">
                            {activeConnectionChats.map((msgObj) => {
                                const isMine = msgObj.from === user?.username;
                                return (
                                    <div key={msgObj.id} className={`message-wrapper ${isMine ? 'message-mine' : 'message-theirs'}`}>
                                        <div className={`message-bubble ${isMine ? 'bubble-mine' : 'bubble-theirs'}`}>
                                            {msgObj.value}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="chat-input-area glass-panel-dark">
                            <input
                                type="text"
                                className="form-input chat-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                            />
                            <button
                                className="btn-send"
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-chat-state">
                        <div className="empty-chat-icon">💬</div>
                        <h2>Your Workspace</h2>
                        <p>Select a contact from the sidebar to start messaging</p>
                    </div>
                )}
            </main>
        </div>
    );


}

export default Main;