{% extends 'template.swig' %}

{%- block css %}
{% parent %}
  <link rel="stylesheet" type="text/css" href="/index.css">
{%- endblock %}

{% block content %}
<article class="index">
<h3>Welcome to {{owner}}'s PNS.</h3>
<span>You can: </span>
<ul>
  <li><a href="/dir/"   title="Directory Listing" >        Browse Files</a></li>
  <li><a href="/code/"  title="Get File with FetchCode">   Get a Private Share</a></li>
  <li><a href="/auth"   title="Authenticate">              Authenticate Yourself</a></li>
  <li><a href="/anonUp" title="Anonymously Upload a File"> Anon. Upload</a></li>
{%- if showCert %}
  <li class="special"><a href="/cert" title="Get Certificate">Get HTTPS Certificate</a></li>
{%- endif %}
</ul>
</article>
{% endblock %}
