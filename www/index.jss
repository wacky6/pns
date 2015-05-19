{% extends 'template.swig' %}

{%- block css %}
{% parent %}
<link rel="stylesheet" type="text/css" href="/index.css">
{%- endblock %}

{% block content %}
<article class="index">
<h3>{{owner}}'s Private Cloud Storage Here!</h3>
<span>You can: </span>
<ul>
<li><a href="/dir/">   Browse Public Files</a></li>
<li><a href="/fcode/"> Get a Private Share</a></li>
<li><a href="/auth">  Authenticate Yourself</a></li>
</ul>
<hr />
<h3></h3>
</article>
{% endblock %}
