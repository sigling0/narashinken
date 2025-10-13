<?php 
/* css・jsの読み込み */
function my_enqueue_scripts() {
    // cssの読み込み(共通)
    wp_enqueue_style(
        "common-css", 
        get_template_directory_uri()."/style.css",
        array()
    );
    wp_enqueue_style(
        "reset-css",
        "https://unpkg.com/modern-css-reset/dist/reset.min.css",
        array()
    );
    // jsの読み込み(共通)
    wp_enqueue_script(
        "jquery-3.6.0",
        "https://code.jquery.com/jquery-3.6.0.min.js",
        array(),
        "1.0",
        true
    );
    wp_enqueue_script(
        "my-js", 
        get_template_directory_uri()."/js/main.js",
        array("jquery-3.6.0"),
        "1.0",
        true
    );
    if (is_page("home")) {
        // cssの読み込み(homeのみ)
        wp_enqueue_style(
            "home-css", 
            get_template_directory_uri()."/css/home.css",
            array()
        );
        wp_enqueue_style(
            "slick", 
            get_template_directory_uri()."/css/slick/slick.css",
            array()
        );
        wp_enqueue_style(
            "slick-theme", 
            get_template_directory_uri()."/css/slick/slick-theme.css",
            array()
        );
        wp_enqueue_style(
            "slick-custom", 
            get_template_directory_uri()."/css/slick/slick-custom.css",
            array()
        );
        // jsの読み込み(homeのみ)
        wp_enqueue_script(
            "slick", 
            get_template_directory_uri()."/js/slick.min.js",
            array("jquery-3.6.0"),
            "1.0",
            true
        );
        wp_enqueue_script(
            "slick-custom", 
            get_template_directory_uri()."/js/slick-custom.js",
            array("jquery-3.6.0"),
            "1.0",
            true
        );
    }
    else {
        // cssの読み込み(home以外)
        wp_enqueue_style(
            "page-css", 
            get_template_directory_uri()."/css/page.css",
            array()
        );
    // jsの読み込み(home以外)
    }
}
add_action("wp_enqueue_scripts", "my_enqueue_scripts");

/* パンくずリスト */
function breadcrumb() {
    $home = '<li class="breadcrumb_item"><a href="'.home_url().'" >ホーム</a></li>';
    if ( !(is_front_page()) ) {
        echo '<ul class="breadcrumb">';
        echo $home;
        if ( is_category() ) {
            $cat = get_queried_object();
            $cat_id = $cat->parent;
            $cat_list = array();
            while ($cat_id != 0){
                $cat = get_category( $cat_id );
                $cat_link = get_category_link( $cat_id );
                array_unshift( $cat_list, '<li class=breadcrumb_item><a href="'.$cat_link.'">'.$cat->name.'</a></li>' );
                $cat_id = $cat->parent;
            }
            foreach($cat_list as $value){
                echo '<span class="breadcrumb_arrow"></span>';
                echo $value;
            }
            the_archive_title('<li class=breadcrumb_item>', '</li>');
        }
        else if ( is_archive() ) {
            echo '<span class="breadcrumb_arrow"></span>';
            the_archive_title('<li class=breadcrumb_item>', '</li>');
        }
        else if ( is_single() ) {
            $cat = get_the_category();
            if( isset($cat[0]->cat_ID) ) $cat_id = $cat[0]->cat_ID;
            $cat_list = array();
            while ($cat_id != 0){
                $cat = get_category( $cat_id );
                $cat_link = get_category_link( $cat_id );
                array_unshift( $cat_list, '<li class=breadcrumb_item><a href="'.$cat_link.'">'.$cat->name.'</a></li>' );
                $cat_id = $cat->parent;
            }
            foreach($cat_list as $value){
                echo '<span class="breadcrumb_arrow"></span>';
                echo $value;
            }
            echo '<span class="breadcrumb_arrow"></span>';
            the_title('<li class=breadcrumb_item>', '</li>');
        }
        elseif (is_search()) {
            echo '<span class="breadcrumb_arrow"></span>';
            echo '<li class=breadcrumb_item>'.get_search_query().'の検索結果</li>';
        }
        else if( is_page() ) {
            echo '<span class="breadcrumb_arrow"></span>';
            the_title('<li class=breadcrumb_item>', '</li>');
        }
        else if( is_404() ) {
            echo '<span class="breadcrumb_arrow"></span>';
            echo '<li class=breadcrumb_item>ページが見つかりません</li>';
        }
        echo "</ul>";
    }
}
/* the_archive_title の不要な文字列を消去 */
add_filter( 'get_the_archive_title', function ($title) {
    if (is_category()) {
        $title = single_cat_title('',false);
    } elseif (is_tag()) {
        $title = single_tag_title('',false);
	} elseif (is_tax()) {
        $title = single_term_title('',false);
	} elseif (is_post_type_archive() ){
		$title = post_type_archive_title('',false);
	} elseif (is_date()) {
        $title = get_the_time('Y年n月');
	} elseif (is_search()) {
        $title = '検索結果：'.esc_html( get_search_query(false) );
	} elseif (is_404()) {
        $title = '「404」ページが見つかりません';
	} else {

	}
    return $title;
});

/* 各アーカイブページのタイトル変更 */
function my_archive_title($title) {
    if (is_archive()):
        if ( is_category() ) {
            $title = "".single_cat_title( "", false ).""; 
        } elseif ( is_tag() ) { 
            $title = "".single_tag_title( "", false )."の記事一覧"; 
        } elseif ( is_date() ) {
            $title = get_the_time("Y年n月")."に書かれた記事一覧";
        } else {
            $title = "記事一覧";
        }
    endif;
    return $title; 
}; 
add_filter( 'get_the_archive_title', 'my_archive_title');

/* ページタイトルの自動表示 */
function pagetitle() {
    if (!(is_front_page())) {
        echo '<div class="bg_pagetitle">';
        the_post_thumbnail();
        echo '<div class="pagetitle">';
        echo '<span></span>';
        if (is_page()) {
            the_title('<h3 class="text_pagetitle text_xl">', '</h3>');
        }
        elseif (is_archive()) {
            the_archive_title('<h3 class="text_pagetitle text_xl">', '</h3>');
        }
        elseif (is_search()) {
            echo '<h3 class="text_pagetitle text_xl">'.get_search_query().'の検索結果</h3>';
        }
        elseif (is_single()) {

        }
        elseif (is_404()) {
            echo '<h3 class="text_pagetitle text_xl">ページが見つかりません</h3>';
        }
        echo '</div></div>';
    }
}

/* アーカイブページの有効化 */
function post_has_archive($args, $post_type) {
    if ('post' == $post_type) {
        $args['rewrite'] = true; // リライトを有効にする
        $args['has_archive'] = 'archive'; // 任意のスラッグ名
    }
    return $args;
}
add_filter('register_post_type_args', 'post_has_archive', 10, 2);

/* アイキャッチ画像の有効化 */
add_theme_support('post-thumbnails');
