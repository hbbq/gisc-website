---
layout: base.njk
title: Projects
---

# Projects

<ul>
{% for project in collections.project %}
    <li>
        <a href="{{ project.url | url }}">{{ project.data.title }}</a>{% if project.data.status %} ({{ project.data.status }}){% endif %}
    </li>
{% endfor %}
</ul>
