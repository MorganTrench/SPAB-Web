import * as L from 'leaflet';

declare module 'leaflet' {
  namespace TileLayer {
    class Provider extends TileLayer {
      constructor(provider: string, options?: TileLayerOptions)
    }

    namespace Provider {
      const providers: ProvidersMap;

      interface ProvidersMap {
        [providerName: string]: ProviderConfig;
      }

      interface ProviderConfig {
        url: string;
        options?: TileLayerOptions;
        variants?: {[variantName: string]: string | ProviderConfig};
      }
    }
  }

  namespace tileLayer {
    function provider(provider: string, options?: TileLayerOptions): TileLayer.Provider;
  }
}