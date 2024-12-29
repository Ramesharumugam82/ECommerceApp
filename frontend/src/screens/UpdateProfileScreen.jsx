// components/UpdateProfileScreen.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../features/fetchProfileSlice';
import { updateUserProfile, clearMessages } from '../features/updateProfileSlice';
import { Form, Button, Alert, Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const UpdateProfileScreen = () => {
    const dispatch = useDispatch();
    const { userInfo, loading: fetchLoading, error } = useSelector((state) => state.fetchProfile);
    const { loading: updateLoading, successMessage } = useSelector((state) => state.updateProfile);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(clearMessages());
        dispatch(fetchUserProfile()); // Fetch user profile when component mounts
    }, [dispatch]);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
        }
    }, [userInfo]);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        if (isEditing) {
            const userData = new FormData(); // Use FormData for multipart/form-data
            userData.append('name', name);
            userData.append('email', email);
            userData.append('password', password); // Include password (can be blank)
            userData.append('confirmPassword', confirmPassword); // Include confirm password (can be blank)

            dispatch(updateUserProfile(userData)); // Dispatch the update action
        }
        setIsEditing(!isEditing); // Toggle edit mode
    };

    return (
        <Container>
            <h2>Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{isEditing ? 'Edit Profile' : 'Profile Details'}</Card.Title>
                            {fetchLoading ? ( // Show loading spinner while fetching
                                <Spinner animation="border" />
                            ) : (
                                <Form onSubmit={handleUpdateProfile}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            readOnly={!isEditing}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            readOnly={!isEditing}
                                        />
                                    </Form.Group>
                                    {isEditing && (
                                        <>
                                            <Form.Group controlId="formPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter new password (leave blank to keep current)"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formConfirmPassword">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                        </>
                                    )}
                                    <Button variant="primary" type="submit" disabled={fetchLoading || updateLoading}>
                                        {updateLoading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setName(userInfo.name || '');
                                                setEmail(userInfo.email || '');
                                                setPassword('');
                                                setConfirmPassword(''); // Reset confirm password
                                            }}
                                            className="ml-2"
                                        >
 Cancel
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateProfileScreen;