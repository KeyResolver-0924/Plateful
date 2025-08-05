import React from 'react';

interface AppHealthState {
  lastActiveTime: number;
  refreshCount: number;
  navigationErrors: number;
  lastSuccessfulRoute: string | null;
}

class AppHealthMonitor {
  private static instance: AppHealthMonitor;
  private state: AppHealthState = {
    lastActiveTime: Date.now(),
    refreshCount: 0,
    navigationErrors: 0,
    lastSuccessfulRoute: null,
  };

  static getInstance(): AppHealthMonitor {
    if (!AppHealthMonitor.instance) {
      AppHealthMonitor.instance = new AppHealthMonitor();
    }
    return AppHealthMonitor.instance;
  }

  // Record app becoming active
  recordActivity(route?: string) {
    this.state.lastActiveTime = Date.now();
    if (route) {
      this.state.lastSuccessfulRoute = route;
    }
    console.log('AppHealth: Activity recorded', { route, time: new Date().toISOString() });
  }

  // Record a refresh event
  recordRefresh() {
    this.state.refreshCount++;
    console.log('AppHealth: Refresh recorded, count:', this.state.refreshCount);
    
    // If too many refreshes in short time, might indicate white screen issues
    if (this.state.refreshCount > 3) {
      console.warn('AppHealth: Multiple refreshes detected - potential white screen issue');
      return true; // Indicates potential issue
    }
    
    return false;
  }

  // Record navigation error
  recordNavigationError() {
    this.state.navigationErrors++;
    console.log('AppHealth: Navigation error recorded, count:', this.state.navigationErrors);
  }

  // Check if app might be in unhealthy state
  isAppHealthy(): boolean {
    const timeSinceLastActivity = Date.now() - this.state.lastActiveTime;
    const tooManyRefreshes = this.state.refreshCount > 3;
    const tooManyNavErrors = this.state.navigationErrors > 2;
    const tooLongInactive = timeSinceLastActivity > 30000; // 30 seconds

    const isHealthy = !tooManyRefreshes && !tooManyNavErrors && !tooLongInactive;
    
    if (!isHealthy) {
      console.warn('AppHealth: App appears unhealthy', {
        refreshCount: this.state.refreshCount,
        navigationErrors: this.state.navigationErrors,
        timeSinceLastActivity,
        lastRoute: this.state.lastSuccessfulRoute
      });
    }

    return isHealthy;
  }

  // Get health report
  getHealthReport() {
    return {
      ...this.state,
      timeSinceLastActivity: Date.now() - this.state.lastActiveTime,
      isHealthy: this.isAppHealthy(),
      timestamp: new Date().toISOString()
    };
  }

  // Reset health state (useful for recovery)
  reset() {
    this.state = {
      lastActiveTime: Date.now(),
      refreshCount: 0,
      navigationErrors: 0,
      lastSuccessfulRoute: null,
    };
    console.log('AppHealth: State reset');
  }

  // Clean up old data periodically
  cleanup() {
    // Reset counters after successful period
    if (this.isAppHealthy() && this.state.refreshCount > 0) {
      setTimeout(() => {
        this.state.refreshCount = Math.max(0, this.state.refreshCount - 1);
        this.state.navigationErrors = Math.max(0, this.state.navigationErrors - 1);
      }, 60000); // Reset counters after 1 minute of healthy state
    }
  }
}

export const appHealthMonitor = AppHealthMonitor.getInstance();

// Hook to monitor component health
export const useAppHealth = (componentName: string) => {
  React.useEffect(() => {
    appHealthMonitor.recordActivity(componentName);
    
    return () => {
      appHealthMonitor.cleanup();
    };
  }, [componentName]);

  return {
    recordActivity: () => appHealthMonitor.recordActivity(componentName),
    isHealthy: () => appHealthMonitor.isAppHealthy(),
    getReport: () => appHealthMonitor.getHealthReport()
  };
}; 