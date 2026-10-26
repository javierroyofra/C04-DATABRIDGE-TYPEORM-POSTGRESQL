import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Libro = { id: number; titulo: string; autor: string; genero: string; leido: boolean };
const API_URL = 'http://localhost:3000';

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [error, setError] = useState('');
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    try {
      const respuesta = await fetch(`${API_URL}/libros`);
      if (!respuesta.ok) throw new Error('No se pudo cargar la biblioteca.');
      setLibros((await respuesta.json()) as Libro[]);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo conectar con el servidor.');
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  async function marcarComoLeido(id: number) {
    setActualizandoId(id);
    try {
      const respuesta = await fetch(`${API_URL}/libros/${id}/leido`, { method: 'PATCH' });
      if (!respuesta.ok) throw new Error('No se pudo actualizar el libro.');
      // Volvemos a consultar la lista para reflejar el valor persistido en PostgreSQL.
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar el libro.');
    } finally {
      setActualizandoId(null);
    }
  }

  function confirmarEliminar(libro: Libro) {
    Alert.alert('Eliminar libro', libro.titulo, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { void eliminar(libro.id); } },
    ]);
  }

  async function eliminar(id: number) {
    try {
      const respuesta = await fetch(`${API_URL}/libros/${id}`, { method: 'DELETE' });
      if (!respuesta.ok) throw new Error('No se pudo eliminar el libro.');
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar el libro.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>MY LIBRARY · BIBLIOTECA</Text>
      <Text style={styles.title}>Biblioteca</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={libros}
        keyExtractor={(libro) => String(libro.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.book}>
            <Text style={styles.bookTitle}>📚 {item.titulo}</Text>
            <Text style={styles.detail}>{item.autor} · {item.leido ? 'Leído ✓' : item.genero}</Text>
            <Pressable
              style={[styles.readButton, (item.leido || actualizandoId === item.id) && styles.disabledButton]}
              onPress={() => { void marcarComoLeido(item.id); }}
              disabled={item.leido || actualizandoId === item.id}
            >
              <Text style={styles.readButtonText}>{item.leido ? 'Leído ✓' : actualizandoId === item.id ? 'Guardando...' : 'Marcar como leído'}</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => confirmarEliminar(item)}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={!error ? <Text style={styles.detail}>Cargando biblioteca...</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  eyebrow: { color: '#64748B', fontSize: 12, marginTop: 12, marginBottom: 18 },
  title: { color: '#111827', fontSize: 24, fontWeight: '800', marginBottom: 16 },
  list: { gap: 12 },
  book: { backgroundColor: '#FFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#DCE3ED', gap: 8 },
  bookTitle: { color: '#111827', fontSize: 16, fontWeight: '800' },
  detail: { color: '#64748B' },
  readButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 9, alignItems: 'center', marginTop: 4 },
  disabledButton: { opacity: 0.65 },
  readButtonText: { color: '#FFF', fontWeight: '700' },
  deleteButton: { padding: 8, alignItems: 'center' },
  deleteButtonText: { color: '#B91C1C', fontWeight: '600' },
  error: { color: '#B91C1C', marginBottom: 12 },
});
