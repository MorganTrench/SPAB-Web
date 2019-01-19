import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Toolbar2 {
    class Control {
      constructor(obj: { position: String; actions: [Action] });
      addTo(map: L.Map);
    }

    class Action {
      static extend(obj: {
        options: {
          toolbarIcon: {
            html: String;
            className?: String;
            tooltip: String;
          };
          subToolbar?: L.Toolbar;
        };
        addHooks: () => void;
      }): Action;
    }
  }
}
