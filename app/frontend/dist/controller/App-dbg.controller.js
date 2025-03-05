"use strict";

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "../env"], function (Controller, UIComponent, ___env) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const getConfidentialInfo = ___env["getConfidentialInfo"];
  /**
   * @namespace wisys.frontend.controller
   */
  const App = Controller.extend("wisys.frontend.controller.App", {
    /*eslint-disable @typescript-eslint/no-empty-function*/onInit: function _onInit() {
      this.router = UIComponent.getRouterFor(this);
      this.onMenuButtonPress();
    },
    onBeforeRendering: function _onBeforeRendering() {
      this.userAuthentication();
    },
    userAuthentication: function _userAuthentication() {
      try {
        const _this = this;
        const authInfo = getConfidentialInfo();
        let userEmail = sap.ushell.Container?.getService("UserInfo")?.getEmail();
        if (authInfo.production === false) {
          userEmail = authInfo.mockEmail;
        }
        if (userEmail) {
          let userId = userEmail?.includes('@') ? userEmail.split('@')[0].toString() : userEmail.toString();
          _this.validatingUser(userId);
        }
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    },
    validatingUser: function _validatingUser(userId) {
      try {
        const _this2 = this;
        // Get the OData model from the view
        const oModel = _this2.getView()?.getModel();

        // Ensure the model is available
        if (!oModel) {
          throw new Error("OData model is not available.");
        }

        // Bind the action context
        const oActionODataContextBinding = oModel.bindContext("/sfUser1(...)");

        // Set the action parameter
        oActionODataContextBinding.setParameter("userId", userId);

        // Execute the action
        const _temp = _catch(function () {
          return Promise.resolve(oActionODataContextBinding.execute()).then(function () {
            const oActionContext = oActionODataContextBinding.getBoundContext();
            // Log or process the result
            if (oActionContext) {
              let data = oActionContext.getObject().value[0];
              let insertUserData = _this2.getOwnerComponent()?.getModel('userModel');
              insertUserData?.setData({
                "userId": data?.userId,
                "userEmail": data?.username,
                "userLocation": data?.city,
                "userName": data?.displayName,
                "position": data?.title,
                "nationality": data?.nationality,
                "grade": data?.payGrade,
                "department": data?.division,
                "section": data?.department,
                "location": data?.city,
                "managerName": data?.manager?.displayName,
                "managerId": data?.manager?.userId,
                "managerEmail": data?.manager?.username
              });
              insertUserData.updateBindings(true);
              _this2.getView()?.setBusy(false);
            } else {}
          });
        }, function (error) {
          debugger;
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    onMenuButtonPress: function _onMenuButtonPress() {
      let toolPage = this.byId("toolPage");
      toolPage?.setSideExpanded(!toolPage?.getSideExpanded());
    },
    onItemSelect: function _onItemSelect(ev) {
      let item = ev.getParameter("item").getKey();
      this.router.navTo(item);
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map
