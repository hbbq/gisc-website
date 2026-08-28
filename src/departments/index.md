---
layout: base.njk
title: Departments
---

# Departments

<ul>
{% for department in collections.department %}
    <li>
        <a href="{{ department.url }}">
            {{ department.data.title }}
        </a>{% if department.data.abbreviation %}({{ department.data.abbreviation }}){% endif %}
    </li>
{% endfor %}
</ul>