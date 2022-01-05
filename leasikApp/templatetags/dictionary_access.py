from django import template


register = template.Library()


@register.simple_tag(takes_context=True)
def get_item(context, key):
    sentence_dict = context['sentences']
    return sentence_dict.get(key)
