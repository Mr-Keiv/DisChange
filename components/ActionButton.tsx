import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle, useColorScheme } from 'react-native';
import { theme, fonts, spacing, borderRadius } from '@/constants/theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export default function ActionButton({
  title,
  onPress,
  type = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false
}: ActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    };

    switch (type) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
          paddingHorizontal: 8,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return 'white';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        fullWidth && styles.fullWidth,
        disabled && { opacity: 0.5 },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              icon && styles.textWithIcon,
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: 8,
  },
});