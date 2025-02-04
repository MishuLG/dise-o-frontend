import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilGroup,
  cilUser,
  cilUserFollow,
  cilMoodVeryGood,
  cilFile
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'record',
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'tools',
  },
 
  {
    component: CNavGroup,
    name: 'Registros',
    to: '/',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Estudiantes',
        to: '/students',
      },
      {
        component: CNavItem,
        name: 'Representantes',
        to: '/tutors',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Academico',
    to: '/buttons',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Secciones',
        to: '/sections',
      },
      {
        component: CNavItem,
        name: 'Materias',
        to: '/subjects',
      },
      {
        component: CNavItem,
        name: 'Materias Cursadas',
        to: '/subjects_taken',
      },
      {
        component: CNavItem,
        name: 'Año Escolar',
        to: '/school_year',
      },
      {
        component: CNavItem,
        name: 'Horario de Clases',
        to: '/class_schedules',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Asistencia',
    to: '/attendance',
    icon: <CIcon icon={cilMoodVeryGood} customClassName="nav-icon" />
  },
  {
    component: CNavGroup,
    name: 'Calificaciones',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Evaluaciones',
        to: '/evaluations',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Boletines',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Informes de Calificaciones',
        to: '/grade_reports',
      },
    ],
  },
]

export default _nav
