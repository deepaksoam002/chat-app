import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/apiAuth';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{

      const payload = {username, email, password};
      await signup(payload);
      navigate('/user/chat-space');
    }catch (error) {
            console.log("getting error :", error);
    } finally {
            setIsLoading(false);
        }
  };

  return (
    <div className="auth-page-wrapper">
      
      <div className="auth-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>


      <div className="auth-card-wrapper">
        <button onClick={() => navigate('/')} className="back-btn">
           &larr; Back to home
        </button>

        <div className="auth-card">
          <div className="text-center">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join the next generation of messaging</p>
          </div>

          <form onSubmit={submitForm}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="cool_user99"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Create a strong password"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-auth-primary">
              {isLoading ? 'Loading...' : 'Start Free Trial'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <button onClick={() => navigate('/signin')} className="text-link">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;















// import { useState } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;

// function Signup() {
//     const [username, setUserName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [buttontext, setButtonText] = useState('Submit');

//     async function submitForm() {
//         try {
//             const payload = {
//                 username,
//                 email,
//                 password
//             };

//             const response = await axios.post('http://localhost:8002/user/signup', payload);
//             console.log(response);
//         } catch (error) {
//             console.log("getting error :", error);
//         }
//     }

//     return (
//         <>
//             <main style={{
//                 display: "flex", 
//                 justifyContent: "center", 
//                 alignItems: "center", 
//                 height: "100vh", 
//                 // A deep, modern cyan/blue-violet gradient to contrast with the sign-in page
//                 backgroundImage: `linear-gradient(135deg, #00c6ff, #0072ff)`,
//                 fontFamily: "monospace"
//             }}>

//                 <div style={{
//                     display: "flex", 
//                     justifyContent: "center", 
//                     alignItems: "center", 
//                     flexDirection: "column",    
//                     height: "fit-content", 
//                     padding: "40px 50px", 
//                     borderRadius: "16px",  
                    
//                     // --- Glassmorphism Setup ---
//                     background: "rgba(255, 255, 255, 0.12)", 
//                     backdropFilter: "blur(14px)",            
//                     webkitBackdropFilter: "blur(14px)",      
//                     border: "1px solid rgba(255, 255, 255, 0.2)", 
//                     boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",  
//                 }}>
//                     <div style={{ marginBottom: "25px" }}>
//                         <h3 style={{ color: "#ffffff", margin: 0, fontSize: "22px", letterSpacing: "1px" }}>
//                             Signup | Chat App
//                         </h3>
//                     </div>

//                     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        
//                         {/* Username Input Group */}
//                         <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
//                             <label htmlFor="username" style={{ padding: "5px 0px", fontWeight: "bold", fontSize: "14px", color: "#ffffff" }}>
//                                 Username
//                             </label>
//                             <input 
//                                 type="text" 
//                                 name="username" 
//                                 value={username} 
//                                 onChange={(e) => setUserName(e.target.value)} 
//                                 style={{ 
//                                     padding: "10px", 
//                                     borderRadius: "8px",
//                                     width: "220px",
//                                     background: "rgba(255, 255, 255, 0.18)",
//                                     border: "1px solid rgba(255, 255, 255, 0.25)",
//                                     outline: "none",
//                                     color: "#ffffff",
//                                 }}
//                             />
//                         </div>

//                         {/* Email Input Group */}
//                         <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
//                             <label htmlFor="email" style={{ padding: "5px 0px", fontWeight: "bold", fontSize: "14px", color: "#ffffff" }}>
//                                 Email
//                             </label>
//                             <input 
//                                 type="text" 
//                                 name="email" 
//                                 value={email} 
//                                 onChange={(e) => setEmail(e.target.value)} 
//                                 style={{ 
//                                     padding: "10px", 
//                                     borderRadius: "8px",
//                                     width: "220px",
//                                     background: "rgba(255, 255, 255, 0.18)",
//                                     border: "1px solid rgba(255, 255, 255, 0.25)",
//                                     outline: "none",
//                                     color: "#ffffff",
//                                 }}
//                             />
//                         </div>

//                         {/* Password Input Group */}
//                         <div style={{ display: "flex", flexDirection: "column", marginBottom: "25px" }}>
//                             <label htmlFor="password" style={{ padding: "5px 0px", fontWeight: "bold", fontSize: "14px", color: "#ffffff" }}>
//                                 Password
//                             </label>
//                             <input 
//                                 type="password" 
//                                 name="password" 
//                                 value={password} 
//                                 onChange={(e) => setPassword(e.target.value)} 
//                                 style={{ 
//                                     padding: "10px", 
//                                     borderRadius: "8px",
//                                     width: "220px",
//                                     background: "rgba(255, 255, 255, 0.18)",
//                                     border: "1px solid rgba(255, 255, 255, 0.25)",
//                                     outline: "none",
//                                     color: "#ffffff",
//                                 }}
//                             />
//                         </div>

//                         {/* Submit Button */}
//                         <div>
//                             <button 
//                                 onClick={submitForm} 
//                                 value={buttontext}
//                                 style={{
//                                     padding: "10px 30px",
//                                     borderRadius: "8px",
//                                     border: "none",
//                                     background: "#ffffff",
//                                     color: "#0072ff", // Matching button text to the theme gradient
//                                     fontWeight: "bold",
//                                     cursor: "pointer",
//                                     fontSize: "14px",
//                                     boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//                                     transition: "0.2s ease"
//                                 }}
//                             >
//                                 {buttontext}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             </main>
//         </>
//     );
// }

// export default Signup;