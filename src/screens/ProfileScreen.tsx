import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  Dimensions, 
  ImageSourcePropType,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useAppNavigation } from '../Components/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';
import { auth0Config } from '../config/auth0-config';
import { API_CONFIG, API_ENDPOINTS } from '../constants/config';
import { LinearGradient } from 'expo-linear-gradient';

// --- DATOS DE EJEMPLO ---
const mockStyles: { id: number; image: ImageSourcePropType }[] = [
  { id: 1, image: require("../../assets/Profile_pic_derecho.png") },
  { id: 2, image: require("../../assets/Profile_pic.png") },
  { id: 3, image: require("../../assets/Profile_pic_izquierdo.png") },
];

const { width, height } = Dimensions.get('window');
const getItemLayout = (data: any, index: number) => ({ length: width, offset: width * index, index });

interface ProfileData {
  picture?: string;
  name?: string;
  email?: string;
}

const deleteReasons = [
  "No uso la aplicación lo suficiente",
  "Encontré una mejor alternativa",
  "Tengo problemas técnicos",
  "Preocupaciones de privacidad",
  "Es muy costoso",
  "Otro motivo"
];

export default function ProfileScreen() {
  const { logout, authFetch } = useAuth();
  const { navigateTo } = useAppNavigation<"Profile">();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de UI
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isSettingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [isGalleryVisible, setGalleryVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (!profile) setIsLoading(true);

          // 1. Obtener datos de Auth0
          const userResponse = await authFetch(`https://${auth0Config.domain}/userinfo`);
          if (userResponse.ok && isActive) {
             const userData = await userResponse.json();
             setProfile(userData);
          }

          // 2. Obtener saldo de monedas del Backend
          // CORRECCIÓN AQUÍ: Usar USERS_BASE_URL
          const balanceUrl = `${API_CONFIG.USERS_BASE_URL}${API_ENDPOINTS.USERS.BALANCE}`;

          try {
              const balanceResponse = await authFetch(balanceUrl);
              if (balanceResponse.ok && isActive) {
                  const balanceData = await balanceResponse.json();
                  setCoins(balanceData.balance || 0); 
              }
          } catch (balanceError) {
              console.log("No se pudo obtener el saldo:", balanceError);
          }

        } catch (error) {
          console.log("Error general cargando perfil:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [authFetch]) 
  );

  const handleTryStyle = () => {
    navigateTo("SelectSex");
  };

  const handleBuyCoins = () => {
    navigateTo("BuyCredits");
  };

  const renderStyleSlide = ({ item }: { item: { id: number; image: ImageSourcePropType } }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.slideImage} />
    </View>
  );

  const renderGallerySlide = ({ item }: { item: { id: number; image: ImageSourcePropType } }) => (
    <View style={styles.gallerySlide}>
      <Image source={item.image} style={styles.galleryImage} />
    </View>
  );

  const executeDeleteAccount = async () => {
    if (!selectedReason) {
        Alert.alert("Selección requerida", "Por favor selecciona un motivo.");
        return;
    }
    setIsDeleting(true);
    try {
      // CORRECCIÓN AQUÍ: Usar USERS_BASE_URL
      const deleteUrl = `${API_CONFIG.USERS_BASE_URL}${API_ENDPOINTS.USERS.DELETE}`;
      const response = await authFetch(deleteUrl, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message); }
      
      setDeleteModalVisible(false); 
      Alert.alert(
          "Cuenta Eliminada", 
          "Tu cuenta ha sido programada para eliminación.",
          [{ text: "OK", onPress: () => logout() }]
      );
    } catch (error) {
      setIsDeleting(false);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  const openSettingsMenu = () => setSettingsMenuVisible(true);
  const closeSettingsMenu = () => setSettingsMenuVisible(false);

  const handleLogoutPress = () => {
    closeSettingsMenu();
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", onPress: logout, style: "destructive" }
    ]);
  };

  const handleDeletePress = () => {
    closeSettingsMenu();
    setDeleteModalVisible(true);
  };

  if (isLoading && !profile) {
    return (
      <ImageBackground source={require('../../assets/bg_profile.png')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EBD2A6" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../../assets/bg_profile.png')} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlay}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={openSettingsMenu}>
            <Ionicons name="ellipsis-vertical" size={24} color="#EBD2A6" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {profile?.picture ? (
                <Image source={{ uri: profile.picture }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#555' }]} />
              )}
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#3B1E0F" />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{profile?.name || "Usuario"}</Text>
              <Text style={styles.userEmail}>{profile?.email || "Cargando..."}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statCard} onPress={handleBuyCoins}>
              <View style={styles.statIconContainer}>
                <Ionicons name="disc" size={24} color="#EBD2A6" />
              </View>
              <Text style={styles.statValue}>{coins}</Text>
              <Text style={styles.statLabel}>Monedas</Text>
              <View style={styles.addBtn}>
                <Ionicons name="add" size={14} color="#3B1E0F" />
              </View>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="images-outline" size={24} color="#EBD2A6" />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Estilos</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tu último LookMatch</Text>
              <TouchableOpacity onPress={() => setGalleryVisible(true)} style={styles.expandButton}>
                <Ionicons name="expand-outline" size={20} color="#EBD2A6" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mockStyles}
              renderItem={renderStyleSlide}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
              initialScrollIndex={1}
              getItemLayout={getItemLayout}
            />
            <View style={styles.indicatorContainer}>
               <Ionicons name="chevron-back" size={16} color="rgba(235, 210, 166, 0.5)" />
               <Text style={styles.swipeText}>Desliza</Text>
               <Ionicons name="chevron-forward" size={16} color="rgba(235, 210, 166, 0.5)" />
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.mainActionButton} onPress={handleTryStyle}>
              <View style={styles.gradientButton}> 
                <Ionicons name="camera" size={22} color="#3B1E0F" style={{ marginRight: 10 }} />
                <Text style={styles.mainActionText}>PROBAR NUEVO ESTILO</Text>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={isGalleryVisible}
          onRequestClose={() => setGalleryVisible(false)}
        >
          <ImageBackground source={require('../../assets/bg_profile.png')} style={styles.galleryBackground} resizeMode="cover">
            <View style={styles.galleryOverlay}>
              <TouchableOpacity style={styles.closeGalleryButton} onPress={() => setGalleryVisible(false)}>
                <Ionicons name="close" size={30} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.galleryTitle}>Galería de Estilos</Text>
              <FlatList
                data={mockStyles}
                renderItem={renderGallerySlide}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={0} 
                getItemLayout={getItemLayout}
              />
              <Text style={styles.galleryInstructions}>Desliza para navegar</Text>
            </View>
          </ImageBackground>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isSettingsMenuVisible}
          onRequestClose={closeSettingsMenu}
        >
          <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeSettingsMenu}>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Opciones de Cuenta</Text>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
                <View style={styles.menuIconBox}>
                  <Ionicons name="log-out-outline" size={20} color="#EBD2A6" />
                </View>
                <Text style={styles.menuText}>Cerrar Sesión</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
              <View style={styles.menuSeparator} />
              <TouchableOpacity style={styles.menuItem} onPress={handleDeletePress}>
                <View style={[styles.menuIconBox, { backgroundColor: 'rgba(201, 60, 60, 0.15)' }]}>
                  <Ionicons name="trash-outline" size={20} color="#c93c3c" />
                </View>
                <Text style={[styles.menuText, { color: '#c93c3c' }]}>Eliminar Cuenta</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>Eliminar Cuenta</Text>
              <Text style={styles.deleteModalSubtitle}>Lamentamos que te vayas. ¿Podrías decirnos el motivo?</Text>
              <ScrollView style={styles.reasonsContainer}>
                {deleteReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[styles.reasonOption, selectedReason === reason && styles.reasonOptionSelected]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <View style={[styles.radioButton, selectedReason === reason && styles.radioButtonSelected]} />
                    <Text style={[styles.reasonText, selectedReason === reason && styles.reasonTextSelected]}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.warningContainer}>
                <Ionicons name="alert-circle-outline" size={20} color="#FF6B6B" style={{marginBottom: 5}}/>
                <Text style={styles.warningText}>Esta acción borrará todos tus datos y créditos no utilizados en un plazo de 3 a 5 días.</Text>
              </View>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)} disabled={isDeleting}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.deleteConfirmButton, !selectedReason && styles.disabledButton]} 
                  onPress={executeDeleteAccount}
                  disabled={!selectedReason || isDeleting}
                >
                  {isDeleting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.deleteConfirmText}>Eliminar Cuenta</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(20, 15, 10, 0.6)' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#EBD2A6', letterSpacing: 1 },
  iconBtn: { padding: 8 },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 25 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#EBD2A6' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#EBD2A6', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1E1E1E' },
  userInfo: { marginLeft: 20, flex: 1 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  userEmail: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 30, gap: 15 },
  statCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(235, 210, 166, 0.2)', position: 'relative' },
  statIconContainer: { marginBottom: 8, padding: 8, backgroundColor: 'rgba(235, 210, 166, 0.15)', borderRadius: 20 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', marginTop: 2 },
  addBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#EBD2A6', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  sectionContainer: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#EBD2A6' },
  expandButton: { padding: 5 },
  carousel: { maxHeight: 280, flexGrow: 0 },
  carouselContent: { paddingVertical: 10 },
  slide: { width: width, justifyContent: 'center', alignItems: 'center' },
  slideImage: { width: width * 0.85, height: 240, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(235, 210, 166, 0.3)', resizeMode: 'cover', backgroundColor: '#000' },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 8 },
  swipeText: { fontSize: 12, color: 'rgba(235, 210, 166, 0.7)' },
  actionsContainer: { paddingHorizontal: 20, alignItems: 'center', gap: 20 },
  mainActionButton: { width: '100%', borderRadius: 30, overflow: 'hidden', shadowColor: "#EBD2A6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  gradientButton: { paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBD2A6' },
  mainActionText: { color: '#3B1E0F', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  galleryBackground: { flex: 1, width: '100%', height: '100%' },
  galleryOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeGalleryButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25 },
  galleryTitle: { position: 'absolute', top: 60, color: '#EBD2A6', fontSize: 20, fontWeight: 'bold' },
  gallerySlide: { width: width, height: height, justifyContent: 'center', alignItems: 'center' },
  galleryImage: { width: width, height: '80%', resizeMode: 'contain' },
  galleryInstructions: { position: 'absolute', bottom: 50, color: '#888', fontSize: 14 },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 90, paddingRight: 20 },
  menuContent: { backgroundColor: '#1E1B18', borderRadius: 16, width: 220, padding: 5, borderWidth: 1, borderColor: '#EBD2A6', shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  menuTitle: { fontSize: 12, color: '#666', marginLeft: 15, marginTop: 10, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12 },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(235, 210, 166, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuText: { flex: 1, fontSize: 15, color: '#EBD2A6', fontWeight: '500' },
  menuSeparator: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginHorizontal: 10, marginVertical: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  deleteModalContent: { width: '90%', backgroundColor: '#1E1B18', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#C93C3C', maxHeight: '85%' },
  deleteModalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 8, textAlign: 'center' },
  deleteModalSubtitle: { fontSize: 15, color: '#CCC', marginBottom: 20, textAlign: 'center', lineHeight: 22 },
  reasonsContainer: { maxHeight: 250, marginBottom: 20 },
  reasonOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  reasonOptionSelected: { backgroundColor: 'rgba(201, 60, 60, 0.1)', borderColor: '#C93C3C', borderWidth: 1, borderRadius: 8 },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#666', marginRight: 15 },
  radioButtonSelected: { borderColor: '#C93C3C', backgroundColor: '#C93C3C' },
  reasonText: { color: '#CCC', fontSize: 16 },
  reasonTextSelected: { color: '#FF6B6B', fontWeight: 'bold' },
  warningContainer: { backgroundColor: 'rgba(201, 60, 60, 0.1)', padding: 15, borderRadius: 12, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201, 60, 60, 0.3)' },
  warningText: { color: '#FF6B6B', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  modalButtonsRow: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#666', borderRadius: 14 },
  cancelButtonText: { color: '#CCC', fontWeight: '600' },
  deleteConfirmButton: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#C93C3C', borderRadius: 14 },
  deleteConfirmText: { color: '#FFF', fontWeight: 'bold' },
  disabledButton: { opacity: 0.5, backgroundColor: '#555' },
});