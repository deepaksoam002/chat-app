import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Css/heroSection.css';

function HeroSection() {
  const navigate = useNavigate();



  return (
    <div className="hero-container">
      {/* Background Gradients */}
      <div className="hero-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <main className="hero-main">
        <div className="hero-content">
          <div className="status-badge">
            <span className="status-dot-container">
              <span className="status-dot-ping"></span>
              <span className="status-dot-core"></span>
            </span>
            v1.0 is now live
          </div>
          
          <h1 className="hero-title">
            Chat without <br />
            <span className="gradient-text">
              the noise.
            </span>
          </h1>
          
          <p className="hero-description">
            Real-time, secure, and blazingly fast messaging designed for modern teams. Drop the lag and start connecting instantly.
          </p>
          
          <div className="btn-group">
            {/* Updated to use React Router navigation */}
            <button onClick={() => navigate('/signup')} className="btn btn-primary">
              Start Chatting for Free
            </button>
            <button onClick={() => navigate('/signin')} className="btn btn-secondary">
              Log into Workspace
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mockup-window">
            <div className="mockup-header">
              <div className="mockup-avatar-main"></div>
              <div>
                <div className="skeleton-line w-24"></div>
                <div className="skeleton-line w-16"></div>
              </div>
            </div>
            
            <div className="message-group">
              <div className="message-row">
                <div className="mockup-avatar-small"></div>
                <div className="message-bubble received">
                  <div className="skeleton-line w-full"></div>
                  <div className="skeleton-line w-2-3"></div>
                </div>
              </div>
              
              <div className="message-row reverse">
                <div className="message-bubble sent">
                  <div className="skeleton-line w-full"></div>
                  <div className="skeleton-line w-1-2"></div>
                </div>
              </div>
            </div>

            <div className="mockup-input">
               <div className="skeleton-line w-1-3"></div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default HeroSection;












// import React from 'react';
// import '../../Css/heroSection.css';


// function HeroSection(){


//   return (
//     <>
     

//       <div className="hero-container">
        
//         {/* Background Gradients */}
//         <div className="hero-background">
//           <div className="blob blob-1"></div>
//           <div className="blob blob-2"></div>
//         </div>

       
//         <main className="hero-main">
          
//           <div className="hero-content">
//             <div className="status-badge">
//               <span className="status-dot-container">
//                 <span className="status-dot-ping"></span>
//                 <span className="status-dot-core"></span>
//               </span>
//               v1.0 is now live
//             </div>
            
//             <h1 className="hero-title">
//               Chat without <br />
//               <span className="gradient-text">
//                 the noise.
//               </span>
//             </h1>
            
//             <p className="hero-description">
//               Real-time, secure, and blazingly fast messaging designed for modern teams. Drop the lag and start connecting instantly.
//             </p>
            
//             <div className="btn-group">
//               <a href="#signup" className="btn btn-primary">
//                 Start Chatting for Free
//               </a>
//               <a href="#signin" className="btn btn-secondary">
//                 Log into Workspace
//               </a>
//             </div>
//           </div>

//           {}
//           <div className="hero-visual">
//             <div className="mockup-window">
              
//               <div className="mockup-header">
//                 <div className="mockup-avatar-main"></div>
//                 <div>
//                   <div className="skeleton-line w-24"></div>
//                   <div className="skeleton-line w-16"></div>
//                 </div>
//               </div>
              
//               <div className="message-group">
//                 <div className="message-row">
//                   <div className="mockup-avatar-small"></div>
//                   <div className="message-bubble received">
//                     <div className="skeleton-line w-full"></div>
//                     <div className="skeleton-line w-2-3"></div>
//                   </div>
//                 </div>
                
//                 <div className="message-row reverse">
//                   <div className="message-bubble sent">
//                     <div className="skeleton-line w-full"></div>
//                     <div className="skeleton-line w-1-2"></div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mockup-input">
//                  <div className="skeleton-line w-1-3"></div>
//               </div>
              
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default HeroSection;