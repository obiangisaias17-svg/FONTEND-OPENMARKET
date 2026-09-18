import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API } from './api';

export default function CrearProductoScreen() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUri, setImagenUri] = useState(null);

  const seleccionarImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const guardarProducto = async () => {
    if (!nombre || !precio) {
      Alert.alert('Error', 'Nombre y precio son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('descripcion', descripcion);

    if (imagenUri) {
      const filename = imagenUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('imagen', {
        uri: imagenUri,
        name: filename,
        type,
      });
    }

    try {
      await API.crearProducto(formData);
      Alert.alert('Éxito', 'Producto publicado correctamente');
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setImagenUri(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre producto" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Precio" keyboardType="numeric" style={styles.input} value={precio} onChangeText={setPrecio} />
      <TextInput placeholder="Descripción" style={styles.input} value={descripcion} onChangeText={setDescripcion} />
      
      <Button title={imagenUri ? "Imagen Seleccionada" : "Seleccionar Imagen"} onPress={seleccionarImagen} />
      <View style={{ marginTop: 10 }}>
        <Button title="Publicar Producto" color="green" onPress={guardarProducto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 5 }
});