{% extends 'template.swig' %}

{% block content %}
<article>
<h3>{{owner}}'s personal netdisk here!</h3>
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
