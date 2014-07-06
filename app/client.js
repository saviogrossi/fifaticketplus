
// 8348

window.refreshAvailability_nnew = function() {

//        refreshAvaSeconds = 300;
//        var rest = parseInt(refreshAvaSeconds -nextValue, 10);
//        if (rest>0) return;

        var thisTime = new Date().toISOString();
        console.log(' ');
        console.log(thisTime+': Verificando...');


        if (received) {

            var msgPW = '<div style="padding:15px;"><h2><img src="img/pwait.gif" style="height:31px;"/></h2></div>'

            $("#lstMatches").block({ css: { border: '1px solid #000' }, message: msgPW });
            $("#lstCats").block({ css: { border: '1px solid #000' }, message: msgPW });
            var optionsR =
                {
                    type: "GET",
                    url: baseTOPS + TOPSBaseURL + "/TopsAkaCalls/Calls.aspx/getRefreshChartAvaDem?l=" + GLBlang + "&c=" + xx.applicationInMode(),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    global: false,
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log('  '+thisTime+' : errorThrown:'+JSON.stringify(errorThrown));
                        console.log('  '+thisTime+' : textStatus:'+JSON.stringify(textStatus));
                        $("#avaProducts").unblock();
                        $("#lstCats").unblock();
                    },
                    success: function (msg) {

                        try {
                            recRef = $.parseJSON(msg.d.data);


                            if (msg.d.data2 == "AO" && xx.newRequestedProducts().length==0) 
                            {
                                setTimeout(function(){document.location.href="http://www.fifa.com/worldcup/organisation/ticketing/apply-for-tickets/index.html";},7000)
                                showModal("INF", TOPS.Resources.SecCheck,"Session Ended / Sessão terminada", '#dum');
                            }

                            var tickets = [];
                            $.each(received.BasicCodes.PRODUCTPRICES, function (i, obj) {
                                //console.log('obj:'+JSON.stringify(obj));
                                var ff = ko.utils.arrayFirst(recRef.BasicCodes.PRODUCTPRICES, function (item) {
                                    //console.log('   item:'+JSON.stringify(item));
                                    return (item.PRPCategoryId == obj.PRPCategoryId && item.PRPProductId == obj.PRPProductId);
                                });

                                if (ff!=null) {
                                    obj.Quantity = ff.Quantity;                                  
                                    if (obj.PRPProductId == 'IMT61') {
                                      if (obj.CategoryName == 'CAT4') {
                                        //obj.Quantity = '8';
                                      }
                                      tickets.push(obj);  
                                    }
                                }

                            });
                            
                            console.log(JSON.stringify(tickets));
                            
                            var data = {
                            	tickets: tickets
                            }
                            
                            $.ajax({
                            	type: "POST",
                                url: "http://localhost:3000/api/v1/ticketsmon",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify( data ),
                                global: false,
                                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                                    console.log(' ERROR (textStatus): '+textStatus);
                                    console.log(' ERROR (errorThrown): '+errorThrown);
                                },
                                success: function (msg) {
                                	console.log(' server back: '+JSON.stringify(msg));
                                }
                            });

                            xx.centralSearch(lastFired);
                            xx.forceRefreshAVA.notifySubscribers();
                            //_gaq.push(['_trackPageview','\ProductsRefresh_v2.aspx']);
                        } catch(ex00){}
                        $("#avaProducts").unblock();
                        $("#lstCats").unblock();
                    }
                };
            $.ajax(optionsR);
        }
}
 