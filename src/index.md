---
layout: base.njk
title: General Infrared Systems Corporation
---

# General Infrared Systems Corporation

~~YOU WANT IT,~~ **WE BUILD IT.**

GISC develops advanced technology products across entertainment,
marine instrumentation, robotics and other sectors.

## Latest News

{% for item in collections.news | reverse %}
{% if loop.index0 < 3 %}
### [{{ item.data.title }}]({{ item.url | url }})

{{ item.data.date | date: "%Y-%m-%d" }}

{{ item.data.summary }}
{% endif %}
{% endfor %}

[All news]({{ '/news/' | url }})
