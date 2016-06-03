function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


$(document).ready(function () {

    var AOSsettings = AOSsettings || (ProcessWire && ProcessWire.config && ProcessWire.config.AdminOnSteroids) ? JSON.parse(ProcessWire.config.AdminOnSteroids) : null,
        htmlClasses = [];

    // HoverSaveDropdown
    // note: copies do not need to modify
    if (AOSsettings.enabledSubmodules.indexOf('HoverSaveDropdown') !== -1) {
        $('#pw-dropdown-toggle-submit_save, ' +
            '#pw-dropdown-toggle-submit_publish, ' +
            '#pw-dropdown-toggle-submit_save_unpublished, ' +
            '#pw-dropdown-toggle-Inputfield_submit_save_module')
            .removeClass('dropdown-toggle-click');
    }

    if (AOSsettings == null) {
        return false;
    }

    // AutoCollapseModuleInfo
    if (AOSsettings.enabledSubmodules.indexOf('LoadCollapsedModuleInfos') !== -1) {
        if ($('#ModuleInfo').length) {
            $('#ModuleInfo').addClass('InputfieldStateCollapsed');
        }
    }

    // LongClickDuration
    if (AOSsettings.enabledSubmodules.indexOf('LongClickDuration') !== -1) {
        // set custom long click duration
        if (jQuery && jQuery.longclick) {
            if (AOSsettings.LongClickDuration) {
                jQuery.longclick.duration = parseInt(AOSsettings.LongClickDuration);
            }
        }
    }


    // fixScrollbarJump
    if (AOSsettings.enabledSubmodules.indexOf('fixScrollbarJump') !== -1) {
        htmlClasses.push('aos_fixScrollbarJump');
    }


    // FileFieldToolbar
    if (AOSsettings.enabledSubmodules.indexOf('FileFieldToolbar') !== -1) {

        htmlClasses.push('aos_fileFieldToolbar');

        if (AOSsettings.FileFieldToolbar.indexOf('filterbox') !== -1) {
            htmlClasses.push('aos_filterbox');
        }
    }


    // Default admin theme tweaks
    if (AOSsettings.enabledSubmodules.indexOf('AdminTweaks') !== -1 && $('body').hasClass('AdminThemeDefault')) {

        var adminTweaksSettings = AOSsettings.AdminTweaks;

        if (adminTweaksSettings.indexOf('stickyHeader') !== -1) {
            htmlClasses.push('aos_stickyHeader');
        }

        $('body').addClass(htmlClasses);
    }


    // RenoTWeaks
    if (AOSsettings.enabledSubmodules.indexOf('RenoTweaks') !== -1 && $('body').hasClass('AdminThemeReno')) {

        var renoTweaksSettings = AOSsettings.RenoTweaks;

        function setupCheckbox(currentCheckbox) {

            var nextCheckbox = currentCheckbox.parent().parent('li').next('li').find('input');

            if (nextCheckbox.length) {

                if (window.getComputedStyle(nextCheckbox.get(0), null).getPropertyValue('margin-left') !== '0px') {

                    var parentCheckbox = getParentCheckbox(currentCheckbox);

                    // console.log(parentCheckbox.next('span').text());

                    var isChecked = parentCheckbox.is(':checked');
                    nextCheckbox.parent().parent('li').toggleClass('disabled', !isChecked);
                    // note: setting to disabled won't save the value
                }

                setupCheckbox(nextCheckbox);
            }
        }

        function getParentCheckbox(cb) {

            if (window.getComputedStyle(cb.get(0), null).getPropertyValue('margin-left') !== '0px') {
                cb = getParentCheckbox(cb.parent().parent('li').prev('li').find('input'));
            }

            return cb;
        }

        // js tweaks to form configuration page
        if ($('form[action$="AdminOnSteroids"]').length) {

            var RenoTweaksSelector = '#wrap_Inputfield_RenoTweaks';

            $(RenoTweaksSelector + ' input[type="checkbox"]').on('change', function () {
                setupCheckbox($(this));
            });

            // do not allow checking checkboxes if it's parent is set to disabled
            $(RenoTweaksSelector).on('click', 'li.disabled input[type="checkbox"]', function (e) {
                e.preventDefault();
                return false;
            });

            setupCheckbox($(RenoTweaksSelector + ' li:eq(0) input[type="checkbox"]'));
        }


        // enable single clicking on headers in sidebar
        if (renoTweaksSettings.indexOf('singleClickSidebarHeaders') !== -1 && renoTweaksSettings.indexOf('alwaysVisibleSidebarItems') !== -1) {

            $('#sidebar > #main-nav > li > a').on('click', function () {
                window.location.href = $(this).attr('href');
                return false;
            });
        }

        if (renoTweaksSettings.indexOf('alwaysShowSearch') !== -1) {
            htmlClasses.push('aos_alwaysShowSearch');
        }

        if (renoTweaksSettings.indexOf('stickyHeader') !== -1) {
            htmlClasses.push('aos_stickyHeader');
            if (renoTweaksSettings.indexOf('stickyHeaderCompact') !== -1) {
                htmlClasses.push('aos_stickyHeaderCompact');
            }
        }

        if (renoTweaksSettings.indexOf('stickySidebar') !== -1) {
            htmlClasses.push('aos_stickySidebar');
        }

        if (renoTweaksSettings.indexOf('autoHideSidebar') !== -1) {
            htmlClasses.push('aos_autoHideSidebar');
        }

        if (renoTweaksSettings.indexOf('alwaysVisibleSidebarItems') !== -1) {
            htmlClasses.push('aos_alwaysVisibleSidebarItems');
        }

        if (renoTweaksSettings.indexOf('hideSidebarQuickLinks') !== -1) {
            htmlClasses.push('aos_hideSidebarQuickLinks');
        }

        if (renoTweaksSettings.indexOf('oneLineSidebarSubmenus') !== -1) {
            htmlClasses.push('aos_oneLineSidebarSubmenus');
        }

        if (renoTweaksSettings.indexOf('headButtonNextToTitle') !== -1) {
            htmlClasses.push('aos_headButtonNextToTitle');
        }

        // if (renoTweaksSettings.indexOf('stickyCKEditorToolbar') !== -1) {
        //     htmlClasses.push('aos_stickyCKEditorToolbar';
        // }

        if (renoTweaksSettings.indexOf('closeNoticeButtonToLeft') !== -1) {
            htmlClasses.push('aos_closeNoticeButtonToLeft');
        }
    }


    // DeselectRadios
    if (AOSsettings.enabledSubmodules.indexOf('DeselectRadios') !== -1) {
        htmlClasses.push('aos_DeselectRadios');
    }

    // PagePreviewLink
    if (AOSsettings.enabledSubmodules.indexOf('PagePreviewLink') !== -1) {

        htmlClasses.push('aos_PagePreviewLink');

        var pageTitleSelector = ($('body').hasClass('AdminThemeDefault') ? '#breadcrumbs li.title' : '#headline #title');

        if ($(pageTitleSelector).length && $('a#_ProcessPageEditView').length) {

            var pageTitle = $(pageTitleSelector),
                pageViewUrl = $('a#_ProcessPageEditView').attr('href');

            if (pageTitle.children('.pageTitleLink').length == 0) {
                pageTitle.append('<a href="' + pageViewUrl + '" id="aos_PagePreviewLink" class="' + AOSsettings.PagePreviewLink + '" target="_blank"><i class="fa fa-external-link"></i></a>');
            }
        }
    }

    $('html').addClass(htmlClasses.join(" "));


    // FileFieldToolbar

    if (AOSsettings.enabledSubmodules.indexOf('FileFieldToolbar') !== -1) {

        // .InputfieldImageMax1 is added only later
        setTimeout(function () {

            var FileFieldToolbarSettings = AOSsettings.FileFieldToolbar;

            if (FileFieldToolbarSettings.indexOf('filterbox') !== -1 && $('.InputfieldImage.Inputfield:not(.InputfieldImageMax1)').length) {

                var $filterInput = $("<span class='InputfieldFileFieldFilter'><input /><i class='fa fa-close'></i></span>");

                $('.InputfieldImage.Inputfield:not(.InputfieldImageMax1)').each(function () {
                    setup$filterInput($(this));
                });

                function addFilterTargets(field) {

                    field.find('.gridImages > li').each(function () {

                        var searchStrings = [],
                            listItem = $(this);

                        searchStrings.push(listItem.find('.InputfieldImageEdit__name').text());

                        var inputs = listItem.find('input[type="text"]');

                        $.each(inputs, function (el) {
                            searchStrings.push(inputs[el].value);
                        });

                        listItem.attr('data-filter', searchStrings.join(" "));
                    });
                }

                function setup$filterInput(field) {

                    field.find('.InputfieldHeader').append($filterInput.clone());

                    $(document).on('click focus', '.InputfieldFileFieldFilter input', function (e) {
                        var target = e.target || e.srcElement;
                        var field = $(target).closest('li.Inputfield');

                        // close editor to append changes
                        field.find('.InputfieldImageEdit__close').trigger('click');
                        addFilterTargets(field);
                    });


                    $(document).on('click', '.InputfieldFileFieldFilter i', function (e) {
                        clearFilterbox(e);
                    });


                    $(document).on('keydown', '.InputfieldFileFieldFilter input', function (e) {

                        e = e || window.event;

                        if (e.keyCode === 27) {
                            clearFilterbox(e);
                        }
                    });


                    function clearFilterbox(e) {

                        var target = e.target || e.srcElement;

                        var inputField = $(target).closest('.InputfieldFileFieldFilter').find('input');

                        inputField.removeClass('hasValue');
                        inputField.val("");
                        inputField.trigger('keypress').focus();
                    }


                    $(document).on('keypress keyup fieldchange', '.InputfieldFileFieldFilter input', function (e) {

                        var target = e.target || e.srcElement,
                            filter = target.value.toLowerCase(),
                            field = $(target).closest('li.Inputfield'),
                            items = field.find('.gridImages > li'),
                            count = 0,
                            length = filter.length;

                        if (!target.value) {
                            $(target).parent().removeClass('hasValue');
                            items.show();
                            return true;
                        }

                        $(target).parent().addClass('hasValue');

                        // close edit field
                        if (field.find('.InputfieldImageEdit--active').length) {
                            field.find('.InputfieldImageEdit__close').trigger('click');
                        }

                        if (length > 1) {

                            var filter_tags = filter.split(" "); // Split user input by spaces

                            items.each(function () {

                                var $this = $(this),
                                    matches = true,
                                    itemFilters = $this.attr('data-filter');

                                if ((typeof itemFilters === typeof undefined || itemFilters === false)) {
                                    return;
                                }

                                // Match each splitted string against the whole tags string
                                $.each(filter_tags, function (i, a_filter) {
                                    if (itemFilters.toLowerCase().indexOf(a_filter) === -1) {
                                        matches = false;
                                    }
                                });

                                if (matches) {
                                    $this.show();
                                    count++;
                                } else {
                                    $this.hide();
                                }
                            });

                        } else {
                            items.show();
                            count++;
                        }

                        if(items.find(':visible').length == 0) {
                            e.preventDefault();
                            return false;
                        }

                    });
                }
            }
        }, 100);
    }


    // todo make filterbox work with ajax-loaded fields/tabs
    //$(document).on('reloaded', '.InputfieldImage', function () {
    //
    //
    //}).on('wiretabclick', function (e, $newTab, $oldTab) {
    //    $newTab.find(".InputfieldImage").each(function () {
    //        initInputfield($(this));
    //    });
    //}).on('opened', '.InputfieldImage', function () {
    //    //console.log('InputfieldImage opened');
    //    initInputfield($(this));
    //});


    if (renoTweaksSettings && renoTweaksSettings.indexOf('stickyCKEditorToolbar') !== -1) {

        var editor_cke_height;
        // isCKEfocused = false;

        // if ($('.aos_stickyCKEditorToolbar .InputfieldCKEditor').length) {
        if ($('.InputfieldCKEditor').length) {

            var $firstCKEditor = $('.InputfieldCKEditor').eq(0);

            var checkstickyCKEditorToolbar = debounce(function () {

                if (!$('html').hasClass('aos_stickyCKEditorToolbar')) {
                    return false;
                }

                if ($(document).width() < 960 || !$firstCKEditor) {
                    return false;
                }

                var cke_toolbar = $firstCKEditor.find('.cke_top'),
                    cke_contents = $firstCKEditor.find('.cke_contents');

                if (!cke_toolbar.length) {
                    return false;
                }

                var topOffset = $firstCKEditor.offset().top - posTop();
                var bottomOffset = $firstCKEditor.offset().top + $firstCKEditor.height() - posTop();
                // var editor_cke_height = cke_toolbar.outerHeight();

                // console.log(topOffset + ', ' + bottomOffset);

                if (topOffset < 70 && bottomOffset > 200) {
                    cke_toolbar.addClass('cke_top_fixed');
                    cke_contents.css('padding-top', editor_cke_height + "px");
                    $('html').addClass('aos_stickyCKEditorToolbar');
                } else {
                    // if (!isCKEfocused || bottomOffset < 70) {
                    // if (!isCKEfocused) {
                    cke_toolbar.removeClass('cke_top_fixed');
                    $('html').removeClass('aos_stickyCKEditorToolbar');
                    cke_contents.css('padding-top', "0px");
                    // }
                }

            }, 0);

            $(window).on('scroll addstickyCKEditorToolbar', function () {
                checkstickyCKEditorToolbar();
            });

            CKEDITOR.on('instanceReady', function (evt) {

                var editor = evt.editor;

                editor_cke_height = $firstCKEditor.find('.cke_top').outerHeight();

                // console.log('The editor named ' + editor.name + ' is now ready');

                // editor.on('focus', function (e) {
                //     if ('wrap_' + e.editor.name == $firstCKEditor.attr('id')) {
                //         $('html').addClass('aos_stickyCKEditorToolbar');
                //         checkstickyCKEditorToolbar();
                //         // console.log('The editor named ' + e.editor.name + ' is now focused');
                //     }
                // });

                editor.on('selectionChange', function (e) {
                    if ('wrap_' + e.editor.name == $firstCKEditor.attr('id')) {
                        $('html').addClass('aos_stickyCKEditorToolbar');
                        checkstickyCKEditorToolbar();
                        // isCKEfocused = true;
                        // console.log('The editor named ' + e.editor.name + ' is now focused');
                    }
                });

                // editor.on('change', function (e) {
                //     if ('wrap_' + e.editor.name == $firstCKEditor.attr('id')) {
                //         $('html').addClass('aos_stickyCKEditorToolbar');
                //         checkstickyCKEditorToolbar();
                //         // console.log('The editor named ' + e.editor.name + ' is now focused');
                //     }
                // });

                editor.on('blur', function (e) {
                    if ('wrap_' + e.editor.name == $firstCKEditor.attr('id')) {
                        // isCKEfocused = false;
                        $firstCKEditor.find('.cke_top').removeClass('cke_top_fixed');
                        $firstCKEditor.find('.cke_contents').css('padding-top', "0px");
                        $('html').removeClass('aos_stickyCKEditorToolbar');
                    }
                });
            });

            // setTimeout(function () {
            //     $(window).trigger('addstickyCKEditorToolbar');
            // }, 1200);
        }
    }

});


// add "scrolled" body class

var addScrolledBodyClass = debounce(function () {
    var el = document.querySelector('body');
    posTop() > 20 ? el.classList.add('scrolled') : el.classList.remove('scrolled');
}, 120);

['scroll', 'resize', 'load'].forEach(function (e) {
    // window.addEventListener(e, addScrolledBodyClass, false);
    window.addEventListener(e, addScrolledBodyClass);
});

function posTop() {
    return typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
}
