<div class="searchform_wrapper">
    <form action="<?php echo esc_url(home_url('/')); ?>" method="get" class="searchform">
        <input type="text" name="s" value="<?php the_search_query(); ?>" placeholder="キーワードを入力" id="s" class="searchform_input text_s">
        <button type="submit" id="s" class="searchform_button">
            <p class="text_s">
                検索
            </p><!-- /.text_s -->
        </button>
    </form>
</div><!-- /.searchform_wrapper -->