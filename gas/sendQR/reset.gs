function reset() {
    var safety = false;
    //safety = true;
    if (safety) {
      var pro = { "id": "100000" };
      PropertiesService.getScriptProperties().setProperties(pro);
          Logger.log("リセットしました")
    }
    else{
      Logger.log("安全装置が解除されていません")
    }
  }
  