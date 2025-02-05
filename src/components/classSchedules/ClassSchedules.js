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
  CFormSelect,
} from '@coreui/react';
import API_URL from '../../../config';

const ClassSchedules = () => {
  const [classSchedules, setClassSchedules] = useState([]);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    classroom: '',
    start_time: '',
    end_time: '',
    unforeseen_events: '',
    day_of_week: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filter, setFilter] = useState({ day_of_week: '', classroom: '' });

  const classSchedulesUrl = `${API_URL}/class_schedules`;

  useEffect(() => {
    fetchClassSchedules();
  }, []);

  const fetchClassSchedules = async () => {
    try {
      const response = await fetch(classSchedulesUrl);
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedData = data.map(schedule => ({
          ...schedule,
          day_of_week: schedule.day_of_week || '',
          classroom: schedule.classroom || '',
        }));
        setClassSchedules(formattedData);
      } else {
        console.error('Received data is not an array:', data);
        alert('Error: Received data is not valid.');
      }
    } catch (error) {
      console.error('Error fetching class schedules:', error);
      alert('An error occurred while fetching class schedules. Please try again.');
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode ? `${classSchedulesUrl}/${selectedSchedule.id_class_schedules}` : classSchedulesUrl;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error in server response');
      }

      fetchClassSchedules();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('An error occurred while saving the schedule. Please try again.');
    }
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      start_date: schedule.start_date,
      end_date: schedule.end_date,
      classroom: schedule.classroom,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      unforeseen_events: schedule.unforeseen_events,
      day_of_week: schedule.day_of_week,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const response = await fetch(`${classSchedulesUrl}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Error in server response');
      }

      fetchClassSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('An error occurred while deleting the schedule. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      start_date: '',
      end_date: '',
      classroom: '',
      start_time: '',
      end_time: '',
      unforeseen_events: '',
      day_of_week: '',
    });
    setEditMode(false);
    setSelectedSchedule(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredSchedules = classSchedules.filter(
    (schedule) =>
      (schedule.day_of_week ? schedule.day_of_week.toLowerCase().includes(filter.day_of_week.toLowerCase()) : false) &&
      (schedule.classroom ? schedule.classroom.toLowerCase().includes(filter.classroom.toLowerCase()) : false)
  );

  return (
    <CCard>
      <CCardHeader>
        <h5>Class Schedules</h5>
        <CButton color="success" onClick={() => setShowModal(true)}>
          Add Schedule
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormInput
            placeholder="Filter by day of the week"
            name="day_of_week"
            value={filter.day_of_week}
            onChange={handleFilterChange}
            className="mb-2"
          />
          <CFormInput
            placeholder="Filter by classroom"
            name="classroom"
            value={filter.classroom}
            onChange={handleFilterChange}
          />
        </div>
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Start Date</CTableHeaderCell>
              <CTableHeaderCell>End Date</CTableHeaderCell>
              <CTableHeaderCell>Classroom</CTableHeaderCell>
              <CTableHeaderCell>Start Time</CTableHeaderCell>
              <CTableHeaderCell>End Time</CTableHeaderCell>
              <CTableHeaderCell>Unforeseen Events</CTableHeaderCell>
              <CTableHeaderCell>Day of the Week</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
              <CTableHeaderCell>Updated At</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredSchedules.map((schedule) => (
              <CTableRow key={schedule.id_class_schedules}>
                <CTableDataCell>{schedule.id_class_schedules}</CTableDataCell>
                <CTableDataCell>{schedule.start_date}</CTableDataCell>
                <CTableDataCell>{schedule.end_date}</CTableDataCell>
                <CTableDataCell>{schedule.classroom}</CTableDataCell>
                <CTableDataCell>{schedule.start_time}</CTableDataCell>
                <CTableDataCell>{schedule.end_time}</CTableDataCell>
                <CTableDataCell>{schedule.unforeseen_events}</CTableDataCell>
                <CTableDataCell>{schedule.day_of_week}</CTableDataCell>
                <CTableDataCell>{schedule.created_at}</CTableDataCell>
                <CTableDataCell>{schedule.updated_at}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="warning"
                    size="sm"
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    Edit
                  </CButton>{' '}
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule.id_class_schedules)}
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
            <CModalTitle>{editMode ? 'Edit Schedule' : 'Add Schedule'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                type="date"
                label="Start Date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
              <CFormInput
                type="date"
                label="End Date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
              <CFormInput
                type="text"
                label="Classroom"
                value={formData.classroom}
                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                required
              />
              <CFormInput
                type="time"
                label="Start Time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
              <CFormInput
                type="time"
                label="End Time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
              <CFormTextarea
                label="Unforeseen Events"
                value={formData.unforeseen_events}
                onChange={(e) => setFormData({ ...formData, unforeseen_events: e.target.value })}
                rows="3"
              />
              <CFormSelect
                label="Day of the Week"
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                required
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </CFormSelect>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={handleSaveSchedule}>
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

export default ClassSchedules;
