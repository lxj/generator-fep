<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><%=pagename%></title>
    <% topFile.forEach(function(item){
    	var fileUrl = /^(?:http|\/)/i.test(item) ? item : (css+'/'+item);
        if(/.+\.css(?:$|\?.+)/.test(fileUrl)){

        }
        if(debug && !/^(?:http|\/)/i.test(item)){
        	fileUrl = item.match(/.+\./)[0]+'styl';
        }
    %>
    <link type="text/css" rel="stylesheet" href="<%=fileUrl%>">
    <%})%>
    <script type="text/javascript"
  src="http://static.iqiyi.com/js/lib/sea1.2.js"></script>
    <script>
    <% if(debug){ %>
    seajs.config({
        base:"http://fengan.iqiyi.com:9000/build/<%= staticAsset %>/<%= projectVersion %>/js/"
    })
    <%}else{%>
    seajs.config({
        base:"http://fengan.iqiyi.com:9000/build/<%= staticAsset %>/<%= projectVersion %>/js/",
        cwd : "http://fengan.iqiyi.com:9000/build/<%= staticAsset %>/<%= projectVersion %>/js/"
    })
    <%}%>
    </script>
</head>
<body data-page-name="<%=pageid%>">
<!-- hd -->
<div id="hd">
    <div class="masthead">
        Header
    </div>
</div>
<!-- /hd -->
