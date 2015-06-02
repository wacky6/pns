<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no">
  <title>{{owner}} @ PNS</title>
  {%- block css %}
  <link rel="stylesheet" type="text/css" href="/base.css">
  {%- endblock %}
  {%- block script %}
  {%- endblock %}
</head>
<body>
<header>
  <h1 class="color1"><a href="/">{{title|default("Private Network Storage")}}</a></h1>
</header>
<div id="content_wrapper" class="color2 light">
  {% block content %}
  {% endblock %}
</div>
<footer class="color1">
  <a class="color1 light" href="https://github.com/wacky6">
  rfas3/pns, Aries, (C) 2014-2015, All rights reserved.
  </a>
</footer>
</body>
</html>
