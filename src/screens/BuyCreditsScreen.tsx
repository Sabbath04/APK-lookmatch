import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  FlatList, 
  Alert, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAppNavigation } from '../Components/useAppNavigation';
import { useAuth } from '../context/AuthContext'; 
import { API_CONFIG, API_ENDPOINTS } from '../constants/config';

// NOTA: Se eliminaron las importaciones de AdMob. Ahora es 100% compatible con Expo Go.

const { width } = Dimensions.get('window');

// Datos de los paquetes
const creditPackages = [
  { 
    id: '1', 
    coins: 50, 
    bonus: 0, 
    price: '$4.99', 
    label: null,
    gradient: ['#2A1C0E', '#3D2914'] 
  },
  { 
    id: '2', 
    coins: 150, 
    bonus: 20, 
    price: '$12.99', 
    label: 'POPULAR',
    gradient: ['#3B1E0F', '#5C4033'] 
  },
  { 
    id: '3', 
    coins: 500, 
    bonus: 100, 
    price: '$39.99', 
    label: 'MEJOR PRECIO',
    gradient: ['#594D00', '#7A6B00'] 
  },
];

export default function BuyCreditsScreen() {
  const { goBack } = useAppNavigation<'BuyCredits'>();
  const { authFetch } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  
  // Obtener el saldo actual cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchBalance = async () => {
        try {
          // CORRECCIÓN: Usar USERS_BASE_URL
          const url = `${API_CONFIG.USERS_BASE_URL}${API_ENDPOINTS.USERS.BALANCE}`;
          const response = await authFetch(url);
          if (response.ok && isActive) {
            const data = await response.json();
            setBalance(data.balance || 0);
          }
        } catch (error) {
          console.log("Error al obtener saldo:", error);
        }
      };
      
      fetchBalance();
      
      return () => { isActive = false; };
    }, [authFetch])
  );

  // Lógica de compra (Conectada al Backend)
  const processPurchase = async (amount: number, isReward: boolean = false) => {
    if (!isReward) setIsPurchasing(true);
    
    try {
      // CORRECCIÓN: Usar USERS_BASE_URL
      const url = `${API_CONFIG.USERS_BASE_URL}${API_ENDPOINTS.USERS.PURCHASE}`;
      
      const response = await authFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount })
      });

      if (response.ok) {
        // Actualizamos el saldo localmente para reflejar la compra de inmediato
        const newBalance = balance + amount;
        setBalance(newBalance);
        
        if (!isReward) {
            Alert.alert("¡Compra Exitosa!", `Se han añadido ${amount} monedas a tu cuenta.`, [
                { text: "OK" } 
            ]);
        }
      } else {
        throw new Error("Error en el servidor");
      }

    } catch (error) {
      console.error("Error en compra:", error);
      if (!isReward) Alert.alert("Error", "No se pudo procesar la compra. Inténtalo de nuevo.");
    } finally {
      if (!isReward) setIsPurchasing(false);
    }
  };

  const handlePurchase = (pkg: typeof creditPackages[0]) => {
    Alert.alert(
      "Confirmar Compra",
      `¿Comprar ${pkg.coins} monedas por ${pkg.price}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Comprar", 
          onPress: () => processPurchase(pkg.coins + pkg.bonus)
        }
      ]
    );
  };

  // Simulación de ver anuncio
  const handleWatchAd = () => {
    Alert.alert(
      "Anuncio Simulado",
      "Aquí se mostraría un video publicitario real (AdMob/Unity Ads). Al cerrar esta alerta, recibirás 1 moneda.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
            text: "Ver Video (Simular)", 
            onPress: () => {
                // Simulamos una pequeña espera y damos la recompensa
                Alert.alert("¡Recompensa!", "Has ganado 1 moneda gratis.");
                processPurchase(1, true);
            }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Tienda</Text>
      <Text style={styles.headerSubtitle}>Elige el paquete perfecto para ti</Text>
    </View>
  );

  const renderItem = ({ item }: { item: typeof creditPackages[0] }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => handlePurchase(item)}
      style={styles.cardContainer}
      disabled={isPurchasing}
    >
      <LinearGradient
        colors={item.label ? ['rgba(212, 175, 55, 0.15)', 'rgba(42, 28, 14, 0.9)'] : ['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, item.label ? styles.cardBorderHighlight : styles.cardBorderNormal]}
      >
        {item.label ? (
          <View style={styles.labelContainer}>
            <LinearGradient colors={['#D4AF37', '#AA8C2C']} style={styles.labelGradient}>
              <Text style={styles.labelText}>{item.label}</Text>
            </LinearGradient>
          </View>
        ) : null}

        <View style={styles.leftSection}>
            <View style={styles.iconCircle}>
                <Ionicons name="sparkles" size={24} color="#D4AF37" />
            </View>
            <View>
                <Text style={styles.coinCount}>{item.coins}</Text>
                <Text style={styles.coinLabel}>Créditos</Text>
                {item.bonus > 0 && (
                    <Text style={styles.bonusText}>+{item.bonus} Gratis</Text>
                )}
            </View>
        </View>

        <View style={styles.rightSection}>
            <View style={styles.priceButton}>
                <Text style={styles.priceText}>{item.price}</Text>
            </View>
        </View>

      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <TouchableOpacity 
        style={styles.adCard} 
        activeOpacity={0.8} 
        onPress={handleWatchAd}
    >
       <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.adGradient}
      >
        <View style={styles.adContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#333' }]}>
                <Ionicons name="play" size={24} color="#FFF" />
            </View>
            <View style={styles.adTexts}>
                <Text style={styles.adTitle}>Monedas Gratis</Text>
                <Text style={styles.adSubtitle}>Mira un video corto</Text>
            </View>
            <View style={styles.adBadge}>
                <Text style={styles.adBadgeText}>+1</Text>
            </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/look-match-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <View style={styles.navbar}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.balanceContainer}>
                <Ionicons name="disc" size={18} color="#D4AF37" />
                <Text style={styles.balanceText}>{balance}</Text>
            </View>
        </View>

        <FlatList
            data={creditPackages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />

        {isPurchasing && (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Procesando...</Text>
            </View>
        )}

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    gap: 6,
  },
  balanceText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 16, 
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 5,
  },
  cardContainer: {
    marginBottom: 20,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    height: 100,
  },
  cardBorderNormal: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardBorderHighlight: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  coinLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  bonusText: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: 'bold',
    marginTop: 2,
  },
  rightSection: {},
  priceButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  priceText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  labelContainer: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    zIndex: 10,
  },
  labelGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  adCard: {
    marginTop: 10,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
  },
  adGradient: {
    padding: 15,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adTexts: {
    flex: 1,
    marginLeft: 15,
  },
  adTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adSubtitle: {
    color: '#888',
    fontSize: 12,
  },
  adBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adBadgeText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#D4AF37',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
});