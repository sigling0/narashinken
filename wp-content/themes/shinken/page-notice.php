<?php get_header(); ?>
            <div class="u_container">
                <div class="container_pagetitle">
                    <?php pagetitle() ?>
                </div><!-- /.container_pagetitle -->
                <div class="container_breadcrumb">
                    <?php breadcrumb() ?>
                </div><!-- /.container_breadcrumb -->
                <div class="page_content">
                    <div class="main_col">
                        <?php
                        $page_id = get_page_by_path("notice");
                        $page = get_post($page_id);
                        echo $page->post_content;
                        ?>
                    </div><!-- /.main_col -->
                    <div class="side_col sp_invisible">
                        <section class="section section_s">
                            <header class="section_header section_header_s">
                                <h5 class="section_title section_title_s text_m">
                                    記事検索
                                </h5><!-- /.section_title section_title_s text_m -->
                            </header><!-- /.section_header section_header_s -->
                            <?php get_sidebar(); ?>
                        </section><!-- /.section section_s -->
                    </div><!-- /.side_col -->
                </div><!-- /.page_content -->
            </div><!-- /.u_container -->
<?php get_footer(); ?>