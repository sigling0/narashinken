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
                        <div class="archive_wrapper">
                            <div class="archive_content">
                                <div class="columns columns_3 column_single_sp">
                                    <?php
                                        if ( have_posts() ) :
                                            while ( have_posts() ) : the_post();
                                    ?>
                                    <a href="<?php the_permalink() ?>" class="card">
                                        <div class="card_wrapper">
                                            <div class="card_image">
                                                <?php
                                                    if ( has_post_thumbnail() ) {
                                                        the_post_thumbnail();
                                                    }
                                                    else {
                                                        echo '<img src="'.get_template_directory_uri().'/img/sample.jpg" alt="">';
                                                    }
                                                ?>
                                            </div><!-- /.card_image -->
                                            <div class="card_text">
                                                <h5 class="card_title text_m">
                                                    <?php the_title(); ?>
                                                </h5><!-- /.card_title.text_m -->
                                                <div class="card_detail">
                                                    <div class="card_data">
                                                        <li class="tag_wrapper">
                                                            <?php 
                                                                $tags = get_the_tags();
                                                                if(!empty($tags)) {
                                                                    foreach ($tags as $tag) {
                                                                        echo "<p class='tag text_s'>".$tag->name."</p>";
                                                                    }
                                                                }
                                                                else {
                                                                    echo "<p class='tag text_s'>タグなし</p>";
                                                                }
                                                            ?>
                                                        </li><!-- /.tag_wrapper -->
                                                        <div class="date_wrapper">
                                                            <div class="date date_posted">
                                                                <span class="icon icon_posted">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                                                        <path fill="#6e6e6e" d="M224 32H64C46.3 32 32 46.3 32 64v64c0 17.7 14.3 32 32 32H441.4c4.2 0 8.3-1.7 11.3-4.7l48-48c6.2-6.2 6.2-16.4 0-22.6l-48-48c-3-3-7.1-4.7-11.3-4.7H288c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 256c0-17.7-14.3-32-32-32H288V192H224v32H70.6c-4.2 0-8.3 1.7-11.3 4.7l-48 48c-6.2 6.2-6.2 16.4 0 22.6l48 48c3 3 7.1 4.7 11.3 4.7H448c17.7 0 32-14.3 32-32V256zM288 480V384H224v96c0 17.7 14.3 32 32 32s32-14.3 32-32z"/>
                                                                    </svg>
                                                                </span><!-- /.icon icon_posted -->
                                                                <time class="text_date text_s" datetime="20XX年XX月XX日">
                                                                    <?php the_time("Y年m月d日"); ?>
                                                                </time><!-- /.text_date.text_s -->
                                                            </div><!-- /.date.date_posted -->
                                                            <div class="date date_modified">
                                                                <span class="icon icon_modified">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                                                        <path fill="#6e6e6e" d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
                                                                    </svg>
                                                                </span><!-- /.icon icon_modified -->
                                                                <time class="text_date text_s" datetime="20XX年XX月XX日">
                                                                    <?php the_modified_time("Y年m月d日"); ?>
                                                                </time><!-- /.text_date.text_s -->
                                                            </div><!-- /.date.date_modified -->
                                                        </div><!-- /.date_wrapper -->
                                                    </div><!-- /.card_data -->
                                                    <span class="card_arrow">
                                                        <span class="icon">
                                                            <svg width="14px" height="16px" viewbox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill="#4d4d4d" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                                            </svg>
                                                        </span><!-- /.icon -->
                                                    </span><!-- /.card_arrow -->
                                                </div><!-- /.card_detail -->
                                            </div><!-- /.card_text -->
                                        </div><!-- /.card_wrapper -->
                                    </a><!-- /.card -->
                                    <?php
                                            endwhile;
                                        endif;
                                    ?>
                                </div><!-- /.columns.columns_3.column_single_sp -->
                            </div><!-- /.archive_content -->
                            <?php 
                            ?>
                        </div><!-- /.archive_wrapper -->
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