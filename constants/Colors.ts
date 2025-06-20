export interface ColorScheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  error: string;
  warning: string;
  success: string;
  info: string;
  border: string;
  divider: string;
  shadow: {
    light: string;
    medium: string;
    dark: string;
  };
  food: {
    carrot: string;
    strawberry: string;
    garlic: string;
    apple: string;
    banana: string;
    orange: string;
    grapes: string;
    watermelon: string;
    broccoli: string;
    peas: string;
  };
  gradient: {
    primary: string[];
    secondary: string[];
    sunset: string[];
    fresh: string[];
  };
}

export const colors: ColorScheme = {
  primary: '#FF9A00',
  primaryDark: '#E88800',
  primaryLight: '#FFB84D',
  
  secondary: '#4CAF50',
  secondaryDark: '#388E3C',
  secondaryLight: '#81C784',
  
  background: '#FFFFFF',
  surface: '#F5F5F5',
  
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF'
  },
  
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3',
  
  border: '#E0E0E0',
  divider: '#F0F0F0',
  
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.2)'
  },
  
  food: {
    carrot: '#FF6B35',
    strawberry: '#FF1744',
    garlic: '#F5DEB3',
    apple: '#DC143C',
    banana: '#FFE135',
    orange: '#FFA500',
    grapes: '#6B46C1',
    watermelon: '#FC5C65',
    broccoli: '#228B22',
    peas: '#3CB371'
  },
  
  gradient: {
    primary: ['#FF9A00', '#FFB84D'],
    secondary: ['#4CAF50', '#81C784'],
    sunset: ['#FF9A00', '#FF6B35'],
    fresh: ['#81C784', '#4CAF50']
  }
};

export default colors; 