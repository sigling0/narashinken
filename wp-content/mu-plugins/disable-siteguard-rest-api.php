<?php
/**
 * Plugin Name: Disable SiteGuard REST API Restriction
 * Description: ヘッドレスCMS用にSiteGuardのREST API制限を無効化
 * Version: 1.0.0
 * Author: Narashinken
 */

// SiteGuardのREST API制限設定を強制的にOFFにする
add_action('plugins_loaded', function() {
    global $siteguard_config;
    
    if (isset($siteguard_config) && is_object($siteguard_config)) {
        // REST API制限を無効化
        $siteguard_config->set('disable_restapi_enable', '0');
        $siteguard_config->update();
    }
}, 0); // 優先度0で最優先実行

// さらに確実にするため、rest_pre_dispatchフィルターも追加
add_filter('rest_pre_dispatch', function($result, $wp_rest_server, $request) {
    // SiteGuardのフィルターを削除
    global $siteguard_author_query;
    
    if (isset($siteguard_author_query) && is_object($siteguard_author_query)) {
        remove_filter('rest_pre_dispatch', [$siteguard_author_query, 'handler_deny_rest_api'], 10);
    }
    
    return $result;
}, 1, 3); // 優先度1で早期実行

// REST APIアクセスを常に許可
add_filter('rest_authentication_errors', function($result) {
    // 既にエラーがある場合は何もしない
    if (is_wp_error($result)) {
        return $result;
    }
    
    // REST APIアクセスを許可
    return true;
}, 0);

