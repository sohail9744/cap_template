import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
/**
 * @namespace wisys.frontend.controller
 */
export default class Home extends Controller {
  /*eslint-disable @typescript-eslint/no-empty-function*/
  private router: Router;
  public onInit(): void {
    this.router = UIComponent.getRouterFor(this);
  }

  onPressTile(ev: any): void {
    let app = ev.getSource().getCustomData()[0];
    this.router.navTo(app.getKey());
  }
}
