// services/backgroundLocationService.ts
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const BACKGROUND_LOCATION_TASK = 'background-location-task';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

interface PositionPayload {
  latitude: number;
  longitude: number;
  recorded_at: number;
}

/**
 * Attempt to refresh the access token using the refresh token.
 * Returns the new access token, or null if refresh fails.
 */
async function refreshTokenInBackground(): Promise<string | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      console.warn('⚠️ Background: No refresh token available');
      return null;
    }

    console.log('🔄 Background: Attempting token refresh...');

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const newAccessToken = response.data?.data?.access_token || null;
    const newRefreshToken = response.data?.data?.refresh_token || refreshToken;

    if (newAccessToken && typeof newAccessToken === 'string') {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
      console.log('✅ Background: Access token refreshed successfully');
    }

    if (newRefreshToken && typeof newRefreshToken === 'string') {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
    }

    return newAccessToken;
  } catch (error: any) {
    console.error('❌ Background: Token refresh failed:', error?.response?.data || error.message);
    return null;
  }
}

/**
 * Send position to backend with automatic token refresh on 401.
 */
async function sendPositionWithAuth(payload: PositionPayload): Promise<boolean> {
  let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    console.warn('⚠️ Background: No access token, attempting refresh...');
    accessToken = await refreshTokenInBackground();
    if (!accessToken) return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/delivery/position`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      console.log('✅ Background: Position sent successfully at', new Date().toISOString());
      return true;
    }
    return false;
  } catch (error: any) {
    // If 401, try refresh token then retry once
    if (error?.response?.status === 401) {
      console.warn('⚠️ Background: 401 received, refreshing token...');
      const newToken = await refreshTokenInBackground();

      if (newToken) {
        try {
          const retryResponse = await axios.post(
            `${BASE_URL}/api/delivery/position`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${newToken}`,
              },
            }
          );

          if (retryResponse.status === 200) {
            console.log('✅ Background: Position sent after token refresh');
            return true;
          }
        } catch (retryError: any) {
          console.error('❌ Background: Retry after refresh failed:', retryError?.response?.data || retryError.message);

          // If still 401 after refresh, token is truly invalid — stop tracking
          if (retryError?.response?.status === 401) {
            console.warn('⚠️ Background: Still unauthorized after refresh, stopping tracking');
            await BackgroundLocationService.stop();
          }
          return false;
        }
      } else {
        // Refresh failed — stop tracking
        console.warn('⚠️ Background: Token refresh failed, stopping tracking');
        await BackgroundLocationService.stop();
        return false;
      }
    }

    console.error('❌ Background: Failed to send position:', error?.response?.data || error.message);
    return false;
  }
}

// Task yang akan berjalan di background
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('❌ Background location error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };

    // Process setiap lokasi yang diterima
    for (const location of locations) {
      // Check if location is mocked (fake GPS)
      if (location.mocked) {
        console.log('🚫 Background: Fake GPS detected, skipping send');
        continue;
      }

      const payload: PositionPayload = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        recorded_at: Math.floor(location.timestamp / 1000), // Convert to Unix timestamp
      };

      console.log('📤 Background: Sending position:', payload);
      await sendPositionWithAuth(payload);
    }
  }
});

export class BackgroundLocationService {
  /**
   * Start background location tracking
   * Akan mengirim lokasi setiap interval tertentu bahkan saat app di background
   */
  static async start(options?: {
    accuracy?: Location.Accuracy;
    timeInterval?: number; // dalam milidetik
    distanceInterval?: number; // dalam meter
  }): Promise<boolean> {
    try {
      console.log('🚀 Starting background location service...');

      // 1. Check & request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== 'granted') {
        console.error('❌ Foreground location permission not granted');
        return false;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== 'granted') {
        console.error('❌ Background location permission not granted');
        return false;
      }

      // 2. Check if task is already running
      const isTaskDefined = await TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK);
      if (!isTaskDefined) {
        console.error('❌ Background task not defined');
        return false;
      }

      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (isTaskRegistered) {
        console.log('⚠️ Background location already running');
        return true;
      }

      // 3. Start background location updates
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: options?.accuracy || Location.Accuracy.High,
        timeInterval: options?.timeInterval || 900000, // Default 15 minutes
        distanceInterval: options?.distanceInterval || 100, // Default 100 meter
        foregroundService: {
          notificationTitle: 'Tracking Aktif',
          notificationBody: 'Aplikasi sedang melacak lokasi Anda untuk pengiriman',
          notificationColor: '#3b82f6',
        },
        // Background location options
        showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: false,
        activityType: Location.ActivityType.AutomotiveNavigation,
        deferredUpdatesInterval: options?.timeInterval || 900000,
      });

      console.log('✅ Background location service started');
      console.log('📊 Config:', {
        accuracy: options?.accuracy || Location.Accuracy.High,
        timeInterval: `${(options?.timeInterval || 900000) / 60000} minutes`,
        distanceInterval: `${options?.distanceInterval || 100} meters`,
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to start background location:', error);
      return false;
    }
  }

  /**
   * Stop background location tracking
   */
  static async stop(): Promise<boolean> {
    try {
      console.log('🛑 Stopping background location service...');

      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);

      if (isTaskRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        console.log('✅ Background location service stopped');
        return true;
      }

      console.log('⚠️ Background location was not running');
      return false;
    } catch (error) {
      console.error('❌ Failed to stop background location:', error);
      return false;
    }
  }

  /**
   * Send a single location update immediately
   * Used for instant backgrounding updates
   */
  static async sendSingleUpdate(): Promise<boolean> {
    try {
      console.log('📤 Background: Sending instant single update...');

      // Get current location (high accuracy)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Check if location is mocked (fake GPS)
      if (location.mocked) {
        console.log('🚫 Background: Instant update: Fake GPS detected, skipping send');
        return false;
      }

      const payload: PositionPayload = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        recorded_at: Math.floor(location.timestamp / 1000),
      };

      return await sendPositionWithAuth(payload);
    } catch (error: any) {
      console.error('❌ Background: Failed to send instant update:', error.message);
      return false;
    }
  }

  /**
   * Check if background location is currently running
   */
  static async isRunning(): Promise<boolean> {
    try {
      return await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
    } catch (error) {
      console.error('❌ Failed to check background location status:', error);
      return false;
    }
  }

  /**
   * Get background location permissions status
   */
  static async checkPermissions(): Promise<{
    foreground: Location.PermissionStatus;
    background: Location.PermissionStatus;
  }> {
    const foreground = await Location.getForegroundPermissionsAsync();
    const background = await Location.getBackgroundPermissionsAsync();

    return {
      foreground: foreground.status,
      background: background.status,
    };
  }
}

export { BACKGROUND_LOCATION_TASK };
