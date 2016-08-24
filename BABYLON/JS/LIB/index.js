(function () {

    // ----------------------
    // LEFT MENU FOR MOBILE
    // ----------------------

    window.addEventListener("DOMContentLoaded", function () {

        var createSlideOutMenu = function (callback) {
            var divSearchBarMobile =
                $('<div>', {
                    class: 'searchbar-mobile searchbar',
                    html: '<form method="get" action="/search"><input type="text" name="q" placeholder="Search..."/>' +
                    '<button type="submit"><i class="fa fa-search"></i></button></form>'
                });

            var navigationLinks = [
                $('<a>', {
                    href: '/',
                    html: '<i class="fa fa-home"></i>Home'
                }),
                $('<a>', {
                    href: '/whats-new',
                    html: '<i class="fa fa-file-text-o"></i>What\'s new?'
                }),
                $('<a>', {
                    href: '/generals',
                    html: '<i class="fa fa-book"></i>Generals'
                }),
                $('<a>', {
                    href: '/tutorials',
                    html: '<i class="fa fa-cogs"></i>Tutorials'
                }),
                $('<a>', {
                    href: '/overviews',
                    html: '<i class="fa fa-book"></i>Overviews'
                }),                     
                $('<a>', {
                    href: '/exporters',
                    html: '<i class="fa fa-rocket"></i>Exporters'
                }),
                $('<a>', {
                    href: '/extensions',
                    html: '<i class="fa fa-wrench"></i>Extensions'
                }),
                $('<a>', {
                    href: '/classes',
                    html: '<i class="fa fa-files-o"></i>Classes'
                }),
                $('<a>', {
                    href: '/playground',
                    html: '<i class="fa fa-cubes"></i>Playground'
                })
            ];

            var links = [
                $('<a>', {
                    href: 'http://www.babylonjs.com',
                    target: '_blank',
                    html: '<i class="fa fa-play"></i>babylonjs.com'
                }),
                $('<a>', {
                    href: 'https://github.com/BabylonJS/Babylon.js',
                    target: '_blank',
                    html: '<i class="fa fa-github"></i>Github'
                }),
                $('<a>', {
                    href: 'https://github.com/BabylonJS/Documentation',
                    target: '_blank',
                    html: '<i class="fa fa-code-fork"></i>Contribute'
                }),
                $('<a>', {
                    href: 'http://www.html5gamedevs.com/forum/16-babylonjs',
                    target: '_blank',
                    html: '<i class="fa fa-html5"></i>Forum'
                })
            ];

            $('#menu').append(divSearchBarMobile)
                .append(navigationLinks)
                .append(links);

            callback();

        }(function () {
            var slideout = new Slideout({
                'panel': document.getElementById('wrapper'),
                'menu': document.getElementById('menu'),
                'padding': 256,
                'tolerance': 70,
                'touch': false
            });

            $("#mobilemenu").click(function () {
                slideout.toggle();
            });
        });
    });
})();
