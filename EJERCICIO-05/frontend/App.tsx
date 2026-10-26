import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'http://localhost:3000';

type Viaje = {
  id: number;
  destino: string;
  pais: string;
  fecha: string;
  estado: string;
};

function mostrarFecha(fecha: string) {
  const [year, month, day] = fecha.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export default function App() {
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('Cargando viaje...');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/viajes/1`)
      .then(async (respuesta) => {
        if (!respuesta.ok) throw new Error('No se pudo cargar el viaje.');
        return (await respuesta.json()) as Viaje;
      })
      .then((dato) => {
        setViaje(dato);
        setFecha(dato.fecha.slice(0, 10));
        setMensaje('');
      })
      .catch((error: unknown) => setMensaje(error instanceof Error ? error.message : 'Error al cargar el viaje.'));
  }, []);

  async function actualizar() {
    if (!viaje || !fecha.trim()) {
      setMensaje('Introduce una fecha válida.');
      return;
    }
    setGuardando(true);
    setMensaje('');
    try {
      const respuesta = await fetch(`${API_URL}/viajes/${viaje.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // PATCH envía solo el campo que se quiere modificar.
        body: JSON.stringify({ fecha }),
      });
      if (!respuesta.ok) throw new Error('No se pudo guardar la fecha.');
      const actualizado = (await respuesta.json()) as Viaje;
      setViaje(actualizado);
      setFecha(actualizado.fecha.slice(0, 10));
      setMensaje('Cambios guardados ✓');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error al guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>TRAVEL BOOK · EDITAR VIAJE</Text>
      <Text style={styles.title}>Editar viaje</Text>
      {viaje && (
        <>
          <View style={styles.card}>
            <Text style={styles.destination}>✈️ {viaje.destino}</Text>
            <Text style={styles.detail}>{viaje.pais} · {viaje.estado}</Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>🗓️ Fecha: {mostrarFecha(fecha)}</Text>
          </View>
          <TextInput
            style={styles.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="AAAA-MM-DD"
            accessibilityLabel="Fecha del viaje"
          />
          <Pressable style={[styles.button, guardando && styles.buttonDisabled]} onPress={actualizar} disabled={guardando}>
            <Text style={styles.buttonText}>{guardando ? 'Guardando...' : 'Guardar cambios'}</Text>
          </Pressable>
        </>
      )}
      {!!mensaje && <Text style={styles.message}>{mensaje}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FFF8E9' },
  eyebrow: { color: '#64748B', fontSize: 12, marginBottom: 18 },
  title: { color: '#111827', fontSize: 24, fontWeight: '800', marginBottom: 18 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DCE3ED', padding: 16, borderRadius: 14, marginBottom: 10, gap: 6 },
  destination: { color: '#111827', fontSize: 16, fontWeight: '800' },
  detail: { color: '#64748B' },
  dateCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DCE3ED', padding: 16, borderRadius: 14, marginBottom: 10 },
  dateLabel: { color: '#111827', fontWeight: '700' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DCE3ED', padding: 14, borderRadius: 12, marginBottom: 10 },
  button: { backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#FFF', fontWeight: '700' },
  message: { color: '#334155', marginTop: 12 },
});

