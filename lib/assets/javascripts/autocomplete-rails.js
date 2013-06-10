/*
* Unobtrusive autocomplete
*
* To use it, you just have to include the HTML attribute autocomplete
* with the autocomplete URL as the value
*
*   Example:
*       <input type="text" data-autocomplete="/url/to/autocomplete">
*
* Optionally, you can use a jQuery selector to specify a field that can
* be updated with the element id whenever you find a matching value
*
*   Example:
*       <input type="text" data-autocomplete="/url/to/autocomplete" data-id-element="#id_field">
*/
$(document).ready(function(){$("input[data-autocomplete]").railsAutocomplete()});(function(e){var t=null;e.fn.railsAutocomplete=function(){return this.on("focus",function(){if(!this.railsAutoCompleter){this.railsAutoCompleter=new e.railsAutocomplete(this)}})};e.railsAutocomplete=function(e){_e=e;this.init(_e)};e.railsAutocomplete.fn=e.railsAutocomplete.prototype={railsAutocomplete:"0.0.1"};e.railsAutocomplete.fn.extend=e.railsAutocomplete.extend=e.extend;e.railsAutocomplete.fn.extend({init:function(e){function t(t){return t.split(e.delimiter)}function n(e){return t(e).pop().replace(/^\s+/,"")}e.delimiter=$(e).attr("data-delimiter")||null;$(e).autocomplete({source:function(t,r){$.getJSON($(e).attr("data-autocomplete"),{term:n(t.term),extra:$(e).attr("data-extra")},function(){$(arguments[0]).each(function(t,n){var r={};r[n.id]=n;$(e).data(r)});r.apply(null,arguments)})},search:function(){var e=n(this.value);if(e.length<2){return false}},focus:function(){return false},select:function(n,r){var i=t(this.value);i.pop();i.push(r.item.value);if(e.delimiter!=null){i.push("");this.value=i.join(e.delimiter)}else{this.value=i.join("");if($(this).attr("data-id-element")){$($(this).attr("data-id-element")).val(r.item.id)}if($(this).attr("data-update-elements")){var s=$(this).data(r.item.id.toString());var o=$.parseJSON($(this).attr("data-update-elements"));for(var u in o){$(o[u]).val(s[u])}}}var a=this.value;$(this).bind("keyup.clearId",function(){if($(this).val().trim()!=a.trim()){$($(this).attr("data-id-element")).val("");$(this).unbind("keyup.clearId")}});$(this).trigger("railsAutocomplete.select",r);return false}})}})})(jQuery)