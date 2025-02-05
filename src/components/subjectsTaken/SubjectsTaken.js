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
} from '@coreui/react';
import API_URL from '../../../config';  

const SubjectsTaken = () => {
  const [subjectsTaken, setSubjectsTaken] = useState([]);
  const [formData, setFormData] = useState({
    id_student: '',
    id_subject: '',
    id_school_year: '',
    final_grade: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSubjectTaken, setSelectedSubjectTaken] = useState(null);
  const [filter, setFilter] = useState({ id_student: '', id_school_year: '' });

  const subjectsTakenUrl = `${API_URL}/subjects_taken`;

  useEffect(() => {
    fetchSubjectsTaken();
  }, []);

  const fetchSubjectsTaken = async () => {
    try {
      const response = await fetch(subjectsTakenUrl);
      if (!response.ok) {
        throw new Error('Red response error');
      }
      const data = await response.json();
      setSubjectsTaken(data);
    } catch (error) {
      console.error('Error getting the subjects taken:', error);
      alert('An error occurred while obtaining the subjects taken. Please try again.');
    }
  };

  const handleSaveSubjectTaken = async () => {
    try {
      const url = editMode ? `${subjectsTakenUrl}/${selectedSubjectTaken.id_subject_taken}` : subjectsTakenUrl;
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response error');
      }

      fetchSubjectsTaken();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error when saving the subject taken:', error);
      alert('An error occurred while saving the course taken. Please try again.');
    }
  };

  const handleEditSubjectTaken = (subjectTaken) => {
    setSelectedSubjectTaken(subjectTaken);
    setFormData({
      id_student: subjectTaken.id_student,
      id_subject: subjectTaken.id_subject,
      id_school_year: subjectTaken.id_school_year,
      final_grade: subjectTaken.final_grade,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteSubjectTaken = async (id) => {
    try {
      const response = await fetch(`${subjectsTakenUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response error');
      }

      fetchSubjectsTaken();
    } catch (error) {
      console.error('Error when deleting the taken subject:', error);
      alert('An error occurred while deleting the taken subject. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      id_student: '',
      id_subject: '',
      id_school_year: '',
      final_grade: '',
    });
    setEditMode(false);
    setSelectedSubjectTaken(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredSubjectsTaken = subjectsTaken.filter(
    (subjectTaken) =>
      subjectTaken.id_student.toString().includes(filter.id_student) &&
      subjectTaken.id_school_year.toString().includes(filter.id_school_year)
  );

  return (
    <CCard>
      <CCardHeader>
        <h5>Subjects Taken</h5>
        <CButton color="success" onClick={() => setShowModal(true)}>
        Add Subject Taken
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormInput
            placeholder="Filter by student ID"
            name="id_student"
            value={filter.id_student}
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
              <CTableHeaderCell>ID Subject Taken</CTableHeaderCell>
              <CTableHeaderCell>ID Student</CTableHeaderCell>
              <CTableHeaderCell>ID Subject</CTableHeaderCell>
              <CTableHeaderCell>ID School year</CTableHeaderCell>
              <CTableHeaderCell>Final Qualification</CTableHeaderCell>
              <CTableHeaderCell>Created at</CTableHeaderCell>
              <CTableHeaderCell>updated at</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredSubjectsTaken.map((subjectTaken) => (
              <CTableRow key={subjectTaken.id_subject_taken}>
                <CTableDataCell>{subjectTaken.id_subject_taken}</CTableDataCell>
                <CTableDataCell>{subjectTaken.id_student}</CTableDataCell>
                <CTableDataCell>{subjectTaken.id_subject}</CTableDataCell>
                <CTableDataCell>{subjectTaken.id_school_year}</CTableDataCell>
                <CTableDataCell>{subjectTaken.final_grade}</CTableDataCell>
                <CTableDataCell>{subjectTaken.created_at}</CTableDataCell>
                <CTableDataCell>{subjectTaken.updated_at}</CTableDataCell>
                <CTableDataCell>
                  {/*<CButton
                    color="warning"
                    size="sm"
                    onClick={() => handleEditSubjectTaken(subjectTaken)}
                  >
                     Editar 
                  </CButton>{' '}*/}
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteSubjectTaken(subjectTaken.id_subject_taken)}
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CModal visible={showModal} onClose={handleCloseModal}>
          <CModalHeader>
            <CModalTitle>{editMode ? 'Edit Subject Taken' : 'Add Subject Taken'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                type="text"
                label="Student ID"
                value={formData.id_student}
                onChange={(e) => setFormData({ ...formData, id_student: e.target.value })}
                required
              />
              <CFormInput
                type="text"
                label="Subject ID"
                value={formData.id_subject}
                onChange={(e) => setFormData({ ...formData, id_subject: e.target.value })}
                required
              />
              <CFormInput
                type="text"
                label="ID School Year"
                value={formData.id_school_year}
                onChange={(e) => setFormData({ ...formData, id_school_year: e.target.value })}
                required
              />
              <CFormInput
                type="number"
                label="Final Qualification"
                value={formData.final_grade}
                onChange={(e) => setFormData({ ...formData, final_grade: e.target.value })}
                required
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={handleSaveSubjectTaken}>
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

export default SubjectsTaken;
