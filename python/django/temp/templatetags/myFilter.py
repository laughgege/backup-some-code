from django import template
register = template.Library()

#@register.filter(name='fuck')
def fuck(value, arg):
    "Removes all values of arg from the given string"
    return value.replace(arg, '')
   
register.filter("fuck", fuck)
