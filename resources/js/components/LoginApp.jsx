import React from 'react';

export default function LoginApp() {
    return (
        <>
            <style>{`
                .login-react-wrap {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 18px;
                    background: linear-gradient(rgba(46, 91, 38, 0.85), rgba(46, 91, 38, 0.85)), url('/images/rice_field_bg.jpg') center/cover no-repeat;
                    color: #1f2937;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .login-react-card {
                    width: min(520px, 100%);
                    background: #fff;
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 0 28px 60px rgba(0,0,0,.18);
                }
                .login-react-header {
                    background: #2e5b26;
                    color: #fff;
                    text-align: center;
                    padding: 28px 20px 22px;
                }
                .login-react-header svg {
                    display: block;
                    margin: 0 auto 12px;
                }
                .login-react-header h2 {
                    margin: 0 0 4px;
                    font-size: clamp(2rem, 4vw, 2.4rem);
                    font-family: Georgia, "Times New Roman", serif;
                    letter-spacing: 0.08em;
                }
                .login-react-header p {
                    margin: 0;
                    opacity: .8;
                    font-size: .92rem;
                }
                .login-react-body {
                    padding: 26px 26px 18px;
                }
                .login-react-form {
                    display: grid;
                    gap: 22px;
                }
                .field-group { display: grid; gap: 8px; }
                .label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                }
                .login-react-label {
                    font-weight: 700;
                    color: #1f2937;
                    font-size: .9rem;
                }
                .login-react-link {
                    color: #d6a63b;
                    text-decoration: none;
                    font-size: .8rem;
                    font-weight: 700;
                }
                .input-wrap {
                    display: flex;
                    align-items: center;
                    background: #f4edd4;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .input-wrap .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 52px;
                    color: #7a7561;
                    flex-shrink: 0;
                }
                .login-react-input {
                    width: 100%;
                    border: none;
                    background: transparent;
                    color: #111827;
                    padding: 15px 16px 15px 0;
                    font-size: 1rem;
                    outline: none;
                }
                .login-react-check {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #4b5563;
                    font-size: .9rem;
                }
                .login-react-check input {
                    width: 16px;
                    height: 16px;
                }
                .login-react-button {
                    width: 100%;
                    border: none;
                    border-radius: 12px;
                    background: #e9af2a;
                    color: #1f2937;
                    font-weight: 800;
                    font-size: 1rem;
                    padding: 16px 18px;
                    cursor: pointer;
                    letter-spacing: 0.06em;
                }
                .login-react-footer {
                    text-align: center;
                    padding: 0 0 22px;
                    color: #4b5563;
                    font-size: .92rem;
                }
                .login-react-footer a {
                    color: #d6a63b;
                    text-decoration: none;
                    font-weight: 800;
                }
            `}</style>

            <div className="login-react-wrap">
                <div className="login-react-card">
                    <div className="login-react-header">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e9af2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2 22s11.5-1.5 14-11.5S15 2 15 2s-1.5 7.5-11.5 10S2 22 2 22z"></path>
                            <path d="M9 13c1.5-1.5 4-2.5 4-2.5s-1-2.5-2.5-4"></path>
                            <path d="M6 16c1.5-1.5 4-2.5 4-2.5s-1-2.5-2.5-4"></path>
                        </svg>
                        <h2>LOGIN</h2>
                        <p>Log in here!</p>
                    </div>

                    <div className="login-react-body">
                        <form action="/login" method="post" className="login-react-form">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />

                            <div className="field-group">
                                <label className="login-react-label">Username</label>
                                <div className="input-wrap">
                                    <span className="icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </span>
                                    <input className="login-react-input" type="text" name="loginname" placeholder="Username" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <div className="label-row">
                                    <label className="login-react-label">Password</label>
                                    <a className="login-react-link" href="#">Forgot Password?</a>
                                </div>
                                <div className="input-wrap">
                                    <span className="icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </span>
                                    <input className="login-react-input" type="password" name="loginpassword" placeholder="Password" required />
                                </div>
                            </div>

                            <label className="login-react-check">
                                <input type="checkbox" name="remember" />
                                <span>Remember me on this device</span>
                            </label>

                            <button type="submit" className="login-react-button">LOGIN</button>
                        </form>
                    </div>

                    <div className="login-react-footer">
                        <span>Don&apos;t have an account yet? </span>
                        <a href="/signup">Create Account</a>
                    </div>
                </div>
            </div>
        </>
    );
}
