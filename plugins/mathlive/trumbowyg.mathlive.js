/* ===========================================================
 * trumbowyg.mathMl.js v1.0
 * MathML plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : loclamor
 */

/* globals MathJax */
(function ($) {
    'use strict';
    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                mathml: 'Insert Formulas',
                formulas: 'Formulas',
                inline: 'Inline'
            },
            az: {
                mathml: 'Düstur əlavə et',
                formulas: 'Düsturlar',
                inline: 'Sətir içi'
            },
            by: {
                mathml: 'Уставіць формулу',
                formulas: 'Формула',
                inline: 'Inline-элемент'
            },
            ca: {
                mathml: 'Inserir Fórmula',
                formulas: 'Fórmula',
                inline: 'En línia'
            },
            da: {
                mathml: 'Indsæt formler',
                formulas: 'Formler',
                inline: 'Inline'
            },
            de: {
                mathml: 'Formel einfügen',
                formulas: 'Formel',
                inline: 'Innerhalb der Zeile'
            },
            es: {
                mathml: 'Insertar Fórmula',
                formulas: 'Fórmula',
                inline: 'En línea'
            },
            et: {
                mathml: 'Sisesta valem',
                formulas: 'Valemid',
                inline: 'Teksti sees'
            },
            fr: {
                mathml: 'Inserer une formule',
                formulas: 'Formule',
                inline: 'En ligne'
            },
            hu: {
                mathml: 'Formulák beszúrás',
                formulas: 'Formulák',
                inline: 'Inline'
            },
            ko: {
                mathml: '수식 넣기',
                formulas: '수식',
                inline: '글 안에 넣기'
            },
            pt_br: {
                mathml: 'Inserir fórmulas',
                formulas: 'Fórmulas',
                inline: 'Em linha'
            },
            ru: {
                mathml: 'Вставить формулу',
                formulas: 'Формула',
                inline: 'Строчный элемент'
            },
            sl: {
                mathml: 'Vstavi matematični izraz',
                formulas: 'Formula',
                inline: 'V vrstici'
            },
            tr: {
                mathml: 'Formül Ekle',
                formulas: 'Formüller',
                inline: 'Satır içi'
            },
            zh_tw: {
                mathml: '插入方程式',
                formulas: '方程式',
                inline: '內嵌'
            },
        },
        // jshint camelcase:true

        plugins: {
            mathml: {
                init: function (trumbowyg) {
                    var mathMlOptions = {
                        formulas: {
                            label: trumbowyg.lang.formulas,
                            required: true,
                            value: '',
                            inputType: 'math',
                            type: function(field, fieldId, prefix, lg) {
                                var html = '<div class="' + prefix + 'input-row">' +
                                    '<div class="' + prefix + 'input-infos">' +
                                    '<label for="' + fieldId + '">' +
                                    '<span>' + (lg[field.label] ? lg[field.label] : field.label) + '</span>' +
                                    '</label>' +
                                    '</div>' +
                                    '<div class="' + prefix + 'input-html">' +
                                    '<math-field type="math-field" style="display: block;">' +
                                    field.value +
                                    '</math-field>' +
                                    '</div>' +
                                    '</div>';

                                return html;
                            }
                        },
                        inline: {
                            label: trumbowyg.lang.inline,
                            attributes: {
                                checked: true
                            },
                            type: 'checkbox',
                            required: false,
                        }
                    };

                    var mathmlCallback = function (v) {
                        var delimiter = v.inline ? '$' : '$$';
                        if (trumbowyg.currentMathNode) {
                            $(trumbowyg.currentMathNode)
                                .html(delimiter + ' ' + v.formulas + ' ' + delimiter)
                                .attr('formulas', v.formulas)
                                .attr('inline', (v.inline ? 'true' : 'false'));
                        } else {
                            var mlFormulas = MathLive.convertLatexToMathMl(v.formulas);
                            var html = '<span contenteditable="false" formulas="' + v.formulas + '" inline="' + (v.inline ? 'true' : 'false') + '" >' + delimiter + ' ' + mlFormulas + ' ' + delimiter + '</span>';
                            var node = $(html)[0];
                            node.onclick = openModal;

                            trumbowyg.range.deleteContents();
                            trumbowyg.range.insertNode(node);
                        }

                        trumbowyg.currentMathNode = false;
                        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
                        return true;
                    };

                    var openModalInsert = function (title, fields, cmd) {
                        var t = trumbowyg,
                            prefix = t.o.prefix,
                            lg = t.lang,
                            html = '',
                            idPrefix = prefix + 'form-' + Date.now() + '-';

                        $.each(fields, function (fieldName, field) {
                            var l = field.label || fieldName,
                                n = field.name || fieldName,
                                a = field.attributes || {},
                                fieldId = idPrefix + fieldName;

                            var attr = Object.keys(a).map(function (prop) {
                                return prop + '="' + a[prop] + '"';
                            }).join(' ');

                            if (typeof field.type === 'function') {
                                if (!field.name) {
                                    field.name = n;
                                }

                                html += field.type(field, fieldId, prefix, lg);

                                return;
                            }

                            html += '<div class="' + prefix + 'input-row">';
                            html += '<div class="' + prefix + 'input-infos"><label for="' + fieldId + '"><span>' + (lg[l] ? lg[l] : l) + '</span></label></div>';
                            html += '<div class="' + prefix + 'input-html">';

                            if ($.isPlainObject(field.options)) {
                                html += '<select name="target">';
                                html += Object.keys(field.options).map((optionValue) => {
                                    return '<option value="' + optionValue + '" ' + (optionValue === field.value ? 'selected' : '') + '>' + field.options[optionValue] + '</option>';
                                }).join('');
                                html += '</select>';
                            } else {

                                if (field.inputType === "math"){
                                    html += '<math-field id="' + fieldId + '" name="' + n + '" ' + attr;
                                } else {
                                    html += '<input id="' + fieldId + '" type="' + (field.type || 'text') + '" name="' + n + '" ' + attr;
                                }
                                html += (field.type === 'checkbox' && field.value ? ' checked="checked"' : '') + ' value="' + (field.value || '').replace(/"/g, '&quot;') + '">';
                            }

                            html += '</div></div>';
                        });

                        return t.openModal(title, html)
                            .on("tbwconfirm", function (e) {
                                e.preventDefault();
                                var $form = $('form', $(this)),
                                    valid = true,
                                    values = {};

                                $.each(fields, function (fieldName, field) {
                                    var n = field.name || fieldName;

                                    var $field = null;

                                    if (field.inputType === "math")
                                    {
                                        $field = $('math-field', $form);
                                    } else {
                                        $field = $(':input[name="' + n + '"]', $form);
                                    }

                                    var inputType = $field[0].type;

                                    switch (inputType.toLowerCase()) {
                                        case 'checkbox':
                                            values[n] = $field.is(':checked');
                                            break;
                                        case 'radio':
                                            values[n] = $field.filter(':checked').val();
                                            break;
                                        default:
                                            values[n] = $.trim($field.val());
                                            break;
                                    }
                                    // Validate value
                                    if (field.required && values[n] === '') {
                                        valid = false;
                                        t.addErrorOnModalField($field, t.lang.required);
                                    } else if (field.pattern && !field.pattern.test(values[n])) {
                                        valid = false;
                                        t.addErrorOnModalField($field, field.patternError);
                                    }
                                });

                                if (valid) {
                                    t.restoreRange();

                                    if (cmd(values, fields)) {
                                        t.syncCode();
                                        t.$c.trigger('tbwchange');
                                        t.closeModal();

                                        return true;
                                    }
                                }

                                return false;
                            })
                            .one("tbwcancel", function () {
                                $(this).off("tbwconfirm");
                                t.closeModal();
                            });
                    }



                    var openModal = function () {
                        trumbowyg.currentMathNode = this;
                        mathMlOptions.formulas.value = $(this).attr('formulas');

                        if ($(this).attr('inline') === 'true') {
                            mathMlOptions.inline.attributes.checked = true;
                        } else {
                            delete mathMlOptions.inline.attributes.checked;
                        }

                        openModalInsert(trumbowyg.lang.mathml, mathMlOptions, mathmlCallback);
                    };

                    var btnDef = {
                        fn: function () {
                            trumbowyg.saveRange();

                            mathMlOptions.formulas.value = trumbowyg.getRangeText();
                            mathMlOptions.inline.attributes.checked = true;
                            openModalInsert(trumbowyg.lang.mathml, mathMlOptions, mathmlCallback);
                        }
                    };

                    trumbowyg.$ta.on('tbwinit', function () {
                        var nodes = trumbowyg.$ed.find('[formulas]');

                        nodes.each(function (i, elem) {
                            elem.onclick = openModal;
                        });
                    });

                    trumbowyg.addBtnDef('mathml', btnDef);
                }
            }
        }
    });
})(jQuery);
