import { router } from 'expo-router';

interface NavigationState {
  isRecovering: boolean;
  lastSuccessfulRoute: string | null;
  errorCount: number;
}

class NavigationRecovery {
  private static instance: NavigationRecovery;
  private state: NavigationState = {
    isRecovering: false,
    lastSuccessfulRoute: null,
    errorCount: 0
  };

  static getInstance(): NavigationRecovery {
    if (!NavigationRecovery.instance) {
      NavigationRecovery.instance = new NavigationRecovery();
    }
    return NavigationRecovery.instance;
  }

  // Record successful navigation
  recordSuccessfulNavigation(route: string) {
    this.state.lastSuccessfulRoute = route;
    this.state.errorCount = 0;
    console.log('NavigationRecovery: Recorded successful navigation to', route);
  }

  // Handle navigation errors
  async handleNavigationError(error: any, attemptedRoute: string) {
    console.error('NavigationRecovery: Navigation error for route', attemptedRoute, error);
    
    this.state.errorCount++;
    
    if (this.state.errorCount >= 3) {
      console.log('NavigationRecovery: Multiple navigation errors, initiating recovery');
      await this.initiateRecovery();
      return;
    }

    // Try fallback navigation
    await this.attemptFallbackNavigation();
  }

  // Initiate recovery process
  private async initiateRecovery() {
    if (this.state.isRecovering) {
      console.log('NavigationRecovery: Already recovering, skipping');
      return;
    }

    this.state.isRecovering = true;

    try {
      console.log('NavigationRecovery: Starting recovery process');
      
      // Clear potentially corrupted navigation state
      await this.clearNavigationCache();
      
      // Try to navigate to last successful route or fallback
      const fallbackRoute = this.state.lastSuccessfulRoute || '/(tabs)';
      
      console.log('NavigationRecovery: Attempting recovery navigation to', fallbackRoute);
      router.replace(fallbackRoute as any);
      
      // Reset error count after successful recovery
      setTimeout(() => {
        this.state.errorCount = 0;
        this.state.isRecovering = false;
        console.log('NavigationRecovery: Recovery completed');
      }, 2000);
      
    } catch (recoveryError) {
      console.error('NavigationRecovery: Recovery failed', recoveryError);
      
      // Ultimate fallback - try to go to index
      setTimeout(() => {
        try {
          router.replace('/');
        } catch (finalError) {
          console.error('NavigationRecovery: Final fallback failed', finalError);
        }
        this.state.isRecovering = false;
      }, 1000);
    }
  }

  // Attempt fallback navigation
  private async attemptFallbackNavigation() {
    const fallbackRoutes = [
      this.state.lastSuccessfulRoute,
      '/(tabs)',
      '/splash',
      '/'
    ].filter(Boolean);

    for (const route of fallbackRoutes) {
      try {
        console.log('NavigationRecovery: Trying fallback route', route);
        router.replace(route as any);
        return; // Success
      } catch (error) {
        console.error('NavigationRecovery: Fallback route failed', route, error);
        continue;
      }
    }

    // If all fallbacks failed, initiate full recovery
    await this.initiateRecovery();
  }

  // Clear navigation cache (if any exists)
  private async clearNavigationCache() {
    try {
      // Clear any navigation-related items from AsyncStorage if needed
      // This is app-specific, add your own cache clearing logic here
      console.log('NavigationRecovery: Clearing navigation cache');
      
      // Example: Clear specific keys that might cause navigation issues
      // await AsyncStorage.multiRemove(['navigationState', 'routeHistory']);
      
    } catch (error) {
      console.error('NavigationRecovery: Failed to clear navigation cache', error);
    }
  }

  // Check if app should show recovery UI
  shouldShowRecoveryUI(): boolean {
    return this.state.isRecovering || this.state.errorCount >= 2;
  }

  // Get current error count
  getErrorCount(): number {
    return this.state.errorCount;
  }

  // Reset recovery state (useful for testing or manual reset)
  reset() {
    this.state = {
      isRecovering: false,
      lastSuccessfulRoute: null,
      errorCount: 0
    };
    console.log('NavigationRecovery: State reset');
  }
}

// Export singleton instance
export const navigationRecovery = NavigationRecovery.getInstance();

// Utility function to safely navigate with error handling
export const safeNavigate = async (route: string, options?: { replace?: boolean }) => {
  try {
    console.log('NavigationRecovery: Safe navigation to', route);
    
    if (options?.replace) {
      router.replace(route as any);
    } else {
      router.push(route as any);
    }
    
    // Record successful navigation
    navigationRecovery.recordSuccessfulNavigation(route);
    
  } catch (error) {
    console.error('NavigationRecovery: Safe navigation failed', error);
    await navigationRecovery.handleNavigationError(error, route);
  }
};

export default NavigationRecovery; 