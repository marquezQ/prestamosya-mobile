import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useAnimatedStyle } from 'react-native-reanimated';

/**
 * Retorna un estilo animado de Reanimated que traslada el modal suavemente
 * hacia arriba a 120fps en sincronía exacta con el teclado.
 *
 * Al trasladarlo exactamente la mitad de la altura del teclado (factor = 0.5),
 * el modal queda geométricamente centrado en el espacio visible libre sobre el teclado,
 * sin contraer su tamaño, sin reflows y sin forzar barras de scroll.
 */
export function useKeyboardTranslate(factor = 0.5) {
  const { height } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => {
    // height.value va de 0 a -keyboardHeight
    return {
      transform: [{ translateY: height.value * factor }],
    };
  });

  return animatedStyle;
}

