<div class="wrap">
  
<h2>Highcharts Editor Settings</h2>

<form method="post" action="options.php">
  <?php settings_fields('highcharts-editor'); ?>
  <?php do_settings_sections('highcharts-editor'); ?>

  <table class="form-table">
    <tr valign="top">
      <th scope="row">Enable Highstock Support</th>
      <td><input type="checkbox" name="enable_highstock" value="1" <?php if(esc_attr(get_option('enable_highstock')) == 1) { echo "checked";} ?>/></td>
    </tr>

    <tr valign="top">
      <th scope="row">Enable Highmaps Support</th>
      <td><input type="checkbox" name="enable_highmaps" value="1" <?php if(esc_attr(get_option('enable_highmaps')) == 1) { echo "checked";} ?>/></td>
    </tr>

    <tr valign="top">
      <th scope="row">Enable Advanced Mode</th>
      <td><input type="checkbox" name="enable_advanced" value="1" <?php if(esc_attr(get_option('enable_advanced')) == 1) { echo "checked";} ?>/></td>
    </tr>


  </table>

  <?php submit_button(); ?>

</form>

<b>Note</b> Using Highcharts/Highstock/Highmaps requires a valid license. Please visit <a href="http://www.highcharts.com/products/highcharts-editor" target="_blank">the Highcharts Editor product page</a> for more information.

</div>
