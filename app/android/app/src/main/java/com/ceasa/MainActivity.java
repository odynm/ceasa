package com.primatas.ceasa;

public class MainActivity extends CeasaActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Ceasa";
  }
}
