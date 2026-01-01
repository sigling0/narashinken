<?php
/**
 * Plugin Name: Headless WordPress API Configuration
 * Description: カスタムREST APIエンドポイントとCORS設定を提供
 * Version: 1.0.0
 * Author: Narashinken
 */

if (!defined('ABSPATH')) {
    exit;
}

class HeadlessAPIConfig {
    
    private $allowed_origins = [];
    
    public function __construct() {
        // 許可するオリジンを設定（本番環境に合わせて変更してください）
        $this->allowed_origins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://narashinken.com', // 本番環境のドメインを追加
            'https://sigling-pg.com',
            // Vercelドメイン（*.vercel.app）は add_cors_headers() で動的に許可
        ];
        
        // REST API認証を完全にバイパス（ヘッドレスCMS用）
        add_filter('rest_authentication_errors', '__return_true', 0);
        
        // SiteGuardのREST API制限を無効化（ヘッドレスCMS用）
        add_action('plugins_loaded', [$this, 'disable_siteguard_rest_restriction'], 1);
        
        // CORSヘッダーの追加
        add_action('rest_api_init', [$this, 'add_cors_headers']);
        
        // カスタムエンドポイントの登録
        add_action('rest_api_init', [$this, 'register_custom_endpoints']);
        
        // REST APIレスポンスにカスタムフィールドを追加
        add_action('rest_api_init', [$this, 'add_custom_fields_to_api']);
        
        // メニューをREST APIで取得可能にする
        add_action('rest_api_init', [$this, 'register_menu_endpoints']);
        
