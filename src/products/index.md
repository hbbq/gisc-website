---
layout: base.njk
title: Products
---

# Products

<ul>
{% for product in collections.product %}
    <li>
        <a href="{{ product.url | url }}">{{ product.data.title }}</a>{% if product.data.model %} ({{ product.data.model }}){% endif %}{% if product.data.status %} — {{ product.data.status }}{% endif %}
    </li>
{% endfor %}
</ul>
