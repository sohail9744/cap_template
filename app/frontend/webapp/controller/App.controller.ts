import Controller from "sap/ui/core/mvc/Controller";
import ToolPage from "sap/tnt/ToolPage";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import { getConfidentialInfo } from "../env";
import MessageBox from "sap/m/MessageBox";
import { FETCH_POST, GET, POST } from "../utlity/apiCall";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FilterOperator from "sap/ui/model/FilterOperator";
/**
 * @namespace wisys.frontend.controller
 */
export default class App extends Controller {
  public router: any;
  private oDataModel: any
  /*eslint-disable @typescript-eslint/no-empty-function*/
  onInit(): void {
    this.router = UIComponent.getRouterFor(this);
    this.onMenuButtonPress();
  }

  public onBeforeRendering(): void {
    this.userAuthentication()
  }

  async userAuthentication() {

    const authInfo = getConfidentialInfo();
    let userEmail = ((sap.ushell as any).Container?.getService("UserInfo") as any)?.getEmail();

    if (authInfo.production === false) { userEmail = authInfo.mockEmail }
    console.log("App.controller.js User Email", userEmail)

    if (userEmail) {
      let userId = userEmail?.includes('@') ? userEmail.split('@')[0].toString() : userEmail.toString()
      this.validatingUser(userId)
    }
  }

  protected async validatingUser(userId: any) {
    // Get the OData model from the view
    const oModel = this.getView()?.getModel() as ODataModel;

    // Ensure the model is available
    if (!oModel) {
      throw new Error("OData model is not available.");
    }

    // Bind the action context
    const oActionODataContextBinding = oModel.bindContext("/sfUser1(...)");

    // Set the action parameter
    oActionODataContextBinding.setParameter("userId", userId);

    // Execute the action
    try {
      await oActionODataContextBinding.execute();
      const oActionContext = oActionODataContextBinding.getBoundContext();
      // Log or process the result
      if (oActionContext) {
        let data = oActionContext.getObject().value[0]
        console.log({
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
          "managerEmail": data?.manager?.username,
        })

        let insertUserData = this.getOwnerComponent()?.getModel('userModel') as JSONModel
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
          "managerEmail": data?.manager?.username,
        })
        insertUserData.updateBindings(true)
        this.getView()?.setBusy(false)
      } else {
        console.warn("Action executed successfully, but no context returned.");
      }
    } catch (error) {
      debugger
      console.error("Error executing the action:", error);
    }
  }

  protected onMenuButtonPress(): void {
    let toolPage = this.byId("toolPage") as ToolPage;
    toolPage?.setSideExpanded(!toolPage?.getSideExpanded());
  }
  protected onItemSelect(ev: any): void {
    let item = ev.getParameter("item").getKey();
    this.router.navTo(item);
  }
}