        // アイキャッチ画像のサイズ情報を追加
        add_filter('rest_prepare_post', [$this, 'add_featured_image_sizes'], 10, 3);
    }
    
    /**
     * SiteGuardのREST API制限を無効化
     * ヘッドレスCMSとして使用するためにREST APIへのアクセスを許可
     */
    public function disable_siteguard_rest_restriction() {
        global $siteguard_author_query;
        
        // SiteGuardのREST API制限フィルターを削除
        if (isset($siteguard_author_query) && is_object($siteguard_author_query)) {
            remove_filter('rest_pre_dispatch', [$siteguard_author_query, 'handler_deny_rest_api'], 10);
        }
    }
    
    /**
     * CORSヘッダーの追加
     */
    public function add_cors_headers() {
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        // 完全一致またはVercelドメインをチェック
        $is_allowed = in_array($origin, $this->allowed_origins) || 
                      (strpos($origin, '.vercel.app') !== false && strpos($origin, 'https://') === 0);
        
        // ヘッドレスCMS用に全てのオリジンを許可（開発中は緩和）
        if ($is_allowed || empty($origin)) {
            remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
            add_filter('rest_pre_serve_request', function($value) use ($origin) {
                $allowed_origin = $origin ? $origin : '*';
                header('Access-Control-Allow-Origin: ' . $allowed_origin);
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, HEAD');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-WP-Nonce');
                header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages');
                return $value;
            });
        }
    }
    
    /**
     * カスタムエンドポイントの登録
     */
    public function register_custom_endpoints() {
        // サイト情報取得エンドポイント
        register_rest_route('headless/v1', '/site-info', [
            'methods' => 'GET',
            'callback' => [$this, 'get_site_info'],
            'permission_callback' => '__return_true',
        ]);
        
        // 最新投稿取得エンドポイント
        register_rest_route('headless/v1', '/recent-posts', [
            'methods' => 'GET',
            'callback' => [$this, 'get_recent_posts'],
            'permission_callback' => '__return_true',
            'args' => [
                'per_page' => [
                    'default' => 10,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);
        
        // カテゴリー別投稿取得
        register_rest_route('headless/v1', '/posts-by-category/(?P<slug>[a-zA-Z0-9-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_posts_by_category'],
            'permission_callback' => '__return_true',
        ]);
        
        // Instagram Feed取得エンドポイント
        register_rest_route('headless/v1', '/instagram-feed', [
            'methods' => 'GET',
            'callback' => [$this, 'get_instagram_feed'],
            'permission_callback' => '__return_true',
            'args' => [
                'limit' => [
                    'default' => 6,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);
        
        // Instagram Feed デバッグエンドポイント（開発用）
        register_rest_route('headless/v1', '/instagram-debug', [
            'methods' => 'GET',
            'callback' => [$this, 'debug_instagram_feed'],
            'permission_callback' => '__return_true',
        ]);
        
        // Instagram Graph API経由で投稿を取得
        register_rest_route('headless/v1', '/instagram-graph', [
            'methods' => 'GET',
            'callback' => [$this, 'get_instagram_from_graph_api'],
            'permission_callback' => '__return_true',
            'args' => [
                'limit' => [
                    'default' => 18,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);
    }
    
    /**
     * サイト情報を取得
     */
    public function get_site_info() {
        return [
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => get_bloginfo('url'),
            'language' => get_bloginfo('language'),
            'charset' => get_bloginfo('charset'),
        ];
    }
    
    /**
     * 最新投稿を取得
     */
    public function get_recent_posts($request) {
        $per_page = $request->get_param('per_page');
        
        $posts = get_posts([
            'numberposts' => $per_page,
            'post_status' => 'publish',
        ]);
        
        return array_map([$this, 'format_post'], $posts);
    }
    
    /**
     * カテゴリー別投稿を取得
     */
    public function get_posts_by_category($request) {
        $slug = $request->get_param('slug');
        $category = get_category_by_slug($slug);
        
        if (!$category) {
            return new WP_Error('invalid_category', 'Invalid category slug', ['status' => 404]);
        }
        
        $posts = get_posts([
            'category' => $category->term_id,
            'numberposts' => -1,
            'post_status' => 'publish',
        ]);
        
        return array_map([$this, 'format_post'], $posts);
    }
    
    /**
     * Instagram Feedを取得
     */
    public function get_instagram_feed($request) {
        $limit = $request->get_param('limit');
        
        // Instagram Feedプラグインのキャッシュを使用
        $feed_id = 1; // デフォルトフィードID
        $transient_name = 'sbi_' . $feed_id;
        
        if (class_exists('SB_Instagram_Cache')) {
            $cache = new SB_Instagram_Cache($transient_name, 1);
            $cache->retrieve_and_set();
            $post_data = $cache->get('posts');
            
            if (!empty($post_data)) {
                $decoded_posts = json_decode($post_data, true);
                
                if (is_array($decoded_posts) && !empty($decoded_posts)) {
                    $posts = [];
                    $count = 0;
                    
                    foreach ($decoded_posts as $post) {
                        if ($count >= $limit) break;
                        
                        // メディアURLを取得
                        $media_url = '';
                        if (isset($post['media_url'])) {
                            $media_url = $post['media_url'];
                        } elseif (isset($post['thumbnail_url'])) {
                            $media_url = $post['thumbnail_url'];
                        }
                        
                        if (empty($media_url)) {
                            continue;
                        }
                        
                        $posts[] = [
                            'id' => $post['id'] ?? '',
                            'media_url' => $media_url,
                            'permalink' => $post['permalink'] ?? '',
                            'caption' => $post['caption'] ?? '',
                            'media_type' => $post['media_type'] ?? 'IMAGE',
                            'timestamp' => $post['timestamp'] ?? '',
                            'username' => $post['username'] ?? '',
                        ];
                        
                        $count++;
                    }
                    
                    return [
                        'count' => count($posts),
                        'posts' => $posts,
                    ];
                }
            }
        }
        
        // フォールバック: データがない場合
        return [
            'count' => 0,
            'posts' => [],
            'message' => 'No Instagram posts found. Please configure Instagram Feed plugin.',
        ];
    }
    
    /**
     * Instagram Graph APIから投稿を取得
     */
    public function get_instagram_from_graph_api($request) {
        $limit = $request->get_param('limit');
        
        // アクセストークン（定数またはオプションから取得）
        $access_token = defined('INSTAGRAM_GRAPH_ACCESS_TOKEN') 
            ? INSTAGRAM_GRAPH_ACCESS_TOKEN 
            : get_option('instagram_graph_access_token', '');
        
        if (empty($access_token)) {
            return [
                'count' => 0,
                'posts' => [],
                'message' => 'Instagram access token not configured.',
                'debug' => [
                    'token_from_constant' => defined('INSTAGRAM_GRAPH_ACCESS_TOKEN'),
                    'token_from_option' => !empty(get_option('instagram_graph_access_token', '')),
                    'token_length' => 0,
                ],
            ];
        }
        
        // アクセストークンの形式を確認（簡易チェック）
        $token_length = strlen($access_token);
        if ($token_length < 50) {
            return [
                'count' => 0,
                'posts' => [],
                'message' => 'Instagram access token appears to be invalid (too short).',
                'debug' => [
                    'token_length' => $token_length,
                ],
            ];
        }
        
        // ユーザー情報を取得（プロフィール写真を含む）
        $user_fields = 'id,username,account_type,media_count';
        $user_api_url = "https://graph.instagram.com/me?fields={$user_fields}&access_token={$access_token}";
        
        $user_response = wp_remote_get($user_api_url, [
            'timeout' => 15,
        ]);
        
        $profile_picture_url = '';
        $account_username = '';
        $user_error = null;
        
        if (is_wp_error($user_response)) {
            $user_error = $user_response->get_error_message();
        } else {
            $user_body = wp_remote_retrieve_body($user_response);
            $user_data = json_decode($user_body, true);
            $user_response_code = wp_remote_retrieve_response_code($user_response);
            
            if ($user_response_code !== 200 || isset($user_data['error'])) {
                $user_error = isset($user_data['error']) 
                    ? $user_data['error']['message'] ?? 'Unknown error'
                    : 'HTTP ' . $user_response_code;
            } else {
                $account_username = $user_data['username'] ?? '';
            }
        }
        
        // Instagram Graph APIで投稿を取得
        $user_id = 'me';
        $fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,username';
        $api_url = "https://graph.instagram.com/{$user_id}/media?fields={$fields}&limit={$limit}&access_token={$access_token}";
        
        // APIリクエスト
        $response = wp_remote_get($api_url, [
            'timeout' => 15,
        ]);
        
        if (is_wp_error($response)) {
            return [
                'count' => 0,
                'posts' => [],
                'message' => 'Failed to fetch Instagram data: ' . $response->get_error_message(),
            ];
        }
        
        $body = wp_remote_retrieve_body($response);
        $response_code = wp_remote_retrieve_response_code($response);
        $data = json_decode($body, true);
        
        // デバッグ情報を追加
        $debug_info = [
            'response_code' => $response_code,
            'has_data_key' => isset($data['data']),
            'data_is_array' => is_array($data['data'] ?? null),
            'data_count' => is_array($data['data'] ?? null) ? count($data['data']) : 0,
            'has_error' => isset($data['error']),
        ];
        
        // エラーレスポンスの場合
        if (isset($data['error'])) {
            return [
                'count' => 0,
                'posts' => [],
                'message' => 'Instagram API Error: ' . ($data['error']['message'] ?? 'Unknown error'),
                'error_code' => $data['error']['code'] ?? null,
                'error_type' => $data['error']['type'] ?? null,
                'debug' => $debug_info,
            ];
        }
        
        // レスポンスコードが200以外の場合
        if ($response_code !== 200) {
            return [
                'count' => 0,
                'posts' => [],
                'message' => 'Instagram API returned status code: ' . $response_code,
                'response_body' => $body,
                'debug' => $debug_info,
            ];
        }
        
        if (!isset($data['data']) || empty($data['data'])) {
            return [
                'count' => 0,
                'posts' => [],
                'message' => 'No Instagram posts found in API response.',
                'debug' => $debug_info,
                'response_sample' => substr($body, 0, 500), // 最初の500文字を返す
            ];
        }
        
        // 最初の投稿からプロフィール写真として使用する画像を取得
        if (!empty($data['data'])) {
            $first_post = $data['data'][0];
            if (isset($first_post['media_url'])) {
                $profile_picture_url = $first_post['media_url'];
            } elseif (isset($first_post['thumbnail_url'])) {
                $profile_picture_url = $first_post['thumbnail_url'];
            }
        }
        
        $posts = [];
        foreach ($data['data'] as $post) {
            // メディアURLを取得
            $media_url = '';
            if (isset($post['media_url'])) {
                $media_url = $post['media_url'];
            } elseif (isset($post['thumbnail_url'])) {
                $media_url = $post['thumbnail_url'];
            }
            
            if (empty($media_url)) {
                continue;
            }
            
            $posts[] = [
                'id' => $post['id'],
                'media_url' => $media_url,
                'permalink' => $post['permalink'] ?? '',
                'caption' => $post['caption'] ?? '',
                'media_type' => $post['media_type'] ?? 'IMAGE',
                'timestamp' => $post['timestamp'] ?? '',
                'username' => $post['username'] ?? '',
            ];
        }
        
        return [
            'count' => count($posts),
            'posts' => $posts,
            'username' => $account_username ?: ($posts[0]['username'] ?? ''),
            'profile_picture_url' => $profile_picture_url,
            'user_info_error' => $user_error, // ユーザー情報取得時のエラー（あれば）
        ];
    }
    
    /**
     * Instagram Feed デバッグ情報を取得
     */
    public function debug_instagram_feed($request) {
        global $wpdb;
        
        $posts_table = $wpdb->prefix . 'sbi_instagram_posts';
        $sources_table = $wpdb->prefix . 'sbi_sources';
        $feeds_table = $wpdb->prefix . 'sbi_feeds';
        
        $debug_info = [
            'tables' => [],
            'plugin_options' => [],
            'sample_data' => [],
        ];
        
        // テーブルの存在確認
        $debug_info['tables']['sbi_instagram_posts'] = $wpdb->get_var("SHOW TABLES LIKE '$posts_table'") === $posts_table;
        $debug_info['tables']['sbi_sources'] = $wpdb->get_var("SHOW TABLES LIKE '$sources_table'") === $sources_table;
        $debug_info['tables']['sbi_feeds'] = $wpdb->get_var("SHOW TABLES LIKE '$feeds_table'") === $feeds_table;
        
        // 投稿数カウント
        if ($debug_info['tables']['sbi_instagram_posts']) {
            $debug_info['posts_count'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM $posts_table");
            $debug_info['posts_with_json'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM $posts_table WHERE json_data != ''");
            
            $feeds_posts_table = $wpdb->prefix . 'sbi_feeds_posts';
            $debug_info['posts_in_feeds'] = (int) $wpdb->get_var(
                "SELECT COUNT(DISTINCT p.id) 
                FROM $posts_table AS p 
                INNER JOIN $feeds_posts_table AS fp ON p.id = fp.id 
                WHERE p.json_data != ''"
            );
            
            // サンプルデータ取得（直接取得）
            if ($debug_info['posts_count'] > 0) {
                $sample = $wpdb->get_row(
                    "SELECT instagram_id, time_stamp, LENGTH(json_data) as json_length 
                    FROM $posts_table
                    WHERE json_data != '' AND json_data != 'null'
                    ORDER BY time_stamp DESC 
                    LIMIT 1",
                    ARRAY_A
                );
                $debug_info['sample_data'] = $sample;
                
                // json_dataの内容を確認
                $full_data = $wpdb->get_var(
                    "SELECT json_data 
                    FROM $posts_table
                    WHERE json_data != '' AND json_data != 'null'
                    ORDER BY time_stamp DESC 
                    LIMIT 1"
                );
                if ($full_data) {
                    // まずJSONとして試す
                    $decoded = json_decode($full_data, true);
                    $debug_info['json_decode_success'] = $decoded !== null;
                    $debug_info['json_error'] = json_last_error_msg();
                    
                    // JSONでない場合、シリアライズデータとして試す
                    if (!$decoded) {
                        $decoded = @unserialize($full_data);
                        $debug_info['unserialize_success'] = $decoded !== false;
                        $debug_info['data_format'] = 'serialized';
                    } else {
                        $debug_info['data_format'] = 'json';
                    }
                    
                    if ($decoded && is_array($decoded)) {
                        $debug_info['json_keys'] = array_keys($decoded);
                        
                        // 実際のAPIと同じ処理をテスト
                        $media_url = '';
                        if (isset($decoded['media_url'])) {
                            $media_url = $decoded['media_url'];
                        } elseif (isset($decoded['thumbnail_url'])) {
                            $media_url = $decoded['thumbnail_url'];
                        }
                        $debug_info['test_media_url'] = $media_url;
                        $debug_info['has_permalink'] = isset($decoded['permalink']);
                        $debug_info['has_username'] = isset($decoded['username']);
                    }
                } else {
                    $debug_info['json_data_empty'] = true;
                }
            }
        }
        
        // ソース数カウント
        if ($debug_info['tables']['sbi_sources']) {
            $debug_info['sources_count'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM $sources_table");
        }
        
        // フィード数カウント
        if ($debug_info['tables']['sbi_feeds']) {
            $debug_info['feeds_count'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM $feeds_table");
        }
        
        // プラグイン設定
        $debug_info['plugin_options']['sb_instagram_settings'] = get_option('sb_instagram_settings', 'not_found');
        $debug_info['plugin_options']['sbi_ver'] = get_option('sbi_ver', 'not_found');
        
        return $debug_info;
    }
    
    /**
     * 投稿データのフォーマット
     */
    private function format_post($post) {
        $featured_image = null;
        if (has_post_thumbnail($post->ID)) {
            $thumbnail_id = get_post_thumbnail_id($post->ID);
            $featured_image = [
                'url' => get_the_post_thumbnail_url($post->ID, 'full'),
                'alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true),
                'sizes' => [
                    'thumbnail' => get_the_post_thumbnail_url($post->ID, 'thumbnail'),
                    'medium' => get_the_post_thumbnail_url($post->ID, 'medium'),
                    'large' => get_the_post_thumbnail_url($post->ID, 'large'),
                    'full' => get_the_post_thumbnail_url($post->ID, 'full'),
                ],
            ];
        }
        
        return [
            'id' => $post->ID,
            'title' => get_the_title($post->ID),
            'slug' => $post->post_name,
            'excerpt' => get_the_excerpt($post->ID),
            'content' => apply_filters('the_content', $post->post_content),
            'date' => get_the_date('c', $post->ID),
            'modified' => get_the_modified_date('c', $post->ID),
            'author' => get_the_author_meta('display_name', $post->post_author),
            'categories' => wp_get_post_categories($post->ID, ['fields' => 'all']),
            'tags' => wp_get_post_tags($post->ID),
            'featured_image' => $featured_image,
            'link' => get_permalink($post->ID),
        ];
    }
    
    /**
     * メニューエンドポイントの登録
     */
    public function register_menu_endpoints() {
        register_rest_route('headless/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menus'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('headless/v1', '/menus/(?P<location>[a-zA-Z0-9_-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menu_by_location'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    /**
     * すべてのメニューを取得
     */
    public function get_menus() {
        $menus = wp_get_nav_menus();
        $menu_list = [];
        
        foreach ($menus as $menu) {
            $menu_list[] = [
                'id' => $menu->term_id,
                'name' => $menu->name,
                'slug' => $menu->slug,
                'items' => $this->get_menu_items($menu->term_id),
            ];
        }
        
        return $menu_list;
    }
    
    /**
     * 場所別メニューを取得
     */
    public function get_menu_by_location($request) {
        $location = $request->get_param('location');
        $locations = get_nav_menu_locations();
        
        // メニューが設定されていない場合は空のメニューを返す（404エラーにしない）
        if (!isset($locations[$location])) {
            return [
                'location' => $location,
                'items' => [],
            ];
        }
        
        return [
            'location' => $location,
            'items' => $this->get_menu_items($locations[$location]),
        ];
    }
    
    /**
     * メニューアイテムを取得
     */
    private function get_menu_items($menu_id) {
        $items = wp_get_nav_menu_items($menu_id);
        if (!$items) return [];
        
        return array_map(function($item) {
            return [
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'target' => $item->target,
                'classes' => implode(' ', $item->classes),
                'parent' => $item->menu_item_parent,
            ];
        }, $items);
    }
    
    /**
     * カスタムフィールドをAPIレスポンスに追加
     */
    public function add_custom_fields_to_api() {
        register_rest_field('post', 'acf_fields', [
            'get_callback' => function($post) {
                // ACF（Advanced Custom Fields）が有効な場合
                if (class_exists('ACF') && function_exists('get_fields')) {
                    return get_fields($post['id']);
                }
                return null;
            },
            'schema' => null,
        ]);
    }
    
    /**
     * アイキャッチ画像のサイズ情報を追加
     */
    public function add_featured_image_sizes($response, $post, $request) {
        if (!has_post_thumbnail($post->ID)) {
            return $response;
        }
        
        $thumbnail_id = get_post_thumbnail_id($post->ID);
        $image_sizes = [];
        
        foreach (['thumbnail', 'medium', 'large', 'full'] as $size) {
            $image_url = get_the_post_thumbnail_url($post->ID, $size);
            if ($image_url) {
                $image_sizes[$size] = $image_url;
            }
        }
        
        $response->data['featured_image_sizes'] = $image_sizes;
        $response->data['featured_image_alt'] = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
        
        return $response;
    }
}

// プラグインの初期化
new HeadlessAPIConfig();

