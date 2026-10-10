// Edita este objeto para ajustar las reglas sin tocar la lógica del juego.
export const GAME_CONFIG = {
  totalCards: 9,
  targetCount: 3,
  startingLives: 2,
  scratchTime: 700,
  difficulties: {
    bajo: { label: 'Tranquilo', memorizeTime: 8, lives: 3, accent: 'mint' },
    medio: { label: 'Clásico', memorizeTime: 5, lives: 2, accent: 'yellow' },
    alto: { label: 'Experto', memorizeTime: 3, lives: 1, accent: 'pink' },
  },
  flavors: [
    { name: 'Fresa', emoji: '🍓', color: 'rose', note: 'dulce y suave' },
    { name: 'Pistacho', emoji: '🌿', color: 'pistachio', note: 'verde cremoso' },
    { name: 'Mango', emoji: '🥭', color: 'mango', note: 'tropical y fresco' },
    { name: 'Chocolate', emoji: '🍫', color: 'cocoa', note: 'intenso y brillante' },
    { name: 'Vainilla', emoji: '✦', color: 'vanilla', note: 'clásico favorito' },
    { name: 'Arándano', emoji: '🫐', color: 'berry', note: 'frutal y ácido' },
    { name: 'Limón', emoji: '🍋', color: 'lemon', note: 'cítrico y alegre' },
    { name: 'Coco', emoji: '🥥', color: 'coconut', note: 'ligero y tropical' },
    { name: 'Caramelo', emoji: '🍯', color: 'caramel', note: 'dorado y dulce' },
  ],
};

export const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
