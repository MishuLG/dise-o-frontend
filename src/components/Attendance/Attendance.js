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

const Asistencia = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [formData, setFormData] = useState({
    id_estudiante: '',
    id_seccion: '',
    fecha_asistencia: '',
    estado: '',
    observaciones: '',
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState({ id_estudiante: '', fecha_asistencia: '' });


  const asistenciaUrl = `${API_URL}/attendance`;

  useEffect(() => {
    obtenerAsistencias();
  }, []);

  const obtenerAsistencias = async () => {
    try {
      const respuesta = await fetch(asistenciaUrl);
      const datos = await respuesta.json();
      setAsistencias(datos);
    } catch (error) {
      console.error('Error al obtener los registros de asistencia:', error);
      alert('Ocurrió un error al obtener los registros de asistencia. Por favor, inténtalo de nuevo.');
    }
  };

  const guardarAsistencia = async () => {
    try {
      const metodo = modoEdicion ? 'PUT' : 'POST';
      const url = modoEdicion ? `${asistenciaUrl}/${asistenciaSeleccionada.id_asistencia}` : asistenciaUrl;

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!respuesta.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      obtenerAsistencias();
      setMostrarModal(false);
      reiniciarFormulario();
    } catch (error) {
      console.error('Error al guardar el registro de asistencia:', error);
      alert('Ocurrió un error al guardar el registro de asistencia. Por favor, inténtalo de nuevo.');
    }
  };

  const editarAsistencia = (asistencia) => {
    setAsistenciaSeleccionada(asistencia);
    setFormData({
      id_estudiante: asistencia.id_estudiante,
      id_seccion: asistencia.id_seccion,
      fecha_asistencia: asistencia.fecha_asistencia,
      estado: asistencia.estado,
      observaciones: asistencia.observaciones,
    });
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const eliminarAsistencia = async (id) => {
    try {
      const respuesta = await fetch(`${asistenciaUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      obtenerAsistencias();
    } catch (error) {
      console.error('Error al eliminar el registro de asistencia:', error);
      alert('Ocurrió un error al eliminar el registro de asistencia. Por favor, inténtalo de nuevo.');
    }
  };

  const cambiarFiltro = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const reiniciarFormulario = () => {
    setFormData({
      id_estudiante: '',
      id_seccion: '',
      fecha_asistencia: '',
      estado: '',
      observaciones: '',
    });
    setModoEdicion(false);
    setAsistenciaSeleccionada(null);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    reiniciarFormulario();
  };

  const asistenciasFiltradas = asistencias.filter(
    (asistencia) =>
      asistencia.id_estudiante.toString().includes(filtro.id_estudiante) &&
      asistencia.fecha_asistencia.includes(filtro.fecha_asistencia)
  );

  return (
    <CCard>
      <CCardHeader>
        <h5>Registros de Asistencia</h5>
        <CButton color="success" onClick={() => setMostrarModal(true)}>
          Agregar Registro de Asistencia
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormInput
            placeholder="Filtrar por ID de estudiante"
            name="id_estudiante"
            value={filtro.id_estudiante}
            onChange={cambiarFiltro}
            className="mb-2"
          />
          <CFormInput
            type="date"
            placeholder="Filtrar por fecha"
            name="fecha_asistencia"
            value={filtro.fecha_asistencia}
            onChange={cambiarFiltro}
          />
        </div>
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID Asistencia</CTableHeaderCell>
              <CTableHeaderCell>ID Estudiante</CTableHeaderCell>
              <CTableHeaderCell>ID Sección</CTableHeaderCell>
              <CTableHeaderCell>Fecha de Asistencia</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Observaciones</CTableHeaderCell>
              <CTableHeaderCell>Creado En</CTableHeaderCell>
              <CTableHeaderCell>Actualizado En</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {asistenciasFiltradas.map((asistencia) => (
              <CTableRow key={asistencia.id_asistencia}>
                <CTableDataCell>{asistencia.id_asistencia}</CTableDataCell>
                <CTableDataCell>{asistencia.id_estudiante}</CTableDataCell>
                <CTableDataCell>{asistencia.id_seccion}</CTableDataCell>
                <CTableDataCell>{asistencia.fecha_asistencia}</CTableDataCell>
                <CTableDataCell>{asistencia.estado}</CTableDataCell>
                <CTableDataCell>{asistencia.observaciones}</CTableDataCell>
                <CTableDataCell>{asistencia.creado_en}</CTableDataCell>
                <CTableDataCell>{asistencia.actualizado_en}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="warning"
                    size="sm"
                    onClick={() => editarAsistencia(asistencia)}
                  >
                    Editar
                  </CButton>{' '}
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => eliminarAsistencia(asistencia.id_asistencia)}
                  >
                    Eliminar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CModal visible={mostrarModal} onClose={cerrarModal}>
          <CModalHeader>
            <CModalTitle>{modoEdicion ? 'Editar Registro de Asistencia' : 'Agregar Registro de Asistencia'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                type="text"
                label="ID Estudiante"
                value={formData.id_estudiante}
                onChange={(e) => setFormData({ ...formData, id_estudiante: e.target.value })}
                required
              />
              <CFormInput
                type="text"
                label="ID Sección"
                value={formData.id_seccion}
                onChange={(e) => setFormData({ ...formData, id_seccion: e.target.value })}
                required
              />
              <CFormInput
                type="date"
                label="Fecha de Asistencia"
                value={formData.fecha_asistencia}
                onChange={(e) => setFormData({ ...formData, fecha_asistencia: e.target.value })}
                required
              />
              <CFormSelect
                label="Estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
              >
                <option value="">Seleccionar Estado</option>
                <option value="Present">Presente</option>
                <option value="Absent">Ausente</option>
                <option value="Late">Tardanza</option>
              </CFormSelect>
              <CFormTextarea
                label="Observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows="3"
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={guardarAsistencia}>
              Guardar
            </CButton>
            <CButton color="secondary" onClick={cerrarModal}>
              Cancelar
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default Asistencia;