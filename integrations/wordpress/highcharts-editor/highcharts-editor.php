<?php
/**
* Plugin Name: Highcharts
* Description: Highcharts editor integration
* Version: 1.0
* Author: Highcharts
* License: mit
*/

function init_highcharts_plugin( $plugins ) {
     $plugins['highcharts'] = plugin_dir_url(__FILE__) . '/editor_plugin.js';
     $plugins['noneditable'] = plugin_dir_url(__FILE__) . '/noneditable.js';
     return $plugins;
}

function add_tinymce_toolbar_button( $buttons ) {
    array_push($buttons, '|', 'highcharts', '|');
    return $buttons;
}

function highcharts_allow_stuff($initArray) {
    $initArray['extended_valid_elements'] .= ',div[id|style|class],a[*],altGlyph[*],altGlyphDef[*],altGlyphItem[*],animate[*],animateColor[*],animateMotion[*],animateTransform[*],circle[*],clipPath[*],color-profile[*],cursor[*],defs[*],desc[*],ellipse[*],feBlend[*],feColorMatrix[*],feComponentTransfer[*],feComposite[*],feConvolveMatrix[*],feDiffuseLighting[*],feDisplacementMap[*],feDistantLight[*],feFlood[*],feFuncA[*],feFuncB[*],feFuncG[*],feFuncR[*],feGaussianBlur[*],feImage[*],feMerge[*],feMergeNode[*],feMorphology[*],feOffset[*],fePointLight[*],feSpecularLighting[*],feSpotLight[*],feTile[*],feTurbulence[*],filter[*],font[*],font-face[*],font-face-format[*],font-face-name[*],font-face-src[*],font-face-uri[*],foreignObject[*],g[*],glyph[*],glyphRef[*],hkern[*],image[*],line[*],linearGradient[*],marker[*],mask[*],metadata[*],missing-glyph[*],mpath[*],path[*],pattern[*],polygon[*],polyline[*],radialGradient[*],rect[*],script[*],set[*],stop[*],style[*],svg[*],switch[*],symbol[*],text[*],textPath[*],title[*],tref[*],tspan[*],use[*],view[*],vkern[*]';

    return $initArray;
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
    add_filter('tiny_mce_before_init', 'highcharts_allow_stuff');

    wp_enqueue_script("highcharts-highcharts", "https://code.highcharts.com/highcharts.js");    
    wp_enqueue_script("highcharts-framework", "http://code.highcharts.com/adapters/standalone-framework.js");  
    wp_enqueue_script("highcharts-more", "https://code.highcharts.com/highcharts-more.js");   
    wp_enqueue_script("highcharts-3d", "https://code.highcharts.com/highcharts-3d.js"); 
    wp_enqueue_script("highcharts-highstock", "https://code.highcharts.com/stock/highstock.js");   
    wp_enqueue_script("highcharts-data", "https://code.highcharts.com/modules/data.js");  
    wp_enqueue_script("highcharts-exporting", "https://code.highcharts.com/modules/exporting.js");

    wp_enqueue_script('highcharts-editor', plugin_dir_url(__FILE__) . 'highcharts-editor.min.js', array(
        //"highcharts-highcharts",
        "highcharts-highstock",
        "highcharts-framework",
        "highcharts-more",
        "highcharts-3d",
        "highcharts-data",
        "highcharts-exporting"
    ));        

    wp_enqueue_style('highcharts-editor', plugin_dir_url(__FILE__) . 'highcharts-editor.min.css');        

    wp_enqueue_style('highcharts-gfonts', 'https://fonts.googleapis.com/css?family=Roboto:400,300,100,700|Source Sans:400,300,100');
    wp_enqueue_style('fontawesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css');

    wp_localize_script('highcharts-editor', 'WPURLS', array( 
        'siteurl' => get_option('siteurl'),
        'pluginurl' => plugin_dir_url(__FILE__) 
    ));
}

add_action('init', 'setup_highcharts_plugin');

?>