{% extends "template.swig" %}

{%- block css %}
  {% parent %}
  <link rel="stylesheet" href="/table.css"> 
{%- endblock %}

{%- block script %}
  {% parent %}
  <script type="text/javascript" src="/underscore-min.js"> </script>
  <script type="text/javascript" src="/rfas3.js"> </script>
  <script>
  {%- block list_json %}
    window.lsJson = {{lsJson|default("[]")|safe}};
  {%- endblock %}
  </script>
{%- endblock %}

{% block content %}
<article>
  <table id="lstable">
    <thead>
    <tr>
      <th id="th_name">Name</th>
      <th id="th_size">Size</th>
      <th id="th_date">Date</th>
    </tr>
    {%- block listing %}
    <tbody id="lsbody">
    </tbody>
    {%- endblock %}
    </thead>
  </table>
</article>
{% endblock %}
