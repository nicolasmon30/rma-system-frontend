// src/components/common/LoadingStates.jsx
import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Skeleton para una fila de la tabla de usuarios
 */
export const UserRowSkeleton = () => (
  <div className="animate-pulse border-b border-gray-200 last:border-b-0">
    <div className="p-4 flex items-center space-x-4">
      {/* User info skeleton */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      {/* Country skeleton */}
      <div className="w-24 space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
      
      {/* Role badge skeleton */}
      <div className="w-20">
        <div className="h-6 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Date skeleton */}
      <div className="w-24">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
      
      {/* Action button skeleton */}
      <div className="w-28">
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * Skeleton para la tabla completa de usuarios
 */
export const UserTableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    {/* Header skeleton */}
    <div className="border-b border-gray-200 p-4 bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse ml-auto"></div>
      </div>
    </div>
    
    {/* Rows skeleton */}
    {Array.from({ length: rows }).map((_, index) => (
      <UserRowSkeleton key={index} />
    ))}
  </div>
);