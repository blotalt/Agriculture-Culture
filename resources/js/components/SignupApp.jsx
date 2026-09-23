import React from 'react';

export default function SignupApp() {
    return (
        <>
            <style>{`
                .signup-react-wrap {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 18px;
                    background: linear-gradient(rgba(46, 91, 38, 0.85), rgba(46, 91, 38, 0.85)), url('/images/rice_field_bg.jpg') center/cover no-repeat;
                    color: #1f2937;
                    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
                }
                .signup-react-card {
                    width: min(760px, 100%);
                    background: #fff;
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 0 28px 60px rgba(0,0,0,.18);
                }
                .signup-react-header {
                    background: #2e5b26;
                    color: #fff;
                    text-align: center;
                    padding: 28px 20px 22px;
                }
                .signup-react-header svg {
                    display: block;
                    margin: 0 auto 12px;
                }
                .signup-react-header h2 {
                    margin: 0 0 4px;
                    font-size: clamp(2rem, 4vw, 2.4rem);
                    font-family: Georgia, "Times New Roman", serif;
                    letter-spacing: 0.08em;
                }
                .signup-react-header p {
                    margin: 0;
                    opacity: .8;
                    font-size: .92rem;
                }
                .signup-react-body {
                    padding: 26px 26px 18px;
                }
                .signup-react-form {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0,1fr));
                    gap: 22px;
                }
                .field-group { display: grid; gap: 8px; }
                .field-group.full { grid-column: 1 / -1; }
                .signup-react-label {
                    font-weight: 700;
                    color: #1f2937;
                    font-size: .9rem;
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
                .signup-react-input {
                    width: 100%;
                    border: none;
                    background: transparent;
                    color: #111827;
                    padding: 15px 16px 15px 0;
                    font-size: 1rem;
                    outline: none;
                }
                .signup-react-check {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #4b5563;
                    font-size: .9rem;
                    margin-top: 8px;
                }
                .signup-react-check input { width: 16px; height: 16px; }
                .signup-react-button {
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
                    margin-top: 10px;
                }
                .signup-react-footer {
                    text-align: center;
                    padding: 0 0 22px;
                    color: #4b5563;
                    font-size: .92rem;
                }
                .signup-react-footer a {
                    color: #d6a63b;
                    text-decoration: none;
                    font-weight: 800;
                }
                @media (max-width: 700px) {
                    .signup-react-form { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="signup-react-wrap">
                <div className="signup-react-card">
                    <div className="signup-react-header">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e9af2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2 22s11.5-1.5 14-11.5S15 2 15 2s-1.5 7.5-11.5 10S2 22 2 22z"></path>
                            <path d="M9 13c1.5-1.5 4-2.5 4-2.5s-1-2.5-2.5-4"></path>
                            <path d="M6 16c1.5-1.5 4-2.5 4-2.5s-1-2.5-2.5-4"></path>
                        </svg>
                        <h2>SIGN UP</h2>
                        <p>Don&apos;t have an account yet? Sign up here!</p>
                    </div>

                    <div className="signup-react-body">
                        <form action="/register" method="post" className="signup-react-form">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />

                            <div className="field-group">
                                <label className="signup-react-label">Username</label>
                                <div className="input-wrap">
                                    <span className="icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </span>
                                    <input className="signup-react-input" type="text" name="name" placeholder="Username" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="signup-react-label">E-mail</label>
                                <div className="input-wrap">
                                    <span className="icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </span>
                                    <input className="signup-react-input" type="email" name="email" placeholder="E-mail" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="signup-react-label">Password</label>
                                <div className="input-wrap">
                                    <span className="icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </span>
                                    <input className="signup-react-input" type="password" name="password" placeholder="Password" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="signup-react-label">Repeat Password</label>
                                <div className="input-wrap">
                                    <span className="icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </span>
                                    <input className="signup-react-input" type="password" name="password_confirmation" placeholder="Repeat Password" required />
                                </div>
                            </div>

                            <div className="field-group full">
                                <label className="signup-react-check">
                                    <input type="checkbox" name="terms" required />
                                    <span>I agree to the <a href="#" style={{ color: '#d6a63b', textDecoration: 'none', fontWeight: 700 }}>Terms of Service</a> and <a href="#" style={{ color: '#d6a63b', textDecoration: 'none', fontWeight: 700 }}>Privacy Policy</a></span>
                                </label>
                            </div>

                            <div className="field-group full">
                                <button type="submit" className="signup-react-button">SIGN UP</button>
                            </div>
                        </form>
                    </div>

                    <div className="signup-react-footer">
                        <span>Already have an account? </span>
                        <a href="/login">Sign In</a>
                    </div>
                </div>
            </div>
        </>
    );
}
