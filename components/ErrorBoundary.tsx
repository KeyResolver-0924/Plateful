import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { Component, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('ErrorBoundary: Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary: Component stack:', errorInfo.componentStack);
    console.error('ErrorBoundary: Error details:', error);
    
    // Increment error count
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }));

    // Auto-reset after multiple errors to prevent infinite error loops
    if (this.state.errorCount >= 3) {
      console.log('ErrorBoundary: Multiple errors detected, auto-resetting in 2 seconds');
      this.resetTimeout = setTimeout(() => {
        this.handleReset();
      }, 2000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  handleReset = () => {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    this.setState({ hasError: false, error: null, errorCount: 0 });
    
    // Try to navigate to a safe route with better error handling
    try {
      console.log('ErrorBoundary: Attempting navigation recovery');
      router.replace('/');
    } catch (navError) {
      console.error('ErrorBoundary: Navigation error:', navError);
      
      // Force reload as last resort
      if (__DEV__) {
        console.log('ErrorBoundary: Development mode - trying manual reset');
        setTimeout(() => {
          this.setState({ hasError: false, error: null, errorCount: 0 });
        }, 1000);
      } else {
        // In production, we might want to show a different fallback
        console.log('ErrorBoundary: Production mode - showing persistent error state');
      }
    }
  };

  handleForceReload = () => {
    if (__DEV__) {
      // In development, we can try to force a complete reset
      console.log('ErrorBoundary: Force reloading app');
      this.setState({ hasError: false, error: null, errorCount: 0 });
      
      // Try navigation to index which should reinitialize everything
      setTimeout(() => {
        try {
          router.replace('/');
        } catch (err) {
          console.error('ErrorBoundary: Force reload navigation failed:', err);
        }
      }, 100);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRepeatedError = this.state.errorCount >= 3;

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Ionicons 
              name={isRepeatedError ? "alert-circle" : "warning"} 
              size={64} 
              color={isRepeatedError ? colors.error : colors.warning} 
            />
            <Text style={styles.title}>
              {isRepeatedError ? 'Multiple Errors Detected' : 'Oops! Something went wrong'}
            </Text>
            <Text style={styles.message}>
              {isRepeatedError 
                ? 'The app encountered repeated errors. This might be due to a refresh or navigation issue.'
                : 'We encountered an unexpected error. Don\'t worry, we can fix this!'
              }
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Dev Mode):</Text>
                <Text style={styles.errorText} numberOfLines={8}>
                  {this.state.error.message}
                </Text>
                <Text style={styles.errorCount}>
                  Error count: {this.state.errorCount}
                </Text>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
              
              {__DEV__ && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={this.handleForceReload}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Force Reload
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  errorDetails: {
    backgroundColor: colors.backgroundSecondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  errorCount: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.text.primary,
  },
});

export default ErrorBoundary; 