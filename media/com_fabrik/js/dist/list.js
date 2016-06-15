/*! Fabrik */
define(["jquery","fab/fabrik","fab/list-toggle","fab/list-grouped-toggler","fab/list-keys","fab/list-actions","fab/mootools-ext"],function(a,b,c,d,e,f){var g=new Class({Implements:[Options,Events],actionManager:null,options:{admin:!1,filterMethod:"onchange",ajax:!1,ajax_links:!1,links:{edit:"",detail:"",add:""},form:"listform_"+this.id,hightLight:"#ccffff",primaryKey:"",headings:[],labels:{},Itemid:0,formid:0,canEdit:!0,canView:!0,page:"index.php",actionMethod:"floating",formels:[],data:[],itemTemplate:"",floatPos:"left",csvChoose:!1,advancedFilters:null,csvOpts:{excel:!1,incfilters:!1,inctabledata:!1,incraw:!1,inccalcs:!1},popup_width:300,popup_height:300,popup_offset_x:null,popup_offset_y:null,groupByOpts:{},isGrouped:!1,listRef:"",fabrik_show_in_list:[],singleOrdering:!1,tmpl:"",groupedBy:"",toggleCols:!1},initialize:function(a,g){var h=this;this.id=a,this.setOptions(g),this.getForm(),this.result=!0,this.plugins=[],this.list=document.id("list_"+this.options.listRef),this.options.j3===!1&&(this.actionManager=new f(this,{method:this.options.actionMethod,floatPos:this.options.floatPos})),this.options.toggleCols&&(this.toggleCols=new c(this.form)),this.groupToggle=new d(this.form,this.options.groupByOpts),new e(this),this.list&&("table"===this.list.get("tag")&&(this.tbody=this.list.getElement("tbody")),"null"===typeOf(this.tbody)&&(this.tbody=this.list),window.ie&&(this.options.itemTemplate=this.list.getElement(".fabrik_row"))),this.watchAll(!1),b.addEvent("fabrik.form.submitted",function(){h.updateRows()}),!this.options.resetFilters&&window.history&&history.pushState&&history.state&&this.options.ajax&&this._updateRows(history.state),b.fireEvent("fabrik.list.loaded",[this])},setItemTemplate:function(){if("string"===typeOf(this.options.itemTemplate)){var a=this.list.getElement(".fabrik_row");window.ie&&"null"!==typeOf(a)&&(this.options.itemTemplate=a)}},rowClicks:function(){var c,d,e=this;a(this.list).on("click",".fabrik_row",function(){c=this.id.split("_").pop(),d={errors:{},data:{rowid:c},rowid:c,listid:e.id},b.fireEvent("fabrik.list.row.selected",d)})},watchAll:function(a){a=a?a:!1,this.watchNav(),this.storeCurrentValue(),a||(this.watchRows(),this.watchFilters()),this.watchOrder(),this.watchEmpty(),a||(this.watchGroupByMenu(),this.watchButtons())},watchGroupByMenu:function(){var b=this;this.options.ajax&&a(this.form).on("click","*[data-groupBy]",function(c){b.options.groupedBy=a(this).data("groupby"),c.rightClick||(c.preventDefault(),b.updateRows())})},watchButtons:function(){var b=this;this.exportWindowOpts={modalId:"exportcsv",type:"modal",id:"exportcsv",title:"Export CSV",loadMethod:"html",minimizable:!1,width:360,height:240,content:"",modal:!0,bootstrap:this.options.j3},this.exportWindowOpts.width=parseInt(this.options.csvOpts.popupwidth,10)>0?this.options.csvOpts.popupwidth:340,this.exportWindowOpts.optswidth=parseInt(this.options.csvOpts.optswidth,10)>0?this.options.csvOpts.optswidth:200,"csv"===this.options.view?this.openCSVWindow():a(this.form).find(".csvExportButton").each(function(c,d){d=a(d),d.hasClass("custom")===!1&&d.on("click",function(a){a.preventDefault(),b.openCSVWindow()})})},centerCSVWindow:function(b){var c=b>0?"block":"none";a("p.saveto").css("display",c),b>=0||0==a("div.itemContent").outerHeight()?a("div.modal-footer").length?a("div.modal").css("height","auto"):a("div.itemContent").css("overflow","initial"):a("div.modal-footer").length&&(a("div.opt__file-type div").css({"float":"left",width:this.exportWindowOpts.optswidth-8+"px","background-color":"bisque",margin:"0px",padding:"4px 8px","font-weight":"600"}),a("div.itemContent").css("height","auto"),a("div.modal").css("height","auto")),a("div.contentWrapper").css("height","auto"),a("#csvmsg").css("text-align","center");var d=a(window).outerHeight(),e=a("div.modal-header").outerHeight(!0);if(a("div.modal-footer").length)var f=a("div.itemContent").outerHeight(!0),g=a("div.modal-footer").outerHeight(!0);else{var f=134,g=0;a("div.modal").css("height",e+f+"px")}var h=parseInt(e+f+g);if(h+10>d){var i=parseInt(e+.8*d+g);a("div.itemContent").outerHeight(parseInt(.8*d)),a("div.modal").outerHeight(i);var j=parseInt((d-i)/2);a("div.modal").css("top",j+"px")}else{var j=parseInt((d-h)/2);a("div.modal").css("top",j+"px")}},openCSVWindow:function(){var c=this;this.exportWindowOpts.content=this.makeCSVExportForm(),this.csvWindow=b.getWindow(this.exportWindowOpts),a("div.modal").css("height","auto"),a("div.modal").draggable({handle:".modal-header"}),a(".modal-header").on("mouseover",function(){a(this).css("cursor","move")}),a(window).on("resize",function(){c.centerCSVWindow()}),a("div.modal").find("form div[class^=opt__]").css({clear:"left","float":"left","white-space":"nowrap"}),a("div.modal").find("form div[class^=opt__] div").css({"line-height":"1.1em","white-space":"initial"}),c.centerCSVWindow(),a(".exportCSVButton").on("click",function(b){b.stopPropagation(),this.disabled=!0,a(this).hide(),a(this).closest("div.modal").find(".contentWrapper").hide();var d=a("#csvmsg");0===d.length&&(d=a("<div />").attr({id:"csvmsg"}).insertBefore(a(this))),d.html(Joomla.JText._("COM_FABRIK_LOADING")+' <p><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+'</p><p class="saveto">'+Joomla.JText._("COM_FABRIK_SAVING_TO")+' <span id="csvfile"></span></p>'),c.triggerCSVExport(0)})},makeCSVExportForm:function(){return this.options.csvChoose?(this.csvExportForm=this._csvExportForm(),this.csvExportForm):this._csvAutoStart()},_csvAutoStart:function(){var b=a("<div />").attr({id:"csvmsg"}).html(Joomla.JText._("COM_FABRIK_LOADING")+' <br /><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+".<br/>"+Joomla.JText._("COM_FABRIK_SAVING_TO")+'<span id="csvfile"></span>');return this.csvopts=this.options.csvOpts,this.csvfields=this.options.csvFields,this.triggerCSVExport(-1),b},makeSafeForCSS:function(a){return a.replace(/[^a-z0-9]/g,function(a){var b=a.charCodeAt(0);return 32==b?"-":b>=65&&90>=b?a.toLowerCase():("000"+b.toString(16)).slice(-4)})},_csvYesNo:function(b,c,d,e,f){var g=a("<label />").css({display:"inline-block","margin-left":"15px"}),h=g.clone().append([a("<input />").attr({type:"radio",name:b,value:"1",checked:c}),a("<span />").text(d)]),i=g.clone().append([a("<input />").attr({type:"radio",name:b,value:"0",checked:!c}),a("<span />").text(e)]),j=a("<div>").css({margin:"3px 0px 1px 8px",width:this.exportWindowOpts.optswidth+"px","float":"left"}).text(f),k="opt__"+this.makeSafeForCSS(f);return a('<div class="'+k+'">').css({"border-bottom":"1px solid #dddddd"}).append([j,h,i])},_csvExportForm:function(){var b,c,d=Joomla.JText._("JYES"),e=Joomla.JText._("JNO"),f=this,g="index.php?option=com_fabrik&view=list&listid="+this.id+"&format=csv&Itemid="+this.options.Itemid,h=(a("<label />").css("clear","left"),a("<form />").css("margin-bottom","0px").attr({action:g,method:"post"}).append([this._csvYesNo("excel",this.options.csvOpts.excel,"Excel CSV","CSV",Joomla.JText._("COM_FABRIK_FILE_TYPE")),this._csvYesNo("incfilters",this.options.csvOpts.incfilters,d,e,Joomla.JText._("COM_FABRIK_INCLUDE_FILTERS")),this._csvYesNo("inctabledata",this.options.csvOpts.inctabledata,d,e,Joomla.JText._("COM_FABRIK_INCLUDE_DATA")),this._csvYesNo("incraw",this.options.csvOpts.incraw,d,e,Joomla.JText._("COM_FABRIK_INCLUDE_RAW_DATA")),this._csvYesNo("inccalcs",this.options.csvOpts.inccalcs,d,e,Joomla.JText._("COM_FABRIK_INCLUDE_CALCULATIONS"))]));c=Joomla.JText._("COM_FABRIK_SELECT_COLUMNS_TO_EXPORT"),b="opt__"+f.makeSafeForCSS(c),a("<div />").prop("class",b).css({clear:"left","float":"left","white-space":"nowrap","background-color":"bisque",padding:"2px 8px","font-weight":"600","margin-top":"10px"}).text(c).appendTo(h);var i="",j=0;return a.each(this.options.labels,function(c,g){if("fabrik_"!==c.substr(0,7)&&"____form_heading"!==c){var k=c.split("___")[0];k!==i&&(i=k,b="opt__"+f.makeSafeForCSS(i),a("<div />").prop("class",b).css({clear:"left","font-weight":"600"}).text(i).appendTo(h)),g=g.replace(/<\/?[^>]+(>|jQuery)/g,""),f._csvYesNo("fields["+c+"]",!0,d,e,g).appendTo(h)}j++}),this.options.formels.length>0&&(c=Joomla.JText._("COM_FABRIK_FORM_FIELDS"),b="opt__"+f.makeSafeForCSS(c),a("<div />").prop("class",b).css({clear:"left","float":"left","white-space":"nowrap","background-color":"bisque",padding:"2px 8px","font-weight":"600","margin-top":"10px"}).text(c).appendTo(h),this.options.formels.each(function(a){f._csvYesNo("fields["+a.name+"]",!1,d,e,a.label).appendTo(h)})),a("<input />").attr({type:"hidden",name:"view",value:"table"}).appendTo(h),a("<input />").attr({type:"hidden",name:"option",value:"com_fabrik"}).appendTo(h),a("<input />").attr({type:"hidden",name:"listid",value:f.id}).appendTo(h),a("<input />").attr({type:"hidden",name:"format",value:"csv"}).appendTo(h),a("<input />").attr({type:"hidden",name:"c",value:"table"}).appendTo(h),h},triggerCSVExport:function(c,d,e){var f=this;f.centerCSVWindow(c),0!==c?-1===c?(c=0,d=f.csvopts,d.fields=f.csvfields):(d=f.csvopts,e=f.csvfields):(d||(d={},["incfilters","inctabledata","incraw","inccalcs","excel"].each(function(a){var b=f.csvExportForm.find("input[name="+a+"]");b.length>0&&(d[a]=b.filter(function(){return this.checked})[0].value)})),e||(e={},f.csvExportForm.find("input[name^=field]").each(function(){if(this.checked){var b=this.name.replace("fields[","").replace("]","");e[b]=a(this).val()}})),d.fields=e,f.csvopts=d,f.csvfields=e),d=this.csvExportFilterOpts(d),d.start=c,d.option="com_fabrik",d.view="list",d.format="csv",d.Itemid=this.options.Itemid,d.listid=this.id,d.listref=this.options.listRef,d.download=0,d.setListRefFromRequest=1,this.options.csvOpts.custom_qs.split("&").each(function(a){var b=a.split("=");d[b[0]]=b[1]});var g=new Request.JSON({url:"?"+this.options.csvOpts.custom_qs,method:"post",data:d,onError:function(a,b){fconsole(a,b)},onComplete:function(d){if(f.centerCSVWindow(c),d.err)window.alert(d.err),b.Windows.exportcsv.close();else if(a("#csvcount").text(d.count),a("#csvtotal").text(d.total),a("#csvfile").text(d.file),d.count<d.total)f.triggerCSVExport(d.count);else{var e="index.php?option=com_fabrik&view=list&format=csv&listid="+f.id+"&start="+d.count+"&Itemid="+f.options.Itemid,g='<div class="alert alert-success" style="padding:10px;margin-bottom:3px"><h3>'+Joomla.JText._("COM_FABRIK_CSV_COMPLETE");g+='</h3><p><a class="btn btn-success" href="'+e+'"><i class="icon-download"></i> '+Joomla.JText._("COM_FABRIK_CSV_DOWNLOAD_HERE")+"</a></p></div>",a("#csvmsg").html(g),document.getElements("input.exportCSVButton").removeProperty("disabled"),a("#csvmsg a.btn-success").mouseup(function(){a(this).hide()}),a("#csvmsg a.btn-success").focusout(function(){b.Windows.exportcsv.close(!0)})}}});g.send()},csvExportFilterOpts:function(b){var c,d,e,f,g=0,h=this,i=0,j=["value","condition","join","key","search_type","match","full_words_only","eval","grouped_to_previous","hidden","elementid"];return this.getFilters().each(function(c,e){e=a(e),d=e.prop("name").split("["),d.length>3&&(f=parseInt(d[3].replace("]",""),10),g=f>g?f:g,"checkbox"===e.prop("type")||"radio"===e.prop("type")?e[0].checked&&(b[e.name]=e.val()):b[e.name]=e.val())}),g++,Object.each(this.options.advancedFilters,function(a,d){if(j.contains(d))for(i=0,c=0;c<a.length;c++)i=c+g,e="fabrik___filter[list_"+h.options.listRef+"]["+d+"]["+i+"]",b[e]="value"===d?h.options.advancedFilters.origvalue[c]:"condition"===d?h.options.advancedFilters.orig_condition[c]:a[c]}),b},addPlugins:function(a){var b=this;a.each(function(a){a.list=b}),this.plugins=a},firePlugin:function(a){var c=Array.prototype.slice.call(arguments),d=this;return c=c.slice(1,c.length),this.plugins.each(function(){b.fireEvent(a,[d,c])}),this.result===!1?!1:!0},watchEmpty:function(){var b=this,c=a(this.form).find(".doempty");c.on("click",function(a){a.preventDefault(),window.confirm(Joomla.JText._("COM_FABRIK_CONFIRM_DROP"))&&b.submit("list.doempty")})},watchOrder:function(){var c,d,e,f,g=!1,h=a(this.form),i=this,j=h.find(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc");j.off("click"),j.on("click",function(j){var k="ordernone.png",l="",m="",n="",o="",p=a(this),q=p.closest(".fabrik_ordercell");switch("A"!==p.prop("tagName")&&(p=q.find("a")),p.attr("class")){case"fabrikorder-asc":m="fabrikorder-desc",n=p.data("data-sort-desc-icon"),o=p.data("data-sort-asc-icon"),l="desc",k="orderdesc.png";break;case"fabrikorder-desc":m="fabrikorder",n=p.data("data-sort-icon"),o=p.data("data-sort-desc-icon"),l="-",k="ordernone.png";break;case"fabrikorder":m="fabrikorder-asc",n=p.data("data-sort-asc-icon"),o=p.data("data-sort-icon"),l="asc",k="orderasc.png"}return q.attr("class").split(" ").each(function(a){a.contains("_order")&&(g=a.replace("_order","").replace(/^\s+/g,"").replace(/\s+$/g,""))}),g?(p.attr("class",m),b.bootstrapped?d=p.find("*[data-isicon]"):(c=p.find("img"),d=p.firstElementChild),i.options.singleOrdering&&h.find(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc").each(function(a){if(b.bootstrapped)switch(e=a.firstElementChild,a.className){case"fabrikorder-asc":e.removeClass(a.data("sort-asc-icon")),e.addClass(a.data("sort-icon"));break;case"fabrikorder-desc":e.removeClass(a.data("sort-desc-icon")),e.addClass(a.data("sort-icon"));break;case"fabrikorder":}else c=a.find("img"),c.length>0&&(f=c.attr("src"),f=f.replace("ordernone.png","").replace("orderasc.png","").replace("orderdesc.png",""),f+="ordernone.png",c.attr("src",f))}),b.bootstrapped?(d.removeClass(o),d.addClass(n)):c&&(f=c.attr("src"),f=f.replace("ordernone.png","").replace("orderasc.png","").replace("orderdesc.png",""),c.attr("src",f)),i.fabrikNavOrder(g,l),void j.preventDefault()):void fconsole("woops didnt find the element id, cant order")})},getFilters:function(){return a(this.form).find(".fabrik_filter")},storeCurrentValue:function(){"submitform"!==this.options.filterMethod&&this.getFilters().each(function(b,c){c=a(c),c.data("initialvalue",c.val())})},watchFilters:function(){var b="",c=this,d=a(this.form).find(".fabrik_filter_submit");this.getFilters().each(function(d,e){e=a(e),b="SELECT"===e.prop("tagName")?"change":"blur","submitform"!==c.options.filterMethod&&(e.off(b),e.on(b,function(a){a.preventDefault(),e.data("initialvalue")!==e.val()&&c.doFilter()}))}),d.off(),d.on("click",function(a){a.preventDefault(),c.doFilter()}),this.getFilters().on("keydown",function(a){13===a.keyCode&&(a.preventDefault(),c.doFilter())})},doFilter:function(){var a=b.fireEvent("list.filter",[this]).eventResults;null===a&&this.submit("list.filter"),0!==a.length&&a.contains(!1)||this.submit("list.filter")},setActive:function(a){this.list.getElements(".fabrik_row").each(function(a){a.removeClass("activeRow")}),a.addClass("activeRow")},getActiveRow:function(c){var d=a(c.target).closest(".fabrik_row");return 0===d.length&&(d=b.activeRow),d},watchRows:function(){this.list&&this.rowClicks()},getForm:function(){return this.form||(this.form=document.id(this.options.form)),this.form},uncheckAll:function(){a(this.form).find("input[name^=ids]").each(function(a,b){b.checked=""})},submitDeleteCheck:function(){var c=!1,d=0;if(a(this.form).find("input[name^=ids]").each(function(a,b){b.checked&&(d++,c=!0)}),!c)return window.alert(Joomla.JText._("COM_FABRIK_SELECT_ROWS_FOR_DELETION")),b.loader.stop("listform_"+this.options.listRef),!1;var e=1===d?Joomla.JText._("COM_FABRIK_CONFIRM_DELETE_1"):Joomla.JText._("COM_FABRIK_CONFIRM_DELETE").replace("%s",d);return window.confirm(e)?!0:(b.loader.stop("listform_"+this.options.listRef),this.uncheckAll(),!1)},submit:function(c){this.getForm();var d=this.options.ajax,e=this,f=a(this.form);if("list.doPlugin.noAJAX"===c&&(c="list.doPlugin",d=!1),"list.delete"===c&&!this.submitDeleteCheck())return!1;if("list.filter"===c?(b["filter_listform_"+this.options.listRef].onSubmit(),this.form.task.value=c,this.form["limitstart"+this.id]&&f.find("#limitstart"+this.id).val(0)):""!==c&&(this.form.task.value=c),d){b.loader.start("listform_"+this.options.listRef),f.find("input[name=option]").val("com_fabrik"),f.find("input[name=view]").val("list"),f.find("input[name=format]").val("raw");var g=this.form.toQueryString();if("list.doPlugin"===c&&(g+="&setListRefFromRequest=1",g+="&listref="+this.options.listRef),"list.filter"===c&&this.advancedSearch!==!1){var h=document.getElement("form.advancedSearch_"+this.options.listRef);"null"!==typeOf(h)&&(g+="&"+h.toQueryString(),g+="&replacefilters=1")}for(var i=0;i<this.options.fabrik_show_in_list.length;i++)g+="&fabrik_show_in_list[]="+this.options.fabrik_show_in_list[i];g+="&tmpl="+this.options.tmpl,this.request?this.request.options.data=g:this.request=new Request({url:this.form.get("action"),data:g,onComplete:function(a){a=JSON.decode(a),e._updateRows(a),b.loader.stop("listform_"+e.options.listRef),b["filter_listform_"+e.options.listRef].onUpdateData(),b.fireEvent("fabrik.list.submit.ajax.complete",[e,a]),a.msg&&window.alert(a.msg)}}),this.request.send(),window.history&&window.history.pushState&&history.pushState(g,"fabrik.list.submit"),b.fireEvent("fabrik.list.submit",[c,this.form.toQueryString().toObject()])}else this.form.submit();return!1},fabrikNav:function(a){return this.options.limitStart=a,this.form.getElement("#limitstart"+this.id).value=a,b.fireEvent("fabrik.list.navigate",[this,a]),this.result?(this.submit("list.view"),!1):(this.result=!0,!1)},getRowIds:function(){var a=[],b=this.options.isGrouped?$H(this.options.data):this.options.data;return b.each(function(b){b.each(function(b){a.push(b.data.__pk_val)})}),a},getRow:function(a){var b={};return Object.each(this.options.data,function(c){for(var d=0;d<c.length;d++){var e=c[d];e&&e.data.__pk_val===a&&(b=e.data)}}),b},fabrikNavOrder:function(a,c){return this.form.orderby.value=a,this.form.orderdir.value=c,b.fireEvent("fabrik.list.order",[this,a,c]),this.result?void this.submit("list.order"):(this.result=!0,!1)},removeRows:function(a){var b,c=this,d=function(){e.dispose(),c.checkEmpty()};for(b=0;b<a.length;b++){var e=document.id("list_"+c.id+"_row_"+a[b]),f=new Fx.Morph(e,{duration:1e3});f.start({backgroundColor:this.options.hightLight}).chain(function(){this.start({opacity:0})}).chain(d)}},editRow:function(){},clearRows:function(){this.list.getElements(".fabrik_row").each(function(a){a.dispose()})},updateRows:function(a){var b=this,c="",d={option:"com_fabrik",view:"list",task:"list.view",format:"raw",listid:this.id,group_by:this.options.groupedBy,listref:this.options.listRef};d["limit"+this.id]=this.options.limitLength,a&&Object.append(d,a),new Request({url:c,data:d,evalScripts:!1,onSuccess:function(a){a=a.stripScripts(),a=JSON.decode(a),b._updateRows(a)},onError:function(a,b){fconsole(a,b)},onFailure:function(a){fconsole(a)}}).send()},_updateHeadings:function(b){var c=a("#"+this.options.form).find(".fabrik___heading");a.each(b.headings,function(a,b){a="."+a;try{c.find(a+" span").html(b)}catch(d){fconsole(d)}})},_updateGroupByTables:function(){var b,c=a(this.list).find("tbody");c.css("display",""),c.each(function(c,d){d.hasClass("fabrik_groupdata")||(b=a(d).next(),0===a(b).find(".fabrik_row").length&&(a(d).hide(),a(b).hide()))})},_updateRows:function(c){var d,e,f,g,h,i,j,k,l,m,n,o=[],p=a(this.form),q=this;if("object"===typeOf(c)&&(window.history&&window.history.pushState&&history.pushState(c,"fabrik.list.rows"),c.id===this.id&&"list"===c.model)){this._updateHeadings(c),this.setItemTemplate(),l=a(this.list).find(".fabrik_row").first(),0===l.length&&(l=a(this.options.itemTemplate)),"TR"===l.prop("tagName")?(i=l,h=1):(i=l.parent(),h=p.find(".fabrikDataContainer").data("cols")),h=void 0===h?1:h,k=i.clone().empty(),e=l.clone(),this.clearRows(),this.options.data=this.options.isGrouped?$H(c.data):c.data,c.calculations&&this.updateCals(c.calculations),p.find(".fabrikNav").html(c.htmlnav);var r=this.options.isGrouped||""!==this.options.groupedBy?$H(c.data):c.data,s=0;r.each(function(c){for(d=q.options.isGrouped?q.list.getElements(".fabrik_groupdata")[s]:q.tbody,d=a(d),d.empty(),q.options.isGrouped&&(g=d.prev(),g.find(".groupTitle").html(c[0].groupHeading)),o=[],s++,f=0;f<c.length;f++){var i=$H(c[f]);j=q.injectItemData(e,i),o.push(j)}for(o=b.Array.chunk(o,h),f=0;f<o.length;f++)m=o[f].length>0&&"TR"===o[f][0].prop("tagName")?o[f][0].children():o[f],n=k.clone().append(m),d.append(n)}),this._updateGroupByTables(),this._updateEmptyDataMsg(0===o.length),this.watchAll(!0),b.fireEvent("fabrik.list.updaterows"),b.fireEvent("fabrik.list.update",[this,c]),this.stripe(),this.mediaScan(),b.loader.stop("listform_"+this.options.listRef)}},_updateEmptyDataMsg:function(b){var c=a(this.list),d=c.parent(".fabrikDataContainer"),e=c.parent(".fabrikForm").find(".emptyDataMessage");b?(e.css("display",""),"none"===e.parent().css("display")&&e.parent().css("display",""),e.parent(".emptyDataMessage").css("display","")):(d.css("display",""),e.css("display","none"))},injectItemData:function(b,c){var d,e,f,g;if(a.each(c.data,function(c,d){if(e=b.find("."+c),"A"!==e.prop("tagName"))e.html(d);else{var f;try{f=a(d).prop("href");var g=a(d).data("rowid");e.prop("href",f),e.data("rowid",g)}catch(h){e.prop("href",d)}}}),b.find(".fabrik_row").prop("id",c.id),"string"==typeof this.options.itemTemplate){f=b.find(".fabrik_row"),f.prop("id",c.id);var h=c["class"].split(" ");for(g=0;g<h.length;g++)f.addClass(h[g]);d=b.clone()}else d=b.find(".fabrik_row");return d},mediaScan:function(){"undefined"!=typeof Slimbox&&Slimbox.scanPage(),"undefined"!=typeof Lightbox&&Lightbox.init(),"undefined"!=typeof Mediabox&&Mediabox.scanPage()},addRow:function(a){var b=new Element("tr",{"class":"oddRow1"});for(var c in a)if(-1!==this.options.headings.indexOf(c)){var d=new Element("td",{}).appendText(a[c]);b.appendChild(d)}b.inject(this.tbody)},addRows:function(a){var b,c;for(b=0;b<a.length;b++)for(c=0;c<a[b].length;c++)this.addRow(a[b][c]);this.stripe()},stripe:function(){var a,b=this.list.getElements(".fabrik_row");for(a=0;a<b.length;a++)if(!b[a].hasClass("fabrik___header")){var c="oddRow"+a%2;b[a].addClass(c)}},checkEmpty:function(){var a=this.list.getElements("tr");2===a.length&&this.addRow({label:Joomla.JText._("COM_FABRIK_NO_RECORDS")})},watchCheckAll:function(){var b,c,d,e,f=a(this.form),g=f.find("input[name=checkAll]"),h=this,i=a(this.list);g.on("click",function(a){for(d=i.closest(".fabrikList").length>0?i.closest(".fabrikList"):i,e=d.find("input[name^=ids]"),b=a.target.checked?"checked":"",c=0;c<e.length;c++)e[c].checked=b,h.toggleJoinKeysChx(e[c])}),f.find("input[name^=ids]").each(function(b,c){a(c).on("change",function(){h.toggleJoinKeysChx(c)})})},toggleJoinKeysChx:function(a){a.getParent().getElements("input[class=fabrik_joinedkey]").each(function(b){b.checked=a.checked})},watchNav:function(){var c,d,e=a(this.form),f=e.find("select[name*=limit]"),g=e.find(".addRecord"),h=this;if(f.on("change",function(){return b.fireEvent("fabrik.list.limit",[h]),h.result===!1?(h.result=!0,!1):void h.doFilter()}),this.options.ajax_links&&g.size()>0){g.off(),d=g.prop("href"),c=""===this.options.links.add||d.contains(b.liveSite)?"xhr":"iframe";var i=d;i+=i.contains("?")?"&":"?",i+="tmpl=component&ajax=1",i+="&format=partial",g.on("click",function(a){a.preventDefault();var d={id:"add."+h.id,title:h.options.popup_add_label,loadMethod:c,contentURL:i,width:h.options.popup_width,height:h.options.popup_height};null!==h.options.popup_offset_x&&(d.offset_x=h.options.popup_offset_x),null!==h.options.popup_offset_y&&(d.offset_y=h.options.popup_offset_y),b.getWindow(d)})}a("#fabrik__swaptable").on("change",function(){window.location="index.php?option=com_fabrik&task=list.view&cid="+this.value});var j=e.find(".pagination .pagenav");0===j.length&&(j=e.find(".pagination a")),a(j).on("click",function(a){if(a.preventDefault(),"A"===this.tagName){var b=this.href.toObject();h.fabrikNav(b["limitstart"+h.id])}}),this.watchCheckAll()},updateCals:function(a){var b=["sums","avgs","count","medians"];this.form.getElements(".fabrik_calculations").each(function(c){b.each(function(b){$H(a[b]).each(function(a,b){var d=c.getElement("."+b);"null"!==typeOf(d)&&d.set("html",a)})})})}});return g});