<!-- ft -->
<div id="ft">
    Footer
</div>
<!-- /ft -->
<% bottomFile.forEach(function(item){
  var fileUrl = /^(?:http|\/)/i.test(item) ? item : (js+'/'+item);
    if(/.+\.css(?:$|\?.+)/.test(fileUrl)){

    }
	if(reqUrl && /\/src\/pages\//.test(reqUrl) && !/^(?:http|\/)/i.test(item)){
		fileUrl = item;
	}
%>

<% if(seajs && debug && !/^(?:http|\/)/i.test(item)){ %>
<script>seajs.use('./<%=fileUrl%>')</script>
<%}else{%>
<script>seajs.use('../<%=fileUrl%>')</script>
<%}%>

<%})%>
</body>
</html>
