//カレント表示
const links = jQuery(".header_menu_item > a");
const linksDropdown = jQuery(".header_dropdown > a");

links.each(function() {
    if (this.href === location.href) {
        jQuery(this).addClass("header_item_active");
    }
});
linksDropdown.each(function() {
    if (this.href === location.href) {
        jQuery(this).closest(".header_dropdown").closest(".header_dropdown_list").prev(".header_item").addClass("header_item_active");
    }
});

//ハンバーガー
$(function() {
    $(".hamburger_button").click(function() {
        document.getElementById("hamburger_button").classList.toggle("active");
        document.getElementById("hamburger_nav").classList.toggle("active");
    });
});

