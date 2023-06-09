import React, { useRef, useState } from "react";
import { auth } from "../firebase";
import "./SignupScreen.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";


function SignupScreen() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false); // Add state to track whether it's sign-up or sign-in

    const showErrorPopup = (message) => {
        setPopupOpen(true);
        setPopupMessage(message);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignUp) {
            // Sign up logic
            auth
                .createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
                .then((authUser) => {
                    dispatch(login({
                        email: authUser.user.email,
                        uid: authUser.user.uid,
                    }));
                    navigate("/home");
                })
                .catch((error) => {
                    showErrorPopup(error.message);
                });
        } else {
            // Sign in logic
            auth
                .signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
                .then((authUser) => {
                    dispatch(login({
                        email: authUser.user.email,
                        uid: authUser.user.uid,
                    }));
                    navigate("/home");
                })
                .catch((error) => showErrorPopup(error.message));
        }
    };

    const signInDemoUser = () => {
        const demoEmail = "test123@gmail.com";
        const demoPassword = "123456";

        emailRef.current.value = demoEmail;
        passwordRef.current.value = demoPassword;

        auth
            .signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((authUser) => {
                dispatch(login({
                    email: authUser.user.email,
                    uid: authUser.user.uid,
                }));
                navigate("/home");
            })
            .catch((error) => showErrorPopup(error.message));
    };

    const toggleForm = () => {
        setIsSignUp((prevState) => !prevState); // Toggle between sign-up and sign-in form
    };




    return (
        <div className="signupScreen">
            <form onSubmit={handleSubmit}>
                <h1>{!isSignUp ? "Sign Up" : "Sign In"}</h1>

                <input style={{ fontSize: "16px" }} ref={emailRef} placeholder="Email" type="email" />
                <input style={{ fontSize: "16px" }} ref={passwordRef} placeholder="Password" type="password" />
                <button type="submit">{!isSignUp ? "Sign Up" : "Sign In"}</button>
                {isSignUp && (
                    <button type="button" onClick={signInDemoUser}>
                        Demo User
                    </button>
                )}
                <h4>
                    <span className="signupScreen__gray">
                        {!isSignUp ? "Already have an account? " : "New to MovieLand? "}
                    </span>
                    <span className="signupScreen__link" onClick={toggleForm}>
                        {!isSignUp ? "Sign In now." : "Sign Up now."}
                    </span>
                </h4>
            </form>
            {popupOpen && (
                <div
                    className="popup"
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'black',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        maxWidth: '400px',
                    }}
                >
                    <div className="popup-content">
                        <p style={{ marginBottom: '16px',fontSize:"15px" }}>{popupMessage}</p>
                        <button
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignupScreen;
