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
                                                    <ul class="card_data">
                                                        <li class="card_tag_s text_s">
                                                            <p href="">
                                                            <?php
                                                                $tags = get_the_tags();
                                                                if( !empty( $tags ) ) {
                                                                    foreach ( $tags as $tag ) {
                                                                        echo $tag->name;
                                                                    }
                                                                }
                                                                else {
                                                                    echo "タグなし";
                                                                }
                                                                ?>
                                                            </p>
                                                        </li><!-- /.card_tag_s.text_s -->
                                                        <li class="card_date text_date">
                                                            <time datetime="2024年XX月XX日">
                                                                <?php the_time("Y年m月d日"); ?>
                                                            </time>
                                                        </li><!-- /.card_date.text_date -->
                                                    </ul><!-- /.card_data -->
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
                    <div class="side_col">
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