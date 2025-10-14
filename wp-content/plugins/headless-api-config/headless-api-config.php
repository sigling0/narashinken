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
            // 必要に応じてステージング環境なども追加
        ];
        
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
     * CORSヘッダーの追加
     */
    public function add_cors_headers() {
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (in_array($origin, $this->allowed_origins)) {
            remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
            add_filter('rest_pre_serve_request', function($value) use ($origin) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
        
        if (!isset($locations[$location])) {
            return new WP_Error('invalid_location', 'Invalid menu location', ['status' => 404]);
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

