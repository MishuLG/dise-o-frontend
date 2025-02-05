import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CImage,
  CFormSelect,
} from '@coreui/react';
import API_URL from '../../../config';

const Profile = ({ currentUser, setUsers }) => {
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [numberTlf, setNumberTlf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  const usersUrl = `${API_URL}/users`;

  useEffect(() => {
    if (currentUser) {
      fetch(`${usersUrl}/${currentUser.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error in server response');
          }
          return response.json();
        })
        .then((data) => {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setDni(data.dni);
          setNumberTlf(data.number_tlf);
          setEmail(data.email);
          setDateOfBirth(data.date_of_birth);
          setGender(data.gender);
          setProfilePic(data.profilePic || 'https://via.placeholder.com/150');
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [currentUser, usersUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !dni || !numberTlf || !email || !dateOfBirth || !gender) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedUser = {
      id: currentUser.id,
      first_name: firstName,
      last_name: lastName,
      dni,
      number_tlf: numberTlf,
      email,
      password,
      date_of_birth: dateOfBirth,
      gender,
      profilePic,
    };

    fetch(`${usersUrl}/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in server response');
        }
        return response.json();
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user))
        );
        alert('Profile updated successfully!');
      })
      .catch((error) => console.error('Error updating user data:', error));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`${usersUrl}/${currentUser.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error in server response');
          }
          return response.json();
        })
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== currentUser.id));
          alert('User deleted successfully!');
        })
        .catch((error) => console.error('Error deleting user:', error));
    }
  };

  return (
    <CCard>
      <CCardHeader>User Profile</CCardHeader>
      <CCardBody>
        <div className="text-center mb-4">
          <CImage src={profilePic} className="img-thumbnail" width="150" height="150" alt="Profile" />
          <div>
            <CFormInput
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-photo"
            />
            <CButton color="primary" size="sm" className="mt-2" onClick={() => document.getElementById('upload-photo').click()}>
              Change photo
            </CButton>
          </div>
        </div>

        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel>First Name</CFormLabel>
            <CFormInput
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Last Name</CFormLabel>
            <CFormInput
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>DNI</CFormLabel>
            <CFormInput
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="DNI"
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Phone Number</CFormLabel>
            <CFormInput
              type="tel"
              value={numberTlf}
              onChange={(e) => setNumberTlf(e.target.value)}
              placeholder="Phone Number"
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Date of Birth</CFormLabel>
            <CFormInput
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Gender</CFormLabel>
            <CFormSelect value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Password</CFormLabel>
            <CFormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
            />
          </div>
          <CButton color="success" type="submit" className="mt-3">
            Save Changes
          </CButton>
          <CButton color="danger" className="mt-3 ms-2" onClick={handleDelete}>
            Delete User
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Profile;