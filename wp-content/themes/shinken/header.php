<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>奈良心剣道場</title>
    <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/img/favicon.png">
<?php wp_head(); ?>
</head>
<body>
    <div id="body_container" class="body_container">
        <header id="header" class="header">
            <div class="u_container">
                <div class="header_content">
                    <div class="header_logo">
                        <a href="/home/">
                            <img src="<?php echo get_template_directory_uri(); ?>/img/logo_header.png" alt="" class="header_logo_img">
                        </a>
                    </div><!-- /.header_logo -->
                    <nav class="header_nav sp_invisible">
                        <div class="header_menu_pc">
                            <ul class="header_menu">
                                <li class="header_menu_item">
                                    <a href="/" class="header_item">ホーム</a><!-- /.header_item.header_item_active -->
                                </li><!-- /.header_menu_item -->
                                <li class="header_menu_item">
                                    <p class="header_item">道場について</p><!-- /.header_item -->
                                    <ul class="header_dropdown_list">
                                        <li class="header_dropdown">
                                            <a href="/about/" class="header_item header_dropdown_item">道場紹介</a><!-- /.header_item.header_dropdown_item -->
                                        </li><!-- /.header_dropdown -->
                                        <li class="header_dropdown">
                                            <a href="/history/" class="header_item header_dropdown_item">道場の歴史</a><!-- /.header_item.header_dropdown_item -->
                                        </li><!-- /.header_dropdown -->
                                        <li class="header_dropdown">
                                            <a href="/member/" class="header_item header_dropdown_item">指導者紹介</a><!-- /.header_item.header_dropdown_item -->
                                        </li><!-- /.header_dropdown -->
                                    </ul><!-- /.header_dropdown_list -->
                                </li><!-- /.header_menu_item -->
                                <li class="header_menu_item">
                                    <a href="/recruit/" class="header_item">道場生募集</a><!-- /.header_item -->
                                </li><!-- /.header_menu_item -->
                                <li class="header_menu_item">
                                    <a href="/album/" class="header_item">稽古風景</a><!-- /.header_item -->
                                </li><!-- /.header_menu_item -->
                                <li class="header_menu_item">
                                    <a href="/category/result/" class="header_item">大会記録</a><!-- /.header_item -->
                                </li><!-- /.header_menu_item -->
                                <li class="header_menu_item">
                                    <a href="/archive/" class="header_item">記事一覧</a><!-- /.header_item -->
                                </li><!-- /.header_menu_item -->
                            </ul><!-- /.header_menu -->
                        </div><!-- /.header_menu_pc -->
                        <a class="header_search header_item">
                            <span class="header_search_icon">
                                <span class="icon">
                                    <svg width="16" height="16" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#1a1a1c" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                                    </svg>
                                </span><!-- /.icon -->
                            </span><!-- /.header_search_icon -->
                        </a><!-- /.header_search -->
                    </nav><!-- /.header_nav.sp_invisible -->
                    <nav class="hamburger_nav pc_invisible" id="hamburger_nav">
                        <div class="hamburger_nav_wrapper">
                            <ul class="hamburger_menu">
                                <li class="hamburger_menu_item">
                                    <a href="/about/" class="hamburger_item">道場紹介</a><!-- /.hamburger_item -->
                                </li><!-- /.hamburger_menu_item -->
                                <li class="hamburger_menu_item">
                                    <a href="/member/" class="hamburger_item">指導者紹介</a><!-- /.hamburger_item -->
                                </li><!-- /.hamburger_menu_item -->
                                <li class="hamburger_menu_item">
                                    <a href="/album/" class="hamburger_item">稽古風景</a><!-- /.hamburger_item -->
                                </li><!-- /.hamburger_menu_item -->
                                <li class="hamburger_menu_item">
                                    <a href="/category/result/" class="hamburger_item">大会記録</a><!-- /.hamburger_item -->
                                </li><!-- /.hamburger_menu_item -->
                                <li class="hamburger_menu_item">
                                    <a href="/archive/" class="hamburger_item">記事一覧</a><!-- /.hamburger_item -->
                                </li><!-- /.hamburger_menu_item -->
                            </ul><!-- /.hamburger_menu -->
                        </div><!-- /.hamburger_nav_wrapper -->
                    </nav><!-- /.hamburger_nav.sp_invisible#hamburger_nav -->
                    <div class="hamburger_wrapper pc_invisible">
                        <button class="hamburger_button" id="hamburger_button">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button><!-- /.hamburger_button#hamburger_button -->
                    </div><!-- /.hamburger_wrapper.pc_invisible -->
                </div><!-- /.header_content -->
            </div><!-- /.u_container -->
        </header><!-- /#header.header -->
        <main id="main" class="main">