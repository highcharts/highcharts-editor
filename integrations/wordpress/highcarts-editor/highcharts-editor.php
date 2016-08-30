<?php
/**
* Plugin Name: Highcharts
* Description: Highcharts 
* Version: 1.0
* Author: Highsoft
* License: mit
*/

function init_highcharts_plugin( $plugins ) {
     $plugins['highcharts'] = plugin_dir_url(__FILE__) . '/editor_plugin.js';
     $plugins['noneditable'] = plugin_dir_url(__FILE__) . '/noneditable.js';
     return $plugins;
}

function add_tinymce_toolbar_button( $buttons ) {
    array_push($buttons, '|', 'highcharts');
    return $buttons;
}

function setup_highcharts_plugin () {
    if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
         return;
    }

    if (get_user_option('rich_editing') !== 'true') {
        return;
    }

    add_filter('mce_external_plugins','init_highcharts_plugin');
    add_filter('mce_buttons', 'add_tinymce_toolbar_button');

    wp_enqueue_script("highcharts-highcharts", "https://code.highcharts.com/highcharts.js");    
    wp_enqueue_script("highcharts-framework", "http://code.highcharts.com/adapters/standalone-framework.js");  
    wp_enqueue_script("highcharts-more", "https://code.highcharts.com/highcharts-more.js");   
    wp_enqueue_script("highcharts-3d", "https://code.highcharts.com/highcharts-3d.js"); 
    wp_enqueue_script("highcharts-highstock", "https://code.highcharts.com/stock/highstock.js");   
    wp_enqueue_script("highcharts-data", "https://code.highcharts.com/modules/data.js");  
    wp_enqueue_script("highcharts-exporting", "https://code.highcharts.com/modules/exporting.js");

    wp_enqueue_script('highcharts-editor', plugin_dir_url(__FILE__) . 'highcharts-editor.min.js', array(
        "highcharts-highcharts",
        "highcharts-framework",
        "highcharts-more",
        "highcharts-3d",
        "highcharts-highstock",
        "highcharts-data",
        "highcharts-exporting"
    ));        

    wp_enqueue_style('highcharts-editor', plugin_dir_url(__FILE__) . 'highcharts-editor.min.css');        

    wp_enqueue_style('highcharts-gfonts', 'https://fonts.googleapis.com/css?family=Roboto:400,300,100,700|Source Sans:400,300,100');
    wp_enqueue_style('fontawesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css');
}

add_action('init', 'setup_highcharts_plugin');

?>