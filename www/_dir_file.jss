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
  <table class="info">
    <tbody>
      <tr class="placeholder"><th class="icon">&nbsp;</th><th class="key">&nbsp;</th><th>&nbsp;</th></tr>
      <tr class="file parent"><td class="name" colspan='3'><a href="./">./</a></td></tr>
      {%- if bothExist %}
          <tr class="file public"> <td class="name" colspan='3'>
            <a href="?public">@Public</a></td>
          </tr>
          <tr class="file private"><td class="name" colspan='3'>
            <a href="?private">@Private</a></td>
          </tr>
      {%- else %}
      {%- endif %}
      <tr><td class="icon" rowspan="9">
            <img src="/icon/{{ext}}" alt="fileIcon"></img>
          </td>
          <th colspan='2'>File Information</th>
      </tr>
      <tr id="name" >         <td>Name:     </td> <td>{{name}} </td></tr>
      <tr id="size" >         <td>Size:     </td> <td>{{size}} </td></tr>
      <tr id="mtime">         <td>Modified: </td> <td>{{mtime}}</td></tr>
      <tr id="mime" >         <td>MIME:     </td> <td>{{mime}} </td></tr>
      <tr class="{{access}}"> <td>Access:   </td> <td>{{access}}   </td></tr>
      <tr><td colspan='2'>&nbsp;</td></tr>
      <tr><th colspan='2'>Actions</th></tr>
      <tr><td colspan='2'>
        <ul>
          <li id="a_view"><a href="{{baseQuery}}view">View</a></li>
          <li id="a_download"><a href="{{baseQuery}}download">Download</a></li>
        </ul>
      </td></tr>
    </tbody>
  </table>
</article>
{% endblock %}
