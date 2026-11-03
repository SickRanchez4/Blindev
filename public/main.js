/**
 * Main JavaScript - Inicializaciones y lógica de la página
 */
$(function () {
    const MOBILE_BREAKPOINT_PX = 768;
    const NAV_SCROLL_OFFSET_PX = 102;
    const SCROLL_DURATION_MS = 1500;
    const PORTFOLIO_COLUMN_WIDTH_PX = 375;
    const PORTFOLIO_GUTTER_PX = 30;

    const $mainNav = $('.main-nav');

    const initNavbar = () => {
        $('#navbar').scrollToFixed();

        $('.res-nav_click').on('click', (event) => {
            event.preventDefault();
            $mainNav.slideToggle();
        });
    };

    const initSmoothScroll = () => {
        $('.main-nav li a, .servicelink').on('click', function (event) {
            event.preventDefault();

            $('html, body').stop().animate({
                scrollTop: $($(this).attr('href')).offset().top - NAV_SCROLL_OFFSET_PX,
            }, SCROLL_DURATION_MS, 'easeInOutExpo');

            if ($(window).width() < MOBILE_BREAKPOINT_PX) {
                $mainNav.hide();
            }
        });
    };

    const initPortfolio = () => {
        const $container = $('.productoContainer');
        if (typeof $.fn.isotope === 'undefined' || !$container.length) return;

        const $body = $('body');
        let columns = null;

        $container.isotope({
            resizable: true,
            masonry: { columnWidth: PORTFOLIO_COLUMN_WIDTH_PX },
        });

        $(window).smartresize(() => {
            const currentColumns = Math.floor(($body.width() - PORTFOLIO_GUTTER_PX) / PORTFOLIO_COLUMN_WIDTH_PX);
            if (currentColumns !== columns) {
                columns = currentColumns;
                $container.width(columns * PORTFOLIO_COLUMN_WIDTH_PX).isotope('reLayout');
            }
        }).smartresize();

        $('.productoFilter a').on('click', function (event) {
            event.preventDefault();
            $('.productoFilter .current').removeClass('current');
            $(this).addClass('current');
            $container.isotope({ filter: $(this).attr('data-filter') });
        });
    };

    initNavbar();
    initSmoothScroll();
    initPortfolio();
});
