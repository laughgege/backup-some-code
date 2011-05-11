from django.http import HttpResponse

def index(request):
	return HttpResponse('''<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="*" />
</cross-domain-policy>''')
