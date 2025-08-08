export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  COUNTRIES: {
    LIST: '/countries',
    CREATE: '/countries',
    UPDATE: (countryId) => `/countries/${countryId}`,
    DELETE: (countryId) => `/countries/${countryId}`
  },
  RMA:{
    CREATE:'/rma',
    LIST:'/rma',
    APPROVE: (rmaId) => `/rma/${rmaId}/approve`,
    REJECT: (rmaId) => `/rma/${rmaId}/reject`,
    MARK_EVALUATING: (rmaId) => `/rma/${rmaId}/mark-evaluating`,
    MARK_PAYMENT: (rmaId) => `/rma/${rmaId}/mark-payment`,
    MARK_PROCESSING: (rmaId) => `/rma/${rmaId}/mark-processing`,
    MARK_INSHIPPING: (rmaId) => `/rma/${rmaId}/mark-inshipping`,
    MARK_COMPLETE: (rmaId) => `/rma/${rmaId}/mark-complete`
  },
  USERS:{
    LIST: '/users',
    UPDATE_ROLE: (userId) => `/users/${userId}/role`
  },
  BRAND:{
    LIST: '/brands',
    CREATE: '/brands',
    GET_BY_ID: (brandId) => `/brands/${brandId}`,
    UPDATE: (brandId) => `/brands/${brandId}`,
    DELETE: (brandId) => `/brands/${brandId}`,
    SEARCH: '/brands/search',
    STATS: '/brands/stats'
  },
  PRODUCT:{
    LIST: '/products',
    CREATE: '/products',
    GET_BY_ID: (productId) => `/products/${productId}`,
    UPDATE: (productId) => `/products/${productId}`,
    DELETE: (productId) => `/products/${productId}`,
    SEARCH: '/products/search',
    STATS: '/products/stats'
  }

};
