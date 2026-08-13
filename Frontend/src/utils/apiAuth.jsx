import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { axiosApi } from './axios';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext(null);




// this function work as a wrapper on our application  so that before load any code on frontend this function finish his work.
export function AuthProvider({ children }) {

    const navigate = useNavigate();
    const [accessToken, setNewAccessToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUserData] = useState({})
     
    const tokenRef = useRef('');
    // Step 1 Logic  


    // this use Effect run on every refresh or new tab open so that it get access token 
    useEffect(() => {

        const initializeAuth = async () => {

            try {
                // here we use post method although we do not send any body to server to maintain idemopotency because on every request we get new response
                const response = await axiosApi.post("api/v1/auth/refresh");
                const token = response.data.accessToken;
                const payload = response.data.payload;
                
                tokenRef.current = token
                setNewAccessToken(token);
                setUserData(payload);

            } catch (error) {

                setNewAccessToken(null);
                navigate('/signin')
                // here client need to login again

            } finally {
                setLoading(false);
            }
        }

        // here we call initializeAuth function 

        initializeAuth();


    }, [])  // with []  this useEffect run only one time 


    // step 2 logic


    useEffect(() => {

        //Step 2 logic A

        // now if we have access token then we attech that token in every request in Authrization header

        const requestIntercept = axiosApi.interceptors.request.use((config) => {


            if (tokenRef.current && !config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${tokenRef.current}`;
            }
            return config;
        }, (error) => Promise.reject(error));

        //Step 2 logic B


        // here we intercept response so if we get response then we return response if we get 401 status code  due to access token then first we check request do we retry or not if no then it run
        const responseIntercept = axiosApi.interceptors.response.use((response) => response, async (error) => {

            const prevRequest = error?.config;

            if (error?.response?.status === 401 && !prevRequest?.send) {
                prevRequest.send = true;

                try {

                    const response = await axiosApi.post("/user/refresh");
                    const newSizeableToken = response.data.accessToken


                    tokenRef.current = newSizeableToken;
                    setNewAccessToken(newSizeableToken);
                    prevRequest.headers['Authorization'] = `Bearer ${newSizeableToken}`

                    return axiosApi(prevRequest);

                } catch (refreshError) {

                    tokenRef.current = null;
                    setNewAccessToken(null);
                    //client need to login again as refresh token expire
                    return Promise.reject(refreshError);

                }

            }

            return Promise.reject(error);
        });

        // here we eject both intercepter If you don't do this, you will leak memory and multiple obsolete interceptors will stack up on top of each other, firing repeatedly.
        return () => {

            axiosApi.interceptors.request.eject(requestIntercept);
            axiosApi.interceptors.response.eject(responseIntercept);
        };
    }, []

    );

    const signup = async (credentials) => {

        const response = await axiosApi.post("api/v1/auth/register", credentials);
        setNewAccessToken(response.data.accessToken);
        return response.data;
    }

    // signin function 

    const signin = async (credentials) => {

        const response = await axiosApi.post("api/v1/auth/login", credentials);
        console.log(response);
        setNewAccessToken(response.data.accessToken);
        return response.data;
    };


    // signout function 

    const signout = async () => {

        try {

            await axiosApi.post("api/v1/auth/logout");

        } finally {
            setNewAccessToken(null)
        }
    }

    return (<AuthContext.Provider value={{ accessToken, setNewAccessToken, user, signin, signout, signup, loading }}>
        {!loading && children}
    </AuthContext.Provider>)

}


export const useAuth = () => useContext(AuthContext);
