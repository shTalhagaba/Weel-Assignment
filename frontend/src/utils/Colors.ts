
export const Colors = {

    RED : '#EF4444',
    WHITE : '#FFFFFF',
    BLACK : '#000000',
    BACKGROUND : '#F9FAFB',
    WHITE_BORDER :'#E5E7EB',
    LABEL :'#6B7280',
    PARIT : '#10B981',
    BLUE : '#3B82F6'
}



export const alpha = (hex, opacity) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    console.warn('Invalid hex color provided:', hex);
    return hex;
  }

  let color = hex.substring(1).split('');
  if (color.length === 3) {
    color = [color[0], color[0], color[1], color[1], color[2], color[2]];
  }

  const r = parseInt(color[0] + color[1], 16);
  const g = parseInt(color[2] + color[3], 16);
  const b = parseInt(color[4] + color[5], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
