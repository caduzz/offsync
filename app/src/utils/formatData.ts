export const formatTime = (seconds: number) => {
  let campoMinuto = Math.floor(seconds / 60);
  let campoSegundos = Math.floor(seconds % 60);
  return `${campoMinuto}:${String(campoSegundos).padStart(2, '0')}`;
};