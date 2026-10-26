import { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Sneaker = { id: number; marca: string; modelo: string; precio: number; talla: number; stock: number };
const API_URL = 'http://localhost:3000';

async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
}

export default function App() {
  const [items, setItems] = useState<Sneaker[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    fetch(`${API_URL}/sneakers`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as Sneaker[];
      })
      .then((data) => {
        if (activo) {
          setItems(data);
          setError('');
        }
      })
      .catch(() => {
        if (activo) setError('No se pudo conectar con la API.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => { activo = false; };
  }, []);

  async function cargar() {
    try {
      const response = await request(`${API_URL}/sneakers`);
      setItems((await response.json()) as Sneaker[]);
      setError('');
    } catch {
      setError('No se pudo conectar con la API.');
    }
  }

  async function crear() {
    try {
      await request(`${API_URL}/sneakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca: 'Nike', modelo: 'Air Max 1', precio: 149.99, talla: 42, stock: 4 }),
      });
      await cargar();
    } catch { setError('Error al crear.'); }
  }

  async function rebajar(id: number) {
    try {
      await request(`${API_URL}/sneakers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio: 139.99 }),
      });
      await cargar();
    } catch { setError('Error al actualizar.'); }
  }

  async function eliminar(id: number) {
    try {
      await request(`${API_URL}/sneakers/${id}`, { method: 'DELETE' });
      await cargar();
    } catch { setError('Error al eliminar.'); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>SNEAKER VAULT · INVENTARIO</Text>
      <Text style={styles.title}>Inventario</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.newButton}><Button title="Nueva" onPress={crear} color="#fff" /></View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>👟 {item.modelo}</Text>
            <Text style={styles.details}>
              {item.marca} · {item.stock === 0 ? <Text style={styles.outOfStock}>AGOTADO</Text> : `Stock ${item.stock}`}
            </Text>
            <Text style={styles.details}>Talla {item.talla} · {Number(item.precio).toFixed(2)} €</Text>
            <View style={styles.actions}>
              <Pressable style={styles.secondaryButton} onPress={() => { void rebajar(item.id); }}>
                <Text style={styles.secondaryText}>Rebajar</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => { void eliminar(item.id); }}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.details}>{cargando ? 'Cargando inventario...' : 'No hay sneakers en el inventario.'}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  eyebrow: { color: '#64748B', fontSize: 12, marginTop: 12, marginBottom: 18 },
  title: { color: '#111827', fontSize: 24, fontWeight: '800', marginBottom: 16 },
  newButton: { backgroundColor: '#2563EB', borderRadius: 9, overflow: 'hidden', marginBottom: 14 },
  list: { gap: 10 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DCE3ED', padding: 16, borderRadius: 14, gap: 8 },
  name: { color: '#111827', fontSize: 16, fontWeight: '800' },
  details: { color: '#64748B' },
  outOfStock: { color: '#64748B', fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  secondaryButton: { backgroundColor: '#EAF0FF', padding: 9, borderRadius: 8 },
  secondaryText: { color: '#1D4ED8', fontWeight: '700' },
  deleteButton: { padding: 9, borderRadius: 8 },
  deleteText: { color: '#B91C1C', fontWeight: '700' },
  error: { color: '#B91C1C', marginBottom: 12 },
});