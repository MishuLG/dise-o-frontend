import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
} from '@coreui/react';
import API_URL from '../../../config';  

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    id_class_schedules: '',
    id_school_year: '',
    name_subject: '',
    description_subject: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [filter, setFilter] = useState({ name_subject: '', id_school_year: '' });

  const subjectsUrl = `${API_URL}/subjects`;

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(subjectsUrl);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.error('Received data is not an array:', data);
        alert('Error: Invalid data received.');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('An error occurred while fetching subjects. Please try again.');
    }
  };

  const handleSaveSubject = async () => {
    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `${subjectsUrl}/${selectedSubject.id_subject}` : subjectsUrl;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      fetchSubjects();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
      alert('An error occurred while saving the subject. Please try again.');
    }
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      id_class_schedules: subject.id_class_schedules,
      id_school_year: subject.id_school_year,
      name_subject: subject.name_subject,
      description_subject: subject.description_subject,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteSubject = async (id) => {
    try {
      const response = await fetch(`${subjectsUrl}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('An error occurred while deleting the subject. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      id_class_schedules: '',
      id_school_year: '',
      name_subject: '',
      description_subject: '',
    });
    setEditMode(false);
    setSelectedSubject(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name_subject.toLowerCase().includes(filter.name_subject.toLowerCase()) &&
      subject.id_school_year.toString().includes(filter.id_school_year)
  );

  return (
    <CCard>
      <CCardHeader>
        <h5>Subjects</h5>
        <CButton color="success" onClick={() => setShowModal(true)}>
          Add Subject
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormInput
            placeholder="Filter by subject name"
            name="name_subject"
            value={filter.name_subject}
            onChange={handleFilterChange}
            className="mb-2"
          />
          <CFormInput
            placeholder="Filter by school year ID"
            name="id_school_year"
            value={filter.id_school_year}
            onChange={handleFilterChange}
          />
        </div>
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Subject ID</CTableHeaderCell>
              <CTableHeaderCell>Class Schedule ID</CTableHeaderCell>
              <CTableHeaderCell>School Year ID</CTableHeaderCell>
              <CTableHeaderCell>Subject Name</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
              <CTableHeaderCell>Updated At</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredSubjects.map((subject) => (
              <CTableRow key={subject.id_subject}>
                <CTableDataCell>{subject.id_subject}</CTableDataCell>
                <CTableDataCell>{subject.id_class_schedules}</CTableDataCell>
                <CTableDataCell>{subject.id_school_year}</CTableDataCell>
                <CTableDataCell>{subject.name_subject}</CTableDataCell>
                <CTableDataCell>{subject.description_subject}</CTableDataCell>
                <CTableDataCell>{subject.created_at}</CTableDataCell>
                <CTableDataCell>{subject.updated_at}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="warning" size="sm" onClick={() => handleEditSubject(subject)}>
                    Edit
                  </CButton>{' '}
                  <CButton color="danger" size="sm" onClick={() => handleDeleteSubject(subject.id_subject)}>
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CModal visible={showModal} onClose={handleCloseModal}>
          <CModalHeader>
            <CModalTitle>{editMode ? 'Edit Subject' : 'Add Subject'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                type="text"
                label="Class Schedule ID"
                value={formData.id_class_schedules}
                onChange={(e) => setFormData({ ...formData, id_class_schedules: e.target.value })}
                required
              />
              <CFormInput
                type="text"
                label="School Year ID"
                value={formData.id_school_year}
                onChange={(e) => setFormData({ ...formData, id_school_year: e.target.value })}
                required
              />
              <CFormInput
                type="text"
                label="Subject Name"
                value={formData.name_subject}
                onChange={(e) => setFormData({ ...formData, name_subject: e.target.value })}
                required
              />
              <CFormTextarea
                label="Description"
                value={formData.description_subject}
                onChange={(e) => setFormData({ ...formData, description_subject: e.target.value })}
                rows="3"
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={handleSaveSubject}>
              Save
            </CButton>
            <CButton color="secondary" onClick={handleCloseModal}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default Subjects;
