(function ($) {
    $('.tocToggle').click(function(){
        $('.tocContent').toggle(600);

        $('.tocToggle i').attr('class',
             $('.tocToggle i').attr('class') === 'fa fa-arrow-up' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'
        );
    });

    $('.tocContent a').click(function(evt){
        evt.preventDefault();

        // get the necessary values
        var hrefString = $(this).attr('href');

        //var titleId = hrefString.split('\#')[1];
        var $selectedElement = $('a.anchor[href="' + hrefString + '"]');

        // change client url
        var currentPage = window.location.toString().split('#', [0]);
        window.history.pushState({id: hrefString}, '', currentPage + hrefString);

        // highlight selected title
        $('.highlighted').removeClass('highlighted');
        $selectedElement.parent().addClass('highlighted');

        // jump to the title, with a little vertical offset
        window.scrollTo(0, $selectedElement.offset().top - 50);
    });
    
    // Prevent scroll in the iframe AND in the main window
    var s = { insideIframe: false } 
    $(iframe).mouseenter(function() {
        s.insideIframe = true;
        s.scrollX = window.scrollX;
        s.scrollY = window.scrollY;
    }).mouseleave(function() {
        s.insideIframe = false;
    });

    $(document).scroll(function() {
        if (s.insideIframe)
            window.scrollTo(s.scrollX, s.scrollY);
    });
    
})(jQuery);
        
/**
 * Creates an iframe containing the given playground. 
 * The link element is used to retrieve the closest div below the link
 */
function createIframe(playgroundId, link) {
    
    // By default, meta marked add the iframeContainer in the next paragraph...
    var iframeContainer = $(link).parent().next();
    if (! iframeContainer.hasClass('iframeContainer')) {
        // ...but sometimes not.
        iframeContainer = $(link).next().next();
    }
    
    iframeContainer.css('display', 'block');
    if (iframeContainer.children().length == 0) {
        var iframe = $("<iframe>").attr('src', 'http://www.babylonjs-playground.com/frame.html#'+playgroundId);
        iframeContainer.append(iframe);
    } else {
        iframeContainer.empty().css('display', 'none');       
    }
}
