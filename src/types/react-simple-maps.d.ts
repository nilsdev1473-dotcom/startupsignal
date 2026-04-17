declare module 'react-simple-maps' {
  import { FC, ReactNode } from 'react';
  export const ComposableMap: FC<{ projection?: string; style?: object; projectionConfig?: object; children?: ReactNode }>;
  export interface GeoFeature { rsmKey: string; properties: Record<string, unknown>; }
  export const Geographies: FC<{ geography: string; children: (props: { geographies: GeoFeature[] }) => ReactNode }>;
  export const Geography: FC<{ geography: object; key?: string; fill?: string; stroke?: string; strokeWidth?: number; style?: object; onMouseEnter?: (e: React.MouseEvent) => void; onMouseLeave?: () => void }>;
  export const Marker: FC<{ coordinates: [number, number]; children?: ReactNode }>;
  export const ZoomableGroup: FC<{ center?: [number, number]; zoom?: number; children?: ReactNode }>;
}
