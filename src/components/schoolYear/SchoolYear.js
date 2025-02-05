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
  CFormSelect,
} from '@coreui/react';
import API_URL from '../../../config';  

const SchoolYear = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [formData, setFormData] = useState({
    school_grade: '',
    start_year: '',
    end_of_year: '',
    number_of_school_days: '',
    scheduled_vacation: '',
    special_events: '',
    school_year_status: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const [filter, setFilter] = useState({ school_grade: '', school_year_status: '' });

  const schoolYearsUrl = `${API_URL}/school_years`;

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const fetchSchoolYears = async () => {
    try {
      const response = await fetch(schoolYearsUrl);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSchoolYears(data);
      } else {
        console.error('Received data is not an array:', data);
        alert('Error: Received data is not valid.');
      }
    } catch (error) {
      console.error('Error fetching school years:', error);
      alert('An error occurred while fetching school years. Please try again.');
    }
  };

  const handleSaveSchoolYear = async () => {
    if (!formData.start_year || !formData.end_of_year || !formData.scheduled_vacation || !formData.special_events) {
      alert("Please complete all date fields.");
      return;
    }

    const formattedData = {
      ...formData,
      start_year: new Date(formData.start_year).toISOString().split('T')[0],
      end_of_year: new Date(formData.end_of_year).toISOString().split('T')[0],
      scheduled_vacation: new Date(formData.scheduled_vacation).toISOString().split('T')[0],
      special_events: new Date(formData.special_events).toISOString().split('T')[0],
    };

    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `${schoolYearsUrl}/${selectedSchoolYear.id_school_year}` : schoolYearsUrl;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      fetchSchoolYears();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving school year:', error);
      alert('An error occurred while saving the school year. Please try again.');
    }
  };

  const handleEditSchoolYear = (schoolYear) => {
    setSelectedSchoolYear(schoolYear);
    setFormData({
      school_grade: schoolYear.school_grade,
      start_year: schoolYear.start_year,
      end_of_year: schoolYear.end_of_year,
      number_of_school_days: schoolYear.number_of_school_days,
      scheduled_vacation: schoolYear.scheduled_vacation,
      special_events: schoolYear.special_events,
      school_year_status: schoolYear.school_year_status,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteSchoolYear = async (id) => {
    try {
      const response = await fetch(`${schoolYearsUrl}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      fetchSchoolYears();
    } catch (error) {
      console.error('Error deleting school year:', error);
      alert('An error occurred while deleting the school year. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      school_grade: '',
      start_year: '',
      end_of_year: '',
      number_of_school_days: '',
      scheduled_vacation: '',
      special_events: '',
      school_year_status: '',
    });
    setEditMode(false);
    setSelectedSchoolYear(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredSchoolYears = schoolYears.filter(
    (schoolYear) =>
      schoolYear.school_grade.toLowerCase().includes(filter.school_grade.toLowerCase()) &&
      schoolYear.school_year_status.toLowerCase().includes(filter.school_year_status.toLowerCase())
  );

  return (
    <CCard>
      <CCardHeader>
        <h5>School Years</h5>
        <CButton color="success" onClick={() => setShowModal(true)}>
          Add School Year
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormInput
            placeholder="Filter by grade"
            name="school_grade"
            value={filter.school_grade}
            onChange={handleFilterChange}
            className="mb-2"
          />
          <CFormInput
            placeholder="Filter by status"
            name="school_year_status"
            value={filter.school_year_status}
            onChange={handleFilterChange}
          />
        </div>
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>School Year ID</CTableHeaderCell>
              <CTableHeaderCell>Grade</CTableHeaderCell>
              <CTableHeaderCell>Start Year</CTableHeaderCell>
              <CTableHeaderCell>End Year</CTableHeaderCell>
              <CTableHeaderCell>School Days</CTableHeaderCell>
              <CTableHeaderCell>Scheduled Vacations</CTableHeaderCell>
              <CTableHeaderCell>Special Events</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredSchoolYears.map((schoolYear) => (
              <CTableRow key={schoolYear.id_school_year}>
                <CTableDataCell>{schoolYear.id_school_year}</CTableDataCell>
                <CTableDataCell>{schoolYear.school_grade}</CTableDataCell>
                <CTableDataCell>{schoolYear.start_year}</CTableDataCell>
                <CTableDataCell>{schoolYear.end_of_year}</CTableDataCell>
                <CTableDataCell>{schoolYear.number_of_school_days}</CTableDataCell>
                <CTableDataCell>{schoolYear.scheduled_vacation}</CTableDataCell>
                <CTableDataCell>{schoolYear.special_events}</CTableDataCell>
                <CTableDataCell>{schoolYear.school_year_status}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="warning" size="sm" onClick={() => handleEditSchoolYear(schoolYear)}>
                    Edit
                  </CButton>{' '}
                  <CButton color="danger" size="sm" onClick={() => handleDeleteSchoolYear(schoolYear.id_school_year)}>
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable> 
        <CModal visible={showModal} onClose={handleCloseModal}>
          <CModalHeader>
            <CModalTitle>{editMode ? 'Edit School Year' : 'Add School Year'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput type="text" label="Grade" value={formData.school_grade} onChange={(e) => setFormData({ ...formData, school_grade: e.target.value })} required />
              <CFormInput type="date" label="Start Year" value={formData.start_year} onChange={(e) => setFormData({ ...formData, start_year: e.target.value })} required />
              <CFormInput type="date" label="End Year" value={formData.end_of_year} onChange={(e) => setFormData({ ...formData, end_of_year: e.target.value })} required />
              <CFormInput type="number" label="School Days" value={formData.number_of_school_days} onChange={(e) => setFormData({ ...formData, number_of_school_days: e.target.value })} required />
              <CFormSelect label="Status" value={formData.school_year_status} onChange={(e) => setFormData({ ...formData, school_year_status: e.target.value })} required>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={handleSaveSchoolYear}>
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

export default SchoolYear;
