

export type ApiResponse<T> = {
  status: string;
  data: T;
}

// Auth Types
export type LoginRequest = {
  username: string;
  password: string;
}

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: UserData;
}

export type RefreshTokenRequest = {
  refresh_token: string;
}

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
}

// User Types
export type UserData = {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  age: number;
}

export type UserProfile = UserData & {
  refresh_token: string;
}

export type UpdateUserRequest = {
  username?: string;
  email?: string;
  phone_number?: string;
  age?: number;
}

export type UpdateProfileRequest = {
  username: string;
  email: string;
  phone_number: string;
  age: number;
}

export type UpdateProfileResponse = {
  refresh_token: string;
}

export type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
}

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  age: number;
}

// Delivery Types
export type DeliveryData = {
  id: string;
  worker_id: string;
  truck_id: string;
  route_id: string;
  add_by_operator_id: string;
  started_at: number;
  finished_at?: number;
}

export type TransitPointData = {
  id: number;
  loading_city_id: number;
  unloading_city_id: number;
  estimated_duration_minute: number;
  cargo_type: string;
  extra_cost: number;
  is_active: boolean;
}

export type DeliveryTransitData = {
  id: string;
  transit_point: TransitPointData;
  arrived_at: number;
  is_accepted: boolean;
  reason: string;
  actioned_at: number;
  action_by_operator_id: string;
}

// Extended transit data with all nested info for display
export type TransitWithDetailsData = DeliveryTransitData & {
  delivery_id: string;
  operator?: UserData;
  delivery?: DeliveryData;
  loading_city_name?: string;
  unloading_city_name?: string;
}

export type DeliveryAlertData = {
  id: string;
  type: string;
  message: string;
  created_at: number;
}

export type DeliveryDetailData = DeliveryData & {
  transits: DeliveryTransitData[];
  alerts: DeliveryAlertData[];
}

export type CreateDeliveryRequest = {
  worker_id: string;
  truck_id: string;
  route_id: string;
  latitude: number;
  longitude: number;
}

export type TakeoverDeliveryRequest = {
  delivery_id: string;
  from_worker_id: string;
  to_worker_id: string;
  handover_at: number;
  reason: string;
}

export type TakeoverLogData = {
  delivery_id: string;
  from_worker: string;
  to_worker: string;
  handover_at: number;
  reason: string;
  action_by_operator: string;
}

// Transit Types
export type TransitData = {
  id: string;
  delivery_id: string;
  transit_point_id: number;
  arrived_at: number;
  is_accepted: boolean;
  actioned_at: number;
  reason: string;
  action_by_operator_id: string;
}

export type AcceptTransitRequest = {
  reason?: string;
}

export type RejectTransitRequest = {
  reason: string;
}

// Truck Types
export type TruckData = {
  id: string;
  license_plate: string;
  model: string;
  cargo_type: string;
  capacity_kg: number;
  is_available: boolean;
}

export type CreateTruckRequest = {
  license_plate: string;
  model: string;
  cargo_type: string;
  capacity_kg: number;
  is_available: boolean;
}

export type UpdateTruckRequest = {
  license_plate?: string;
  model?: string;
  cargo_type?: string;
  capacity_kg?: number;
  is_available?: boolean;
}

// Route Types
export type RouteData = {
  id: string;
  start_city_name: string;
  end_city_name: string;
  details: string;
  cargo_type: string;
  base_price: number;
  distance_km: number;
  estimated_duration_hours: number;
  is_active: boolean;
  created_at: number;
}

export type CreateRouteRequest = {
  start_city_id: string;
  end_city_id: string;
  details: string;
  cargo_type: string;
  base_price: number;
  distance_km: number;
  estimated_duration_hours: number;
  is_active: boolean;
}

export type UpdateRouteRequest = {
  start_city_id?: string;
  end_city_id?: string;
  details?: string;
  cargo_type?: string;
  base_price?: number;
  distance_km?: number;
  estimated_duration_hours?: number;
  is_active?: boolean;
}

// Tracking Types
export type Position = {
  latitude: number;
  longitude: number;
  name: string;
  city: string;
  state: string;
  country: string;
  formatted_address: string;
  plus_code: string;
  recorded_at: number;
}

export type TrackingData = {
  status: string;
  data: Position[];
}
