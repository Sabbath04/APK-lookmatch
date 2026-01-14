// hooks/useAppNavigation.ts
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

export function useAppNavigation<Screen extends keyof RootStackParamList>() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, Screen>>();
  const route = useRoute<RouteProp<RootStackParamList, Screen>>();

  // ✅ Compatible con la firma real de navigation.navigate
  function navigateTo<T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) {
    // TypeScript a veces se queja de navigate() aunque los tipos sean correctos,
    // así que hacemos una conversión controlada:
    (navigation as any).navigate(screen, params);
  }

  const goBack = () => {
    navigation.goBack();
  };

  return {
    navigation,
    route,
    navigateTo,
    goBack,
  };
}
