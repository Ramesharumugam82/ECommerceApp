import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser , clearMessages as clearLoginMessages } from '../features/login_Slice';
import { registerUser , clearMessages as clearRegisterMessages } from '../features/register_Slice';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading: loginLoading, error: loginError, successMessage: loginSuccess, userInfo } = useSelector((state) => state.login);
    const { loading: registerLoading, error: registerError, successMessage: registerSuccess } = useSelector((state) => state.register);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistering) {
            if (password !== confirmPassword) {
                setConfirmPasswordError('Passwords do not match!');
                return;
            }
            setConfirmPasswordError('');
            const registrationData = { name, username, email: username, password };
            dispatch(registerUser (registrationData));
        } else {
            const userData = { username, password };
            handleLogin(userData); // Call the login logic
        }
    };

    const handleLogin = async (credentials) => {
        // Dispatch the login action
        await dispatch(loginUser (credentials));
    };

    useEffect(() => {
        if (userInfo) {
            navigate('/'); // Redirect to home if user is logged in
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isRegistering) {
                dispatch(clearRegisterMessages());
            } else {
                dispatch(clearLoginMessages());
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [loginSuccess, loginError, registerSuccess, registerError, dispatch, isRegistering]);

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ height: '70vh', backgroundColor: '#f8f9fa' }}>
            <Row className="w-100">
                <Col md={6} className="mx-auto">
                    <div className="border rounded p-4 shadow-sm bg-white">
                        <h2 className="text-center mb-4">{isRegistering ? 'Register New User' : 'Login User'}</h2>
                        {registerSuccess && isRegistering && (
                            <Alert variant="success">You have registered successfully! Now you can log in.</Alert>
                        )}
                        {loginSuccess && !isRegistering && <Alert variant="success">{loginSuccess}</Alert>}
                        {(loginError || registerError) && <Alert variant="danger">{loginError || registerError}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            {isRegistering && (
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            )}
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username / Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your username or email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target .value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </Form.Group>
                            {isRegistering && (
                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {confirmPasswordError && (
                                        <Form.Text className="text-danger">{confirmPasswordError}</Form.Text>
                                    )}
                                </Form.Group>
                            )}
                            <Button
                                className="my-2 w-100"
                                variant="primary"
                                type="submit"
                                disabled={loginLoading || registerLoading}
                            >
                                {loginLoading || registerLoading
                                    ? 'Loading...'
                                    : isRegistering
                                    ? 'Register'
                                    : 'Login'}
                            </Button>
                        </Form>
                        <Button
                            variant="link"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="mt-2"
                        >
                            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;