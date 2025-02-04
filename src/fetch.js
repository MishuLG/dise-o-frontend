import API_URL from '../config'; 

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`); 
  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }
  return await response.json();
};

export const addUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Error al agregar usuario');
  }
  return await response.json();
};

export const updateUser = async (id, user) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar usuario');
  }
  return await response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar usuario');
  }
  return await response.json();
};