/**
 * Main JavaScript - Inicializaciones y lógica de la página
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Navbar - ScrollToFixed & Mobile Menu
    // ============================================
    $('#test').scrollToFixed();
    
    $('.res-nav_click').click(function(){
        $('.main-nav').slideToggle();
        return false;    
    });

    // ============================================
    // Smooth Scroll a Anchors
    // ============================================
    $('.main-nav li a, .servicelink').bind('click', function(event){
        var $anchor = $(this);
        
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 102
        }, 1500, 'easeInOutExpo');
        
        if ($(window).width() < 768) { 
            $('.main-nav').hide(); 
        }
        event.preventDefault();
    });

    // ============================================
    // WOW.js - Animaciones
    // ============================================
    if (typeof WOW !== 'undefined') {
        var wow = new WOW({
            animateClass: 'animated',
            offset: 100
        });
        wow.init();
    }

    // ============================================
    // Isotope - Portfolio Masonry
    // ============================================
    if (typeof $.fn.isotope !== 'undefined') {
        var $container = $('.productoContainer');
        if ($container.length) {
            var $body = $('body');
            var colW = 375;
            var columns = null;

            $container.isotope({
                resizable: true,
                masonry: {
                    columnWidth: colW
                }
            });
            
            $(window).smartresize(function(){
                var currentColumns = Math.floor(($body.width() - 30) / colW);
                if (currentColumns !== columns) {
                    columns = currentColumns;
                    $container.width(columns * colW).isotope('reLayout');
                }
            }).smartresize();

            // Portfolio Filter
            $('.productoFilter a').click(function(){
                $('.productoFilter .current').removeClass('current');
                $(this).addClass('current');
        
                var selector = $(this).attr('data-filter');
                $container.isotope({
                    filter: selector,
                });
                return false;
            });
        }
    }
});
