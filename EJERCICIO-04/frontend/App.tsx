import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

type Restaurante = {
  id: number;
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
};

const API_URL = 'http://172.22.23.163:3000';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    const precio = Number(precioMedio);
    if (!nombre.trim() || !tipo.trim() || !ciudad.trim() || !precioMedio.trim() || !Number.isFinite(precio) || precio < 0) {
      setMensaje('Completa todos los campos e indica un precio válido.');
      return;
    }

    setGuardando(true);
    setMensaje('');
    try {
      const respuesta = await fetch(API_URL + '/restaurantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), tipo: tipo.trim(), ciudad: ciudad.trim(), puntuacion: 9, precioMedio: precio }),
      });
      if (!respuesta.ok) throw new Error('Error al guardar el restaurante.');
      const creado = (await respuesta.json()) as Restaurante;
      setRestaurante(creado);
      setMensaje('Restaurante guardado ✓');
    } catch (error) {
      setRestaurante(null);
      setMensaje(error instanceof Error ? error.message : 'No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>FOOD SPOTS · NUEVO RESTAURANTE</Text>
      <Text style={styles.title}>Nuevo restaurante</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Tipo de cocina" value={tipo} onChangeText={setTipo} />
      <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} />
      <TextInput style={styles.input} placeholder="Precio medio (€)" value={precioMedio} onChangeText={setPrecioMedio} keyboardType="numeric" />
      <Pressable style={styles.button} onPress={guardar} disabled={guardando}><Text style={styles.buttonText}>{guardando ? 'Guardando...' : 'Guardar restaurante'}</Text></Pressable>
      {!!mensaje && <Text style={styles.message}>{mensaje}</Text>}
      {restaurante && (
        <View style={styles.card}>
          <Text style={styles.name}>🍜 {restaurante.nombre}</Text>
          <Text style={styles.detail}>{restaurante.tipo} · {restaurante.ciudad}</Text>
          <Text style={styles.price}>Precio medio: {restaurante.precioMedio} €</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FFF7E8' },
  eyebrow: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 16 },
  input: { backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#DCE3ED' },
  button: { backgroundColor: '#2563EB', borderRadius: 10, marginTop: 2, paddingVertical: 13, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: '700' },
  message: { marginTop: 12, color: '#334155' },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DCE3ED', padding: 16, borderRadius: 14, marginTop: 16, gap: 8 },
  name: { fontSize: 16, fontWeight: '800', color: '#111827' },
  detail: { color: '#64748B' },
  price: { fontWeight: '700', color: '#111827' },
});


