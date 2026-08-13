import Main from './pages/Chatspace/chatSpace';
import Signup from './pages/Signup/signup'
import Signin from './pages/Signin/signin'
import HeroSection from './pages/heroSection/heropage';
import { socket } from './utils/socket';
import { useEffect, useState } from 'react';
import { useAuth } from './utils/apiAuth';
import { Routes, Route, Outlet } from 'react-router-dom';
import PublicRoute from './components/Navbar';
import { axiosApi } from './utils/axios';

function App() {


  const { accessToken, loading, setNewAccessToken } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState('');

  if (loading) {
    return (
      <div className="app-loader">
        <p>Connecting securely to server...</p>
      </div>
    );
  }

  useEffect(() => {


    socket.auth = { token: accessToken };
    socket.connect();


    const handleConnectError = async (error) => {

      console.log("Socket Connection Error : ", error.data);

      if (error.data.statusCode === 401) {

        try {

          const response = await axiosApi.get('/api/v1/auth/refresh');
          const token = response.data.accessToken;

          setNewAccessToken(token);
         
        }
        catch (error) {

          console.error("Token refresh failed. Redirecting to login...", error);

        }
      }
    }


    function handleNewMessage(message) {

      console.log("unread messages", message)

      setUnreadMessages(message)
    }

    socket.on("connect_error", handleConnectError);
    socket.on("unread_Message", (message) => handleNewMessage(message));

    return (() => {
      socket.off("connect_error", handleConnectError);
      socket.off("unread_Message", handleNewMessage);
      socket.disconnect()
    })
  }, [accessToken])

  return (

    <Routes>
      <Route element={<PublicRoute />}>
        <Route path='/'>
          <Route index element={<HeroSection />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>
      <Route path='/user' element={<div><Outlet /></div>}>

        <Route path="chat-space" element={<Main unreadMessages={unreadMessages} />} />
      </Route>
    </Routes>

  );
}

export default App;