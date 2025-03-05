"use strict";

sap.ui.define(["sap/ui/core/UIComponent", "./model/models", "./env"], function (BaseComponent, ___model_models, ___env) {
  "use strict";

  const createDeviceModel = ___model_models["createDeviceModel"];
  const getConfidentialInfo = ___env["getConfidentialInfo"];
  /**
   * @namespace wisys.frontend
   */
  const Component = BaseComponent.extend("wisys.frontend.Component", {
    metadata: {
      manifest: "json"
    },
    init: function _init() {
      // Load the XLSX scripts dynamically
      this._loadScripts();
      // call the base component's init function
      BaseComponent.prototype.init.call(this);
      const oRouter = this.getRouter();
      oRouter.initialize();

      // Log route name
      this._logRouteName(oRouter);

      // set the device model
      this.setModel(createDeviceModel(), "device");
    },
    _loadScripts: function _loadScripts() {
      const scripts = ["https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.15/jspdf.plugin.autotable.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js", "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"];
      scripts.forEach(script => {
        const tag = document.createElement("script");
        tag.src = script;
        document.head.appendChild(tag);
      });
    },
    _logRouteName: function _logRouteName(oRouter) {
      const _this = this;
      const authInfo = getConfidentialInfo();
      const userLock = this.getModel("userModel");
      this.oDataModel = this?.getModel();
      oRouter.attachRouteMatched(function (ev) {
        try {
          const oRouteName = ev.getParameter("name");
          let userEmail = sap.ushell.Container?.getService("UserInfo")?.getEmail();
          if (authInfo.production === false) {
            userEmail = authInfo.mockEmail;
          }
          if (!userEmail) {
            return Promise.resolve(oRouter.navTo("RouteError"));
          }
          const userId = userEmail?.includes('@') ? userEmail.split('@')[0].toString() : userEmail.toString();
          let newUser = JSON.stringify(parseInt(userId));
          // console.log("component.ts userId", newUser)
          userLock.setProperty("/userId", newUser);
          // CPI ACL CONFIG
          // const payload = {
          // }

          // const POST = async (
          //   model: any,  // ODataV4Model
          //   entitySet: string,
          //   newData: any
          // ): Promise<any> => {
          //   return new Promise((resolve, reject) => {
          //     // Bind the entity set to the ListBinding to perform the POST
          //     const listBinding = model.bindList(entitySet);

          //     // Call the create method and pass success/error callbacks
          //     const contextBinding = listBinding.create(newData, false, {
          //       success: (createdEntity: any) => {
          //         console.log("Record created successfully!", createdEntity);
          //         resolve(createdEntity);  // Resolve with the created record data
          //       },
          //       error: (error: any) => {
          //         console.log("Error creating record:", error);
          //         reject(error);  // Reject in case of an error
          //       }
          //     });

          //     if (!contextBinding) {
          //       reject(new Error("Failed to create context binding"));
          //     }
          //   });
          // };

          // try {
          //   let userAccess2 = await POST(this.oDataModel, '/cpiAcl', payload)
          //   console.log(userAccess2)
          // } catch (error) {
          //   console.error(error)
          // }

          // const userAccess2 = await GET(this.oDataModel, `/cpiAcl`) as [];

          // console.log("userAccess2", userAccess2);
          // const userAccessEntries = userAccess2[0].feed.entry; // Access the 'entry' array inside the 'feed'
          // console.log("userAccessEntries --------------------------------------", userAccessEntries)

          // const userIds = userAccessEntries.find((entry: any) => entry.content.properties.userId === userId);
          // const userData = userIds.content.properties
          // console.log("userData", userData);
          // END CPI ACL CONFIG

          // const userAccess = await GET(this.oDataModel, `/Access_UserSet`) as []
          // const userData = userAccess.find((item: any) => item.appId === authInfo.AppId && item.userId === userId) as any
          // const userData = userAccess.find((item: any) => item.userId === userId) as any
          // console.log(userData)

          // if (!userData || !userData?.status) {
          //   return oRouter.navTo("RouteError");
          // }
          const userAuthentication = {
            reports: true,
            create: true,
            settings: true,
            analytics: true
          };
          // console.log("userAuthentication", userAuthentication)
          userLock.setProperty("/auth", userAuthentication);
          const navListModel = _this?.getModel('navList');
          const navListData = [{
            "title": "Home",
            "icon": "sap-icon://home",
            "key": "RouteHome"
          }, {
            "title": "Time Sheet",
            "icon": "sap-icon://end-user-experience-monitoring",
            "key": "RouteAttendance"
          }, {
            "title": "My Task",
            "icon": "sap-icon://activity-assigned-to-goal",
            "key": "RouteMyTask"
          }, {
            "title": "Employees",
            "icon": "sap-icon://employee",
            "key": "RouteDashboard"
          }, {
            "title": "Request Status",
            "icon": "sap-icon://step",
            "key": "RouteRequestStatus"
          }];
          if (userAuthentication?.create) {
            navListData.push({
              "title": "Add Employee",
              "icon": "sap-icon://add",
              "key": "RouteEmployee"
            }, {
              "title": "Bulk Upload",
              "icon": "sap-icon://upload-to-cloud",
              "key": "RouteBulkUpload"
            });
          }
          if (userAuthentication?.settings) {
            navListData.push({
              "title": "Settings",
              "icon": "sap-icon://action-settings",
              "key": "RouteSetting",
              "items": [{
                "title": "Workflow Approvers",
                "icon": "sap-icon://people-connected",
                "key": "RouteApprover"
              }, {
                "title": "Master Data",
                "icon": "sap-icon://database",
                "key": "RouteMasterData"
              }, {
                "title": "Reassign request",
                "icon": "sap-icon://citizen-connect",
                "key": "RouteReassign"
              }]
            });
          }
          navListModel?.setProperty("/navigation", navListData);
          const authData = userLock.getProperty("/auth");
          if (oRouteName === "RouteSettings" && !authData?.settings || oRouteName === "RouteApprover" && !authData?.settings || oRouteName === "RouteMasterData" && !authData?.settings || oRouteName === "RouteReassign" && !authData?.settings) {
            return Promise.resolve(oRouter.navTo("RouteError"));
          }
          if (oRouteName === "RouteBulkUpload" && !authData?.create) {
            return Promise.resolve(oRouter.navTo("RouteError"));
          }
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      });
    }
  });
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map
