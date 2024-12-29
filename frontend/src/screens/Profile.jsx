import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../features/updateSlice';
import { fetchUserProfile } from '../features/profileSlice';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const Profile = () => {
    const dispatch = useDispatch();
    const { profileData, loading, error, successMessage } = useSelector((state) => state.update);
    const { userInfo } = useSelector((state) => state.update);
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo')).token
            : null;

        if (token) {
            dispatch(fetchUserProfile(token));
        }
    }, [dispatch]);

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                password: '',
            });
        }
    }, [profileData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        const token = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo')).token
            : null;

        if (token) {
            dispatch(updateUserProfile({ token, userData: formData }));
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: profileData.name || '',
            email: profileData.email || '',
            password: '',
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container>
            <h1>Profile</h1>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </Form.Group>
                {isEditing && (
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                )}
                {isEditing ? (
                    <>
                        <Button variant="success" onClick={handleUpdate} className="me-2">
                            Update
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                )}
            </Form>
        </Container>
    );
};
export default Profile;
