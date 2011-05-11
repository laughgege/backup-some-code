from django import template

register = template.Library()

def do_current_time(parser, token):
    try:
        # split_contents() knows not to split quoted strings.
        tag_name, format_string = token.split_contents()
    except ValueError:
        msg = '%r tag requires a single argument' % tag_name
        raise template.TemplateSyntaxError(msg)
    return CurrentTimeNode(format_string[1:-1])
   
   
import datetime

class CurrentTimeNode(template.Node):
    def __init__(self, format_string):
        self.format_string = str(format_string)
#rewrite render
    def render(self, context):
        now = datetime.datetime.now()
        return now.strftime(self.format_string)
#reg
register.tag('current_time', do_current_time)

