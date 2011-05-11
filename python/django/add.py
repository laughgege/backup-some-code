from django.http import HttpResponse
from main.models import Book
from plus.object2xml import transfor

def index(request):
	_xml = transfor(Book.objects.all())
	return HttpResponse(_xml)

