<div class="sidebar_wrapper">
    <div class="sidebar_content">
        <section class="sidebar_section sidebar_section_search">
            <div class="sidebar_header sidebar_search_header">
                <span class="icon icon_sidebar icon_sidebar_search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path fill="4e4e4e" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </span><!-- /.icon icon_sidebar icon_sidebar_search -->
                <div class="sidebar_title sidebar_search_title">
                    <p class="text_r">
                        キーワードで探す
                    </p><!-- /.text_s -->
                </div><!-- /.sidebar_title.sidebar_search_title -->
            </div><!-- /.sidebar_header.sidebar_search_header -->
            <div class="sidebar_search_form">
                <?php get_search_form(); ?>
            </div><!-- /.sidebar_search_form -->
        </section><!-- /.sidebar_section sidebar_section_search -->
        <section class="sidebar_section sidebar_section_category">
            <div class="sidebar_header sidebar_category_header">
                <span class="icon icon_sidebar icon_sidebar_category">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path fill="4e4e4e" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/>
                    </svg>
                </span><!-- /.icon icon_sidebar icon_sidebar_category -->
                <div class="sidebar_title sidebar_category_title">
                    <p class="text_r">
                        カテゴリーで探す
                    </p><!-- /.text_s -->
                </div><!-- /.sidebar_title sidebar_category_title -->
            </div><!-- /.sidebar_header.sidebar_category_header -->
            <div class="category_wrapper sidebar_category_wrapper">
                <?php 
                    $args = array(
                        'orderby' => 'count',
                        'order' => 'DESC'
                    );
                    $categories = get_categories($args);
                    if($categories) {
                        foreach($categories as $category) {
                            echo '<div class="category category_sidebar text_s"><a href="'.get_category_link($category->term_id).'" class="category_link sidebar_category_link">'.$category->name.'('.$category->count.')</a></div>';
                        }
                    }
                ?>
            </div><!-- /.category_wrapper sidebar_category_wrapper -->
        </section><!-- /.sidebar_section sidebar_section_category -->
        <section class="sidebar_section sidebar_section_tag">
            <div class="sidebar_header sidebar_tag_header">
                <span class="icon icon_sidebar icon_sidebar_tag">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path fill="#4e4e4e" d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                    </svg>
                </span><!-- /.icon icon_sidebar icon_sidebar_tag -->
                <div class="sidebar_title sidebar_tag_title">
                    <p class="text_r">
                        タグで探す
                    </p><!-- /.text_s -->
                </div><!-- /.sidebar_title.sidebar_tag_title -->
            </div><!-- /.sidebar_header.sidebar_tag_header -->
            <li class="tag_wrapper sidebar_tag_wrapper">
                <?php 
                    $args = array(
                        'orderby' => 'count',
                        'order' => 'DESC'
                    );
                    $tags = get_tags( $args );
                    if ( $tags ){
                        foreach( $tags as $tag ) {
                            echo '<a href="'.get_tag_link($tag->term_id ).'" class="tag tag_sidebar text_s">'.$tag->name.'('.$tag->count.')</a>';
                        }
                    }
                ?>
            </li><!-- /.tag_wrapper sidebar_tag_wrapper -->
        </section><!-- /.sidebar_section sidebar_section_tag -->
    </div><!-- /.sidebar_content -->
</div><!-- /.sidebar_wrapper -->