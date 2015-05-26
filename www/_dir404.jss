{% extends "_template.swig" %}

{%- block css %}
  {% parent %}
  <link rel="stylesheet" href="/table.css"> 
{%- endblock %}

{%- block script %}
  {% parent %}
  <script type="text/javascript" src="/underscore-min.js"> </script>

{%- endblock %}

{% block content %}
<article>
  <table id="lstable" class="error">
    <thead>
    <tr>
      <th>Oops.</th>
    </tr>
    <tbody id="lsbody">
      <tr class="file parent"><td class="name"><a href="../">../</a></td></tr>
      <tr class="file"><td>&nbsp;</td></tr>
      <tr class="file"><td class="name">Directory does not exist!</td></tr>
      <tr class="file"><td class="name">目录不存在!</td></tr>
      <tr class="file"><td>&nbsp;</td></tr>
    </tbody>
    </thead>
  </table>
</article>
{% endblock %}
