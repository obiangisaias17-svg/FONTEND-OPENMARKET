import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://tu-app-en-render.onrender.com';

async function request(endpoint, method = 'GET', data = null, isFormData = false) {
  const token = await AsyncStorage.getItem('userToken');
  
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Error en la petición');
  }

  return json;
}

export const API = {
  // Autenticación
  login: (email, password) => request('/api/auth/login', 'POST', { email, password }),
  registro: (datosUsuario) => request('/api/auth/registro', 'POST', datosUsuario),

  // Productos
  obtenerProductos: () => request('/api/productos', 'GET'),
  
  crearProducto: (formData) => request('/api/productos', 'POST', formData, true),
  
  eliminarProducto: (id) => request(`/api/productos/${id}`, 'DELETE'),

  // Pedidos
  crearPedido: (productoId, comprador, direccionEntrega) => 
    request('/api/pedidos', 'POST', { productoId, comprador, direccionEntrega }),
    
  obtenerPedidos: () => request('/api/pedidos', 'GET'),
  
  actualizarEstadoPedido: (pedidoId, estado) => 
    request(`/api/pedidos/${pedidoId}/estado`, 'PATCH', { estado }),

  // Repartidores
  obtenerMisPedidosRepartidor: (repartidorId) => 
    request(`/api/repartidores/${repartidorId}/pedidos`, 'GET'),
};