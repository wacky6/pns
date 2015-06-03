{% extends "template.swig" %}

{%- block css -%}
  {% parent %}
  <link rel="stylesheet" href="/table.css"> 
{%- endblock -%}

{%- block script -%}
  {% parent %}
  <script type="text/javascript" src="/underscore-min.js"> </script>
  <script type="text/javascript" src="/rfas3.js"> </script>
{%- endblock -%}

{%- block content -%}
<article>
  <table id="lstable">
  <thead>
  <tr>
    <th id="th_name">Name</th>
    <th id="th_size">Size</th>
    <th id="th_date">Date</th>
  </tr>
  </thead>
  {%- block listing -%}
  <tbody id="lsbody">  
    {%- macro entry(type, access, name, size, mtime) -%}
    <tr class="{{type}} {{access}}" d-name="{{name}}" d-size="{{size}}" d-mtime="{{mtime}}">
      <td class="name"><a href="{{name}}">{{name}}</a></td>
      <td class="size">{%- if type=="dir" -%} {%- else -%} {{size|fsize}} {%- endif -%} </td> 
      <td class="time">{%- if mtime=="0" -%} {%- else -%} {{mtime|date("Y-m-d H:i:s")}}{%- endif- %}</td>
    </tr>
    {%- endmacro -%}
    {%- if isRoot -%} {{ entry("dir", "parent", "", 0, 0) }}
    {%-else-%}{{ entry("dir", "parent", "../", 0, 0) }}{%- endif -%}
    {%- for x in ls -%}
    {{ entry(x.type, x.access, x.name, x.size, x.mtime) }}
    {%- endfor -%}
  </tbody>
  {%- endblock -%}
  </table>
</article>
{%- endblock -%}
