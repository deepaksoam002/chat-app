import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/apiAuth';
import '../Signup/signup.css'; /* Reusing the exact same theme css from above */

function Signin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signin } = useAuth();

    async function submitForm(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = { email, password };
            await signin(payload);
            navigate('/user/chat-space');
        } catch (error) {
            console.log("getting error :", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to your workspace</p>
                    </div>

                    <form onSubmit={submitForm}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-auth-primary">
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/signup')} className="text-link">
                            Create one
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signin;












// import { useState } from 'react';
// // import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // axios.defaults.withCredentials = true;
// import { useAuth } from '../../utils/apiAuth';

// function Signin() {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [buttontext, setButtonText] = useState('Submit');
//      const {signin}= useAuth();

//     async function submitForm() {
//         console.log(`send sign in request`)
//         try {
//             const payload = { email, password };
//             const response = await signin(payload);
//             navigate('/');
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
//                 // The gradient needs to be back here so the glass effect has something to blur!
//                 backgroundImage: `linear-gradient(135deg, #ff007f, #7f00ff)`,
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
                    
//                     // --- The Glassmorphism Recipe ---
//                     background: "rgba(255, 255, 255, 0.15)", // Semi-transparent white
//                     backdropFilter: "blur(12px)",            // Blurs the background underneath
//                     webkitBackdropFilter: "blur(12px)",      // Safari support
//                     border: "1px solid rgba(255, 255, 255, 0.25)", // Subtle highlights on the edge
//                     boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",  // Soft shadow for depth
//                 }}>
//                     <div style={{ marginBottom: "25px" }}>
//                         <h3 style={{ color: "#ffffff", margin: 0, fontSize: "22px", letterSpacing: "1px" }}>
//                             Signin | Chat App
//                         </h3>
//                     </div>

//                     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        
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
//                                     // Glassy inputs look incredible
//                                     background: "rgba(255, 255, 255, 0.2)",
//                                     border: "1px solid rgba(255, 255, 255, 0.3)",
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
//                                     background: "rgba(255, 255, 255, 0.2)",
//                                     border: "1px solid rgba(255, 255, 255, 0.3)",
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
//                                     color: "#7f00ff",
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

// export default Signin;