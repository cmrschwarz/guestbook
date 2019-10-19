$(document).ready(function() {
    'use strict';

    $('#form').submit(function(e) {
        e.preventDefault();

        var form = $(this);

        $.ajax({
            type : 'POST',
            cache : false,
            url : form.attr('action'),
            data : form.serialize(),
            success : function(data) {
                $("#entries").append('<div>' + data + '</div>');

                // fix index
                var index = $('#entries div[id^="entry"]').length;
                var textArray = $(data).find('h3').text().split('.', 2);

                $('#entries div[id^="entry"]:last')
                    .find('h3')
                    .text(index + '.' + textArray[1]);
                $('html, body').animate({scrollTop : form.offset().top}, 2000);

                e.target.reset();
            }
        });
    });

    function handleDelete(form, id) {
        $.ajax({
            type : 'DELETE',
            cache : false,
            url : form.attr('action'),
            data : form.serialize(),
            success : function() {
                $('#entry' + id).slideUp(500, function() {
                    var followingEntries =
                        $(this).parent().nextAll().each(function() {
                            var textArray =
                                $(this).find('h4').text().split('.', 2);
                            $(this).find('h4').text(
                                (parseInt(textArray[0], 10) - 1) + '.' +
                                textArray[1]);
                        });
                    $(this).parent().remove();
                });
            }
        });
    }

    function handleEdit(form, id, is_save) {
        var style_enable = {false : "none", true : "block"};
        var entry = $('#entry' + id);
        var edit = entry.find("#card_edit")[0];
        var save = entry.find("#card_save")[0];
        var content = entry.find("#card_content")[0];
        var content_editable = entry.find("#card_content_editable")[0];
        var text;
        if (is_save) {
            text = content_editable.value;
            content.innerText = text;
        }
        else {
            text = content.innerText;
            content_editable.value = text;
        }
        content.style.display = style_enable[is_save];
        content_editable.style.display = style_enable[!is_save];
        edit.style.display = style_enable[is_save];
        save.style.display = style_enable[!is_save];
        if (is_save) {
            $.ajax({
                type : 'POST',
                cache : false,
                url : form.attr('action'),
                data : "&text=" + text,
            });
        }
    }

    $('#entries').on('submit', 'form', function(e) {
        e.preventDefault();
        var form = $(this);
        var id = form[0].parentElement.getAttribute('data-entry-id');
        var input = form.find("input[name=_method]")[0];
        switch (input.getAttribute("value")) {
            case "delete": handleDelete(form, id); break;
            case "edit": handleEdit(form, id, false); break;
            case "save": handleEdit(form, id, true); break;
        }
    });
});
