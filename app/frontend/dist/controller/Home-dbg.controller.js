"use strict";

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"], function (Controller, UIComponent) {
  "use strict";

  /**
   * @namespace wisys.frontend.controller
   */
  const Home = Controller.extend("wisys.frontend.controller.Home", {
    onInit: function _onInit() {
      this.router = UIComponent.getRouterFor(this);
    },
    onPressTile: function _onPressTile(ev) {
      let app = ev.getSource().getCustomData()[0];
      this.router.navTo(app.getKey());
    }
  });
  return Home;
});
//# sourceMappingURL=Home-dbg.controller.js.map
